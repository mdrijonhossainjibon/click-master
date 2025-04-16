import Coin from "@/models/Coin";
import dbConnect from "../dbConnect";

 
const defaultCoins = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '/icons/bitcoin.png',
    active: true,
    minAmount: 0.0001,
    maxAmount: 5,
    exchangeRate: 65000, // Default exchange rate in USD
    network: 'Bitcoin',
    withdrawalFee: 0.0001,
    confirmations: 2,
    isStableCoin: false,
    decimals: 8
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '/icons/ethereum.png',
    active: true,
    minAmount: 0.01,
    maxAmount: 100,
    exchangeRate: 3500, // Default exchange rate in USD
    network: 'Ethereum',
    withdrawalFee: 0.002,
    confirmations: 12,
    isStableCoin: false,
    decimals: 18
  },
  {
    id: 'usdt_erc20',
    name: 'USDT (ERC20)',
    symbol: 'USDT',
    icon: '/icons/usdt.png',
    active: true,
    minAmount: 10,
    maxAmount: 1000000,
    exchangeRate: 1, // Stablecoin, pegged to USD
    network: 'Ethereum',
    withdrawalFee: 15, // Fixed fee in USDT
    confirmations: 12,
    isStableCoin: true,
    decimals: 6
  },
  {
    id: 'usdt_trc20',
    name: 'USDT (TRC20)',
    symbol: 'USDT',
    icon: '/icons/usdt.png',
    active: true,
    minAmount: 1,
    maxAmount: 1000000,
    exchangeRate: 1, // Stablecoin, pegged to USD
    network: 'TRON',
    withdrawalFee: 1, // Fixed fee in USDT
    confirmations: 20,
    isStableCoin: true,
    decimals: 6
  },
  {
    id: 'bnb',
    name: 'Binance Coin',
    symbol: 'BNB',
    icon: '/icons/bnb.png',
    active: true,
    minAmount: 0.01,
    maxAmount: 1000,
    exchangeRate: 500, // Default exchange rate in USD
    network: 'BSC',
    withdrawalFee: 0.001,
    confirmations: 15,
    isStableCoin: false,
    decimals: 18
  }
];

export async function seedCoins() {
  try {
    await dbConnect();

    // Clear existing coins
    await Coin.deleteMany({});

    // Insert default coins
    await Coin.insertMany(defaultCoins);

    console.log('✅ Coins seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding coins:', error);
  }
}

 