import mongoose, { Schema } from 'mongoose';

export interface IDirectLink {
    title: string;
    url: string;
    icon: string;
    gradient: {
        from: string;
        to: string;
    };
    clicks: number;
    isActive: boolean;
    position: number;
    category: string;
    lastClicked?: Date;
}

const directLinkSchema = new Schema<IDirectLink>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    url: {
        type: String,
        required: [true, 'URL is required'],
        trim: true
    },
    icon: {
        type: String,
        default: '🔗'
    },
    gradient: {
        from: {
            type: String,
            required: true,
            default: 'rose-600'
        },
        to: {
            type: String,
            required: true,
            default: 'pink-800'
        }
    },
    clicks: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    position: {
        type: Number,
        required: true,
        min: 1
    },
    category: {
        type: String,
        required: true,
        default: 'adult',
        enum: ['adult', 'general']
    },
    lastClicked: {
        type: Date
    }
}, {
    timestamps: true
});

// Create indexes for efficient querying
directLinkSchema.index({ position: 1 });
directLinkSchema.index({ category: 1, isActive: 1 });

export const DirectLink = mongoose.models.DirectLink || mongoose.model<IDirectLink>('DirectLink', directLinkSchema);
