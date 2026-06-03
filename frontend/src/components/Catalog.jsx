import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import './Catalog.css';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
    fetchProducts(1, true);
  }, [activeCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(1, true);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const json = await response.json();
      if (json.success) {
        setCategories(json.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async (pageNum, resetList = false) => {
    setLoading(true);
    setError('');
    try {
      let url = `http://localhost:5000/api/products?page=${pageNum}&limit=6`;
      if (activeCategory) {
        url += `&category=${activeCategory}`;
      }
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      if (sortBy) {
        url += `&sort=${sortBy}`;
      }

      const response = await fetch(url);
      const json = await response.json();

      if (json.success) {
        const newProducts = json.data.products;
        if (resetList) {
          setProducts(newProducts);
        } else {
          setProducts((prev) => [...prev, ...newProducts]);
        }
        setHasNextPage(json.data.pagination.hasNextPage);
      } else {
        setError(json.message || 'Error al cargar los productos.');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('No se pudo establecer conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage, false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveCategory('');
    setSortBy('newest');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  };

  return (
    <section className="catalog-section" id="catalog">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">NUESTRO INVENTARIO</span>
          <h2 className="section-title">Componentes de Alto Rendimiento</h2>
          <div className="section-divider"></div>
        </div>

        <div className="catalog-controls">
          <div className="categories-bar">
            <button
              className={`category-tab ${activeCategory === '' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('')}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="search-sort-row">
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Buscar componente..."
                className="search-input"
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary search-btn">Buscar</button>
            </form>

            <div className="sort-wrapper">
              <label htmlFor="sort" className="sort-label">Ordenar por:</label>
              <select
                id="sort"
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Más recientes</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
                <option value="name_asc">Nombre (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="catalog-error">
            <p>{error}</p>
            <button className="btn btn-secondary btn-sm" onClick={handleClearFilters}>Restablecer filtros</button>
          </div>
        )}

        {!error && products.length === 0 && !loading && (
          <div className="catalog-empty">
            <p>No se encontraron componentes que coincidan con tu búsqueda.</p>
            <button className="btn btn-secondary" onClick={handleClearFilters}>Limpiar Filtros</button>
          </div>
        )}

        <div className="catalog-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {hasNextPage && (
          <div className="load-more-wrapper">
            <button
              className="btn btn-outline load-more-btn"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Cargar Más Elementos'}
            </button>
          </div>
        )}

        {loading && products.length > 0 && (
          <div className="grid-loading-indicator">
            <div className="spinner"></div>
            <span>Cargando más componentes...</span>
          </div>
        )}
      </div>
    </section>
  );
}

