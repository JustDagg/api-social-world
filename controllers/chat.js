const Chat = require('../models/chat');
const User = require('../models/user');
const Socket = require('../models/socket');

// getChats
exports.getChats = (req, res) => {
    const senderId = req.params.senderId;
    const recieverId = req.params.recieverId;
    Chat.find({ $or: [{ 'reciever._id': recieverId, 'sender._id': senderId }, { 'sender._id': recieverId, 'reciever._id': senderId }] }, (err, chats) => {
        if (err || !chats) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(chats);
    });
};

// getAllChatsRn
exports.getAllChatsRn = (req, res) => {
    Chat.find()
        .then(chats => {
            res.json(chats)
        })
        .catch(err => console.log(err));
};

// chatList
exports.chatList = async (req, res) => {
    const senderId = req.params.senderId;
    const { name } = req.query;
    let chatList1 = await Chat.distinct("reciever._id", { 'sender._id': senderId })
    let chatList2 = await Chat.distinct("sender._id", { 'reciever._id': senderId })
    let chatList = await chatList1.concat(chatList2);
    let distinctChatList = [...new Set(chatList)]


    let userQuery = { _id: { $in: distinctChatList } };
    if (name) {
        userQuery.name = { $regex: name, $options: 'i' }; 
    }

    User.find({ _id: { $in: distinctChatList } })
        .select('name email created updated notificationToken university')
        .exec((err, data) => {
            if (err || !data) {
                res.status(400).json({
                    error: err || "No users found"
                })
            }
            res.json(data);
        });
};

// getOnlineUsers
exports.getOnlineUsers = (req, res) => {
    Socket.find()
        .select('user._id')
        .exec((err, result) => {
            if (err || !result) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
};