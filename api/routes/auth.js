const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const CLIENT_URL = process.env.CLIENT_URL;
const jwt = require("jsonwebtoken");
//Register
router.post("/register", async(req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Login
router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        !user && res.status(404).send("Không tìm thấy tài khoản");

        const conformPassword = await bcrypt.compare(req.body.password, user.password);
        !conformPassword && res.status(400).json("Sai mật khẩu")

        const accessToken = jwt.sign({
            id: user._id,
        });

        const updated = await User.findOneAndUpdate(user._id, {
            $set: {
                isOnline: true,
                onlineTime: new Date()
            }
        }, {
            new: true
        })
        const { password, ...others } = user._doc;

        res.status(200).json({...others, accessToken });
        console.log(accessToken);
    } catch (err) {
        // res.status(500).json(err);
    }
});
//Login admin
router.post("/loginAdmin", async(req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        !user && res.status(404).send("Không tìm thấy tài khoản");

        const conformPassword = await bcrypt.compare(req.body.password, user.password);
        !conformPassword && res.status(400).json("Sai mật khẩu")

        const adminConform = User.findOne(req.body.isAdmin === "true");
        !adminConform && res.status(403).json("Bạn không thể truy cập vào trang Admin");

        res.status(200).json(user);
    } catch (err) {}
})

module.exports = router;