const User = require("../model/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");


//get a user
router.get("/", async(req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId ?
            await User.findById(userId) :
            await User.findOne({ username: username });
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.put("/:id", async(req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Tài khoản đã được cập nhật");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can update only your account!");
    }
});
//get all user

router.get('/all', async(req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.send("Error!!")
            next();
        }
        res.status(200).json(users);
    })
});
// get all user online
router.get('/online', async(req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.send("Error!!")
            next();
        }
        res.status(200).json(users);
    })
});
// router.get('/online', async(req, res) => {
//     User.find({}, (err, users) => {
//         if (err) {
//             res.send("Error!!")
//             next();
//         } else {
//             if (users.on_off === "true") {
//                 res.status(200).json(users);
//             }
//         }
//     })
// });
//get friends
router.get("/friends/:userId", async(req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map((friendId) => {
                return User.findById(friendId);
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendList)
    } catch (err) {
        res.status(500).json(err);
    }
});

//follow a user

router.put("/:id/follow", async(req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("Theo dõi người dùng thành công");
            } else {
                res.status(403).json("Bạn đã theo dõi người này rồi");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("Không thể tự theo dõi chính mình");
    }
});

//unfollow a user

router.put("/:id/unfollow", async(req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("Hủy theo dõi thành công");
            } else {
                res.status(403).json("Bạn không theo dõi người dùng này");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("Bạn không thể bỏ theo dõi chính mình");
    }
});

module.exports = router;