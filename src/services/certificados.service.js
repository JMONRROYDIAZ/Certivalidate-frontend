import { request, API_BASE, getToken } from './api';

export const certificadosService = {
  listar: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/certificados/listar?${query}`);
  },
  obtener: (id) => request(`/certificados/${id}`),
  emitir: (data) => request('/certificados/emitir', { method: 'POST', body: data }),
  revocar: (id, data) => request(`/certificados/${id}/revocar`, { method: 'POST', body: data }),
  verificar: (data) => request('/certificados/verificar', { method: 'POST', body: data, auth: false }),
  verificaciones: (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/certificados/${id}/verificaciones?${query}`);
  },
  revocaciones: (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/certificados/${id}/revocaciones?${query}`);
  },
  descargarUrl: (id) => `${API_BASE}/certificados/descargar/${id}`,
  descargar: (id) =>
    request(`/certificados/descargar/${id}`, { raw: true }).then(res => res.blob()),
};
