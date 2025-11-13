const { Category, Product, User } = require('../models');

const viewData = async () => {
  try {
    console.log('\n=== CATEGORIES ===');
    const categories = await Category.findAll();
    categories.forEach(c => console.log(`${c.name} (${c.id}) - Parent: ${c.parentId || 'None'}`));
    
    console.log('\n=== PRODUCTS ===');
    const products = await Product.findAll({ include: ['category'] });
    products.forEach(p => console.log(`${p.name} - ${p.category?.name} - BDT ${p.price}`));
    
    console.log('\n=== USERS ===');
    const users = await User.findAll();
    users.forEach(u => console.log(`${u.email} - Role: ${u.role}`));
    
    console.log('\n=== SUMMARY ===');
    console.log(`Categories: ${categories.length}`);
    console.log(`Products: ${products.length}`);
    console.log(`Users: ${users.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

viewData();
