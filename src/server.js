require('reflect-metadata');
const http = require('http');                 // <-- Ajout
const { Server } = require("socket.io");      // <-- Ajout

const app = require('./app');
const AppDataSource = require('./config/data-source');
const env = require('./config/env');

const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');

        // --- Création du serveur HTTP brut ---
        const httpServer = http.createServer(app);

        // --- Initialisation de Socket.IO ---
        const io = new Server(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        // --- Gestion des connexions WebSocket ---
        io.on('connection', (socket) => {
            console.log(`Un utilisateur s'est connecté : ${socket.id}`);

            socket.on('disconnect', () => {
                console.log(`Utilisateur ${socket.id} déconnecté`);
            });

            // Ping-Pong
            socket.on('my_ping', (data) => {
                console.log('Message reçu du client :', data);
                // Répondre UNIQUEMENT à cet utilisateur
                io.emit('broadcast_msg', { message: `Quelqu'un a pingué ! C'est ${socket.id}` });
            });
        });

        // --- Lancement du serveur ---
        httpServer.listen(env.PORT, () => {
            console.log(`Server is running on port ${env.PORT}`);
        });

        // Gestion des erreurs
        httpServer.on('error', (error) => {
            console.error('Server failed to start:', error);
            process.exit(1);
        });

    } catch (error) {
        console.error('Error during Data Source initialization', error);
        process.exit(1);
    }
};

startServer();
