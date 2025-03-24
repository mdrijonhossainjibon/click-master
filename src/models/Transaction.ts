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
        
    },
    walletAddress: {
        type: String,
         
        validate: {
            validator: function(v: string) {
                
                const addressRegex = {
                    bitget: /^[0-9a-zA-Z]{34,42}$/,
                    binance: /^0x[0-9a-fA-F]{40}$/
                };
                return addressRegex.binance.test(v)
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