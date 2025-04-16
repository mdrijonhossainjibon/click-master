const { seedWithdrawalMethods } = require('./withdrawal-methods');
const { seedCoins } = require('./coins');

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  console.log('\n📀 Seeding coins...');
  await seedCoins();
  
  console.log('\n💳 Seeding withdrawal methods...');
  await seedWithdrawalMethods();
  
  console.log('\n✨ Database seeding completed!');
  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error('❌ Database seeding failed:', error);
  process.exit(1);
}); 