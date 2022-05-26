const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000",
    },
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    // ceonnect
    console.log("Người dùng đã kết nối.");

    //Lay userId va socket
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    //gui va nhan tin nhan
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });
        console.log(user.socketId);
    });
    // disconnect
    socket.on("disconnect", () => {
        console.log("Người dùng đã ngắt kết nối!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});

//online
// const users_online = {};
// io.on('connection', function(socket) {
//     console.log('a user connected');

//     socket.on('login', function(data) {
//         console.log('a user ' + data.userId + ' connected');
//         // saving userId to object with socket ID
//         users[socket.id] = data.userId;
//     });

//     socket.on('disconnect', function() {
//         console.log('user ' + users[socket.id] + ' disconnected');
//         // remove saved socket from users object
//         delete users[socket.id];
//     });
// });