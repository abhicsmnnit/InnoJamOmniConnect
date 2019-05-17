const express = require('express');
const Company = require('../models/Company');
const router = express.Router();

router.get('/', (req, res) =>
    Company.findAll()
    .then(companies => {
        console.log(companies);
        res.sendStatus(200);
    })
    .catch(err => console.log(`Error: ${err}`)));

router.post('/', (req, res) => {
    let {
        name
    } = req.body;

    console.log(`Name: ${name}`);
    //todo: Add validations - name is passed

    Company.create({
            name
        })
        .then(companies => {
            console.log(companies);
            res.send(companies);
        })
        .catch(err => console.log(`Error: ${err}`));
});

module.exports = router;