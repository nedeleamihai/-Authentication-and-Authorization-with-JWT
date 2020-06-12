const express = require('express');

const AuthorsService = require('./services.js');
const {
    validateFields
} = require('../utils');
const {
    ServerError
} = require('../errors');

const {
	authorizeAndExtractToken
} = require('../security/Jwt');

const {
	authorizeRoles
} = require('../security/Roles');

const router = express.Router();

router.post('/', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        first_name,
        last_name
    } = req.body;

    // validare de campuri
    try {

        const fieldsToBeValidated = {
            first_name: {
                value: first_name,
                type: 'alpha'
            },
            last_name: {
                value: last_name,
                type: 'alpha'
            }
        };

        validateFields(fieldsToBeValidated);

        await AuthorsService.add(first_name, last_name);

        res.status(201).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/', authorizeAndExtractToken, authorizeRoles('admin', 'user'), async (req, res, next) => {
    try {

        const authors = await AuthorsService.getAll();
        res.json(authors);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/:id', authorizeAndExtractToken, authorizeRoles('admin', 'user'), async (req, res, next) => {
    const {
        id
    } = req.params;
    try {

        validateFields({
            id: {
                value: id,
                type: 'int'
            }
        });
        const author = await AuthorsService.getById(parseInt(id));
        res.json(author);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.put('/:id', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        id
    } = req.params;
    const {
        first_name,
        last_name
    } = req.body;
    try {

        const fieldsToBeValidated = {
            id: {
                value: id,
                type: 'int'
            },
            first_name: {
                value: first_name,
                type: 'alpha'
            },
            last_name: {
                value: last_name,
                type: 'alpha'
            }
        };

        validateFields(fieldsToBeValidated);

        await AuthorsService.updateById(parseInt(id), first_name, last_name);
        res.status(204).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.delete('/:id', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        id
    } = req.params;

    try {

        validateFields({
            id: {
                value: id,
                type: 'int'
            }
        });
        // se poate modifica 
        await AuthorsService.deleteById(parseInt(id));
        res.status(204).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

module.exports = router;