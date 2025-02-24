import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

async function startServer() {
  try {
    // Connect to MongoDB using the URI from config
    await mongoose.connect(config.dataBase as string);
    console.log('🎊 Mongoose connected successfully 🎉');

    // Start the server on the specified port
    app.listen(config.port, () => {
      console.log(`Server is listening on port ${config.port} 📌`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1); // Exit process with failure
  }
}

startServer();
