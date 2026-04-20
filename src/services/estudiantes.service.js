import { request } from './api';

export const estudiantesService = {
  listar: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/estudiantes?${query}`);
  },
  obtener: (id) => request(`/estudiantes/${id}`),
  crear: (data) => request('/estudiantes', { method: 'POST', body: data }),
  actualizar: (id, data) => request(`/estudiantes/${id}`, { method: 'PUT', body: data }),
  eliminar: (id) => request(`/estudiantes/${id}`, { method: 'DELETE' }),
};
