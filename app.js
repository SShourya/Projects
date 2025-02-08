import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from express.Router();
import connectDB from './config/db.js';
import userRoutes from './routes/UserRoutes/userRoutes.js';
import adminRoutes from './routes/AdminRoutes/adminRoutes.js';
import routes from './routes/index.js'
connectDB()

dotenv.config();  // Load .env variables

const app = express();

// CORS Middleware
app.use(cors({
  origin: '*',
}));

// Middleware for parsing JSON
app.use(express.json());

// Routes
// Server check route
app.get('/server-check', (req, res) => {
  res.status(200).json({ message: 'Server is running fine!', status: 'OK' });
});
// app.use('/api', routes);
app.use("/.netlify/functions/app", router);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});


// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
