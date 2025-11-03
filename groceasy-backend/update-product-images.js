require('dotenv').config();
const { sequelize, Product } = require('./db');

const CATEGORY_TO_IMAGE = {
  Fruits: 'images/categories/Fruits.png',
  'Fruits & Vegetables': 'images/categories/Fruits.png',
  Dairy: 'images/categories/Dairy.png',
  Meat: 'images/categories/Meat_seafood.png',
  'Meat & Seafood': 'images/categories/Meat_seafood.png',
  Pantry: 'images/categories/Pantry.png'
};

async function main() {
  try {
    await sequelize.authenticate();
    const products = await Product.findAll();
    for (const p of products) {
      const img = CATEGORY_TO_IMAGE[p.category] || CATEGORY_TO_IMAGE['Pantry'];
      if (p.image !== img) {
        p.image = img;
        await p.save();
        console.log(`Updated image for ${p.name} -> ${img}`);
      }
    }
    console.log('✅ Product images updated');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to update images:', err);
    process.exit(1);
  }
}

main();
