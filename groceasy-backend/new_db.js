const { Sequelize, DataTypes } = require('sequelize');

if (!process.env.DB_NAME || !process.env.DB_USER) {
  console.error('❌ Missing database configuration in environment variables');
  process.exit(1);
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mariadb',
    port: process.env.DB_PORT || 3306,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: DataTypes.STRING(20),
  userType: {
    type: DataTypes.ENUM('customer', 'admin'),
    defaultValue: 'customer'
  }
});

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: DataTypes.TEXT,
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  image: DataTypes.STRING(255),
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  reviewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

const Cart = sequelize.define('Cart', {
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
});

const Order = sequelize.define('Order', {
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    defaultValue: 'pending'
  }
});

const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  priceAtTime: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

const Review = sequelize.define('Review', {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: DataTypes.TEXT
});

User.hasMany(Cart);
Cart.belongsTo(User);
Cart.belongsTo(Product);

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);
OrderItem.belongsTo(Product);

User.hasMany(Review);
Review.belongsTo(User);
Product.hasMany(Review);
Review.belongsTo(Product);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}

testConnection();

module.exports = {
  sequelize,
  User,
  Product,
  Cart,
  Order,
  OrderItem,
  Review
};