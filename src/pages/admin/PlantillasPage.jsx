import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_PLANTILLAS, MOCK_INSTITUCIONES } from '../../utils/mockData';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Card } from '../../components/ui/Card';
import { Plus, Pencil, Archive, Eye } from 'lucide-react';

const instMap = Object.fromEntries(MOCK_INSTITUCIONES.map(i => [i.id, i]));

export const PlantillasPage = () => {
  const { hasPermission } = useAuth();
  const [plantillas, setPlantillas] = useState([...MOCK_PLANTILLAS]);
  const [filterInst, setFilterInst] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ institucion_id: '', nombre: '', template_html: '', version: 1, activa: true });
  const [formError, setFormError] = useState('');

  const [previewPlantilla, setPreviewPlantilla] = useState(null);

  const displayed = filterInst ? plantillas.filter(p => p.institucion_id === filterInst) : plantillas;

  const openCreate = () => {
    setEditing(null);
    setForm({ institucion_id: MOCK_INSTITUCIONES[0]?.id || '', nombre: '', template_html: '<h1>{{nombre}}</h1>\n<p>Ha completado satisfactoriamente el curso de <strong>{{curso}}</strong>.</p>\n<p>Institución: {{institucion}}</p>\n<p>Fecha de emisión: {{fecha_emision}}</p>', version: 1, activa: true });
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p.id);
    setForm({ institucion_id: p.institucion_id, nombre: p.nombre, template_html: p.template_html, version: p.version, activa: p.activa });
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.nombre.trim()) { setFormError('El nombre es obligatorio.'); return; }
    if (!form.template_html.trim()) { setFormError('El HTML de la plantilla es obligatorio.'); return; }
    await new Promise(r => setTimeout(r, 400));
    const payload = { ...form, version: parseInt(form.version, 10) };
    if (editing) {
      setPlantillas(prev => prev.map(p => p.id === editing ? { ...p, ...payload } : p));
    } else {
      setPlantillas(prev => [...prev, {
        id: `plt-${Date.now()}`,
        ...payload,
        created_at: new Date().toISOString(),
      }]);
    }
    setShowForm(false);
  };

  const handleArchive = (id) => {
    if (!confirm('¿Archivar esta plantilla? No podrá usarse para emitir nuevos certificados.')) return;
    setPlantillas(prev => prev.map(p => p.id === id ? { ...p, activa: false } : p));
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Plantillas de Certificado</h1>
          <p>Define y gestiona los diseños HTML de tus certificados. Total: {plantillas.filter(p => p.activa).length} activa(s).</p>
        </div>
      </div>

      <div className="page-toolbar">
        <div className="page-actions">
          <select
            className="search-input"
            value={filterInst}
            onChange={e => setFilterInst(e.target.value)}
            style={{ minWidth: 220 }}
          >
            <option value="">Todas las instituciones</option>
            {MOCK_INSTITUCIONES.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
          </select>
        </div>
        {hasPermission('plantilla:crear') && (
          <Button variant="primary" icon={<Plus size={18} />} onClick={openCreate}>Nueva Plantilla</Button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {displayed.length === 0 ? (
          <Card><div className="empty-state">No hay plantillas.</div></Card>
        ) : displayed.map(p => {
          const inst = instMap[p.institucion_id];
          return (
            <Card key={p.id} glow={p.activa}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nombre}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Versión {p.version}</p>
                </div>
                <Badge variant={p.activa ? 'success' : 'muted'} style={{ flexShrink: 0, marginLeft: '0.5rem' }}>
                  {p.activa ? 'Activa' : 'Archivada'}
                </Badge>
              </div>
              {inst && (
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: inst.activa ? 'var(--color-success)' : 'var(--color-text-muted)', display: 'inline-block', flexShrink: 0 }} />
                  {inst.nombre}
                </p>
              )}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="icon-btn" title="Vista previa" onClick={() => setPreviewPlantilla(p)}><Eye size={16} /></button>
                {hasPermission('plantilla:actualizar') && (
                  <button className="icon-btn" title="Editar" onClick={() => openEdit(p)}><Pencil size={16} /></button>
                )}
                {hasPermission('plantilla:archivar') && p.activa && (
                  <button className="icon-btn danger" title="Archivar" onClick={() => handleArchive(p.id)}><Archive size={16} /></button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Editar Plantilla' : 'Nueva Plantilla'} size="lg">
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Institución <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <select className="form-input form-select" value={form.institucion_id} onChange={update('institucion_id')} required>
              {MOCK_INSTITUCIONES.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Nombre <span style={{ color: 'var(--color-error)' }}>*</span></label>
              <input className="form-input" value={form.nombre} onChange={update('nombre')} required placeholder="Ej. Certificado de Finalización" />
            </div>
            <div className="form-group">
              <label className="form-label">Versión <span style={{ color: 'var(--color-error)' }}>*</span></label>
              <input className="form-input" type="number" min={1} value={form.version} onChange={update('version')} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">
              HTML de plantilla <span style={{ color: 'var(--color-error)' }}>*</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>
                Variables: {'{{nombre}}'}, {'{{institucion}}'}, {'{{curso}}'}, {'{{fecha_emision}}'}
              </span>
            </label>
            <textarea
              className="form-input form-textarea"
              style={{ minHeight: '200px', fontFamily: 'monospace', fontSize: '0.82rem' }}
              value={form.template_html}
              onChange={update('template_html')}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.75rem', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              onClick={() => setPreviewPlantilla({ ...form, id: 'preview' })}
            >
              <Eye size={14} /> Vista previa
            </button>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit" variant="primary">{editing ? 'Guardar Cambios' : 'Crear Plantilla'}</Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={!!previewPlantilla} onClose={() => setPreviewPlantilla(null)} title={`Vista previa — ${previewPlantilla?.nombre || ''}`} size="lg">
        {previewPlantilla && (
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              Renderizado con datos de ejemplo. Las variables se sustituirán en la emisión real.
            </p>
            <div
              style={{ background: '#fff', color: '#1a1a1a', padding: '2rem', borderRadius: 'var(--radius-md)', minHeight: 200, overflowX: 'auto' }}
              dangerouslySetInnerHTML={{
                __html: previewPlantilla.template_html
                  .replace(/\{\{nombre\}\}/g, 'Ana Martínez')
                  .replace(/\{\{institucion\}\}/g, 'Universidad Central')
                  .replace(/\{\{curso\}\}/g, 'Desarrollo Web')
                  .replace(/\{\{fecha_emision\}\}/g, new Date().toLocaleDateString('es-ES')),
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
