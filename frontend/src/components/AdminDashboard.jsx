import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const catRes = await fetch('http://localhost:5000/api/categories');
      const catJson = await catRes.json();
      if (catJson.success) {
        setCategories(catJson.data.categories);
        if (catJson.data.categories.length > 0) {
          setCategoryId(catJson.data.categories[0].id);
        }
      }

      const prodRes = await fetch('http://localhost:5000/api/products?page=1&limit=100');
      const prodJson = await prodRes.json();
      if (prodJson.success) {
        setProducts(prodJson.data.products);
      } else {
        setError(prodJson.message || 'Error al obtener productos.');
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Error al comunicar con la API del servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setSpecifications('');
    setPrice('');
    setStock('');
    setImageUrl('');
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setSpecifications(product.specifications || '');
    setPrice(product.price);
    setStock(product.stock);
    setImageUrl(product.image_url || '');
    setCategoryId(product.category_id);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id, prodName) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el producto "${prodName}"?`)) {
      return;
    }

    const token = localStorage.getItem('turing_token');
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await response.json();

      if (json.success) {
        alert('Producto eliminado exitosamente.');
        fetchDashboardData();
      } else {
        alert(`Error: ${json.message}`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error al conectar con el servidor.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('turing_token');

    const url = editingProduct 
      ? `http://localhost:5000/api/products/${editingProduct.id}`
      : 'http://localhost:5000/api/products';

    const method = editingProduct ? 'PUT' : 'POST';

    const payload = {
      name,
      description,
      specifications,
      price: parseFloat(price),
      stock: parseInt(stock),
      image_url: imageUrl,
      category_id: parseInt(categoryId)
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const json = await response.json();

      if (json.success) {
        alert(editingProduct ? 'Producto actualizado exitosamente.' : 'Producto agregado exitosamente.');
        setIsModalOpen(false);
        fetchDashboardData();
      } else {
        alert(`Error: ${json.message}`);
      }
    } catch (err) {
      console.error('Submit form error:', err);
      alert('Error al conectar con el servidor.');
    }
  };

  return (
    <section className="admin-section" id="admin">
      <div className="container">
        <div className="admin-header-row">
          <div>
            <span className="section-subtitle">PANEL DE ADMINISTRACIÓN</span>
            <h2 className="section-title">Control de Inventario</h2>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            ➕ Agregar Componente
          </button>
        </div>
        <div className="section-divider admin-divider"></div>

        {error && <div className="admin-alert alert-danger">{error}</div>}

        {loading ? (
          <div className="admin-loading">
            <div className="spinner"></div>
            <span>Cargando datos de inventario...</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th className="actions-header">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">No hay productos disponibles.</td>
                  </tr>
                ) : (
                  products.map((prod) => (
                    <tr key={prod.id} className="inventory-row">
                      <td>{prod.id}</td>
                      <td>
                        <img 
                          src={prod.image_url} 
                          alt={prod.name} 
                          className="table-product-thumbnail"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100&auto=format&fit=crop&q=60';
                          }}
                        />
                      </td>
                      <td className="product-table-name" title={prod.name}><strong>{prod.name}</strong></td>
                      <td><span className="table-category-badge">{prod.category_name}</span></td>
                      <td className="table-price">${prod.price.toFixed(2)}</td>
                      <td>
                        <span className={`table-stock-indicator ${prod.stock <= 0 ? 'out-of-stock' : prod.stock < 5 ? 'low-stock' : 'in-stock'}`}>
                          {prod.stock} uds
                        </span>
                      </td>
                      <td className="table-actions">
                        <button 
                          className="btn-action btn-action-edit"
                          onClick={() => handleOpenEditModal(prod)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-action btn-action-delete"
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-container admin-modal-container glow-card" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
              
              <h3 className="admin-modal-title">
                {editingProduct ? 'Editar Componente' : 'Agregar Nuevo Componente'}
              </h3>
              <div className="section-divider modal-divider"></div>

              <form className="admin-modal-form" onSubmit={handleFormSubmit}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="prod-name">Nombre del Componente</label>
                    <input
                      type="text"
                      id="prod-name"
                      className="form-control"
                      placeholder="ej. Intel Core i7-14700K"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prod-category">Categoría</label>
                    <select
                      id="prod-category"
                      className="form-control"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="prod-desc">Breve Descripción</label>
                  <textarea
                    id="prod-desc"
                    className="form-control textarea-desc"
                    placeholder="Escribe un resumen atractivo del componente tecnológico..."
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prod-specs">Ficha Técnica / Especificaciones (Separar por barra vertical "|")</label>
                  <input
                    type="text"
                    id="prod-specs"
                    className="form-control"
                    placeholder="ej. Núcleos: 20 | Hilos: 28 | Frecuencia: 5.6 GHz | TDP: 125W"
                    value={specifications}
                    onChange={(e) => setSpecifications(e.target.value)}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="prod-price">Precio (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      id="prod-price"
                      className="form-control"
                      placeholder="0.00"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prod-stock">Stock Disponible</label>
                    <input
                      type="number"
                      min="0"
                      id="prod-stock"
                      className="form-control"
                      placeholder="Unidades"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="prod-image">URL de la Imagen</label>
                  <input
                    type="url"
                    id="prod-image"
                    className="form-control"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>

                <div className="modal-actions-row">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Guardar Cambios' : 'Crear Componente'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

