const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Debug: Print MONGO_URI to verify it's loaded correctly
    console.log('🔍 MONGO_URI from .env:', process.env.MONGO_URI);

    // Connect to MongoDB using the URI from .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
