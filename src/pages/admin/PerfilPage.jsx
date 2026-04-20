import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { User, Mail, Lock, Save, Check, X, ShieldAlert, Pencil, Eye } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

const PW_RULES = [
  { label: 'Mínimo 8 caracteres', test: p => p.length >= 8 },
  { label: 'Al menos una mayúscula', test: p => /[A-Z]/.test(p) },
  { label: 'Al menos una minúscula', test: p => /[a-z]/.test(p) },
  { label: 'Al menos un número', test: p => /\d/.test(p) },
];

const ROLE_META = {
  admin: { label: 'Administrador', color: 'var(--color-primary)', variant: 'primary', icon: ShieldAlert },
  editor: { label: 'Editor', color: 'var(--color-secondary)', variant: 'secondary', icon: Pencil },
  lector: { label: 'Lector', color: '#38bdf8', variant: 'primary', icon: Eye },
};

export const PerfilPage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [form, setForm] = useState({ nombre: user?.nombre || '', apellido: user?.apellido || '', email: user?.email || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwFocus, setPwFocus] = useState(false);

  const roleMeta = ROLE_META[user?.rol] || ROLE_META.lector;
  const RoleIcon = roleMeta.icon;

  const pwValid = useMemo(() => PW_RULES.every(r => r.test(pwForm.newPassword)), [pwForm.newPassword]);
  const confirmMatch = pwForm.newPassword === pwForm.confirmPassword;

  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    if (form.nombre.trim().length < 3) { setError('El nombre debe tener al menos 3 caracteres.'); return; }
    try {
      await updateProfile(form);
      setMsg('Perfil actualizado correctamente.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setPwMsg(''); setPwError('');
    if (!pwValid) { setPwError('La nueva contraseña no cumple los requisitos.'); return; }
    if (!confirmMatch) { setPwError('Las contraseñas no coinciden.'); return; }
    try {
      await changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwMsg('Contraseña cambiada. Serás redirigido al login.');
    } catch (err) {
      setPwError(err.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 620 }}>
      <div className="page-header">
        <h1>Mi Perfil</h1>
        <p>Administra tu información personal y credenciales de acceso.</p>
      </div>

      {/* User info card */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: `${roleMeta.color}18`,
            border: `2px solid ${roleMeta.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', fontWeight: 700, color: roleMeta.color,
            fontFamily: 'var(--font-display)',
          }}>
            {user?.nombre?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              {user?.nombre} {user?.apellido}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{user?.email}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RoleIcon size={14} style={{ color: roleMeta.color }} />
              <span style={{ fontSize: '0.82rem', color: roleMeta.color, fontWeight: 600 }}>{roleMeta.label}</span>
            </div>
          </div>
          {user?.ultimo_acceso && (
            <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              <p>Último acceso</p>
              <p>{formatDateTime(user.ultimo_acceso)}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Profile form */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <User size={18} /> Información Personal
        </h3>
        {msg && <div className="alert alert-success">{msg}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Nombre <span style={{ color: 'var(--color-error)' }}>*</span></label>
              <input
                className="form-input"
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                required
                minLength={3}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Apellido</label>
              <input
                className="form-input"
                value={form.apellido}
                onChange={e => setForm({ ...form, apellido: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary" icon={<Save size={18} />}>Guardar Cambios</Button>
          </div>
        </form>
      </Card>

      {/* Password form */}
      <Card>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <Lock size={18} /> Cambiar Contraseña
        </h3>
        {pwMsg && <div className="alert alert-success">{pwMsg}</div>}
        {pwError && <div className="alert alert-error">{pwError}</div>}
        <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Contraseña Actual <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input
              className="form-input"
              type="password"
              value={pwForm.currentPassword}
              onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nueva Contraseña <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input
              className="form-input"
              type="password"
              value={pwForm.newPassword}
              onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
              onFocus={() => setPwFocus(true)}
              required
            />
            {(pwFocus || pwForm.newPassword) && (
              <div className="pw-rules-inline">
                {PW_RULES.map(({ label, test }) => {
                  const ok = test(pwForm.newPassword);
                  return (
                    <div key={label} className={`pw-rule-inline ${ok ? 'ok' : ''}`}>
                      {ok ? <Check size={12} /> : <X size={12} />}
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Confirmar Nueva Contraseña <span style={{ color: 'var(--color-error)' }}>*</span></label>
            <input
              className={`form-input ${pwForm.confirmPassword && !confirmMatch ? 'input-error-field' : ''}`}
              type="password"
              value={pwForm.confirmPassword}
              onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
              required
            />
            {pwForm.confirmPassword && !confirmMatch && (
              <p style={{ fontSize: '0.78rem', color: 'var(--color-error)', marginTop: '0.25rem' }}>
                Las contraseñas no coinciden
              </p>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="primary"
              disabled={!pwValid || !confirmMatch || !pwForm.currentPassword}
            >
              Cambiar Contraseña
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
