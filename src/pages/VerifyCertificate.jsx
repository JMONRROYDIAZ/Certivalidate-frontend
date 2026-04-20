import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_CERTIFICADOS } from '../utils/mockData';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ShieldCheck, Search, CheckCircle2, XCircle, AlertTriangle, Hash, KeyRound, LogIn } from 'lucide-react';
import { formatDate, getStatusClass, getStatusLabel } from '../utils/helpers';
import './VerifyCertificate.css';

const SEARCH_MODES = [
  { key: 'codigo', label: 'Código único', icon: KeyRound, placeholder: 'Ej. A3F2B91C4D7E0812' },
  { key: 'hash', label: 'Hash SHA-256', icon: Hash, placeholder: 'Ej. e3b0c44298fc1c149afb...' },
];

export const VerifyCertificate = () => {
  const [mode, setMode] = useState('codigo');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    await new Promise(r => setTimeout(r, 600));

    let found;
    if (mode === 'codigo') {
      found = MOCK_CERTIFICADOS.find(c => c.codigo_unico === query.trim().toUpperCase());
    } else {
      found = MOCK_CERTIFICADOS.find(c => c.hash_sha256 === query.trim());
    }

    if (found) {
      setResult({
        ...found,
        mensaje: found.estado === 'valido'
          ? 'Certificado válido y verificado'
          : found.estado === 'revocado'
          ? 'Este certificado ha sido revocado'
          : 'Este certificado ha expirado',
        hash_verificado: true,
      });
    } else {
      setResult({
        estado: 'no_encontrado',
        mensaje: 'No se encontró ningún certificado con ese ' + (mode === 'codigo' ? 'código' : 'hash') + '.',
      });
    }
    setLoading(false);
  };

  const handleModeChange = (m) => {
    setMode(m);
    setQuery('');
    setResult(null);
    setError('');
  };

  const getIcon = () => {
    if (!result) return null;
    if (result.estado === 'valido') return <CheckCircle2 size={48} className="icon-success" />;
    if (result.estado === 'revocado') return <XCircle size={48} className="icon-error" />;
    if (result.estado === 'expirado') return <AlertTriangle size={48} className="icon-warning" />;
    return <XCircle size={48} className="icon-error" />;
  };

  const activePlaceholder = SEARCH_MODES.find(m => m.key === mode)?.placeholder;

  return (
    <div className="verify-public-page">
      {/* Top nav */}
      <nav className="verify-topnav">
        <div className="verify-nav-brand">
          <ShieldCheck size={20} style={{ color: 'var(--color-primary)' }} />
          <span>CertiValidate</span>
        </div>
        <Link to="/login" className="verify-nav-login">
          <LogIn size={16} />
          Iniciar sesión
        </Link>
      </nav>

      <div className="verify-hero animate-fade-in">
        <ShieldCheck size={48} className="hero-icon" />
        <h1>Verificar Certificado</h1>
        <p>Comprueba la autenticidad e integridad de cualquier certificado emitido por la plataforma.</p>
      </div>

      {/* Mode selector */}
      <div className="verify-mode-tabs animate-fade-in">
        {SEARCH_MODES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`mode-tab ${mode === key ? 'active' : ''}`}
            onClick={() => handleModeChange(key)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleVerify} className="verify-search animate-fade-in">
        <div className="search-bar glass-panel">
          <input
            type="text"
            placeholder={activePlaceholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <Button type="submit" variant="primary" icon={<Search size={18} />} disabled={loading}>
            {loading ? 'Verificando...' : 'Verificar'}
          </Button>
        </div>
        {mode === 'codigo' && (
          <p className="verify-hint">El código de 16 caracteres aparece en el certificado impreso o digital.</p>
        )}
        {mode === 'hash' && (
          <p className="verify-hint">El hash SHA-256 garantiza la integridad del documento PDF.</p>
        )}
      </form>

      {error && <div className="alert alert-error" style={{ maxWidth: 700, margin: '0 auto 1rem' }}>{error}</div>}

      {result && (
        <Card
          className={`verify-result animate-fade-in ${result.estado === 'valido' ? 'valid' : result.estado === 'no_encontrado' ? 'not-found' : 'invalid'}`}
          glow={result.estado === 'valido'}
        >
          <div className="result-icon-container">{getIcon()}</div>
          <div className="result-details">
            <h3>{result.mensaje}</h3>
            {result.estado !== 'no_encontrado' && (
              <>
                <Badge variant={getStatusClass(result.estado).replace('badge-', '')} style={{ marginBottom: '1rem' }}>
                  {getStatusLabel(result.estado)}
                </Badge>
                <div className="details-list">
                  <div><strong>Código único:</strong> <span style={{ fontFamily: 'monospace' }}>{result.codigo_unico}</span></div>
                  {result.estudiante && (
                    <div><strong>Receptor:</strong> {result.estudiante.nombre} {result.estudiante.apellido} — Doc. {result.estudiante.documento}</div>
                  )}
                  {result.institucion && <div><strong>Institución emisora:</strong> {result.institucion.nombre}</div>}
                  {result.plantilla && <div><strong>Acreditación:</strong> {result.plantilla.nombre}</div>}
                  <div><strong>Fecha de emisión:</strong> {formatDate(result.fecha_emision)}</div>
                  {result.fecha_expiracion && <div><strong>Expira:</strong> {formatDate(result.fecha_expiracion)}</div>}
                  <div>
                    <strong>Integridad del documento:</strong>{' '}
                    {result.hash_verificado
                      ? <span style={{ color: 'var(--color-success)' }}>✅ Hash verificado — documento íntegro</span>
                      : <span style={{ color: 'var(--color-error)' }}>❌ Hash no coincide — documento comprometido</span>
                    }
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    <strong>SHA-256:</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{result.hash_sha256}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
