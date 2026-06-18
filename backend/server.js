import app from './src/app.js';
import connectDB from './config/db.js';
import config from './config/config.js';

connectDB();

const server = app.listen(config.PORT || 3000, () => {
    const port = server.address().port;
    console.log(`Server started at http://localhost:${port}`);
});