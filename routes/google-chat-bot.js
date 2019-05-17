const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    let text = '';
    // Case 1: When BOT was added to the ROOM
    if (req.body.type === 'ADDED_TO_SPACE' && req.body.space.type === 'ROOM') {
        text = `Thanks for adding me to ${req.body.space.displayName}`;
        // Case 2: When BOT was added to a DM
    } else if (req.body.type === 'ADDED_TO_SPACE' && req.body.space.type === 'DM') {
        text = `Thanks for adding me to a DM, ${req.body.user.displayName}`;
        // Case 3: Texting the BOT
    } else if (req.body.type === 'MESSAGE') {
        // text = `Your message : ${req.body.message.text}`;
        // Call PP's App
        // Get Response from PP's App
        text = 'I told you... Not talking to strangers!';
        console.log(req.body);
    }
    return res.json({
        text
    });
});

module.exports = router;