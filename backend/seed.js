const bcrypt = require('bcryptjs');
const { dbQuery, initDatabase } = require('./database');

const seed = async () => {
  console.log('Iniciando carga de datos semilla en español (3 tablas)...');
  await initDatabase();

  try {
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const userPasswordHash = await bcrypt.hash('user123', 10);

    await dbQuery.run(
      `INSERT OR IGNORE INTO usuarios (usuario, correo, contrasena_hash, rol) 
       VALUES (?, ?, ?, ?)`,
      ['admin', 'admin@turingtech.com', adminPasswordHash, 'admin']
    );

    await dbQuery.run(
      `INSERT OR IGNORE INTO usuarios (usuario, correo, contrasena_hash, rol) 
       VALUES (?, ?, ?, ?)`,
      ['user', 'user@turingtech.com', userPasswordHash, 'user']
    );
    console.log('Usuarios de prueba creados (Admin y User).');

    const adminUser = await dbQuery.get('SELECT id FROM usuarios WHERE usuario = ?', ['admin']);

    const categories = [
      { nombre: 'Procesadores', descripcion: 'CPUs de última generación Intel y AMD para gaming y productividad.' },
      { nombre: 'Tarjetas de Video', descripcion: 'GPUs NVIDIA GeForce RTX y AMD Radeon para máximo rendimiento gráfico.' },
      { nombre: 'Memorias RAM', descripcion: 'Módulos de memoria DDR4 y DDR5 con alta velocidad y latencia baja.' },
      { nombre: 'Almacenamiento', descripcion: 'SSDs NVMe M.2 ultra rápidos y discos duros de alta capacidad.' },
      { nombre: 'Computadoras Armadas', descripcion: 'Sistemas completos ensamblados y optimizados por profesionales.' }
    ];

    for (const cat of categories) {
      await dbQuery.run(
        'INSERT OR IGNORE INTO categorias (nombre, descripcion) VALUES (?, ?)',
        [cat.nombre, cat.descripcion]
      );
    }
    console.log('Categorías insertadas.');

    const catProcesadores = await dbQuery.get('SELECT id FROM categorias WHERE nombre = ?', ['Procesadores']);
    const catGPU = await dbQuery.get('SELECT id FROM categorias WHERE nombre = ?', ['Tarjetas de Video']);
    const catRAM = await dbQuery.get('SELECT id FROM categorias WHERE nombre = ?', ['Memorias RAM']);
    const catSSD = await dbQuery.get('SELECT id FROM categorias WHERE nombre = ?', ['Almacenamiento']);
    const catPCs = await dbQuery.get('SELECT id FROM categorias WHERE nombre = ?', ['Computadoras Armadas']);

    const products = [
      {
        nombre: 'AMD Ryzen 7 7800X3D',
        descripcion: 'El mejor procesador para gaming del mundo, con tecnología 3D V-Cache.',
        especificaciones: 'Núcleos: 8 | Hilos: 16 | Frecuencia Base: 4.2 GHz | Frecuencia Boost: 5.0 GHz | Caché L3: 96MB | TDP: 120W',
        precio: 389.99,
        stock: 15,
        imagen_url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=60',
        categoria_id: catProcesadores.id
      },
      {
        nombre: 'Intel Core i9-14900K',
        descripcion: 'Procesador tope de gama híbrido de 14ª generación para gaming entusiasta y creación de contenido pesado.',
        especificaciones: 'Núcleos: 24 (8 P-cores + 16 E-cores) | Hilos: 32 | Frecuencia Max: 6.0 GHz | Caché L3: 36MB | TDP: 125W',
        precio: 529.99,
        stock: 8,
        imagen_url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=60',
        categoria_id: catProcesadores.id
      },
      {
        nombre: 'AMD Ryzen 5 7600X',
        descripcion: 'Excelente rendimiento calidad-precio para entrar a la plataforma AM5 y DDR5.',
        especificaciones: 'Núcleos: 6 | Hilos: 12 | Frecuencia Base: 4.7 GHz | Frecuencia Boost: 5.3 GHz | Caché L3: 32MB | TDP: 105W',
        precio: 219.00,
        stock: 25,
        imagen_url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=60',
        categoria_id: catProcesadores.id
      },
      {
        nombre: 'NVIDIA GeForce RTX 4080 Super',
        descripcion: 'Tarjeta gráfica de alto rendimiento para gaming en 4K con Ray Tracing y DLSS 3.',
        especificaciones: 'Memoria: 16GB GDDR6X | Interfaz de Memoria: 256-bit | Núcleos CUDA: 10240 | Reloj Boost: 2.55 GHz | Consumo: 320W',
        precio: 999.99,
        stock: 6,
        imagen_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=60',
        categoria_id: catGPU.id
      },
      {
        nombre: 'NVIDIA GeForce RTX 4070 Super',
        descripcion: 'La tarjeta ideal para gaming competitivo a 1440p con trazado de rayos avanzado.',
        especificaciones: 'Memoria: 12GB GDDR6X | Interfaz de Memoria: 192-bit | Núcleos CUDA: 7168 | Reloj Boost: 2.48 GHz | Consumo: 220W',
        precio: 599.00,
        stock: 12,
        imagen_url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=60',
        categoria_id: catGPU.id
      },
      {
        nombre: 'AMD Radeon RX 7900 XTX',
        descripcion: 'El buque insignia de AMD con gran cantidad de VRAM para rasterizado extremo.',
        especificaciones: 'Memoria: 24GB GDDR6 | Interfaz de Memoria: 384-bit | Stream Processors: 6144 | Consumo: 355W',
        precio: 929.99,
        stock: 5,
        imagen_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=60',
        categoria_id: catGPU.id
      },
      {
        nombre: 'Corsair Vengeance RGB DDR5 32GB (2x16GB)',
        descripcion: 'Kit de memoria de alto rendimiento optimizado para placas Intel y AMD con iluminación dinámica.',
        especificaciones: 'Capacidad: 32GB (2 x 16GB) | Frecuencia: 6000 MHz | Latencia: CL30 | Formato: DIMM 288-pin | Iluminación: RGB',
        precio: 124.99,
        stock: 30,
        imagen_url: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=60',
        categoria_id: catRAM.id
      },
      {
        nombre: 'G.Skill Trident Z5 Neo RGB DDR5 64GB (2x32GB)',
        descripcion: 'Memoria premium para entusiastas y creadores de contenido que requieren multitarea extrema.',
        especificaciones: 'Capacidad: 64GB (2 x 32GB) | Frecuencia: 6000 MHz | Latencia: CL30 | Perfil: AMD EXPO | Iluminación: RGB',
        precio: 219.99,
        stock: 10,
        imagen_url: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=60',
        categoria_id: catRAM.id
      },
      {
        nombre: 'Samsung 990 Pro 2TB NVMe M.2 SSD',
        descripcion: 'SSD insignia PCIe 4.0 con velocidades de lectura/escritura líderes en la industria.',
        especificaciones: 'Capacidad: 2TB | Lectura Secuencial: Hasta 7450 MB/s | Escritura Secuencial: Hasta 6900 MB/s | Interfaz: PCIe Gen 4.0 x4',
        precio: 169.99,
        stock: 20,
        imagen_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=60',
        categoria_id: catSSD.id
      },
      {
        nombre: 'Crucial T700 1TB PCIe 5.0 NVMe SSD',
        descripcion: 'Experimenta velocidades de almacenamiento de próxima generación con PCIe Gen 5.',
        especificaciones: 'Capacidad: 1TB | Lectura Secuencial: Hasta 11700 MB/s | Escritura Secuencial: Hasta 9500 MB/s | Interfaz: PCIe Gen 5.0 x4',
        precio: 149.00,
        stock: 8,
        imagen_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=60',
        categoria_id: catSSD.id
      },
      {
        nombre: 'Turing Beast Elite Core',
        descripcion: 'Computadora armada extrema lista para streaming, realidad virtual y gaming 4K ultra.',
        especificaciones: 'CPU: Ryzen 7 7800X3D | GPU: RTX 4080 Super 16GB | RAM: 32GB DDR5 6000MHz | SSD: 2TB NVMe Gen4 | Enfriamiento Líquido 360mm | Fuente 850W 80+ Gold',
        precio: 2499.00,
        stock: 4,
        imagen_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=60',
        categoria_id: catPCs.id
      },
      {
        nombre: 'Turing Streamer Pro-X',
        descripcion: 'PC de gama media-alta ideal para gaming a 1440p y multitarea pesada.',
        especificaciones: 'CPU: Ryzen 5 7600X | GPU: RTX 4070 Super 12GB | RAM: 32GB DDR5 6000MHz | SSD: 1TB NVMe | Disipador por aire Premium | Fuente 750W 80+ Gold',
        precio: 1549.99,
        stock: 6,
        imagen_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=60',
        categoria_id: catPCs.id
      }
    ];

    for (const prod of products) {
      await dbQuery.run(
        `INSERT OR IGNORE INTO productos 
         (nombre, descripcion, especificaciones, precio, stock, imagen_url, categoria_id, creado_por) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prod.nombre,
          prod.descripcion,
          prod.especificaciones,
          prod.precio,
          prod.stock,
          prod.imagen_url,
          prod.categoria_id,
          adminUser.id
        ]
      );
    }
    console.log('Productos cargados con éxito.');
    console.log('Carga de datos semilla finalizada correctamente.');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la carga de datos semilla:', error);
    process.exit(1);
  }
};

seed();
