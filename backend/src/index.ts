import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/user';

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/lifeaid';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();
app.use(cors());
app.use(express.json());

// User routes
app.use('/api/users', userRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'life-aid-backend' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
