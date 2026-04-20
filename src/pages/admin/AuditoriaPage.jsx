import React, { useState, useMemo } from 'react';
import { MOCK_AUDITORIA } from '../../utils/mockData';
import { Pagination } from '../../components/ui/Pagination';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { formatDateTime } from '../../utils/helpers';
import { Eye, RotateCcw } from 'lucide-react';

const LIMIT = 20;

export const AuditoriaPage = () => {
  const [page, setPage] = useState(1);
  const [filterEntidad, setFilterEntidad] = useState('');
  const [filterAccion, setFilterAccion] = useState('');
  const [filterUsuario, setFilterUsuario] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [detailEntry, setDetailEntry] = useState(null);

  const usuarios = useMemo(() => {
    const seen = new Set();
    return MOCK_AUDITORIA
      .map(a => a.usuario)
      .filter(u => u && !seen.has(u.id) && seen.add(u.id));
  }, []);

  const filtered = useMemo(() => {
    return MOCK_AUDITORIA.filter(a => {
      if (filterEntidad && a.entidad !== filterEntidad) return false;
      if (filterAccion && a.accion !== filterAccion) return false;
      if (filterUsuario && a.usuario_id !== filterUsuario) return false;
      if (fechaDesde && new Date(a.fecha) < new Date(fechaDesde)) return false;
      if (fechaHasta && new Date(a.fecha) > new Date(fechaHasta + 'T23:59:59')) return false;
      return true;
    });
  }, [filterEntidad, filterAccion, filterUsuario, fechaDesde, fechaHasta]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT));
  const auditorias = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const hasFilters = filterEntidad || filterAccion || filterUsuario || fechaDesde || fechaHasta;

  const clearFilters = () => {
    setFilterEntidad(''); setFilterAccion(''); setFilterUsuario('');
    setFechaDesde(''); setFechaHasta(''); setPage(1);
  };

  const getActionColor = (accion) => {
    if (accion.includes('CREAR') || accion.includes('EMITIR')) return 'success';
    if (accion.includes('REVOCAR') || accion.includes('ELIMINAR')) return 'error';
    if (accion.includes('ACTUALIZAR') || accion.includes('CAMBIAR')) return 'warning';
    return 'primary';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Auditoría</h1>
          <p>Registro completo de todas las acciones realizadas en la plataforma.</p>
        </div>
      </div>

      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: hasFilters ? '0.75rem' : 0 }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Entidad</label>
            <select className="search-input" value={filterEntidad} onChange={e => { setFilterEntidad(e.target.value); setPage(1); }} style={{ minWidth: 0, width: '100%' }}>
              <option value="">Todas</option>
              <option value="Certificado">Certificado</option>
              <option value="Usuario">Usuario</option>
              <option value="Estudiante">Estudiante</option>
              <option value="Plantilla">Plantilla</option>
              <option value="Institucion">Institución</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Acción</label>
            <select className="search-input" value={filterAccion} onChange={e => { setFilterAccion(e.target.value); setPage(1); }} style={{ minWidth: 0, width: '100%' }}>
              <option value="">Todas</option>
              <option value="EMITIR_CERTIFICADO">Emitir Certificado</option>
              <option value="REVOCAR_CERTIFICADO">Revocar Certificado</option>
              <option value="CREAR_USUARIO">Crear Usuario</option>
              <option value="ACTUALIZAR_PERFIL">Actualizar Perfil</option>
              <option value="CAMBIAR_PASSWORD">Cambiar Contraseña</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Usuario</label>
            <select className="search-input" value={filterUsuario} onChange={e => { setFilterUsuario(e.target.value); setPage(1); }} style={{ minWidth: 0, width: '100%' }}>
              <option value="">Todos</option>
              {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre} {u.apellido}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Desde</label>
            <input
              type="date"
              className="search-input"
              value={fechaDesde}
              onChange={e => { setFechaDesde(e.target.value); setPage(1); }}
              style={{ minWidth: 0, width: '100%', colorScheme: 'dark' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Hasta</label>
            <input
              type="date"
              className="search-input"
              value={fechaHasta}
              onChange={e => { setFechaHasta(e.target.value); setPage(1); }}
              style={{ minWidth: 0, width: '100%', colorScheme: 'dark' }}
            />
          </div>
        </div>
        {hasFilters && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {filtered.length} resultado(s) encontrado(s)
            </span>
            <button
              onClick={clearFilters}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.82rem' }}
            >
              <RotateCcw size={13} /> Limpiar filtros
            </button>
          </div>
        )}
      </Card>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha y hora</th>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Entidad</th>
                <th>IP</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {auditorias.length === 0 ? (
                <tr><td colSpan={6} className="empty-state">No hay registros con los filtros aplicados.</td></tr>
              ) : auditorias.map(a => (
                <tr key={a.id?.toString()}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>{formatDateTime(a.fecha)}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{a.usuario?.nombre} {a.usuario?.apellido}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{a.usuario?.email}</div>
                  </td>
                  <td><Badge variant={getActionColor(a.accion)}>{a.accion.replace(/_/g, ' ')}</Badge></td>
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{a.entidad}</span>
                    {a.entidad_id && <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{a.entidad_id}</div>}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{a.ip || '—'}</td>
                  <td>
                    <button className="icon-btn" title="Ver detalle" onClick={() => setDetailEntry(a)}><Eye size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>

      <Modal isOpen={!!detailEntry} onClose={() => setDetailEntry(null)} title="Detalle de registro" size="md">
        {detailEntry && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div className="detail-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div><strong>Fecha:</strong><br /><span style={{ color: 'var(--color-text-muted)' }}>{formatDateTime(detailEntry.fecha)}</span></div>
              <div><strong>Acción:</strong><br /><Badge variant={detailEntry.accion.includes('CREAR') || detailEntry.accion.includes('EMITIR') ? 'success' : detailEntry.accion.includes('REVOCAR') || detailEntry.accion.includes('ELIMINAR') ? 'error' : 'warning'}>{detailEntry.accion.replace(/_/g, ' ')}</Badge></div>
              <div><strong>Usuario:</strong><br />{detailEntry.usuario?.nombre} {detailEntry.usuario?.apellido}<br /><span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{detailEntry.usuario?.email}</span></div>
              <div><strong>IP de origen:</strong><br /><span style={{ fontFamily: 'monospace' }}>{detailEntry.ip || '—'}</span></div>
              <div><strong>Entidad:</strong><br />{detailEntry.entidad}</div>
              <div><strong>ID afectado:</strong><br /><span style={{ fontFamily: 'monospace', fontSize: '0.82rem', wordBreak: 'break-all' }}>{detailEntry.entidad_id || '—'}</span></div>
            </div>
            {(detailEntry.valores_antes || detailEntry.valores_despues) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {detailEntry.valores_antes && (
                  <div>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>ANTES</strong>
                    <pre style={{ fontSize: '0.75rem', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', marginTop: '0.25rem', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(detailEntry.valores_antes, null, 2)}
                    </pre>
                  </div>
                )}
                {detailEntry.valores_despues && (
                  <div>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>DESPUÉS</strong>
                    <pre style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', marginTop: '0.25rem', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(detailEntry.valores_despues, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
