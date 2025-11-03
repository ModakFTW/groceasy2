require('dotenv').config();
const bcrypt = require('bcryptjs');
const { User, sequelize } = require('./db');

async function main() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });

    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || '1234';

    let user = await User.findOne({ where: { email } });
    if (!user) {
      const passwordHash = await bcrypt.hash(password, 10);
      user = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email,
        password: passwordHash,
        phone: '',
        userType: 'admin'
      });
      console.log(`✅ Created admin user: ${email} / ${password}`);
    } else {
      if (user.userType !== 'admin') {
        user.userType = 'admin';
        await user.save();
      }
      console.log(`ℹ️ Admin user already exists: ${email}`);
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create admin:', err);
    process.exit(1);
  }
}

main();
