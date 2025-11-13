const { User } = require('../models');
const sequelize = require('../config/database');

async function makeUserAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected');

    // Get email from command line argument
    const email = process.argv[2];
    
    if (!email) {
      console.log('Usage: node scripts/makeUserAdmin.js <email>');
      console.log('Example: node scripts/makeUserAdmin.js user@example.com');
      process.exit(1);
    }

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log(`✗ User with email ${email} not found`);
      console.log('Available users:');
      const users = await User.findAll();
      users.forEach(u => console.log(`  - ${u.email}`));
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log('✓ User updated to admin:');
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

makeUserAdmin();
