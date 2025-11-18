const mongoose = require('mongoose');

async function debugUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/divino-maestro');
    console.log('Connected to MongoDB');

    // Get the latest user
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).sort({ _id: -1 }).limit(5).toArray();

    console.log('\nLatest users in database:');
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log('  Email:', user.email);
      console.log('  Name:', user.name);
      console.log('  Has password field?:', 'password' in user);
      console.log('  Password value:', user.password ? 'HASHED (hidden)' : 'undefined');
      console.log('  Created:', user.createdAt);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

debugUser();