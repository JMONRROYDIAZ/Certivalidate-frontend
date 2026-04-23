import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/ui/Modal';
import { MOCK_SYSTEM_USERS } from '../../utils/mockData';
import './UsuariosPage.css';

const ROLE_META = {
  admin:  { label: 'Administrador', color: '#6366f1', bg: 'rgba(99,102,241,0.15)' },
  editor: { label: 'Emisor',        color: '#06b6d4', bg: 'rgba(6,182,212,0.15)'  },
  lector: { label: 'Validador',     color: '#0ea5e9', bg: 'rgba(14,165,233,0.15)' },
};

const emptyForm = { nombre: '', apellido: '', email: '', rol: 'editor', activo: true };

export const UsuariosPage = () => {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState(MOCK_SYSTEM_USERS);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | { mode: 'create' | 'edit', user }
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const canCreate = hasPermission('usuario:crear');
  const canEdit   = hasPermission('usuario:actualizar');
  const canDelete = hasPermission('usuario:eliminar');

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.apellido.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      ROLE_META[u.rol]?.label.toLowerCase().includes(q)
    );
  });

  const openCreate = () => { setForm(emptyForm); setModal({ mode: 'create' }); };
  const openEdit   = (u) => { setForm({ nombre: u.nombre, apellido: u.apellido, email: u.email, rol: u.rol, activo: u.activo }); setModal({ mode: 'edit', user: u }); };
  const closeModal = () => setModal(null);

  const handleSave = () => {
    if (!form.nombre.trim() || !form.email.trim()) return;
    if (modal.mode === 'create') {
      setUsers(prev => [...prev, { id: `su-${Date.now()}`, ...form }]);
    } else {
      setUsers(prev => prev.map(u => u.id === modal.user.id ? { ...u, ...form } : u));
    }
    closeModal();
  };

  const handleDelete = () => {
    setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const initials = (u) =>
    `${u.nombre.charAt(0)}${u.apellido.charAt(0)}`.toUpperCase();

  return (
    <div className="usuarios-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p className="page-subtitle">Gestión de usuarios institucionales y roles</p>
        </div>
        {canCreate && (
          <button className="btn-nuevo-usuario" onClick={openCreate}>
            <Plus size={16} /> Nuevo Usuario
          </button>
        )}
      </div>

      {/* Search */}
      <div className="usuarios-search-wrap">
        <Search size={16} className="search-ico" />
        <input
          type="text"
          className="usuarios-search"
          placeholder="Buscar usuarios..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Cards grid */}
      <div className="usuarios-grid">
        {filtered.map(u => {
          const meta = ROLE_META[u.rol] || ROLE_META.lector;
          return (
            <div key={u.id} className="usuario-card glass-panel">
              <div className="uc-actions">
                {canEdit && (
                  <button className="uc-action-btn" onClick={() => openEdit(u)} title="Editar">
                    <Pencil size={15} />
                  </button>
                )}
                {canDelete && (
                  <button className="uc-action-btn danger" onClick={() => setDeleteTarget(u)} title="Eliminar">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <div className="uc-avatar-wrap">
                <div className="uc-avatar" style={{ borderColor: meta.color, color: meta.color, background: meta.bg }}>
                  {initials(u)}
                </div>
              </div>
              <p className="uc-name">{u.nombre} {u.apellido}</p>
              <p className="uc-email">{u.email}</p>
              <span className="uc-role-badge" style={{ color: meta.color, background: meta.bg }}>
                {meta.label}
              </span>
              <div className="uc-status">
                <span className="uc-status-dot" style={{ background: u.activo ? '#10b981' : '#6b7280' }} />
                <span style={{ color: u.activo ? '#10b981' : '#6b7280' }}>
                  {u.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="usuarios-empty">
          <User size={40} />
          <p>No se encontraron usuarios.</p>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modal !== null}
        onClose={closeModal}
        title={modal?.mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
      >
        <div className="modal-form">
          <div className="form-row-2">
            <div className="form-group">
              <label>Nombre <span className="req">*</span></label>
              <input
                type="text"
                className="form-input"
                value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                placeholder="Nombre"
              />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                className="form-input"
                value={form.apellido}
                onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))}
                placeholder="Apellido"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Correo electrónico <span className="req">*</span></label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="usuario@institución.edu.co"
            />
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label>Rol</label>
              <select
                className="form-input"
                value={form.rol}
                onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}
              >
                <option value="admin">Administrador</option>
                <option value="editor">Emisor</option>
                <option value="lector">Validador</option>
              </select>
            </div>
            <div className="form-group form-group-check">
              <label>Estado</label>
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))}
                />
                <span className="toggle-text">{form.activo ? 'Activo' : 'Inactivo'}</span>
              </label>
            </div>
          </div>
          <div className="modal-footer-actions">
            <button className="btn-secondary" onClick={closeModal}>Cancelar</button>
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={!form.nombre.trim() || !form.email.trim()}
            >
              {modal?.mode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar Usuario"
      >
        <div className="modal-form">
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            ¿Eliminar a <strong style={{ color: 'var(--color-text-main)' }}>{deleteTarget?.nombre} {deleteTarget?.apellido}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="modal-footer-actions">
            <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>Cancelar</button>
            <button className="btn-danger" onClick={handleDelete}>Eliminar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
