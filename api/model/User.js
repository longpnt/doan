const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 3,
        max: 20,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        min: 6
    },
    profilePicture: {
        type: String,
        default: "person/noAvatar.png",
        crossOrigin: "anonymous"
    },
    coverPicture: {
        type: String,
        default: "person/noCover.png"
    },
    followers: {
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    desc: {
        type: String,
        max: 50
    },
    city: {
        type: String,
        max: 50
    },
    from: {
        type: String,
        max: 50
    },
    relationship: {
        type: String,
        enum: [1, 2, 3]
    },
    isOnline: {
        type: Boolean,
        default: true
    },
    onlineTime: {
        type: Date,
        default: new Date()
    },
}, { timestamps: true })
module.exports = mongoose.model("User", UserSchema);