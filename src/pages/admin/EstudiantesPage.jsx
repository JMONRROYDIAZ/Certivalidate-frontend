import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ESTUDIANTES, MOCK_INSTITUCIONES } from '../../utils/mockData';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/helpers';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const LIMIT = 10;

const instMap = Object.fromEntries(MOCK_INSTITUCIONES.map(i => [i.id, i]));

export const EstudiantesPage = () => {
  const { hasPermission } = useAuth();
  const [estudiantes, setEstudiantes] = useState([...MOCK_ESTUDIANTES]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterInst, setFilterInst] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ institucion_id: '', nombre: '', apellido: '', documento: '', email: '' });
  const [formError, setFormError] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return estudiantes.filter(e => {
      if (filterInst && e.institucion_id !== filterInst) return false;
      if (q && !`${e.nombre} ${e.apellido} ${e.documento} ${e.email}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [estudiantes, search, filterInst]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT));
  const pageEstudiantes = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const openCreate = () => {
    setEditing(null);
    setForm({ institucion_id: MOCK_INSTITUCIONES[0]?.id || '', nombre: '', apellido: '', documento: '', email: '' });
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (est) => {
    setEditing(est.id);
    setForm({ institucion_id: est.institucion_id, nombre: est.nombre, apellido: est.apellido, documento: est.documento, email: est.email || '' });
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.nombre.trim() || !form.apellido.trim()) { setFormError('Nombre y apellido son obligatorios.'); return; }
    if (!form.documento.trim()) { setFormError('El documento de identidad es obligatorio.'); return; }
    await new Promise(r => setTimeout(r, 400));
    if (editing) {
      setEstudiantes(prev => prev.map(est => est.id === editing ? { ...est, ...form } : est));
    } else {
      const dup = estudiantes.find(e => e.documento === form.documento.trim());
      if (dup) { setFormError('Ya existe un estudiante con ese número de documento.'); return; }
      setEstudiantes(prev => [{
        id: `est-${Date.now()}`,
        ...form,
        created_at: new Date().toISOString(),
      }, ...prev]);
    }
    setShowForm(false);
    setPage(1);
  };

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar este estudiante? Esta acción es permanente si no tiene certificados asociados.')) return;
    setEstudiantes(prev => prev.filter(e => e.id !== id));
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Estudiantes</h1>
          <p>Administra los estudiantes registrados. Total: {estudiantes.length}</p>
        </div>
      </div>

      <div className="page-toolbar">
        <div className="page-actions">
          <input
            className="search-input"
            placeholder="Buscar por nombre, apellido o documento..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ minWidth: 260 }}
          />
          <select
            className="search-input"
            value={filterInst}
            onChange={e => { setFilterInst(e.target.value); setPage(1); }}
            style={{ minWidth: 200 }}
          >
            <option value="">Todas las instituciones</option>
            {MOCK_INSTITUCIONES.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
          </select>
        </div>
        {hasPermission('estudiante:crear') && (
          <Button variant="primary" icon={<Plus size={18} />} onClick={openCreate}>Nuevo Estudiante</Button>
        )}
      </div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre completo</th>
                <th>Documento</th>
                <th>Email</th>
                <th>Institución</th>
                <th>Registrado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pageEstudiantes.length === 0 ? (
                <tr><td colSpan={6} className="empty-state">No se encontraron estudiantes.</td></tr>
              ) : pageEstudiantes.map(e => {
                const inst = instMap[e.institucion_id];
                return (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 500 }}>{e.nombre} {e.apellido}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{e.documento}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{e.email || '—'}</td>
                    <td>
                      {inst && (
                        <Badge variant={inst.activa ? 'primary' : 'muted'}>
                          {inst.nombre.length > 28 ? inst.nombre.slice(0, 25) + '…' : inst.nombre}
                        </Badge>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{formatDate(e.created_at)}</td>
                    <td>
                      <div className="table-actions">
                        {hasPermission('estudiante:actualizar') && (
                          <button className="icon-btn" title="Editar" onClick={() => openEdit(e)}><Pencil size={16} /></button>
                        )}
                        {hasPermission('estudiante:eliminar') && (
                          <button className="icon-btn danger" title="Eliminar" onClick={() => handleDelete(e.id)}><Trash2 size={16} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Editar Estudiante' : 'Nuevo Estudiante'} size="md">
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Institución <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <select className="form-input form-select" value={form.institucion_id} onChange={update('institucion_id')} required>
              {MOCK_INSTITUCIONES.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
            </select>
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Nombre <span style={{ color: 'var(--color-error)' }}>*</span></label>
              <input className="form-input" value={form.nombre} onChange={update('nombre')} placeholder="Ana" required />
            </div>
            <div className="form-group">
              <label className="form-label">Apellido <span style={{ color: 'var(--color-error)' }}>*</span></label>
              <input className="form-input" value={form.apellido} onChange={update('apellido')} placeholder="Martínez" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Documento de identidad <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input className="form-input" value={form.documento} onChange={update('documento')} placeholder="1023456789" required />
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Cédula, pasaporte u otro identificador único.</p>
          </div>
          <div className="form-group">
            <label className="form-label">Email <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>(opcional)</span></label>
            <input className="form-input" type="email" value={form.email} onChange={update('email')} placeholder="estudiante@email.com" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">{editing ? 'Guardar Cambios' : 'Crear Estudiante'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
