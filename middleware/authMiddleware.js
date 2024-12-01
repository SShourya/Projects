const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

module.exports = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const session = await redisClient.get(`sess:${token}`);
        if (!session) return res.status(401).json({ error: 'Session expired' });

        req.user = JSON.parse(session);
        next();
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};
