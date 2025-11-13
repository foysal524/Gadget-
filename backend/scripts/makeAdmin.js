const { User } = require('../models');

const makeAdmin = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found with email:', email);
      process.exit(1);
    }
    
    user.role = 'admin';
    await user.save();
    console.log('✓ User', email, 'is now an admin');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Usage: node makeAdmin.js <email>');
  process.exit(1);
}

makeAdmin(email);
