import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileBadge, Users, CheckCircle, XCircle, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MOCK_ACTIVIDAD_RECIENTE, MOCK_MONTHLY_DATA } from '../../utils/mockData';
import './AdminDashboard.css';

const DASH_STATS = [
  { label: 'Certificados Emitidos', value: '1,247', trend: '+12%', up: true, icon: FileBadge, color: '#00f0ff' },
  { label: 'Verificaciones', value: '3,891', trend: '+28%', up: true, icon: CheckCircle, color: '#10b981' },
  { label: 'Revocados', value: '23', trend: '-5%', up: false, icon: XCircle, color: '#ef4444' },
  { label: 'Intentos de Fraude', value: '7', trend: '+2', up: false, icon: AlertTriangle, color: '#f59e0b' },
  { label: 'Usuarios Activos', value: '34', trend: '+3', up: true, icon: Users, color: '#a78bfa' },
  { label: 'Tasa de Éxito', value: '99.2%', trend: '+0.3%', up: true, icon: TrendingUp, color: '#38bdf8' },
];

const DONUT_SEGMENTS = [
  { label: 'Válidos', value: 1200, color: '#10b981' },
  { label: 'Revocados', value: 20, color: '#ef4444' },
  { label: 'Alterados', value: 27, color: '#f59e0b' },
];

function BarChart({ data }) {
  const maxVal = 600;
  const svgW = 500, svgH = 250;
  const padL = 42, padB = 28, padT = 12, padR = 10;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padB - padT;
  const groupW = chartW / data.length;
  const barW = 22;
  const gap = 5;
  const yGrids = [0, 150, 300, 450, 600];

  const yPos = (val) => padT + chartH - (val / maxVal) * chartH;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: 'auto' }}>
      {yGrids.map(v => (
        <g key={v}>
          <line x1={padL} y1={yPos(v)} x2={svgW - padR} y2={yPos(v)} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          <text x={padL - 6} y={yPos(v) + 4} textAnchor="end" fill="rgba(255,255,255,0.35)" fontSize="10">{v}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const cx = padL + i * groupW + groupW / 2;
        const eX = cx - barW - gap / 2;
        const vX = cx + gap / 2;
        return (
          <g key={d.mes}>
            <rect x={eX} y={yPos(d.emisiones)} width={barW} height={(d.emisiones / maxVal) * chartH} fill="#0d7a7a" rx="3" />
            <rect x={vX} y={yPos(d.verificaciones)} width={barW} height={(d.verificaciones / maxVal) * chartH} fill="#10b981" rx="3" />
            <text x={cx} y={svgH - 8} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="11">{d.mes}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ segments }) {
  const cx = 90, cy = 90, r = 65, strokeWidth = 26;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let startAngle = -90;

  return (
    <svg viewBox="0 0 180 180" width="170" height="170">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
      {segments.map((seg, i) => {
        const fraction = seg.value / total;
        const arc = fraction * circ;
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc} ${circ}`}
            transform={`rotate(${startAngle} ${cx} ${cy})`}
          />
        );
        startAngle += fraction * 360;
        return el;
      })}
    </svg>
  );
}

export const AdminDashboard = () => {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Resumen general del sistema de certificados</p>
        </div>
        {hasPermission('certificado:emitir') && (
          <button className="btn-emit" onClick={() => navigate('/admin/certificados')}>
            <FileBadge size={16} />
            Emitir Certificado
          </button>
        )}
      </div>

      {/* Stat cards */}
      <div className="dash-stats-grid">
        {DASH_STATS.map(({ label, value, trend, up, icon: Icon, color }) => (
          <div key={label} className="dash-stat-card glass-panel">
            <div className="dash-stat-top">
              <span className={`dash-stat-trend ${up ? 'trend-up' : 'trend-down'}`}>
                {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {trend}
              </span>
            </div>
            <div className="dash-stat-icon" style={{ color }}>
              <Icon size={22} />
            </div>
            <p className="dash-stat-value">{value}</p>
            <p className="dash-stat-label">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="dash-charts-row">
        {/* Bar chart */}
        <div className="dash-chart-card glass-panel">
          <div className="dash-chart-header">
            <h3>Emisiones y Verificaciones</h3>
            <div className="chart-legend">
              <span className="legend-dot" style={{ background: '#0d7a7a' }} /> Emisiones
              <span className="legend-dot" style={{ background: '#10b981' }} /> Verificaciones
            </div>
          </div>
          <BarChart data={MOCK_MONTHLY_DATA} />
        </div>

        {/* Donut chart */}
        <div className="dash-donut-card glass-panel">
          <h3>Estado de Certificados</h3>
          <div className="donut-wrap">
            <DonutChart segments={DONUT_SEGMENTS} />
          </div>
          <div className="donut-legend">
            {DONUT_SEGMENTS.map(s => (
              <div key={s.label} className="donut-legend-item">
                <span className="legend-dot" style={{ background: s.color }} />
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="dash-activity-card glass-panel">
        <h3>Actividad Reciente</h3>
        <div className="activity-list">
          {MOCK_ACTIVIDAD_RECIENTE.map(item => (
            <div key={item.id} className="activity-item">
              <span className="activity-dot" style={{ background: item.color }} />
              <div className="activity-info">
                <p className="activity-title">{item.titulo}</p>
                <p className="activity-desc">{item.desc}</p>
              </div>
              <span className="activity-time">{item.tiempo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
