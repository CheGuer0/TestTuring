# Turing Tech Store - Proyecto Backend dia 1

Turing Tech Store es una aplicación para ver, filtrar y administrar productos de tecnología como procesadores, tarjetas de video, memoria RAM, almacenamiento y computadoras armadas.

Este repositorio contiene la parte del backend del proyecto, que incluye la base de datos y los servicios de la API.

---

## Tecnologías utilizadas

* **Servidor**: Node.js con Express.js.
* **Base de Datos**: SQLite, organizada para evitar información duplicada y asegurar buenas relaciones entre las tablas.
* **Seguridad**:
  - Encriptación de contraseñas de usuarios.
  - Sesiones seguras mediante tokens (JWT) con duración de 24 horas.
  - Protección contra consultas maliciosas (inyección SQL) mediante consultas parametrizadas.
  - Control de accesos según el rol de usuario (usuario normal o administrador).

---

## Estructura de la Base de Datos

La base de datos utiliza 3 tablas principales para guardar la información:

1. **usuarios**: Registra las cuentas, contraseñas protegidas y el rol (administrador o usuario común).
   - id
   - usuario
   - correo
   - contrasena_hash
   - rol (admin / user)
   - creado_en
2. **categorias**: Las categorías de los componentes (Procesadores, Tarjetas de Video, etc.).
   - id
   - nombre
   - descripcion
3. **productos**: Los artículos del catálogo de tecnología.
   - id
   - nombre
   - descripcion
   - especificaciones
   - precio
   - stock
   - imagen_url
   - categoria_id (relacionado con categorias)
   - creado_por (relacionado con el usuario que lo dio de alta)
   - creado_en

---

## Instalación y Uso Local

### Requisitos previos
- Node.js instalado (versión 18 o superior).
- npm (el gestor de paquetes de Node).

---

### Paso 1: Instalar dependencias

Abre una terminal en la carpeta del backend e instala las librerías necesarias:
```bash
cd backend
npm install
```

---

### Paso 2: Crear la base de datos y datos de prueba

Ejecuta el siguiente comando para generar la base de datos SQLite de manera automática y cargar la información de prueba:
```bash
npm run seed
```

---

### Paso 3: Iniciar el servidor

Inicia la aplicación:
```bash
npm start
```
El servidor estará funcionando en la dirección http://localhost:5000.

---

## Cuentas de Prueba

Puedes probar el sistema con los siguientes usuarios de ejemplo:

 Tipo de Usuario | Nombre | Correo Electrónico | Contraseña |

 **Administrador (Puede editar y crear)** | `admin` | `admin@turingtech.com` | `admin123` |
 **Usuario Regular (Solo lectura)** | `user` | `user@turingtech.com` | `user123` |

---

## Rutas de la API

### Autenticación (Usuarios)
* **`POST /api/auth/register`**: Registra una nueva cuenta de usuario (rol de usuario común).
* **`POST /api/auth/login`**: Inicia sesión y devuelve el token de seguridad.
* **`GET /api/auth/me`**: Muestra los datos del usuario conectado (requiere token).

### Catálogo (Categorías y Productos)
* **`GET /api/categories`**: Devuelve todas las categorías de hardware.
* **`GET /api/products`**: Devuelve los productos disponibles. Se pueden usar los siguientes filtros opcionales en la dirección web:
  - `category`: Filtrar por el identificador de una categoría.
  - `search`: Buscar palabras en el nombre o descripción del producto.
  - `sort`: Ordenar los productos (`newest` para novedades, `price_asc` / `price_desc` para precio de menor a mayor o viceversa, y `name_asc` para orden alfabético).
  - `page` y `limit`: Para paginar los resultados.
* **`GET /api/products/:id`**: Devuelve los detalles de un producto en específico.

### Administración (Solo Administradores)
* **`POST /api/products`**: Crea un producto nuevo (requiere token de administrador).
* **`PUT /api/products/:id`**: Modifica los datos de un producto (requiere token de administrador).
* **`DELETE /api/products/:id`**: Elimina un producto (requiere token de administrador).

