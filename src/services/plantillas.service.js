import { request } from './api';

export const plantillasService = {
  listar: () => request('/plantillas'),
  obtener: (id) => request(`/plantillas/${id}`),
  crear: (data) => request('/plantillas', { method: 'POST', body: data }),
  actualizar: (id, data) => request(`/plantillas/${id}`, { method: 'PUT', body: data }),
  archivar: (id) => request(`/plantillas/${id}`, { method: 'DELETE' }),
};
