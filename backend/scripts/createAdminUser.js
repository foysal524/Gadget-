const { User } = require('../models');
const sequelize = require('../config/database');

async function createAdminUser() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected');

    const admin = await User.create({
      uid: 'nahinfarhan-admin-uid',
      email: 'nahinfarhan.czs@gmail.com',
      displayName: 'Nahin Farhan',
      role: 'admin'
    });

    console.log('✓ Admin user created:');
    console.log('  Email:', admin.email);
    console.log('  Role:', admin.role);
    console.log('\nNow login with this email at http://localhost:3000/admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();
