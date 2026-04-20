import { request } from './api';

export const institucionesService = {
  listar: () => request('/instituciones'),
  obtener: (id) => request(`/instituciones/${id}`),
  crear: (data) => request('/instituciones', { method: 'POST', body: data }),
  actualizar: (id, data) => request(`/instituciones/${id}`, { method: 'PUT', body: data }),
  desactivar: (id) => request(`/instituciones/${id}/desactivar`, { method: 'PATCH' }),
  estadisticas: (id) => request(`/instituciones/${id}/estadisticas`),
};
