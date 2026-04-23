// ==============================
// Mock Data for CertiValidate
// ==============================

export const MOCK_USERS = {
  admin: {
    id: 'u-001',
    nombre: 'Carlos',
    apellido: 'Mendoza',
    email: 'admin@certivalidate.com',
    rol: 'admin',
    email_verificado: true,
    ultimo_acceso: '2026-04-19T10:30:00Z',
  },
  editor: {
    id: 'u-002',
    nombre: 'María',
    apellido: 'García',
    email: 'editor@certivalidate.com',
    rol: 'editor',
    email_verificado: true,
    ultimo_acceso: '2026-04-19T09:15:00Z',
  },
  lector: {
    id: 'u-003',
    nombre: 'Pedro',
    apellido: 'López',
    email: 'lector@certivalidate.com',
    rol: 'lector',
    email_verificado: true,
    ultimo_acceso: '2026-04-18T14:00:00Z',
  },
};

export const MOCK_CREDENTIALS = {
  'admin@certivalidate.com': { password: 'Admin1234', user: MOCK_USERS.admin },
  'editor@certivalidate.com': { password: 'Editor1234', user: MOCK_USERS.editor },
  'lector@certivalidate.com': { password: 'Lector1234', user: MOCK_USERS.lector },
};

export const MOCK_INSTITUCIONES = [
  { id: 'inst-001', nombre: 'Universidad Central de Colombia', dominio: 'ucentral.edu.co', logo_url: null, activa: true, created_at: '2025-01-15T00:00:00Z' },
  { id: 'inst-002', nombre: 'Instituto Tecnológico del Valle', dominio: 'itv.edu.co', logo_url: null, activa: true, created_at: '2025-03-20T00:00:00Z' },
  { id: 'inst-003', nombre: 'Academia de Ciencias Digitales', dominio: 'acd.edu.co', logo_url: null, activa: false, created_at: '2024-11-01T00:00:00Z' },
];

export const MOCK_ESTUDIANTES = [
  { id: 'est-001', institucion_id: 'inst-001', nombre: 'Ana', apellido: 'Martínez', documento: '1023456789', email: 'ana.m@email.com', created_at: '2025-06-10T00:00:00Z' },
  { id: 'est-002', institucion_id: 'inst-001', nombre: 'Luis', apellido: 'Rodríguez', documento: '1098765432', email: 'luis.r@email.com', created_at: '2025-06-12T00:00:00Z' },
  { id: 'est-003', institucion_id: 'inst-001', nombre: 'Sofía', apellido: 'Herrera', documento: '1034567891', email: 'sofia.h@email.com', created_at: '2025-07-01T00:00:00Z' },
  { id: 'est-004', institucion_id: 'inst-002', nombre: 'Diego', apellido: 'Torres', documento: '1045678912', email: 'diego.t@email.com', created_at: '2025-08-15T00:00:00Z' },
  { id: 'est-005', institucion_id: 'inst-002', nombre: 'Valentina', apellido: 'Jiménez', documento: '1056789123', email: 'val.j@email.com', created_at: '2025-08-20T00:00:00Z' },
  { id: 'est-006', institucion_id: 'inst-001', nombre: 'Camilo', apellido: 'Vargas', documento: '1067891234', email: 'camilo.v@email.com', created_at: '2025-09-05T00:00:00Z' },
  { id: 'est-007', institucion_id: 'inst-002', nombre: 'Isabella', apellido: 'Moreno', documento: '1078912345', email: 'isa.m@email.com', created_at: '2025-09-10T00:00:00Z' },
  { id: 'est-008', institucion_id: 'inst-001', nombre: 'Juan Pablo', apellido: 'Ríos', documento: '1089123456', email: 'jp.rios@email.com', created_at: '2025-10-01T00:00:00Z' },
];

export const MOCK_PLANTILLAS = [
  { id: 'plt-001', institucion_id: 'inst-001', nombre: 'Certificado de Finalización', template_html: '<h1>{{nombre}}</h1><p>Ha completado el curso...</p>', version: 2, activa: true, created_at: '2025-05-01T00:00:00Z' },
  { id: 'plt-002', institucion_id: 'inst-001', nombre: 'Diploma de Excelencia', template_html: '<h1>Diploma</h1><p>Se otorga a {{nombre}}...</p>', version: 1, activa: true, created_at: '2025-05-15T00:00:00Z' },
  { id: 'plt-003', institucion_id: 'inst-002', nombre: 'Constancia de Participación', template_html: '<h1>Constancia</h1><p>{{nombre}} participó...</p>', version: 1, activa: true, created_at: '2025-06-01T00:00:00Z' },
  { id: 'plt-004', institucion_id: 'inst-002', nombre: 'Certificado Técnico', template_html: '<h1>Técnico</h1>', version: 3, activa: true, created_at: '2025-07-01T00:00:00Z' },
  { id: 'plt-005', institucion_id: 'inst-001', nombre: 'Reconocimiento Académico (v1)', template_html: '<h1>Reconocimiento</h1>', version: 1, activa: false, created_at: '2025-02-01T00:00:00Z' },
];

export const MOCK_CERTIFICADOS = [
  { id: 'cert-001', estudiante_id: 'est-001', institucion_id: 'inst-001', plantilla_id: 'plt-001', codigo_unico: 'A3F2B91C4D7E0812', estado: 'valido',   fecha_emision: '2026-01-15T10:00:00Z', fecha_expiracion: null,                  hash_sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', created_at: '2026-01-15T10:00:00Z', estudiante: { nombre: 'Ana',       apellido: 'Martínez', documento: '1023456789' }, institucion: { nombre: 'Universidad Central de Colombia'   }, plantilla: { nombre: 'Certificado de Finalización'  } },
  { id: 'cert-002', estudiante_id: 'est-002', institucion_id: 'inst-001', plantilla_id: 'plt-002', codigo_unico: 'B7D1E4A9F2C30516', estado: 'valido',   fecha_emision: '2026-02-10T14:30:00Z', fecha_expiracion: '2027-02-10T00:00:00Z', hash_sha256: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', created_at: '2026-02-10T14:30:00Z', estudiante: { nombre: 'Luis',      apellido: 'Rodríguez', documento: '1098765432' }, institucion: { nombre: 'Universidad Central de Colombia'   }, plantilla: { nombre: 'Diploma de Excelencia'         } },
  { id: 'cert-003', estudiante_id: 'est-004', institucion_id: 'inst-002', plantilla_id: 'plt-003', codigo_unico: 'C5E8F1B3D6A90724', estado: 'revocado', fecha_emision: '2025-11-20T09:00:00Z', fecha_expiracion: null,                  hash_sha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824', created_at: '2025-11-20T09:00:00Z', estudiante: { nombre: 'Diego',     apellido: 'Torres',    documento: '1045678912' }, institucion: { nombre: 'Instituto Tecnológico del Valle'   }, plantilla: { nombre: 'Constancia de Participación'  } },
  { id: 'cert-004', estudiante_id: 'est-003', institucion_id: 'inst-001', plantilla_id: 'plt-001', codigo_unico: 'D2A4C6E8F0B17935', estado: 'valido',   fecha_emision: '2026-03-05T11:15:00Z', fecha_expiracion: null,                  hash_sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', created_at: '2026-03-05T11:15:00Z', estudiante: { nombre: 'Sofía',     apellido: 'Herrera',   documento: '1034567891' }, institucion: { nombre: 'Universidad Central de Colombia'   }, plantilla: { nombre: 'Certificado de Finalización'  } },
  { id: 'cert-005', estudiante_id: 'est-005', institucion_id: 'inst-002', plantilla_id: 'plt-004', codigo_unico: 'E9F3A7B1C5D20846', estado: 'valido',   fecha_emision: '2026-03-18T16:00:00Z', fecha_expiracion: '2027-03-18T00:00:00Z', hash_sha256: '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', created_at: '2026-03-18T16:00:00Z', estudiante: { nombre: 'Valentina', apellido: 'Jiménez',   documento: '1056789123' }, institucion: { nombre: 'Instituto Tecnológico del Valle'   }, plantilla: { nombre: 'Certificado Técnico'           } },
  { id: 'cert-006', estudiante_id: 'est-006', institucion_id: 'inst-001', plantilla_id: 'plt-002', codigo_unico: 'F1B5D9E3A7C40258', estado: 'valido',   fecha_emision: '2026-04-01T08:45:00Z', fecha_expiracion: null,                  hash_sha256: 'bf9d2f17b592b6c748ee1b8b3c5ffbcfbbd1ef6c6a3b5cdc55b50cce9e3451a', created_at: '2026-04-01T08:45:00Z', estudiante: { nombre: 'Camilo',    apellido: 'Vargas',    documento: '1067891234' }, institucion: { nombre: 'Universidad Central de Colombia'   }, plantilla: { nombre: 'Diploma de Excelencia'         } },
  { id: 'cert-007', estudiante_id: 'est-007', institucion_id: 'inst-002', plantilla_id: 'plt-003', codigo_unico: 'G4H8K2L6M0N35769', estado: 'valido',   fecha_emision: '2026-04-10T13:20:00Z', fecha_expiracion: null,                  hash_sha256: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069', created_at: '2026-04-10T13:20:00Z', estudiante: { nombre: 'Isabella',  apellido: 'Moreno',    documento: '1078912345' }, institucion: { nombre: 'Instituto Tecnológico del Valle'   }, plantilla: { nombre: 'Constancia de Participación'  } },
];

export const MOCK_ESTADISTICAS = {
  'inst-001': { institucion_id: 'inst-001', estudiantes: 5, plantillas: 3, certificados: 4, certificados_validos: 4, certificados_revocados: 0, certificados_expirados: 0, verificaciones_publicas: 127 },
  'inst-002': { institucion_id: 'inst-002', estudiantes: 3, plantillas: 2, certificados: 3, certificados_validos: 2, certificados_revocados: 1, certificados_expirados: 0, verificaciones_publicas: 58 },
};

export const MOCK_AUDITORIA = [
  { id: 1, usuario_id: 'u-001', accion: 'EMITIR_CERTIFICADO', entidad: 'Certificado', entidad_id: 'cert-007', ip: '192.168.1.10', fecha: '2026-04-10T13:20:00Z', usuario: { id: 'u-001', nombre: 'Carlos', apellido: 'Mendoza', email: 'admin@certivalidate.com' } },
  { id: 2, usuario_id: 'u-001', accion: 'EMITIR_CERTIFICADO', entidad: 'Certificado', entidad_id: 'cert-006', ip: '192.168.1.10', fecha: '2026-04-01T08:45:00Z', usuario: { id: 'u-001', nombre: 'Carlos', apellido: 'Mendoza', email: 'admin@certivalidate.com' } },
  { id: 3, usuario_id: 'u-002', accion: 'CREAR_USUARIO', entidad: 'Usuario', entidad_id: 'u-003', ip: '10.0.0.5', fecha: '2026-03-28T11:00:00Z', usuario: { id: 'u-002', nombre: 'María', apellido: 'García', email: 'editor@certivalidate.com' } },
  { id: 4, usuario_id: 'u-001', accion: 'REVOCAR_CERTIFICADO', entidad: 'Certificado', entidad_id: 'cert-003', ip: '192.168.1.10', fecha: '2026-03-20T15:30:00Z', usuario: { id: 'u-001', nombre: 'Carlos', apellido: 'Mendoza', email: 'admin@certivalidate.com' } },
  { id: 5, usuario_id: 'u-002', accion: 'EMITIR_CERTIFICADO', entidad: 'Certificado', entidad_id: 'cert-005', ip: '10.0.0.5', fecha: '2026-03-18T16:00:00Z', usuario: { id: 'u-002', nombre: 'María', apellido: 'García', email: 'editor@certivalidate.com' } },
  { id: 6, usuario_id: 'u-001', accion: 'ACTUALIZAR_PERFIL', entidad: 'Usuario', entidad_id: 'u-001', ip: '192.168.1.10', fecha: '2026-03-15T09:00:00Z', usuario: { id: 'u-001', nombre: 'Carlos', apellido: 'Mendoza', email: 'admin@certivalidate.com' } },
  { id: 7, usuario_id: 'u-002', accion: 'EMITIR_CERTIFICADO', entidad: 'Certificado', entidad_id: 'cert-004', ip: '10.0.0.5', fecha: '2026-03-05T11:15:00Z', usuario: { id: 'u-002', nombre: 'María', apellido: 'García', email: 'editor@certivalidate.com' } },
  { id: 8, usuario_id: 'u-001', accion: 'CAMBIAR_PASSWORD', entidad: 'Usuario', entidad_id: 'u-001', ip: '192.168.1.10', fecha: '2026-02-28T14:45:00Z', usuario: { id: 'u-001', nombre: 'Carlos', apellido: 'Mendoza', email: 'admin@certivalidate.com' } },
];

// Role permission map
export const ROLE_PERMISSIONS = {
  admin: ['certificado:emitir', 'certificado:revocar', 'certificado:listar', 'certificado:ver', 'certificado:descargar', 'estudiante:crear', 'estudiante:actualizar', 'estudiante:eliminar', 'estudiante:listar', 'estudiante:ver', 'institucion:actualizar', 'institucion:ver', 'institucion:estadisticas', 'plantilla:crear', 'plantilla:actualizar', 'plantilla:archivar', 'plantilla:ver', 'plantilla:listar', 'auditoria:ver', 'usuario:listar', 'usuario:crear', 'usuario:actualizar', 'usuario:eliminar'],
  editor: ['certificado:emitir', 'certificado:revocar', 'certificado:listar', 'certificado:ver', 'certificado:descargar', 'estudiante:crear', 'estudiante:actualizar', 'estudiante:listar', 'estudiante:ver', 'institucion:ver', 'institucion:estadisticas'],
  lector: ['certificado:listar', 'certificado:ver', 'certificado:descargar', 'estudiante:listar', 'estudiante:ver', 'institucion:ver', 'institucion:estadisticas'],
};

export const MOCK_SYSTEM_USERS = [
  { id: 'su-001', nombre: 'Administrador', apellido: 'Principal', email: 'admin@unicesar.edu.co', rol: 'admin', activo: true },
  { id: 'su-002', nombre: 'Juan', apellido: 'Emisor', email: 'emisor@unicesar.edu.co', rol: 'editor', activo: true },
  { id: 'su-003', nombre: 'Laura', apellido: 'Validadora', email: 'validador@unicesar.edu.co', rol: 'lector', activo: true },
  { id: 'su-004', nombre: 'Pedro', apellido: 'García', email: 'pgarcia@unicesar.edu.co', rol: 'editor', activo: false },
];

export const MOCK_ACTIVIDAD_RECIENTE = [
  { id: 1, tipo: 'emision', titulo: 'Certificado emitido', desc: 'María López — Ing. Sistemas', tiempo: 'Hace 5 min', color: '#10b981' },
  { id: 2, tipo: 'verificacion', titulo: 'Verificación exitosa', desc: 'Código: CV-2026-0847', tiempo: 'Hace 12 min', color: '#00f0ff' },
  { id: 3, tipo: 'revocacion', titulo: 'Certificado revocado', desc: 'Carlos Ruiz — Derecho', tiempo: 'Hace 1 hora', color: '#ef4444' },
  { id: 4, tipo: 'usuario', titulo: 'Nuevo usuario creado', desc: 'emisor@unicesar.edu.co', tiempo: 'Hace 2 horas', color: '#3b82f6' },
  { id: 5, tipo: 'fallo', titulo: 'Verificación fallida', desc: 'Código inválido detectado', tiempo: 'Hace 3 horas', color: '#f59e0b' },
];

export const MOCK_MONTHLY_DATA = [
  { mes: 'Ene', emisiones: 80, verificaciones: 170 },
  { mes: 'Feb', emisiones: 100, verificaciones: 175 },
  { mes: 'Mar', emisiones: 300, verificaciones: 310 },
  { mes: 'Abr', emisiones: 130, verificaciones: 140 },
  { mes: 'May', emisiones: 350, verificaciones: 490 },
  { mes: 'Jun', emisiones: 150, verificaciones: 450 },
];
