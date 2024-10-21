const express = require('express')
const router = express.Router();

const { getChats, chatList, getOnlineUsers, getAllChatsRn } = require('../controllers/chat');

// /chats/:senderId/:recieverId
router.get('/chats/:senderId/:recieverId', getChats);

// /chatlist/:senderId
router.get('/chatlist/:senderId', chatList);

// /online/users
router.get('/online/users', getOnlineUsers);

// /rn/allchats
router.get('/rn/allchats', getAllChatsRn)

module.exports = router;