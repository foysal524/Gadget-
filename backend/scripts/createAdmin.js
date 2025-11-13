const { User } = require('../models');
const sequelize = require('../config/database');

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected');

    // Create admin user
    const admin = await User.create({
      uid: 'admin-test-uid',
      email: 'admin@gadgetbazar.com',
      displayName: 'Admin User',
      role: 'admin'
    });

    console.log('✓ Admin user created:');
    console.log('  Email:', admin.email);
    console.log('  UID:', admin.uid);
    console.log('  Role:', admin.role);
    console.log('\nNote: Use this UID for Firebase authentication');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
