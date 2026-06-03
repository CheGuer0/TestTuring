import React, { useState } from 'react';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const [showSpecs, setShowSpecs] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="product-card glow-card">
      <div className="product-image-wrapper">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=60';
          }}
        />
        <div className="product-category-tag">{product.category_name}</div>
        
        {product.stock <= 0 ? (
          <div className="product-stock-tag stock-out">Agotado</div>
        ) : product.stock < 5 ? (
          <div className="product-stock-tag stock-low">¡Pocas Unidades!</div>
        ) : null}
      </div>

      <div className="product-info">
        <h3 className="product-title" title={product.name}>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        {product.specifications && (
          <div className="product-specs-section">
            <button 
              className="specs-toggle-btn"
              onClick={() => setShowSpecs(!showSpecs)}
            >
              {showSpecs ? 'Ocultar Ficha Técnica ▲' : 'Ver Ficha Técnica ▼'}
            </button>
            
            <div className={`specs-list-container ${showSpecs ? 'expanded' : ''}`}>
              <ul className="specs-list">
                {product.specifications.split('|').map((spec, index) => (
                  <li key={index} className="spec-item">
                    {spec.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="product-footer">
          <div className="product-price-wrapper">
            <span className="price-label">Precio</span>
            <span className="product-price">{formatPrice(product.price)}</span>
          </div>
          
          <button 
            className="btn btn-primary card-action-btn"
            disabled={product.stock <= 0}
            onClick={() => alert(`¡Añadido al carrito: ${product.name}!\n(Funcionalidad demostrativa)`)}
          >
            {product.stock <= 0 ? 'Agotado' : 'Comprar'}
          </button>
        </div>
      </div>
    </div>
  );
}

