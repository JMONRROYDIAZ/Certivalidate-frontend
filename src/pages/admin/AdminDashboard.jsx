import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MOCK_INSTITUCIONES, MOCK_ESTADISTICAS } from '../../utils/mockData';
import { FileBadge, Users, FileText, ScrollText, CheckCircle, XCircle, Eye } from 'lucide-react';
import './AdminDashboard.css';

export const AdminDashboard = () => {
  const { hasPermission } = useAuth();
  const activeInsts = MOCK_INSTITUCIONES.filter(i => i.activa);
  const [stats, setStats] = useState(MOCK_ESTADISTICAS[activeInsts[0]?.id] || null);
  const [selectedInst, setSelectedInst] = useState(activeInsts[0]?.id || '');
  const navigate = useNavigate();

  useEffect(() => {
    setStats(MOCK_ESTADISTICAS[selectedInst] || null);
  }, [selectedInst]);

  const statCards = stats ? [
    { label: 'Certificados', value: stats.certificados, icon: FileBadge, color: 'var(--color-primary)' },
    { label: 'Válidos', value: stats.certificados_validos, icon: CheckCircle, color: 'var(--color-success)' },
    { label: 'Revocados', value: stats.certificados_revocados, icon: XCircle, color: 'var(--color-error)' },
    { label: 'Estudiantes', value: stats.estudiantes, icon: Users, color: '#a78bfa' },
    { label: 'Plantillas', value: stats.plantillas, icon: FileText, color: '#fbbf24' },
    { label: 'Verificaciones', value: stats.verificaciones_publicas, icon: Eye, color: '#38bdf8' },
  ] : [];

  return (
    <div className="admin-dashboard animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general de tu plataforma de certificados.</p>
        </div>
        {activeInsts.length > 1 && (
          <select
            className="search-input"
            value={selectedInst}
            onChange={e => setSelectedInst(e.target.value)}
          >
            {activeInsts.map(i => (
              <option key={i.id} value={i.id}>{i.nombre}</option>
            ))}
          </select>
        )}
      </div>

      <div className="stats-grid">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card glow key={label}>
            <div className="stat-card">
              <div className="stat-icon" style={{ color }}>
                <Icon size={28} />
              </div>
              <div className="stat-info">
                <p className="stat-label">{label}</p>
                <p className="stat-value">{value?.toLocaleString() ?? '—'}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="dashboard-actions">
        <Card>
          <h3>Acciones Rápidas</h3>
          <div className="quick-actions">
            {hasPermission('certificado:emitir') && (
              <Button variant="primary" icon={<FileBadge size={18} />} onClick={() => navigate('/admin/certificados')}>
                Emitir Certificado
              </Button>
            )}
            {hasPermission('estudiante:listar') && (
              <Button variant="secondary" icon={<Users size={18} />} onClick={() => navigate('/admin/estudiantes')}>
                Gestionar Estudiantes
              </Button>
            )}
            {hasPermission('auditoria:ver') && (
              <Button variant="secondary" icon={<ScrollText size={18} />} onClick={() => navigate('/admin/auditoria')}>
                Ver Auditoría
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
