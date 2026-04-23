# CertiValidate - Prototipo Frontend

Este proyecto es el prototipo no funcional (frontend simulado con datos estáticos) del sistema **CertiValidate**, una plataforma para la gestión, emisión y validación de certificados.

## Requisitos Previos

Para ejecutar este proyecto en cualquier entorno, asegúrese de tener instalado:
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- `npm` (viene instalado con Node.js)

## Instrucciones de Instalación y Ejecución

1. **Clonar o descargar el repositorio**
   Una vez descargado o clonado el proyecto, abra una terminal y navegue hasta la raíz del proyecto (`certivalidate-frontend`).

2. **Instalar dependencias**
   Ejecute el siguiente comando para descargar e instalar todas las librerías necesarias:
   ```bash
   npm install
   ```

3. **Iniciar el proyecto**
   El proyecto utiliza Vite. Para iniciar el servidor de desarrollo, ejecute:
   ```bash
   npm run dev
   ```

4. **Navegar en el prototipo**
   Abra su navegador web y diríjase a la URL local indicada en la terminal (usualmente `http://localhost:5173/`).

## Roles de Usuarios y Accesos

El sistema tiene implementado un sistema de inicio de sesión simulado. Puede ingresar utilizando los siguientes roles y sus respectivas credenciales de prueba preconfiguradas:

### Administrador
- **Email:** `admin@certivalidate.com`
- **Contraseña:** `Admin1234`
- **Capacidades:** Control total. Puede administrar certificados, estudiantes, plantillas, instituciones y revisar el registro de auditoría.

### Editor
- **Email:** `editor@certivalidate.com`
- **Contraseña:** `Editor1234`
- **Capacidades:** Tiene permisos para emitir y revocar certificados, además de gestionar estudiantes y plantillas. No puede realizar acciones críticas de administración global.

### Lector
- **Email:** `lector@certivalidate.com`
- **Contraseña:** `Lector1234`
- **Capacidades:** Permisos de visualización. Puede listar y ver detalles de los registros (estudiantes, certificados, etc.), pero no tiene permisos para crear, editar ni revocar información.

## Listado de Pantallas

El prototipo consiste en un sistema navegable con múltiples vistas, cumpliendo con la entrega de más de 5 pantallas funcionales:

1. **Pantalla de Inicio de Sesión (Login):** Donde ingresan los distintos roles del sistema.
2. **Pantalla de Registro:** Formulario para registrar nuevas cuentas.
3. **Página Pública de Validación de Certificados (`/verificar`):** Un portal público, libre de autenticación, donde cualquier persona puede ingresar un código de certificado y comprobar su validez.
4. **Dashboard Principal:** Panel general con indicadores clave (estadísticas de certificados, estudiantes, etc.).
5. **Módulo de Certificados:** Tabla de gestión y visualización de diplomas.
6. **Módulo de Estudiantes:** Administración y listado de los perfiles de los estudiantes.
7. **Módulo de Plantillas:** Gestión de los diseños estructurados para la creación de certificados.
8. **Módulo de Instituciones:** Configuración y vista de los entes emisores y métricas asociadas.
9. **Módulo de Auditoría y Perfil:** Registro de acciones (logs) de seguridad y control de usuario.
