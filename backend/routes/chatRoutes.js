const express = require("express");
const router  = express.Router();
const Conversation = require("../models/Conversation");
const Message      = require("../models/Message");
const User         = require("../models/User");

/* ── GET all conversations for a user ── */
router.get("/conversations/:username", async (req, res) => {
  try {
    const convos = await Conversation.find({ members: req.params.username }).sort({ lastTime: -1 });
    res.json(convos);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── CREATE or GET DM conversation ── */
router.post("/conversations/dm", async (req, res) => {
  try {
    const { userA, userB } = req.body;
    let convo = await Conversation.findOne({ type: "dm", members: { $all: [userA, userB] } });
    if (!convo) {
      convo = new Conversation({ type: "dm", members: [userA, userB], name: "" });
      await convo.save();
    }
    res.json(convo);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── CREATE group conversation ── */
router.post("/conversations/group", async (req, res) => {
  try {
    const { name, members, createdBy } = req.body;
    if (!name || !members || members.length < 2)
      return res.status(400).json({ error: "Name and at least 2 members required." });
    const convo = new Conversation({ type: "group", name, members, createdBy, lastMessage: "" });
    await convo.save();
    res.json(convo);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── GET messages in a conversation ── */
router.get("/messages/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── SEND a message ── */
router.post("/messages", async (req, res) => {
  try {
    const { conversationId, sender, senderRole, text } = req.body;
    if (!conversationId || !sender || !text)
      return res.status(400).json({ error: "conversationId, sender, text required." });
    const msg = new Message({ conversationId, sender, senderRole, text, readBy: [sender] });
    await msg.save();
    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: text, lastTime: new Date() });
    res.json(msg);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── MARK messages as read ── */
router.post("/messages/read/:conversationId", async (req, res) => {
  try {
    const { username } = req.body;
    await Message.updateMany(
      { conversationId: req.params.conversationId, readBy: { $ne: username } },
      { $push: { readBy: username } }
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── SEARCH users (for starting new chat) ── */
router.get("/users/search", async (req, res) => {
  try {
    const q = req.query.q || "";
    const users = await User.find({
      username: { $regex: q, $options: "i" },
      role: { $ne: "admin" },
    }).select("username role department").limit(10);
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── GET unread count for a user ── */
router.get("/unread/:username", async (req, res) => {
  try {
    const convos = await Conversation.find({ members: req.params.username });
    const ids = convos.map(c => c._id.toString());
    const count = await Message.countDocuments({
      conversationId: { $in: ids },
      sender: { $ne: req.params.username },
      readBy: { $nin: [req.params.username] }
    });
    res.json({ count });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;