require('dotenv').config();
const { sequelize, Product } = require('./db');

async function main() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });

    const products = [
      { name: 'Apple', price: 40, category: 'Fruits', description: 'Fresh apple', image: '/images/categories/apple.jpg', stock: 100 },
      { name: 'Banana', price: 20, category: 'Fruits', description: 'Yellow banana', image: '/images/categories/banana.jpg', stock: 200 },
      { name: 'Milk', price: 50, category: 'Dairy', description: 'Fresh milk 1L', image: '/images/categories/milk.jpg', stock: 50 }
    ];

    for (const p of products) {
      await Product.findOrCreate({ where: { name: p.name }, defaults: p });
    }

    console.log('✅ Seeded basic products');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

main();
