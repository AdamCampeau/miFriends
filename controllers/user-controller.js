const { User } = require('../models')

const userController = {
    getAllUsers(req, res) {
        User.find()
            .populate({
                path: "thoughts",
                select: "__v"
            })
            .select("-__v")
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400)
            })
    },

    getUserById({ params, body }, res) {
        User.findOne({ _id: params.userId })
            .populate({
                path: "thoughts",
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: "Page not found"
                    })
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            })
    },

    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            })
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {
            new: true
        }).then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({
                    message: "Page not found"
                })
                return;
            }
            res.json(dbUserData)
        })
            .catch(err => res.status(400).json(err))
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.userId })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(400).json({
                        message: "Page not found"
                    })
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => res.status(400).json(err))
    },

    createFriend({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.userId }, { $addToSet: { friends: params.friendId } }, { new: true })
            .then(dbuserData => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: "Page not found"
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: { friendId: params.friendId } } },
            { new: true }
        )
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                res.json(err)
            });
    }
};

module.exports = userController;



