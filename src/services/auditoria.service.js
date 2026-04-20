import { request } from './api';

export const auditoriaService = {
  listar: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/auditoria?${query}`);
  },
  porEntidad: (entidad, entidadId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/auditoria/${entidad}/${entidadId}?${query}`);
  },
};
