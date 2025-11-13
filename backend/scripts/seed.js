const { Category, Product } = require('../models');
const sequelize = require('../config/database');

const categories = [
  { name: 'Power Bank', image: 'https://via.placeholder.com/150' },
  { name: 'Wearables', image: 'https://via.placeholder.com/150' },
  { name: 'Headphones', image: 'https://via.placeholder.com/150' },
  { name: 'Smartphones', image: 'https://via.placeholder.com/150' },
  { name: 'Laptops', image: 'https://via.placeholder.com/150' },
  { name: 'Accessories', image: 'https://via.placeholder.com/150' }
];

const products = [
  {
    name: 'Wireless Power Bank 20000mAh',
    description: 'High capacity wireless power bank with fast charging support',
    price: 2500,
    originalPrice: 3000,
    images: ['https://via.placeholder.com/400'],
    brand: 'TechPro',
    specifications: { capacity: '20000mAh', wireless: true, fastCharging: true },
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    stockQuantity: 50,
    isNew: true,
    isDeal: true,
    category: 'Power Bank'
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health tracking and GPS',
    price: 8500,
    originalPrice: 10000,
    images: ['https://via.placeholder.com/400'],
    brand: 'FitTech',
    specifications: { display: 'AMOLED', waterproof: true, gps: true },
    rating: 4.7,
    reviewCount: 256,
    inStock: true,
    stockQuantity: 30,
    isNew: true,
    isDeal: false,
    category: 'Wearables'
  },
  {
    name: 'Bluetooth Headphones',
    description: 'Noise cancelling wireless headphones with premium sound',
    price: 1800,
    originalPrice: 2200,
    images: ['https://via.placeholder.com/400'],
    brand: 'AudioMax',
    specifications: { noiseCancelling: true, batteryLife: '30 hours', wireless: true },
    rating: 4.3,
    reviewCount: 89,
    inStock: true,
    stockQuantity: 75,
    isNew: false,
    isDeal: true,
    category: 'Headphones'
  },
  {
    name: 'Gaming Mouse RGB',
    description: 'High precision gaming mouse with customizable RGB lighting',
    price: 1200,
    originalPrice: 1500,
    images: ['https://via.placeholder.com/400'],
    brand: 'GameGear',
    specifications: { dpi: '16000', programmableButtons: 8, rgb: true },
    rating: 4.6,
    reviewCount: 145,
    inStock: true,
    stockQuantity: 100,
    isNew: false,
    isDeal: false,
    category: 'Accessories'
  },
  {
    name: 'USB-C Hub 7-in-1',
    description: 'Multi-port USB-C hub for laptops and tablets',
    price: 1500,
    originalPrice: 1800,
    images: ['https://via.placeholder.com/400'],
    brand: 'ConnectPro',
    specifications: { ports: 7, usbC: true, hdmi: true },
    rating: 4.4,
    reviewCount: 67,
    inStock: true,
    stockQuantity: 60,
    isNew: true,
    isDeal: false,
    category: 'Accessories'
  },
  {
    name: 'Portable SSD 1TB',
    description: 'Ultra-fast portable solid state drive',
    price: 7500,
    originalPrice: 9000,
    images: ['https://via.placeholder.com/400'],
    brand: 'DataSpeed',
    specifications: { capacity: '1TB', speed: '1050MB/s', usbC: true },
    rating: 4.8,
    reviewCount: 234,
    inStock: true,
    stockQuantity: 40,
    isNew: true,
    isDeal: true,
    category: 'Accessories'
  },
  {
    name: 'Wireless Earbuds Pro',
    description: 'True wireless earbuds with active noise cancellation',
    price: 3500,
    originalPrice: 4500,
    images: ['https://via.placeholder.com/400'],
    brand: 'AudioMax',
    specifications: { anc: true, batteryLife: '24 hours', waterproof: 'IPX4' },
    rating: 4.5,
    reviewCount: 178,
    inStock: true,
    stockQuantity: 85,
    isNew: true,
    isDeal: false,
    category: 'Headphones'
  },
  {
    name: 'Mechanical Keyboard RGB',
    description: 'Premium mechanical keyboard with RGB backlighting',
    price: 4500,
    originalPrice: 5500,
    images: ['https://via.placeholder.com/400'],
    brand: 'GameGear',
    specifications: { switches: 'Cherry MX', rgb: true, wireless: false },
    rating: 4.7,
    reviewCount: 312,
    inStock: true,
    stockQuantity: 45,
    isNew: false,
    isDeal: true,
    category: 'Accessories'
  },
  {
    name: 'Fitness Tracker Band',
    description: 'Affordable fitness tracker with heart rate monitoring',
    price: 2200,
    originalPrice: 2800,
    images: ['https://via.placeholder.com/400'],
    brand: 'FitTech',
    specifications: { heartRate: true, waterproof: true, batteryLife: '7 days' },
    rating: 4.2,
    reviewCount: 156,
    inStock: true,
    stockQuantity: 120,
    isNew: false,
    isDeal: false,
    category: 'Wearables'
  },
  {
    name: 'Laptop Cooling Pad',
    description: 'Adjustable laptop cooling pad with dual fans',
    price: 1100,
    originalPrice: 1400,
    images: ['https://via.placeholder.com/400'],
    brand: 'CoolTech',
    specifications: { fans: 2, adjustable: true, usb: true },
    rating: 4.1,
    reviewCount: 92,
    inStock: true,
    stockQuantity: 70,
    isNew: false,
    isDeal: false,
    category: 'Accessories'
  },
  {
    name: 'Webcam HD 1080p',
    description: 'Full HD webcam with auto-focus and built-in microphone',
    price: 2800,
    originalPrice: 3500,
    images: ['https://via.placeholder.com/400'],
    brand: 'VisionPro',
    specifications: { resolution: '1080p', autoFocus: true, microphone: true },
    rating: 4.4,
    reviewCount: 203,
    inStock: true,
    stockQuantity: 55,
    isNew: true,
    isDeal: true,
    category: 'Accessories'
  },
  {
    name: 'Phone Stand Adjustable',
    description: 'Universal adjustable phone stand for desk',
    price: 450,
    originalPrice: 600,
    images: ['https://via.placeholder.com/400'],
    brand: 'DeskMate',
    specifications: { adjustable: true, foldable: true, universal: true },
    rating: 4.0,
    reviewCount: 45,
    inStock: true,
    stockQuantity: 200,
    isNew: false,
    isDeal: false,
    category: 'Accessories'
  },
  {
    name: 'Wireless Charger Pad',
    description: 'Fast wireless charging pad for smartphones',
    price: 1200,
    originalPrice: 1500,
    images: ['https://via.placeholder.com/400'],
    brand: 'ChargeFast',
    specifications: { fastCharging: true, wireless: true, ledIndicator: true },
    rating: 4.3,
    reviewCount: 167,
    inStock: true,
    stockQuantity: 90,
    isNew: false,
    isDeal: false,
    category: 'Accessories'
  },
  {
    name: 'Bluetooth Speaker Portable',
    description: 'Waterproof portable Bluetooth speaker with bass boost',
    price: 2100,
    originalPrice: 2600,
    images: ['https://via.placeholder.com/400'],
    brand: 'SoundWave',
    specifications: { waterproof: 'IPX7', batteryLife: '12 hours', bassBoost: true },
    rating: 4.5,
    reviewCount: 189,
    inStock: true,
    stockQuantity: 65,
    isNew: true,
    isDeal: true,
    category: 'Accessories'
  },
  {
    name: 'Screen Protector Tempered Glass',
    description: 'Premium tempered glass screen protector',
    price: 350,
    originalPrice: 500,
    images: ['https://via.placeholder.com/400'],
    brand: 'ShieldPro',
    specifications: { material: 'Tempered Glass', thickness: '0.33mm', oleophobic: true },
    rating: 4.2,
    reviewCount: 78,
    inStock: true,
    stockQuantity: 300,
    isNew: false,
    isDeal: false,
    category: 'Accessories'
  },
  {
    name: 'Cable Organizer Set',
    description: 'Complete cable management solution for desk',
    price: 550,
    originalPrice: 700,
    images: ['https://via.placeholder.com/400'],
    brand: 'OrganiTech',
    specifications: { pieces: 10, adhesive: true, reusable: true },
    rating: 4.1,
    reviewCount: 56,
    inStock: true,
    stockQuantity: 150,
    isNew: false,
    isDeal: false,
    category: 'Accessories'
  },
  {
    name: 'Mini Power Bank 5000mAh',
    description: 'Compact and lightweight power bank for daily use',
    price: 850,
    originalPrice: 1100,
    images: ['https://via.placeholder.com/400'],
    brand: 'TechPro',
    specifications: { capacity: '5000mAh', compact: true, fastCharging: false },
    rating: 4.0,
    reviewCount: 112,
    inStock: true,
    stockQuantity: 180,
    isNew: false,
    isDeal: false,
    category: 'Power Bank'
  },
  {
    name: 'Solar Power Bank 30000mAh',
    description: 'High capacity solar power bank for outdoor adventures',
    price: 3200,
    originalPrice: 4000,
    images: ['https://via.placeholder.com/400'],
    brand: 'EcoPower',
    specifications: { capacity: '30000mAh', solar: true, waterproof: true },
    rating: 4.4,
    reviewCount: 145,
    inStock: true,
    stockQuantity: 35,
    isNew: true,
    isDeal: true,
    category: 'Power Bank'
  },
  {
    name: 'Gaming Headset 7.1 Surround',
    description: 'Professional gaming headset with virtual surround sound',
    price: 3800,
    originalPrice: 4500,
    images: ['https://via.placeholder.com/400'],
    brand: 'GameGear',
    specifications: { surround: '7.1', microphone: 'Detachable', rgb: true },
    rating: 4.6,
    reviewCount: 267,
    inStock: true,
    stockQuantity: 42,
    isNew: true,
    isDeal: false,
    category: 'Headphones'
  },
  {
    name: 'Smart Ring Fitness Tracker',
    description: 'Sleek fitness tracking ring with sleep monitoring',
    price: 5500,
    originalPrice: 7000,
    images: ['https://via.placeholder.com/400'],
    brand: 'FitTech',
    specifications: { heartRate: true, sleepTracking: true, waterproof: true },
    rating: 4.3,
    reviewCount: 89,
    inStock: true,
    stockQuantity: 25,
    isNew: true,
    isDeal: true,
    category: 'Wearables'
  }
];

async function seed() {
  try {
    console.log('Starting database seeding...');

    await sequelize.authenticate();
    console.log('✓ Database connected');

    // Create categories
    console.log('Creating categories...');
    const createdCategories = {};
    for (const cat of categories) {
      const category = await Category.create(cat);
      createdCategories[cat.name] = category.id;
      console.log(`  ✓ Created category: ${cat.name}`);
    }

    // Create products
    console.log('Creating products...');
    for (const prod of products) {
      const categoryId = createdCategories[prod.category];
      const { category, ...productData } = prod;
      await Product.create({ ...productData, categoryId });
      console.log(`  ✓ Created product: ${prod.name}`);
    }

    console.log('✓ Seeding completed successfully!');
    console.log(`  - ${categories.length} categories created`);
    console.log(`  - ${products.length} products created`);
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
