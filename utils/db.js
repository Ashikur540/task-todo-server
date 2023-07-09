
const mongoose = require('mongoose');

const connectDB = async () => {
    
    try {
      const conn = await mongoose.connect(`mongodb://0.0.0.0:27017/taskManagerDb`, {
        useNewUrlParser: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }

  module.exports=connectDB;