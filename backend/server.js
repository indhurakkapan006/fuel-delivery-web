const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();
app.use(express.json());
// Add both your project URL and the specific project instance URL
const allowedOrigins = [
  'https://fuel-delivery-frontend.vercel.app',
  'https://fuel-delivery-frontend-hrkaa7yo0-esakkimuthus-projects.vercel.app',
  'http://localhost:5174' // Keeping local dev support
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// --- DATABASE CONNECTION ---
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true // allow running several SQL commands in one query
});
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DATABASE CONNECTION FAILED:", err.code, err.message);
  } else {
    console.log("✅ Fuel Database (MySQL) Connected Successfully!");

    // run initialization queries to ensure tables/columns exist
    // create tables if they don't already exist
    const createUsers = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(15) NULL,
        address TEXT NULL
      );
    `;

    const createProducts = `
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock_quantity INT DEFAULT 0
      );
    `;

    const createOrders = `
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `;

    // execute create table statements sequentially
    db.query(createUsers, (err) => {
      if (err) console.error('❌ CREATE TABLE users error:', err.sqlMessage || err);
      // attempt to add phone/address if missing (ignore errors if already there)
      db.query('ALTER TABLE users ADD COLUMN phone VARCHAR(15) NULL', (colErr) => {
        if (colErr && colErr.code !== 'ER_DUP_FIELDNAME' && colErr.code !== 'ER_CANT_DROP_FIELD_OR_KEY') {
          console.error('❌ ADD COLUMN phone error:', colErr.sqlMessage || colErr);
        }
        db.query('ALTER TABLE users ADD COLUMN address TEXT NULL', (colErr2) => {
          if (colErr2 && colErr2.code !== 'ER_DUP_FIELDNAME' && colErr2.code !== 'ER_CANT_DROP_FIELD_OR_KEY') {
            console.error('❌ ADD COLUMN address error:', colErr2.sqlMessage || colErr2);
          }
          // continue with other tables after user modifications
          db.query(createProducts, (prodErr) => {
            if (prodErr) console.error('❌ CREATE TABLE products error:', prodErr.sqlMessage || prodErr);
            db.query(createOrders, (ordErr) => {
              if (ordErr) console.error('❌ CREATE TABLE orders error:', ordErr.sqlMessage || ordErr);
              else console.log('✅ Database schema ensured (tables/columns created)');
              connection.release();
            });
          });
        });
      });
    });
  }
});

// Middleware to verify JWT and extract User ID
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log('Auth middleware - Token received:', !!token);
  
  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ Token verification failed:", err.message);
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    req.userId = decoded.id; // Store ID for the routes below
    console.log("✅ Token verified for user:", decoded.id);
    next();
  });
};

// --- ROUTES ---

// 1. Signup Route (Matches your users table with email)
app.post('/api/signup', async (req, res) => {
  const { username, email, password, phone, address } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, email, password, phone, address) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [username, email, hashedPassword, phone || null, address || null], (err, result) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      res.status(201).json({ message: "User registered!" });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 2. Login Route (Returns token + email for frontend storage)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ message: "Invalid user" });
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, username: user.username, email: user.email });
  });
});

// 3. Get Products Route
app.get('/api/products', (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
});

// 4. Place Order Route (FIXED: Uses user_id and product_id)
app.post('/api/orders', verifyToken, (req, res) => {
  const { productId, quantity, totalPrice } = req.body;
  const userId = req.userId; // From the verifyToken middleware
  
  console.log('Order placement - User ID:', userId);
  console.log('Order placement - Product ID:', productId);
  console.log('Order placement - Quantity:', quantity);
  console.log('Order placement - Total Price:', totalPrice);

  const sql = "INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES (?, ?, ?, ?, 'pending')";
  
  db.query(sql, [userId, productId, quantity, totalPrice], (err, result) => {
    if (err) {
      console.error("❌ ORDER ERROR:", err.sqlMessage);
      console.error("❌ ORDER ERROR DETAILS:", err);
      return res.status(500).json({ error: err.sqlMessage });
    }
    console.log('✅ Order placed successfully, ID:', result.insertId);
    res.status(201).json({ message: "Order placed!", id: result.insertId });
  });
});

// 5. Get My Orders Route (FIXED: Joins with products to get names)
app.get('/api/my-orders', verifyToken, (req, res) => {
  const userId = req.userId;
  console.log('My orders - Fetching for user ID:', userId);
  
  // This query joins orders and products so you see names, not just IDs
  const sql = `
    SELECT o.*, p.name as product_name 
    FROM orders o 
    JOIN products p ON o.product_id = p.id 
    WHERE o.user_id = ? 
    ORDER BY o.order_date DESC`;
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ GET ORDERS ERROR:", err.sqlMessage);
      return res.status(500).json({ error: err.sqlMessage });
    }
    console.log('✅ Orders fetched successfully, count:', results.length);
    res.json(results);
  });
});

// 6. Get Profile Route
app.get('/api/profile/:email', (req, res) => {
  const { email } = req.params;
  // Try to select with phone and address, fallback if columns don't exist
  const sql = `
    SELECT 
      id, username, email,
      COALESCE(phone, '') as phone,
      COALESCE(address, '') as address
    FROM users 
    WHERE email = ?
  `;
  
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Profile fetch error:", err);
      // If column doesn't exist, try without phone/address
      const fallbackSql = "SELECT id, username, email FROM users WHERE email = ?";
      db.query(fallbackSql, [email], (fallbackErr, fallbackResults) => {
        if (fallbackErr) {
          console.error("Fallback profile fetch error:", fallbackErr);
          return res.status(500).json({ error: fallbackErr.sqlMessage });
        }
        if (fallbackResults.length === 0) return res.status(404).json({ message: "User not found" });
        // Add empty phone/address fields
        const user = { ...fallbackResults[0], phone: '', address: '' };
        res.json(user);
      });
    } else {
      if (results.length === 0) return res.status(404).json({ message: "User not found" });
      res.json(results[0]);
    }
  });
});

// 7. Update Profile Route
app.put('/api/profile', (req, res) => {
  const { email, username, phone, address } = req.body;
  
  // Try to update with phone and address, fallback if columns don't exist
  const sql = "UPDATE users SET username = ?, phone = ?, address = ? WHERE email = ?";
  
  db.query(sql, [username, phone, address, email], (err, result) => {
    if (err) {
      console.error("Profile update error:", err);
      // If phone/address columns don't exist, update only username
      if (err.code === 'ER_BAD_FIELD_ERROR') {
        const fallbackSql = "UPDATE users SET username = ? WHERE email = ?";
        db.query(fallbackSql, [username, email], (fallbackErr, fallbackResult) => {
          if (fallbackErr) {
            console.error("Fallback profile update error:", fallbackErr);
            return res.status(500).json({ error: fallbackErr.sqlMessage });
          }
          res.json({ message: "Profile updated successfully (username only)" });
        });
      } else {
        return res.status(500).json({ error: err.sqlMessage });
      }
    } else {
      res.json({ message: "Profile updated successfully" });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend server active on port ${PORT}`));