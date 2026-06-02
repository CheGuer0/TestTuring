const { dbQuery } = require('../database');

exports.getProducts = async (req, res) => {
  try {
    let { category, search, sort, page = 1, limit = 6 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 6;

    const offset = (page - 1) * limit;

    let queryParams = [];
    let whereClauses = [];

    if (category) {
      if (!isNaN(category)) {
        whereClauses.push('p.categoria_id = ?');
        queryParams.push(parseInt(category));
      } else {
        whereClauses.push('c.nombre = ?');
        queryParams.push(category);
      }
    }

    if (search) {
      whereClauses.push('(p.nombre LIKE ? OR p.descripcion LIKE ?)');
      const searchWildcard = `%${search}%`;
      queryParams.push(searchWildcard, searchWildcard);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countSql = `
      SELECT COUNT(*) as total 
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
      ${whereSql}
    `;
    const countResult = await dbQuery.get(countSql, queryParams);
    const totalItems = countResult ? countResult.total : 0;
    const totalPages = Math.ceil(totalItems / limit);

    let orderBySql = 'ORDER BY p.creado_en DESC';
    if (sort) {
      switch (sort) {
        case 'price_asc':
          orderBySql = 'ORDER BY p.precio ASC';
          break;
        case 'price_desc':
          orderBySql = 'ORDER BY p.precio DESC';
          break;
        case 'name_asc':
          orderBySql = 'ORDER BY p.nombre ASC';
          break;
        case 'newest':
        default:
          orderBySql = 'ORDER BY p.creado_en DESC';
          break;
      }
    }

    const selectSql = `
      SELECT p.id, p.nombre as name, p.descripcion as description, p.especificaciones as specifications, 
             p.precio as price, p.stock, p.imagen_url as image_url, p.categoria_id as category_id, 
             p.creado_en as created_at, c.nombre as category_name 
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
      ${whereSql}
      ${orderBySql}
      LIMIT ? OFFSET ?
    `;

    const finalParams = [...queryParams, limit, offset];
    const products = await dbQuery.all(selectSql, finalParams);

    return res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          totalItems,
          currentPage: page,
          totalPages,
          limit,
          hasNextPage: page < totalPages
        }
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Ocurrió un error en el servidor al obtener los productos.' 
    });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await dbQuery.get(
      `SELECT p.id, p.nombre as name, p.descripcion as description, p.especificaciones as specifications, 
              p.precio as price, p.stock, p.imagen_url as image_url, p.categoria_id as category_id, 
              p.creado_en as created_at, c.nombre as category_name 
       FROM productos p 
       JOIN categorias c ON p.categoria_id = c.id 
       WHERE p.id = ?`,
      [id]
    );

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Producto no encontrado.' 
      });
    }

    return res.status(200).json({
      success: true,
      data: { product }
    });

  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Ocurrió un error interno en el servidor.' 
    });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, specifications, price, stock, image_url, category_id } = req.body;

  if (!name || !description || price === undefined || stock === undefined || !category_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'Faltan campos obligatorios (name, description, price, stock, category_id).' 
    });
  }

  if (isNaN(price) || price < 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'El precio debe ser un número positivo válido.' 
    });
  }

  if (isNaN(stock) || stock < 0 || !Number.isInteger(Number(stock))) {
    return res.status(400).json({ 
      success: false, 
      message: 'El stock debe ser un entero positivo válido.' 
    });
  }

  try {
    const category = await dbQuery.get('SELECT id FROM categorias WHERE id = ?', [category_id]);
    if (!category) {
      return res.status(400).json({ 
        success: false, 
        message: 'El ID de categoría no existe.' 
      });
    }

    const result = await dbQuery.run(
      `INSERT INTO productos (nombre, descripcion, especificaciones, precio, stock, imagen_url, categoria_id, creado_por) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        description.trim(),
        specifications ? specifications.trim() : null,
        parseFloat(price),
        parseInt(stock),
        image_url ? image_url.trim() : 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=60',
        parseInt(category_id),
        req.user.id
      ]
    );

    const newProduct = await dbQuery.get(
      `SELECT p.id, p.nombre as name, p.descripcion as description, p.especificaciones as specifications, 
              p.precio as price, p.stock, p.imagen_url as image_url, p.categoria_id as category_id, 
              p.creado_en as created_at, c.nombre as category_name 
       FROM productos p 
       JOIN categorias c ON p.categoria_id = c.id 
       WHERE p.id = ?`,
      [result.id]
    );

    return res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente.',
      data: { product: newProduct }
    });

  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Ocurrió un error en el servidor al crear el producto.' 
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, specifications, price, stock, image_url, category_id } = req.body;

  if (!name || !description || price === undefined || stock === undefined || !category_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'Faltan campos obligatorios (name, description, price, stock, category_id).' 
    });
  }

  if (isNaN(price) || price < 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'El precio debe ser un número positivo válido.' 
    });
  }

  if (isNaN(stock) || stock < 0 || !Number.isInteger(Number(stock))) {
    return res.status(400).json({ 
      success: false, 
      message: 'El stock debe ser un entero positivo válido.' 
    });
  }

  try {
    const existingProduct = await dbQuery.get('SELECT id FROM productos WHERE id = ?', [id]);
    if (!existingProduct) {
      return res.status(404).json({ 
        success: false, 
        message: 'Producto no encontrado.' 
      });
    }

    const category = await dbQuery.get('SELECT id FROM categorias WHERE id = ?', [category_id]);
    if (!category) {
      return res.status(400).json({ 
        success: false, 
        message: 'El ID de categoría no existe.' 
      });
    }

    await dbQuery.run(
      `UPDATE productos 
       SET nombre = ?, descripcion = ?, especificaciones = ?, precio = ?, stock = ?, imagen_url = ?, categoria_id = ? 
       WHERE id = ?`,
      [
        name.trim(),
        description.trim(),
        specifications ? specifications.trim() : null,
        parseFloat(price),
        parseInt(stock),
        image_url ? image_url.trim() : null,
        parseInt(category_id),
        id
      ]
    );

    const updatedProduct = await dbQuery.get(
      `SELECT p.id, p.nombre as name, p.descripcion as description, p.especificaciones as specifications, 
              p.precio as price, p.stock, p.imagen_url as image_url, p.categoria_id as category_id, 
              p.creado_en as created_at, c.nombre as category_name 
       FROM productos p 
       JOIN categorias c ON p.categoria_id = c.id 
       WHERE p.id = ?`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente.',
      data: { product: updatedProduct }
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Ocurrió un error en el servidor al actualizar el producto.' 
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const existingProduct = await dbQuery.get('SELECT id FROM productos WHERE id = ?', [id]);
    if (!existingProduct) {
      return res.status(404).json({ 
        success: false, 
        message: 'Producto no encontrado.' 
      });
    }

    await dbQuery.run('DELETE FROM productos WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente.'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Ocurrió un error en el servidor al eliminar el producto.' 
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await dbQuery.all(
      'SELECT id, nombre as name, descripcion as description FROM categorias ORDER BY id ASC'
    );
    return res.status(200).json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Ocurrió un error en el servidor al obtener las categorías.' 
    });
  }
};

