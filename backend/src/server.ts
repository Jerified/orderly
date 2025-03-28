import dotenv from 'dotenv';
dotenv.config(); // This must be called BEFORE any database/config imports

import { connectDB } from './config/database';
import { server } from './app';

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.IO endpoint: http://localhost:${PORT}/socket.io`);
  });
});

