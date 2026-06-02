const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./database');
const authController = require('./controllers/authController');
const productController = require('./controllers/productController');
const { authenticateToken, isAdmin } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

initDatabase().then(() => {
  console.log('Database system initialized.');
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenido a la API de Turing Tech Store'
  });
});

app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authenticateToken, authController.getCurrentUser);

app.get('/api/categories', productController.getCategories);

app.get('/api/products', productController.getProducts);
app.get('/api/products/:id', productController.getProductById);

app.post('/api/products', authenticateToken, isAdmin, productController.createProduct);
app.put('/api/products/:id', authenticateToken, isAdmin, productController.updateProduct);
app.delete('/api/products/:id', authenticateToken, isAdmin, productController.deleteProduct);

app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

app.use((req, res, next) => {
  res.status(404).json({ 
    success: false, 
    message: `API endpoint '${req.method} ${req.url}' not found.` 
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` Turing Tech Store API running on port ${PORT}`);
  console.log(` Local URL: http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`=================================================`);
});

