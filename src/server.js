require('reflect-metadata');
const app = require('./app');
const AppDataSource = require('./config/data-source');
const env = require('./config/env');

const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');

        const server = app.listen(env.PORT, () => {
            console.log(`Server is running on port ${env.PORT}`);
        });

        server.on('error', (error) => {
            console.error('Server failed to start:', error);
            process.exit(1);
        });
    } catch (error) {
        console.error('Error during Data Source initialization', error);
        process.exit(1);
    }
};

startServer();
