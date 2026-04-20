import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_CERTIFICADOS, MOCK_INSTITUCIONES, MOCK_ESTUDIANTES, MOCK_PLANTILLAS } from '../../utils/mockData';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { Card } from '../../components/ui/Card';
import { formatDate, getStatusClass, getStatusLabel } from '../../utils/helpers';
import { Plus, Download, Ban, Eye } from 'lucide-react';

const LIMIT = 10;

const MOTIVOS_REVOCACION = [
  { value: 'ERROR_DATOS', label: 'Error en datos del certificado' },
  { value: 'ERROR_EMISION', label: 'Error en la emisión' },
  { value: 'FRAUDE', label: 'Fraude o falsificación' },
  { value: 'DECISION_INSTITUCIONAL', label: 'Decisión institucional' },
  { value: 'DUPLICADO', label: 'Certificado duplicado' },
  { value: 'CADUCIDAD', label: 'Caducidad anticipada' },
  { value: 'OTRO', label: 'Otro motivo' },
];

const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const instMap = Object.fromEntries(MOCK_INSTITUCIONES.map(i => [i.id, i.nombre]));

export const CertificadosPage = () => {
  const { hasPermission } = useAuth();
  const [certs, setCerts] = useState([...MOCK_CERTIFICADOS]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [filterInst, setFilterInst] = useState('');

  // Emit modal
  const [showEmit, setShowEmit] = useState(false);
  const [emitForm, setEmitForm] = useState({
    estudiante_id: '',
    plantilla_id: '',
    institucion_id: MOCK_INSTITUCIONES.filter(i => i.activa)[0]?.id || '',
    fecha_expiracion: '',
  });
  const [emitLoading, setEmitLoading] = useState(false);

  // Revoke modal
  const [showRevoke, setShowRevoke] = useState(false);
  const [revokeId, setRevokeId] = useState('');
  const [revokeForm, setRevokeForm] = useState({ motivo_codigo: 'ERROR_DATOS', motivo_detalle: '' });

  // Detail modal
  const [showDetail, setShowDetail] = useState(false);
  const [detailCert, setDetailCert] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return certs.filter(c => {
      if (filter && c.estado !== filter) return false;
      if (filterInst && c.institucion_id !== filterInst) return false;
      if (q) {
        const hay = `${c.codigo_unico} ${c.estudiante?.nombre} ${c.estudiante?.apellido}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [certs, search, filter, filterInst]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT));
  const pageCerts = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const instEstudiantes = MOCK_ESTUDIANTES.filter(e => e.institucion_id === emitForm.institucion_id);
  const instPlantillas = MOCK_PLANTILLAS.filter(p => p.institucion_id === emitForm.institucion_id && p.activa);

  const openEmit = () => {
    const firstInst = MOCK_INSTITUCIONES.filter(i => i.activa)[0]?.id || '';
    setEmitForm({ estudiante_id: '', plantilla_id: '', institucion_id: firstInst, fecha_expiracion: '' });
    setShowEmit(true);
  };

  const handleEmit = async (e) => {
    e.preventDefault();
    setEmitLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const inst = MOCK_INSTITUCIONES.find(i => i.id === emitForm.institucion_id);
    const est = MOCK_ESTUDIANTES.find(s => s.id === emitForm.estudiante_id);
    const plt = MOCK_PLANTILLAS.find(p => p.id === emitForm.plantilla_id);
    const newCert = {
      id: `cert-${Date.now()}`,
      estudiante_id: emitForm.estudiante_id,
      plantilla_id: emitForm.plantilla_id,
      institucion_id: emitForm.institucion_id,
      codigo_unico: generateCode(),
      estado: 'valido',
      fecha_emision: new Date().toISOString(),
      fecha_expiracion: emitForm.fecha_expiracion ? new Date(emitForm.fecha_expiracion).toISOString() : null,
      hash_sha256: 'mock-hash-' + Math.random().toString(36).slice(2),
      created_at: new Date().toISOString(),
      estudiante: est ? { nombre: est.nombre, apellido: est.apellido, documento: est.documento } : null,
      institucion: inst ? { nombre: inst.nombre } : null,
      plantilla: plt ? { nombre: plt.nombre } : null,
    };
    setCerts(prev => [newCert, ...prev]);
    setEmitLoading(false);
    setShowEmit(false);
    setPage(1);
  };

  const handleRevoke = async (e) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 400));
    setCerts(prev => prev.map(c => c.id === revokeId ? { ...c, estado: 'revocado' } : c));
    setShowRevoke(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Certificados</h1>
          <p>Gestiona todos los certificados digitales emitidos. Total: {certs.length}</p>
        </div>
      </div>

      <div className="page-toolbar">
        <div className="page-actions">
          <input
            className="search-input"
            placeholder="Buscar por código o nombre..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ minWidth: 220 }}
          />
          <select className="search-input" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }} style={{ minWidth: 130 }}>
            <option value="">Todos los estados</option>
            <option value="valido">Válidos</option>
            <option value="revocado">Revocados</option>
          </select>
          <select className="search-input" value={filterInst} onChange={e => { setFilterInst(e.target.value); setPage(1); }} style={{ minWidth: 200 }}>
            <option value="">Todas las instituciones</option>
            {MOCK_INSTITUCIONES.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
          </select>
        </div>
        {hasPermission('certificado:emitir') && (
          <Button variant="primary" icon={<Plus size={18} />} onClick={openEmit}>Emitir Certificado</Button>
        )}
      </div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Estudiante</th>
                <th>Institución</th>
                <th>Plantilla</th>
                <th>Emisión</th>
                <th>Expiración</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pageCerts.length === 0 ? (
                <tr><td colSpan={8} className="empty-state">No se encontraron certificados.</td></tr>
              ) : pageCerts.map(c => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.82rem', letterSpacing: '0.05em' }}>{c.codigo_unico}</td>
                  <td>{c.estudiante?.nombre} {c.estudiante?.apellido}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{c.institucion?.nombre}</td>
                  <td style={{ fontSize: '0.85rem' }}>{c.plantilla?.nombre}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(c.fecha_emision)}</td>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--color-text-muted)' }}>{c.fecha_expiracion ? formatDate(c.fecha_expiracion) : '—'}</td>
                  <td><Badge variant={getStatusClass(c.estado).replace('badge-', '')}>{getStatusLabel(c.estado)}</Badge></td>
                  <td>
                    <div className="table-actions">
                      {hasPermission('certificado:ver') && (
                        <button className="icon-btn" title="Ver detalle" onClick={() => { setDetailCert(c); setShowDetail(true); }}><Eye size={16} /></button>
                      )}
                      {hasPermission('certificado:descargar') && (
                        <button className="icon-btn" title="Descargar PDF" onClick={() => alert(`Descarga simulada:\ncertificado-${c.codigo_unico}.pdf`)}><Download size={16} /></button>
                      )}
                      {hasPermission('certificado:revocar') && c.estado !== 'revocado' && (
                        <button className="icon-btn danger" title="Revocar" onClick={() => { setRevokeId(c.id); setRevokeForm({ motivo_codigo: 'ERROR_DATOS', motivo_detalle: '' }); setShowRevoke(true); }}>
                          <Ban size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>

      {/* Emit Modal */}
      <Modal isOpen={showEmit} onClose={() => setShowEmit(false)} title="Emitir Nuevo Certificado" size="md">
        <form onSubmit={handleEmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Institución <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <select
              className="form-input form-select"
              value={emitForm.institucion_id}
              onChange={e => setEmitForm({ ...emitForm, institucion_id: e.target.value, estudiante_id: '', plantilla_id: '' })}
              required
            >
              <option value="">Seleccionar institución...</option>
              {MOCK_INSTITUCIONES.filter(i => i.activa).map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Estudiante <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <select
              className="form-input form-select"
              value={emitForm.estudiante_id}
              onChange={e => setEmitForm({ ...emitForm, estudiante_id: e.target.value })}
              required
              disabled={!emitForm.institucion_id}
            >
              <option value="">Seleccionar estudiante...</option>
              {instEstudiantes.map(e => (
                <option key={e.id} value={e.id}>{e.nombre} {e.apellido} — Doc. {e.documento}</option>
              ))}
            </select>
            {emitForm.institucion_id && instEstudiantes.length === 0 && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                No hay estudiantes registrados en esta institución.
              </p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Plantilla <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <select
              className="form-input form-select"
              value={emitForm.plantilla_id}
              onChange={e => setEmitForm({ ...emitForm, plantilla_id: e.target.value })}
              required
              disabled={!emitForm.institucion_id}
            >
              <option value="">Seleccionar plantilla...</option>
              {instPlantillas.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} (v{p.version})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Fecha de expiración <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>(opcional)</span></label>
            <input
              type="date"
              className="form-input"
              value={emitForm.fecha_expiracion}
              onChange={e => setEmitForm({ ...emitForm, fecha_expiracion: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button type="button" variant="ghost" onClick={() => setShowEmit(false)}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={emitLoading}>
              {emitLoading ? 'Emitiendo...' : 'Emitir Certificado'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Revoke Modal */}
      <Modal isOpen={showRevoke} onClose={() => setShowRevoke(false)} title="Revocar Certificado" size="sm">
        <div className="alert alert-error" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
          Esta acción es irreversible. El certificado quedará marcado como revocado y no podrá ser rehabilitado.
        </div>
        <form onSubmit={handleRevoke} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Motivo de revocación <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <select
              className="form-input form-select"
              value={revokeForm.motivo_codigo}
              onChange={e => setRevokeForm({ ...revokeForm, motivo_codigo: e.target.value })}
            >
              {MOTIVOS_REVOCACION.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Detalle adicional <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>(opcional, máx. 500 caracteres)</span></label>
            <textarea
              className="form-input form-textarea"
              value={revokeForm.motivo_detalle}
              onChange={e => setRevokeForm({ ...revokeForm, motivo_detalle: e.target.value })}
              maxLength={500}
              placeholder="Describe el motivo con más detalle..."
              rows={3}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
              {revokeForm.motivo_detalle.length}/500
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button type="button" variant="ghost" onClick={() => setShowRevoke(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">Confirmar Revocación</Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Detalle de Certificado" size="lg">
        {detailCert && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="detail-grid">
              <div><strong>Código único:</strong><br /><span style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--color-primary)' }}>{detailCert.codigo_unico}</span></div>
              <div><strong>Estado:</strong><br /><Badge variant={getStatusClass(detailCert.estado).replace('badge-', '')}>{getStatusLabel(detailCert.estado)}</Badge></div>
              <div><strong>Estudiante:</strong><br />{detailCert.estudiante?.nombre} {detailCert.estudiante?.apellido}</div>
              <div><strong>Documento:</strong><br />{detailCert.estudiante?.documento}</div>
              <div><strong>Institución:</strong><br />{detailCert.institucion?.nombre}</div>
              <div><strong>Plantilla:</strong><br />{detailCert.plantilla?.nombre}</div>
              <div><strong>Fecha de emisión:</strong><br />{formatDate(detailCert.fecha_emision)}</div>
              <div><strong>Fecha de expiración:</strong><br />{formatDate(detailCert.fecha_expiracion)}</div>
            </div>
            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>HASH SHA-256 (integridad)</strong>
              <p style={{ fontFamily: 'monospace', fontSize: '0.78rem', wordBreak: 'break-all', marginTop: '0.25rem', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
                {detailCert.hash_sha256}
              </p>
            </div>
            {detailCert.estado === 'revocado' && (
              <div className="alert alert-error" style={{ margin: 0 }}>
                Este certificado fue revocado y ya no es válido.
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
