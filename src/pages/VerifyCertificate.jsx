import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_CERTIFICADOS } from '../utils/mockData';
import { ShieldCheck, Search, CheckCircle2, XCircle, AlertTriangle, Upload, Link2, Fingerprint, Globe, Lock, KeyRound, Hash } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import './VerifyCertificate.css';

const MODES = [
  { key: 'codigo', label: 'Código único', icon: KeyRound, placeholder: 'Ej. A3F2B91C4D7E0812  —  prueba también con B7D1E4A9F2C30516 o C5E8F1B3D6A90724' },
  { key: 'hash',   label: 'Hash SHA-256',  icon: Hash,     placeholder: 'Ej. e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
];

const HOW_IT_WORKS = [
  { icon: Link2,       title: 'Blockchain Inmutable',  desc: 'Cada certificado se registra en una red blockchain, garantizando que no pueda ser alterado.' },
  { icon: Fingerprint, title: 'Hash SHA-256',          desc: 'Se genera una huella digital única para cada documento, detectando cualquier modificación.' },
  { icon: Globe,       title: 'Verificación Pública',  desc: 'Cualquier persona puede verificar un certificado sin necesidad de cuenta o registro.' },
  { icon: Lock,        title: 'Protección de Datos',   desc: 'Cumplimiento con la normativa de protección de datos vigente en Colombia.' },
];

function ResultCard({ result }) {
  const isValid   = result.estado === 'valido';
  const isRevoked = result.estado === 'revocado';
  const notFound  = result.estado === 'no_encontrado';
  const IconComp  = isValid ? CheckCircle2 : (notFound ? AlertTriangle : XCircle);
  const iconColor = isValid ? '#10b981' : (notFound ? '#f59e0b' : '#ef4444');

  return (
    <div className={`result-card glass-panel ${isValid ? 'res-valid' : notFound ? 'res-not-found' : 'res-invalid'}`}>
      <div className="result-icon-col">
        <IconComp size={46} style={{ color: iconColor }} />
      </div>
      <div className="result-info-col">
        <h3 style={{ color: iconColor }}>{result.mensaje}</h3>
        {!notFound && (
          <div className="result-details-grid">
            <div><span>Código único</span><strong style={{ fontFamily: 'monospace' }}>{result.codigo_unico}</strong></div>
            {result.estudiante && <div><span>Receptor</span><strong>{result.estudiante.nombre} {result.estudiante.apellido} — Doc. {result.estudiante.documento}</strong></div>}
            {result.institucion && <div><span>Institución</span><strong>{result.institucion.nombre}</strong></div>}
            {result.plantilla && <div><span>Acreditación</span><strong>{result.plantilla.nombre}</strong></div>}
            <div><span>Emisión</span><strong>{formatDate(result.fecha_emision)}</strong></div>
            {result.fecha_expiracion && <div><span>Expira</span><strong>{formatDate(result.fecha_expiracion)}</strong></div>}
            <div className="hash-row">
              <span>SHA-256</span>
              <strong style={{ fontFamily: 'monospace', wordBreak: 'break-all', fontSize: '0.78rem' }}>{result.hash_sha256}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const VerifyCertificate = () => {
  const [mode, setMode]       = useState('codigo');
  const [query, setQuery]     = useState('');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const verify = async (code, searchMode) => {
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 700));

    const q = code.trim();
    let found;
    if (searchMode === 'codigo') {
      found = q.toUpperCase() === 'DEMO'
        ? MOCK_CERTIFICADOS[0]
        : MOCK_CERTIFICADOS.find(c => c.codigo_unico === q.toUpperCase());
    } else {
      found = MOCK_CERTIFICADOS.find(c => c.hash_sha256 === q);
    }

    if (found) {
      setResult({
        ...found,
        mensaje: found.estado === 'valido'
          ? 'Certificado válido y verificado'
          : found.estado === 'revocado'
          ? 'Este certificado ha sido revocado'
          : 'Este certificado ha expirado',
      });
    } else {
      setResult({ estado: 'no_encontrado', mensaje: `No se encontró ningún certificado con ese ${searchMode === 'codigo' ? 'código' : 'hash'}.` });
    }
    setLoading(false);
  };

  const handleSubmit = (e) => { e.preventDefault(); if (query.trim()) verify(query, mode); };

  const handleModeChange = (m) => { setMode(m); setQuery(''); setResult(null); };

  const handlePdf = (e) => {
    if (!e.target.files?.[0]) return;
    verify(MOCK_CERTIFICADOS[1].codigo_unico, 'codigo');
    e.target.value = '';
  };

  const scrollToVerify = () => document.getElementById('verificar')?.scrollIntoView({ behavior: 'smooth' });

  const activePlaceholder = MODES.find(m => m.key === mode)?.placeholder;

  return (
    <div className="landing-page">

      {/* ── Navbar ─────────────────────────── */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <ShieldCheck size={20} />
          <span>CertiValidate</span>
        </div>
        <div className="nav-actions">
          <button className="nav-btn-ghost" onClick={scrollToVerify}>
            <ShieldCheck size={14} />
            Verificar Certificado
          </button>
          <Link to="/login" className="nav-btn-acceder">Acceder</Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────── */}
      <section className="hero-section">
        <div className="hero-inner animate-fade-in">
          <div className="hero-badge-pill">
            <ShieldCheck size={13} />
            Verificación respaldada por Blockchain
          </div>
          <h1 className="hero-title">
            Certificados Académicos<br />
            <span className="hero-highlight">Verificables</span>
          </h1>
          <p className="hero-desc">
            Verifica la autenticidad de cualquier certificado académico emitido por la
            institución en segundos. Seguro, transparente e inmutable.
          </p>
          <div className="hero-features-row">
            <span><Link2 size={13} /> Registro en Blockchain</span>
            <span><Fingerprint size={13} /> Hash SHA-256</span>
            <span><ShieldCheck size={13} /> Verificación Pública</span>
          </div>
        </div>
      </section>

      {/* ── Verificar ─────────────────────── */}
      <section id="verificar" className="verify-section">
        <div className="verify-inner animate-fade-in">
          <h2 className="verify-title">
            Verificar <span className="hero-highlight">Certificado</span>
          </h2>
          <p className="verify-subtitle">
            Ingresa el código único del certificado o sube el archivo PDF
          </p>

          {/* Mode tabs */}
          <div className="verify-mode-tabs">
            {MODES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                className={`mode-tab ${mode === key ? 'active' : ''}`}
                onClick={() => handleModeChange(key)}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="verify-form">
            <div className="verify-input-wrap glass-panel">
              <Search size={16} className="vi-icon" />
              <input
                type="text"
                className="verify-input"
                placeholder={activePlaceholder}
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <div className="verify-btn-row">
              <button type="submit" className="btn-verify" disabled={loading || !query.trim()}>
                <Search size={16} />
                {loading ? 'Verificando...' : 'Verificar'}
              </button>
              <button type="button" className="btn-upload" onClick={() => fileRef.current?.click()}>
                <Upload size={16} />
                Subir PDF
              </button>
              <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handlePdf} />
            </div>
          </form>

          {mode === 'codigo' && !result && (
            <p className="verify-hint">El código de 16 caracteres aparece en el certificado impreso o digital.</p>
          )}
          {mode === 'hash' && !result && (
            <p className="verify-hint">El hash SHA-256 garantiza la integridad del documento PDF.</p>
          )}

          {result && <ResultCard result={result} />}
        </div>
      </section>

      {/* ── Cómo funciona ─────────────────── */}
      <section className="hiw-section">
        <div className="hiw-inner">
          <h2 className="hiw-title">¿Cómo funciona?</h2>
          <div className="hiw-grid">
            {HOW_IT_WORKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="hiw-card glass-panel">
                <div className="hiw-icon-wrap">
                  <Icon size={28} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
