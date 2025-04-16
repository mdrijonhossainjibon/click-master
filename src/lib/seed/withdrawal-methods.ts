import WithdrawalMethod from "@/models/WithdrawalMethod";
import dbConnect from "../dbConnect";
import { seedCoins } from "./coins";

 

const defaultWithdrawalMethods = [
  {
    id: 'wm_btc_transfer',
    name: 'Bitcoin Transfer',
    supportedCoins: ['BTC'],
    icon: '/icons/bitcoin.png',
    active: true,
    fee: '0.1%',
    estimatedTime: '30-60 minutes',
    category: 'Crypto',
    minAmount: 50,
    maxAmount: 100000,
    currency: 'USD'
  },
  {
    id: 'wm_eth_transfer',
    name: 'Ethereum Transfer',
    supportedCoins: ['ETH'],
    icon: '/icons/ethereum.png',
    active: true,
    fee: '0.15%',
    estimatedTime: '5-10 minutes',
    category: 'Crypto',
    minAmount: 100,
    maxAmount: 50000,
    currency: 'USD'
  },
  {
    id: 'wm_usdt_transfer',
    name: 'USDT Transfer',
    supportedCoins: ['USDT'],
    icon: '/icons/usdt.png',
    active: true,
    fee: '1%',
    estimatedTime: '1-5 minutes',
    category: 'Crypto',
    minAmount: 10,
    maxAmount: 200000,
    currency: 'USD'
  },
  {
    id: 'wm_mobile_banking',
    name: 'Mobile Banking Transfer',
    supportedCoins: ['USDT', 'BTC', 'ETH'],
    icon: '/icons/mobile-banking.png',
    active: true,
    fee: '2%',
    estimatedTime: '24-48 hours',
    category: 'Mobile Banking',
    minAmount: 100,
    maxAmount: 50000,
    currency: 'USD'
  }
];

export async function seedWithdrawalMethods() {
  try {
    await dbConnect();
   
    // Clear existing withdrawal methods
    await WithdrawalMethod.deleteMany({});

    // Insert default withdrawal methods
    await WithdrawalMethod.insertMany(defaultWithdrawalMethods);

    console.log('✅ Withdrawal methods seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding withdrawal methods:', error);
  }
}

 
 