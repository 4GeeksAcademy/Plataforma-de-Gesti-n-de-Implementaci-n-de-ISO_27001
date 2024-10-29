# Plataforma de Gestión de Implementación de ISO 27001

## Descripción General
Esta plataforma permite a las organizaciones gestionar de manera estructurada y eficiente la implementación de la norma **ISO 27001** para la gestión de seguridad de la información. ___???????


## Product Backlog (Inicial) 

Este documento describe el backlog inicial para la implementación de ISO 27001.

## Registro Inicial y Gestión de Usuarios
### Objetivo: Permitir que el administrador registre el proyecto y cree cuentas para los demás usuarios antes de comenzar a usar otras funcionalidades de la plataforma.

- Como **usuario nuevo**, quiero registrarme en la plataforma como Administrador con datos básicos (nombre, correo electrónico, contraseña y datos de la organización), para empezar a configurar el proyecto de ISO 27001.
- Como **administrador**, quiero acceder a un panel de gestión de usuarios para registrar nuevos implementadores, auditores y visitantes, para que puedan colaborar en el proyecto.
- Como **adminsitrador**, quiero asignar roles específicos (auditor, visitante) a los usuarios registrados, para controlar su acceso a la información de la plataforma.
- Como **administrador**, quiero enviar invitaciones de registro a los nuevos usuarios (implementadores, auditores, visitantes) con un enlace de activación?? ,(Quizas solo directo datos de ingreso: usuario y contraseña?) para que puedan configurar sus cuentas y unirse al proyecto.
- Como **usuario invitado**, quiero (actualizar mi contraseña) de mi cuenta, para poder acceder a la plataforma de forma segura y empezar a trabajar según mi rol asignado.


## Sistema de Autenticación y Gestión de Permisos
### Objetivo: Controlar el acceso a la plataforma y gestionar los permisos de los usuarios.

- Como **administrador**, quiero gestionar los usuarios de la plataforma (agregar, editar, eliminar), para que solo personas autorizadas accedan a la plataforma.
- Como **usuario** (administrador, auditor), quiero iniciar sesión de manera segura con autenticación JWT, para asegurar la protección de los datos.
- Como **administrador**, quiero asignar roles específicos a cada usuario (auditor o visitante), para asegurar que solo tengan acceso a la información necesaria para su rol.
- Como **auditor/visitante**, quiero poder restablecer mi contraseña en caso de olvido.


## Gestión de Proyectos y Tareas
### Objetivo: Gestionar proyectos y tareas de forma estructurada para facilitar el seguimiento y avance.

- Como **administrador**, quiero crear un proyecto de implementación para ISO 27001 con un nombre, fecha de inicio y responsables, para gestionar todo el proceso en un solo lugar.
- Como **auditor**, quiero dividir el proyecto en fases (planificación, implementación de controles, etc.), para estructurar el avance del proyecto.
- Como **administrador**, quiero crear y asignar tareas dentro de cada fase, con plazos y prioridades, para asegurar que cada miembro sepa sus responsabilidades (formulario).
- Como **auditor**, quiero visualizar un tablero de tareas donde pueda ver el estado de cada tarea (pendiente, en progreso, completada), para conocer el avance del proyecto.
- Como **consultor**, quiero recibir notificaciones cuando una tarea esté próxima a vencer, para poder priorizar mi tiempo de forma efectiva??? Es aplicable?? Es útil??.

## Documentación de Políticas y Procedimientos
### Objetivo: Centralizar la documentación de políticas y procedimientos para facilitar la gestión y actualización.

- Como **consultor**, quiero subir documentos de políticas y procedimientos relacionados con el proyecto la empresa, para tener toda la documentación en un solo lugar.
- Como **usuario**, quiero agregar o elimiar los documentos directamente en la plataforma?? API DRIVE, para mantenerlos actualizados conforme avanzamos en la implementación.


## Matriz de Cumplimiento de Controles
### Objetivo: Gestionar y monitorear el cumplimiento de los controles de seguridad de ISO 27001.

- Como **consultor**, quiero ver una lista de los **94** controles de seguridad de ISO 27001 (Anexo A), para poder evaluar el cumplimiento de cada uno.
- Como **consultor**, quiero marcar el estado de cada control (pendiente, en implementación, cumplido), para tener un seguimiento claro de cada control.
- Como **consultor**, quiero agregar observaciones o notas en cada control, para detallar el trabajo realizado y cualquier excepción.
- Como **consultor**, quiero ver el estado de los controles implementados, para verificar el cumplimiento y hacer recomendaciones de mejora.

## Reportes y Auditoría Interna
### Objetivo: Generar reportes y llevar a cabo auditorías internas para el seguimiento y cumplimiento de ISO 27001.

- Como **consultor**, quiero generar reportes de progreso **graficas**, para tener una referencia visual de la implementación.
- Como **auditor**, quiero realizar auditorías internas documentando hallazgos y observaciones en cada fase del proyecto, para validar el cumplimiento de ISO 27001.////
- Como **auditor**, quiero descargar un reporte detallado de controles y tareas completadas, para documentar el avance de la implementación y preparar informes para los auditoria (A evaluar).
- Como **administrador**, quiero generar reportes de cumplimiento y riesgos para presentar al equipo directivo y demostrar el avance de la implementación.    --> **Ultimos dos puntos sugerencia de Chat GPT** (A evaluar)


## Acceso para Visitante (Representante de Empresa)
### Objetivo: Dar seguimiento a  la implementación de la ISO 27001 desde la perspectiva de un visitante, control de estados, información, etc.

- Como **administrador**, quiero crear cuentas de visitante con permisos de solo lectura, para que representantes de la empresa puedan monitorear el avance de la implementación.
- Como **visitante** (representante de la empresa), quiero iniciar sesión de forma segura y acceder al panel de progreso, para ver el avance general del proyecto.
- Como **visitante** (representante de la empresa), quiero ver el tablero de tareas y fases del proyecto, para entender el estado actual de la implementación y los pendientes.
- Como **visitante** (representante de la empresa), quiero visualizar la matriz de cumplimiento de controles, para revisar los controles implementados y el estado de cada uno.
- Como **visitante** (representante de la empresa), quiero ver y descargar reportes de progreso y auditoría interna, para tener un registro documentado de la implementación y los resultados. (A evaluar)

## Prioridad sugerida para el Product Backlog:
### 0: Registro Inicial y Gestión de Usuarios.
**Flujo de Registro Inicial y Gestión de Usuarios**
Registro Inicial del Administrador:

El primer usuario en registrarse en la plataforma sería el Administrador.
Este administrador inicial configurará los detalles básicos del proyecto y gestionará el acceso de otros usuarios (implementadores, auditores y visitantes).

Creación y Gestión de Usuarios:
El administrador podrá registrar a nuevos usuarios dentro de la plataforma.
Asignará roles específicos (consultor, visitante) a cada usuario, permitiéndoles solo los permisos necesarios para su función.

Acceso Controlado:
Los usuarios registrados recibirán un enlace para activar su cuenta y establecer su contraseña.
Se implementará un flujo de autenticación seguro usando JWT, que restringe el acceso de cada usuario según su rol.

### 1: Sistema de Autenticación y Gestión de Permisos.
?
### 2: Gestión de Proyectos y Tareas.
?
### 3: Documentación de Políticas y Procedimientos.
?
### 4: Matriz de Cumplimiento de Controles.
?
### 5: Reportes y Auditoría Interna.
?
### 6+: Acceso para Visitante (Representante de Empresa).
?


## Vistas del Proyecto

### 1. Carátula de la Aplicación (Landing Page) **Principal**
**Descripción**: Página de bienvenida a **introducir** las características principales de la plataforma, dirigida a nuevos usuarios.

**Elementos clave**:
- **Encabezado**: Nombre de la aplicación y menú de navegación.
- **Explicación breve** Utilidad de la app.
- **Vendernos como app**.
- **Botones de Acción**:
  - **"Registrarse"**: Para crear una cuenta de administrador. --> Gestionar nuevo proyecto
  - **"Iniciar sesión"**: Para usuarios registrados.
- **Pie de página**: Información de contacto y políticas.

### 2. Registro de Administrador
**Descripción**: Página donde el administrador inicial crea su cuenta y configura el proyecto.

**Elementos clave**:
- **Formulario de Registro**: Nombre, correo, contraseña y datos de la empresa.
- **Enlace a "Iniciar sesión"** para usuarios registrados.

### 3. Iniciar Sesión
**Descripción**: Página de autenticación para usuarios registrados.

**Elementos clave**:
- **Campos de correo y contraseña**.
- **Enlace a "¿Olvidaste tu contraseña?"** para recuperación de acceso.

### 4. Recuperar Contraseña
**Descripción**: Página de recuperación de contraseña en caso de olvido.

**Elementos clave**:
- **Formulario de recuperación**: Campo de correo electrónico.
- **Botón para enviar enlace de restablecimiento**.

### 5. Dashboard Principal **Principal**
**Descripción**: Vista general del estado del proyecto de implementación de ISO 27001.

**Elementos clave**:
- **Indicador de Progreso**: Estado general de la implementación.
- **Lista de Tareas Pendientes**.
- **Estado de Controles**.
- **Notificaciones** de tareas próximas a vencer.

### 6. Gestión de Usuarios
**Descripción**: Vista para que el administrador gestione los usuarios de la plataforma.

**Elementos clave**:
- **Lista de Usuarios**: Muestra usuarios registrados y **su rol**.
- **Botón para Agregar Nuevos Usuarios** (implementadores, auditores, visitantes).
- Opciones para editar y eliminar usuarios.

### 7. Gestión de Proyectos y Tareas
**Descripción**: Sección para crear y gestionar tareas del proyecto.

**Elementos clave**:
- **Vista de Fases del Proyecto**.
- **Lista de Tareas**: Asignación de responsables y plazos.
- **Tablero de Tareas (Kanban)** para seguimiento de estado.

### 8. Documentación de Políticas y Procedimientos
**Descripción**: Módulo de almacenamiento y gestión de documentos de ISO 27001.

**Elementos clave**:
- **Función para Subir Documentos**.
- **Vista y Descarga de Documentos** en modo solo lectura para usuarios sin permisos de edición.

### 10. Matriz de Cumplimiento de Controles
**Descripción**: Módulo para verificar el estado de cumplimiento de cada control de ISO 27001.

**Elementos clave**:
- **Lista de los 94 controles de ISO 27001 (Anexo A)**.
- **Estado de cada Control** (pendiente, en implementación, cumplido).
- Campo de **Observaciones y Notas** adicionales.

### 11. Reportes y Auditoría Interna
**Descripción**: Generación y descarga de reportes (a evaluar).

**Elementos clave**:
- **Generación de Reportes en PDF o Excel** sobre progreso general y cumplimiento.
- **Módulo de Auditoría**: Para que los auditores documenten observaciones y hallazgos. ////
- **Reportes Descargables para Visitantes**.

---

## Roles de Usuario

### Administrador
- Configuración inicial, creación de usuarios y gestión del proyecto.
- Acceso completo a todos los módulos.

### Consultor
- Ejecución del proyecto y implementación de controles.
- Acceso a tareas, documentación y controles.

### Auditor ////
- Validación del cumplimiento de controles y auditoría interna.
- Acceso a la matriz de controles, gestión de riesgos y módulo de auditoría.

### Visitante (Representante de Empresa)
- Solo lectura para visualizar el progreso de la implementación.
- Acceso a informes de progreso, controles cumplidos y reportes descargables.

