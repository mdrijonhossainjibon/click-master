import mongoose from 'mongoose';

export interface IHistory {
    userId: mongoose.Types.ObjectId;
    activityType: 'ad_watch' | 'link_visit' | 'login' | 'referral_signup' | 'referral_commission';
    amount?: number;
    description: string;
    metadata?: {
        adId?: string;
        linkId?: string;
        referralId?: string;
        ipAddress?: string;
        deviceInfo?: string;
        [key: string]: any;
    };
    createdAt: Date;
}

const historySchema = new mongoose.Schema<IHistory>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    activityType: {
        type: String,
        required: true,
        enum: ['ad_watch', 'link_visit', 'login', 'referral_signup', 'referral_commission'],
        index: true
    },
    amount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Create indexes for common queries
historySchema.index({ userId: 1, activityType: 1, createdAt: -1 });
historySchema.index({ userId: 1, createdAt: -1 });

const History = mongoose.models.History || mongoose.model<IHistory>('History', historySchema);

export default History; 