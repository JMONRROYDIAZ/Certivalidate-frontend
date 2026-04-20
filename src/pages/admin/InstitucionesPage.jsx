import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_INSTITUCIONES } from '../../utils/mockData';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Card } from '../../components/ui/Card';
import { Plus, Pencil, Power } from 'lucide-react';

export const InstitucionesPage = () => {
  const { hasPermission } = useAuth();
  const [instituciones, setInstituciones] = useState([...MOCK_INSTITUCIONES]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: '', dominio: '', logo_url: '' });
  const [formError, setFormError] = useState('');

  const openCreate = () => {
    setEditing(null);
    setForm({ nombre: '', dominio: '', logo_url: '' });
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (inst) => {
    setEditing(inst.id);
    setForm({ nombre: inst.nombre, dominio: inst.dominio || '', logo_url: inst.logo_url || '' });
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    await new Promise(r => setTimeout(r, 400));
    if (editing) {
      setInstituciones(prev => prev.map(i => i.id === editing ? { ...i, ...form } : i));
    } else {
      setInstituciones(prev => [...prev, {
        id: `inst-${Date.now()}`,
        ...form,
        activa: true,
        created_at: new Date().toISOString(),
      }]);
    }
    setShowForm(false);
  };

  const handleDeactivate = (id) => {
    if (!confirm('¿Desactivar esta institución?')) return;
    setInstituciones(prev => prev.map(i => i.id === id ? { ...i, activa: false } : i));
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Instituciones</h1>
        <p>Gestiona las instituciones emisoras de certificados.</p>
      </div>

      <div className="page-toolbar">
        <span>{instituciones.length} institución(es)</span>
        {hasPermission('institucion:actualizar') && (
          <Button variant="primary" icon={<Plus size={18} />} onClick={openCreate}>Nueva Institución</Button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1rem' }}>
        {instituciones.length === 0 ? (
          <Card><div className="empty-state">No hay instituciones.</div></Card>
        ) : instituciones.map(i => (
          <Card key={i.id} glow>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>{i.nombre}</h3>
                {i.dominio && <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{i.dominio}</p>}
              </div>
              <Badge variant={i.activa ? 'success' : 'muted'}>{i.activa ? 'Activa' : 'Inactiva'}</Badge>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              {hasPermission('institucion:actualizar') && (
                <button className="icon-btn" title="Editar" onClick={() => openEdit(i)}><Pencil size={16} /></button>
              )}
              {hasPermission('institucion:actualizar') && i.activa && (
                <button className="icon-btn danger" title="Desactivar" onClick={() => handleDeactivate(i.id)}><Power size={16} /></button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Editar Institución' : 'Nueva Institución'} size="md">
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input className="form-input" value={form.nombre} onChange={update('nombre')} required placeholder="Ej. Universidad Central" />
          </div>
          <div className="form-group">
            <label className="form-label">Dominio (opcional)</label>
            <input className="form-input" value={form.dominio} onChange={update('dominio')} placeholder="universidad.edu" />
          </div>
          <div className="form-group">
            <label className="form-label">Logo URL (opcional)</label>
            <input className="form-input" value={form.logo_url} onChange={update('logo_url')} placeholder="https://..." />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">{editing ? 'Guardar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
