import express from 'express';
import cors from 'cors';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from './models/Article.js';
import User from './models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // Allow specific frontend in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url} [${res.statusCode}] - ${duration}ms`);
        if (req.method === 'POST' || req.method === 'PUT') {
            const safeBody = { ...req.body };
            if (safeBody.password) safeBody.password = '****';
            console.log('Body:', safeBody);
        }
    });
    next();
});

// MongoDB Connection
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        console.error('Make sure you have replaced <db_password> in the .env file and your IP is whitelisted in Atlas.');
    });

// Create uploads directory if it doesn't exist
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const IMAGES_DIR = path.join(UPLOADS_DIR, 'images');

if (!existsSync(IMAGES_DIR)) {
    mkdirSync(IMAGES_DIR, { recursive: true });
}

// Serve static files from uploads folder
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMAGES_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes

// Signup
app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
            phone,
            role: 'user'
        });

        res.status(201).json({
            success: true,
            user: { firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email, role: 'user' }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: 'Server error during signup', error: error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by email or username
        const user = await User.findOne({
            $or: [
                { email: username },
                { username: username }
            ]
        });

        if (user && user.password === password) {
            return res.json({
                success: true,
                user: {
                    firstName: user.firstName || 'Admin',
                    lastName: user.lastName || 'User',
                    email: user.email,
                    role: user.role
                }
            });
        }

        res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Get Articles
app.get('/api/articles', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.json(articles); // Schema toJSON handles mapping _id to id
    } catch (error) {
        res.status(500).json({ message: 'Error fetching articles' });
    }
});

// Create Article
app.post('/api/articles', async (req, res) => {
    try {
        const newArticle = await Article.create({
            ...req.body,
            status: 'pending'
        });
        res.status(201).json(newArticle);
    } catch (error) {
        res.status(500).json({ message: 'Error creating article' });
    }
});

// Update Article
app.put('/api/articles/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Check if id is valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid article ID' });
        }
        await Article.findByIdAndUpdate(id, req.body);
        res.json({ message: 'Article updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating article' });
    }
});

// Delete Article
app.delete('/api/articles/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid article ID' });
        }
        await Article.findByIdAndDelete(id);
        res.json({ message: 'Article deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting article' });
    }
});

// User Management Routes

// Get all users (Admin only role check could be here, but using basic route for now)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude passwords
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// Create User (Admin)
app.post('/api/users', async (req, res) => {
    const { firstName, lastName, email, username, password, phone, role } = req.body;
    try {
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            return res.status(400).json({ message: 'User already exists with this email or username' });
        }
        const newUser = await User.create({
            firstName, lastName, email, username, password, phone, role: role || 'user'
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// Update User (Admin)
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (!updateData.password) delete updateData.password;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

// Image Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Dynamic URL based on request host for better deployment compatibility
    const protocol = req.protocol;
    const host = req.get('host');
    const imageUrl = `${protocol}://${host}/uploads/images/${req.file.filename}`;
    res.json({ success: true, url: imageUrl });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
