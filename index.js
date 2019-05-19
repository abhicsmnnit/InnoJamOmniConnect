const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const {
    google
} = require('googleapis');
const CurrentConnectionMap = require('./models/CurrentConnectionMap');

const app = express()
    .use(bodyParser.urlencoded({
        extended: false
    }))
    .use(bodyParser.json());

// Middleware for Logging
app.use((req, res, next) => {
    const now = new Date().toString();
    const logLine = `${now}: ${req.method} ${req.url}`;

    console.log(logLine);
    fs.appendFile(`${__dirname}/logs/server.log`, logLine + '\n', (err) => {
        if (err) {
            console.log('Unable to write to server logs!');
        }
    });

    next();
});

// Database
const db = require('./config/database');

db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log(`Error: ${err}`));

const key = require('./config/auth.json');
// process.env.GOOGLE_APPLICATION_CREDENTIALS = './config/auth.json';
const scopes = 'https://www.googleapis.com/auth/chat.bot';

const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes);


// jwt.authorize((err, response) => {
//     google.chat('v1').spaces.get({
//             auth: jwt,
//             name: 'spaces/6meaQgAAAAE'
//         },
//         (err, result) => {
//             console.log(err, result)
//         }
//     );

//     google.chat('v1').spaces.messages.create({
//             auth: jwt,
//             parent: 'spaces/6meaQgAAAAE',
//             requestBody: {
//                 text: 'Hello bro!'
//             }
//         },
//         (err, result) => {
//             console.log(err, result)
//         });
// });

// Endpoints
app.get('/', (req, res) => res.send('Hello World!!!'));

// GoogleChatBot Routes
app.use('/backend-services/google-chat-bot', require('./routes/google-chat-bot'));

// Company Routes
app.use('/companies', require('./routes/companies'));

// Message Sending
app.get('/messages', (req, res) => {
    const message = req.body.message;
    const sender = req.body.sender;
    const receiver = req.body.receiver;

    // todo: Add input validations

    if (sender.type === 'client') {

    }

    res.send('');
});

// Message Sending
app.post('/newMessage', (req, res) => {
    const serviceName = req.body.service_name;
    const companyId = req.body.company_id;
    const senderId = req.body.sender_id;
    const message = req.body.message;

    // todo: Add input validations

    let clientServiceId;
    if (serviceName === 'facebook') {
        clientServiceId = 1
    } else {
        clientServiceId = 2
    }

    CurrentConnectionMap.count({
            where: {
                agentId: 1,
                clientId: 1
            }
        })
        .then(count => {
            if (count > 0) {
                CurrentConnectionMap.destroy({
                        where: {
                            agentId: 1,
                            clientId: 1
                        }
                    })
                    .then(deletedMapping => {

                    });
            }

            CurrentConnectionMap.create({
                    agentId: 1,
                    clientId: 1,
                    agentServiceId: 2,
                    clientServiceId
                })
                .then(mapping => {

                })
                .catch(err => console.log(`Error: ${err}`));
        });

    // save the message in DB

    // send the message to proper receiver
    jwt.authorize((err, response) => {
        google.chat('v1').spaces.messages.create({
                auth: jwt,
                parent: 'spaces/6meaQgAAAAE',
                requestBody: {
                    text: message
                }
            },
            (err, result) => {
                console.log(err, result)
            });
    });

    res.send({
        message,
        serviceName,
        companyId,
        senderId
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`OmniConnect listening at ${port}!`));