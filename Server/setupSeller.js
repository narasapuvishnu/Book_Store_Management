const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Seller = require('./models/Seller');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/BookStore';

async function setupSeller() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const hashedPassword = await bcrypt.hash('seller123', 10);
  
  // 1. Ensure balu password is known: seller123
  await Seller.updateOne(
    { email: 'nagarjunanarasapu@gmail.com' },
    { $set: { password: hashedPassword, isApproved: true } }
  );

  // 2. Ensure standard demo merchant exists: seller@bookstore.com / seller123
  const demoSeller = await Seller.findOneAndUpdate(
    { email: 'seller@bookstore.com' },
    {
      name: 'Premier Bookstore Merchant',
      email: 'seller@bookstore.com',
      password: hashedPassword,
      isApproved: true
    },
    { upsert: true, new: true }
  );

  console.log('Seller accounts prepared successfully:');
  console.log('1. Email: seller@bookstore.com | Password: seller123');
  console.log('2. Email: nagarjunanarasapu@gmail.com | Password: seller123');
  process.exit(0);
}

setupSeller().catch(err => {
  console.error(err);
  process.exit(1);
});
