// routes/moderation-cases.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateBot } = require('../middleware/auth');

// Simple counter for case IDs (in production use a better system)
let caseCounter = 1000;

const generateCaseId = (type) => {
    const prefix = type === 'warn' ? 'w' : type === 'kick' ? 'k' : type === 'ban' ? 'b' : 'c';
    caseCounter++;
    return `${prefix}-${caseCounter.toString().padStart(6, '0')}`;
};

router.post('/cases', authenticateBot, async (req, res) => {
    try {
        const { actionType, discordId, reason, moderator, ...rest } = req.body;

        const caseId = generateCaseId(actionType);

        let user = await User.findOne({ discordId }) || new User({ discordId });

        user.moderationHistory.push({
            action: actionType,
            reason: reason || 'No reason provided',
            moderator,
            timestamp: new Date(),
            source: 'discord',
            caseId: caseId
        });

        await user.save();

        res.json({
            success: true,
            caseId: caseId,
            message: `Case ${caseId} created successfully`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/cases/:caseId', authenticateBot, async (req, res) => {
    try {
        const user = await User.findOne({
            'moderationHistory.caseId': req.params.caseId
        });

        if (!user) return res.status(404).json({ error: 'Case not found' });

        const caseData = user.moderationHistory.find(c => c.caseId === req.params.caseId);

        res.json({ case: caseData, user: { discordId: user.discordId, robloxUsername: user.robloxUsername } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;