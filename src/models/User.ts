import mongoose from 'mongoose';

interface IUser {
    fullName: string;
    telegramId: string;
    status: 'active' | 'inactive';
    username?: string;
    email: string;
    role: 'admin' | 'moderator' | 'user';
    balance: number;
    totalEarnings: number;
    lastWatchTime: Date | null;
    adsWatched: number;
    lastResetDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

interface IUserMethods {
    shouldResetDaily(): boolean;
    resetDaily(): boolean;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;
type UserDocument = mongoose.Document<unknown, {}, IUser> & IUser & IUserMethods;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
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
        default : null
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
    lastResetDate: {
        type: Date,
        default: null
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

// Helper function to check if reset is needed
userSchema.methods.shouldResetDaily = function(this: UserDocument): boolean {
    if (!this.lastResetDate) return true;

    const now = new Date();
    const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const lastReset = new Date(this.lastResetDate);
    const resetTime = new Date(utcNow);
    resetTime.setUTCHours(17, 0, 0, 0); // 5 PM UTC

    // If current time is before 5 PM UTC, check against previous day's 5 PM
    if (utcNow < resetTime) {
        resetTime.setDate(resetTime.getDate() - 1);
    }

    return lastReset < resetTime;
};

// Reset daily stats
userSchema.methods.resetDaily = function(this: UserDocument): boolean {
    if (this.shouldResetDaily()) {
        this.adsWatched = 0;
        this.lastResetDate = new Date();
        return true;
    }
    return false;
};

// Middleware to check and reset daily limits before save
userSchema.pre('save', function(this: UserDocument, next) {
    this.resetDaily();
    next();
});

// Middleware to ensure username is set from fullName if not provided
userSchema.pre('save', function(this: UserDocument, next) {
    if (!this.username && this.fullName) {
        this.username = this.fullName.toLowerCase().replace(/\s+/g, '_');
    }
    next();
});

// Update timestamps on save
userSchema.pre('save', function(this: UserDocument, next) {
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

const User = mongoose.models.User || mongoose.model<IUser, UserModel>('User', userSchema);

export default User;