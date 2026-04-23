import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ShieldAlert, Pencil } from 'lucide-react';
import './Auth.css';

const DEMO_USERS = [
  { email: 'admin@certivalidate.com', password: 'Admin1234', label: 'Admin', icon: ShieldAlert, color: '#00f0ff' },
  { email: 'editor@certivalidate.com', password: 'Editor1234', label: 'Emisor', icon: Pencil, color: '#b026ff' },
  { email: 'lector@certivalidate.com', password: 'Lector1234', label: 'Lector', icon: Eye, color: '#38bdf8' },
];

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
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
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const loginAs = async (demoEmail, demoPassword) => {
    setError('');
    setLoading(true);
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
    <div className="auth-split-page">
      {/* Left branding panel */}
      <div className="auth-left-panel">
        <div className="auth-brand-content">
          <div className="auth-brand-icon-wrap">
            <ShieldCheck size={36} />
          </div>
          <h1 className="auth-brand-title">CertiValidate</h1>
          <p className="auth-brand-desc">
            Sistema de Certificados Académicos con tecnología Blockchain.
            Gestiona, emite y verifica certificados de forma segura.
          </p>
          <div className="auth-badges-row">
            <div className="auth-badge-pill">
              <span className="badge-value">100%</span>
              <span className="badge-label">Seguro</span>
            </div>
            <div className="auth-badge-pill">
              <span className="badge-value">SHA-256</span>
              <span className="badge-label">Cifrado</span>
            </div>
            <div className="auth-badge-pill">
              <span className="badge-value">Público</span>
              <span className="badge-label">Verificable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right-panel">
        <div className="auth-form-container animate-fade-in">
          <div className="auth-form-accent-bar" />
          <h2 className="auth-form-title">Iniciar Sesión</h2>
          <p className="auth-form-subtitle">Ingresa tus credenciales institucionales</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                className="form-input"
                placeholder="usuario@unicesar.edu.co"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <div className="input-wrapper has-icon-right">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? 'Verificando...' : 'Acceder al Sistema'}
            </button>
          </form>

          <div className="auth-demo-section">
            <p className="demo-label">Acceso rápido (demo)</p>
            <div className="demo-grid">
              {DEMO_USERS.map(({ email: e, password: p, label, icon: Icon, color }) => (
                <button
                  key={e}
                  type="button"
                  className="demo-btn glass-panel"
                  onClick={() => loginAs(e, p)}
                  disabled={loading}
                >
                  <Icon size={16} style={{ color }} />
                  <span className="demo-btn-label">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="auth-back-link">
            <Link to="/">← Volver al inicio</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
