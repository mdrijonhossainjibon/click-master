import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // New fields
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [3, 'Full name must be at least 3 characters']
    },
    telegramId: {
        type: String,
        required: [true, 'Telegram ID is required'],
        unique: true,
        trim: true,
        match: [/^@?[\w\d_]{5,32}$/, 'Please enter a valid Telegram ID']
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
        required: true
    },

    // Legacy fields maintained for compatibility
    username: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    role: {
        type: String,
        enum: ['admin', 'moderator', 'user'],
        default: 'user',
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    lastWatchTime: {
        type: Date,
        default: null
    },
    adsWatched: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to ensure username is set from fullName if not provided
userSchema.pre('save', function(next) {
    if (!this.username && this.fullName) {
        this.username = this.fullName.toLowerCase().replace(/\s+/g, '_');
    }
    next();
});

// Update timestamps on save
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    next();
});

// Remove sensitive data from JSON responses
userSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;