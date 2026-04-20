import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, ShieldAlert, Pencil, Eye } from 'lucide-react';
import { MOCK_CREDENTIALS } from '../utils/mockData';
import './Auth.css';

const DEMO_USERS = [
  {
    email: 'admin@certivalidate.com',
    password: 'Admin1234',
    label: 'Administrador',
    desc: 'Acceso total',
    icon: ShieldAlert,
    color: '#00f0ff',
  },
  {
    email: 'editor@certivalidate.com',
    password: 'Editor1234',
    label: 'Editor',
    desc: 'Emitir y gestionar',
    icon: Pencil,
    color: '#b026ff',
  },
  {
    email: 'lector@certivalidate.com',
    password: 'Lector1234',
    label: 'Lector',
    desc: 'Solo lectura',
    icon: Eye,
    color: '#38bdf8',
  },
];

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const loginAs = async (demoEmail, demoPassword) => {
    setError('');
    setLoading(true);
    setEmail(demoEmail);
    setPassword(demoPassword);
    try {
      await login(demoEmail, demoPassword);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel animate-fade-in" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <ShieldCheck size={40} />
          <h1>CertiValidate</h1>
        </div>
        <p className="auth-subtitle">Inicia sesión en tu cuenta</p>

        {/* Demo quick access */}
        <div className="demo-access">
          <p className="demo-label">Acceso rápido (demo)</p>
          <div className="demo-grid">
            {DEMO_USERS.map(({ email: e, password: p, label, desc, icon: Icon, color }) => (
              <button
                key={e}
                type="button"
                className="demo-btn glass-panel"
                onClick={() => loginAs(e, p)}
                disabled={loading}
              >
                <Icon size={20} style={{ color }} />
                <span className="demo-btn-label">{label}</span>
                <span className="demo-btn-desc">{desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="auth-divider"><span>o ingresa manualmente</span></div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Correo Electrónico</label>
            <div className="input-wrapper has-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-wrapper has-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
          {' · '}
          <Link to="/verificar">Verificar certificado</Link>
        </p>
      </div>
    </div>
  );
};
