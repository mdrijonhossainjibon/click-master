import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['withdrawal', 'earning'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    network: {
        type: String,
        enum: ['bitget', 'binance'],
        required: function() {
            return this.type === 'withdrawal';
        }
    },
    walletAddress: {
        type: String,
        required: function() {
            return this.type === 'withdrawal';
        },
        validate: {
            validator: function(v: string) {
                if (this.type !== 'withdrawal') return true;
                const addressRegex = {
                    bitget: /^[0-9a-zA-Z]{34,42}$/,
                    binance: /^0x[0-9a-fA-F]{40}$/
                };
                return addressRegex[this.network as keyof typeof addressRegex].test(v);
            },
            message: 'Invalid wallet address for the selected network'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    txHash: {
        type: String,
        sparse: true
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

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction;