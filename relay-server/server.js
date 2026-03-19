const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // allow from everywhere for development
        methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1e8 // increase max upload size to 100MB (since we do chunks it's safer)
});

// Store active connections
const shops = new Map(); // shopId -> socketId
const customers = new Map(); // customerSocketId -> shopId

io.on('connection', (socket) => {
    console.log(`[+] Socket connected: ${socket.id}`);

    // --- SHOPKEEPER ACTIONS ---
    socket.on('shop-online', (shopId) => {
        console.log(`[Shop] ${shopId} is now online on socket ${socket.id}`);
        shops.set(shopId, socket.id);
        socket.join(`shop_${shopId}`);
    });

    // --- CUSTOMER ACTIONS ---
    socket.on('customer-join-shop', (shopId) => {
        console.log(`[Customer] ${socket.id} joined shop tunnel ${shopId}`);
        customers.set(socket.id, shopId);
        
        // Notify shop that customer is ready
        const shopSocketId = shops.get(shopId);
        if (shopSocketId) {
            io.to(shopSocketId).emit('customer-connected-for-job', { customerId: socket.id });
        }
    });

    // --- AIR-TRANSFER CHUNK RELAY ---
    // This is the core 'Air' logic: bytes are never stored on this server!
    socket.on('file-stream-chunk', (data) => {
        const { shopId, chunk, fileName, isFirst, isLast, totalSize } = data;
        const shopSocketId = shops.get(shopId);

        if (shopSocketId) {
            // Immediately relay to the correct shop
            io.to(shopSocketId).emit('incoming-file-chunk', {
                chunk,
                fileName,
                isFirst,
                isLast,
                totalSize,
                senderId: socket.id
            });
            console.log(`[Relay] Chunk for ${shopId} (${fileName}) - isLast: ${isLast}`);
        } else {
            socket.emit('transfer-error', 'Shop is offline. Cannot transfer file.');
        }
    });

    // --- CLEANUP ---
    socket.on('disconnect', () => {
        // Remove from shop list if it was a shop
        for (const [id, sId] of shops.entries()) {
            if (sId === socket.id) {
                console.log(`[-] Shop Offline: ${id}`);
                shops.delete(id);
                break;
            }
        }
        customers.delete(socket.id);
        console.log(`[-] Socket disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 SecurePrint Relay Server active on port ${PORT}`);
    console.log(`   Waiting for shop and customer connections...`);
});
