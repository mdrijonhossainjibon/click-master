import mongoose from 'mongoose';
import WithdrawalMethod from '../src/app/[lang]/models/WithdrawalMethod';

const withdrawalMethods = [
    {
        id: 'mobile_banking',
        symbol: 'BDT',
        name: 'Mobile Banking',
        icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
        networks: [
            {
                id: 'bkash',
                name: 'bKash',
                symbol: 'BDT',
                icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
                fee: 0,
                minWithdraw: 100,
                maxWithdraw: 50000
            },
            {
                id: 'nagad',
                name: 'Nagad',
                symbol: 'BDT',
                icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
                fee: 0,
                minWithdraw: 100,
                maxWithdraw: 50000
            },
            {
                id: 'rocket',
                name: 'Rocket',
                symbol: 'BDT',
                icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
                fee: 0,
                minWithdraw: 100,
                maxWithdraw: 50000
            }
        ]
    },
    {
        id: 'usdt',
        symbol: 'USDT',
        name: 'Tether',
        icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
        networks: [
            {
                id: 'trc20',
                name: 'TRC20',
                symbol: 'TRX',
                icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
                fee: 1,
                minWithdraw: 10,
                maxWithdraw: 10000
            },
            {
                id: 'bep20',
                name: 'BEP20',
                symbol: 'BNB',
                icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
                fee: 0.5,
                minWithdraw: 5,
                maxWithdraw: 5000
            },
            {
                id: 'erc20',
                name: 'ERC20',
                symbol: 'ETH',
                icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
                fee: 5,
                minWithdraw: 20,
                maxWithdraw: 15000
            }
        ]
    },
    {
        id: 'btc',
        symbol: 'BTC',
        name: 'Bitcoin',
        icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
        networks: [
            {
                id: 'btc',
                name: 'Bitcoin',
                symbol: 'BTC',
                icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
                fee: 0.0005,
                minWithdraw: 0.001,
                maxWithdraw: 1
            },
            {
                id: 'lightning',
                name: 'Lightning',
                symbol: 'BTC',
                icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
                fee: 0.0001,
                minWithdraw: 0.0001,
                maxWithdraw: 0.1
            }
        ]
    },
    {
        id: 'eth',
        symbol: 'ETH',
        name: 'Ethereum',
        icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
        networks: [
            {
                id: 'eth',
                name: 'Ethereum',
                symbol: 'ETH',
                icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
                fee: 0.005,
                minWithdraw: 0.01,
                maxWithdraw: 10
            },
            {
                id: 'arbitrum',
                name: 'Arbitrum',
                symbol: 'ETH',
                icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
                fee: 0.001,
                minWithdraw: 0.005,
                maxWithdraw: 5
            },
            {
                id: 'optimism',
                name: 'Optimism',
                symbol: 'ETH',
                icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
                fee: 0.001,
                minWithdraw: 0.005,
                maxWithdraw: 5
            }
        ]
    },
    {
        id: 'ltc',
        symbol: 'LTC',
        name: 'Litecoin',
        icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
        networks: [
            {
                id: 'ltc',
                name: 'Litecoin',
                symbol: 'LTC',
                icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
                fee: 0.01,
                minWithdraw: 0.1,
                maxWithdraw: 50
            }
        ]
    },
    {
        id: 'xrp',
        symbol: 'XRP',
        name: 'Ripple',
        icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
        networks: [
            {
                id: 'xrp',
                name: 'XRP Ledger',
                symbol: 'XRP',
                icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
                fee: 0.1,
                minWithdraw: 10,
                maxWithdraw: 10000
            }
        ]
    },
    {
        id: 'sol',
        symbol: 'SOL',
        name: 'Solana',
        icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
        networks: [
            {
                id: 'sol',
                name: 'Solana',
                symbol: 'SOL',
                icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400',
                fee: 0.01,
                minWithdraw: 0.1,
                maxWithdraw: 100
            }
        ]
    }
];

async function seedWithdrawalMethods() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete existing withdrawal methods
        await WithdrawalMethod.deleteMany({});
        console.log('Cleared existing withdrawal methods');

        // Insert new withdrawal methods
        await WithdrawalMethod.insertMany(withdrawalMethods);
        console.log('Successfully seeded withdrawal methods');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding withdrawal methods:', error);
        process.exit(1);
    }
}

seedWithdrawalMethods(); 