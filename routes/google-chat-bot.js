const express = require('express');
const router = express.Router();
const axios = require('axios');
const CurrentConnectionMap = require('../models/CurrentConnectionMap');

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

        const facebookConnectionDetails = {
            serviceName: 'facebook',
            appId: '9876',
            senderId: '1083775135033562'
        };

        const whatsAppConnectionDetails = {
            serviceName: 'whatsapp',
            appId: '9876',
            senderId: '+918007766821'
        };

        let connectionDetails;
        let currentClientApp;

        CurrentConnectionMap.findOne({
                where: {
                    agentId: 1,
                    clientId: 1
                }
            })
            .then(mapping => {
                console.log('Mapping Found: ' + mapping.clientServiceId);
                if (mapping.clientServiceId === 1) {
                    currentClientApp = 'facebook';
                    connectionDetails = facebookConnectionDetails;
                } else {
                    currentClientApp = 'whatsapp';
                    connectionDetails = whatsAppConnectionDetails;
                }

                console.log(`Sending to ${connectionDetails.serviceName}`);

                let ppServiceURL = `http://085f7199.ngrok.io/index.php?service_name=${connectionDetails.serviceName}&data[app_id]=${connectionDetails.appId}&data[sender_id]=${connectionDetails.senderId}&data[message]=${req.body.message.text}`;
                console.log('PP Service URL: ' + ppServiceURL);
        
                axios.post(ppServiceURL)
                    .then((res) => {
                        console.log(`Response from FE Service: ${res}`);
                    })
                    .catch((error) => {
                        console.log(`Error in calling the FE service: ${error}`);
                    });
        
                console.log(req.body);
            });
    }
    return res.send({});
});

module.exports = router;