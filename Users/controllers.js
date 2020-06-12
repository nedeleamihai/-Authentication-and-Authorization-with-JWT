const express = require('express');

const UsersService = require('./services.js');

const {
    validateFields
} = require('../utils');

const {
    authorizeAndExtractToken
} = require('../security/Jwt');

const {
    authorizeRoles
} = require('../security/Roles');

const router = express.Router();

router.post('/roles', async (req, res, next) => {
    const {
        value
    } = req.body;

    try {
        validateFields({
            value: {
                value,
                type: 'alpha'
            }
        });

        await UsersService.addRole(value);

        res.status(201).end();
    } catch (err) {
        next(err);
    }
    
});

// ruta pt verificarea datelor
router.get('/roles', async (req, res, next) => {
    res.json(await UsersService.getRoles());
});

router.post('/register', async (req, res, next) => {
    const {
        username,
        password,
        role_id
    } = req.body;

    // validare de campuri
    try {
        const fieldsToBeValidated = {
            username: {
                value: username,
                type: 'alpha'
            },
            password: {
                value: password,
                type: 'ascii'
            },
            role_id: {
                value: role_id,
                type:'int'
            }
        };

        validateFields(fieldsToBeValidated);

        await UsersService.add(username, password, role_id);

        res.status(201).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

// ruta pt verificarea datelor
router.get('/', async (req, res, next) => {
    res.json(await UsersService.getUsers());
});

router.post('/login', async (req, res, next) => {
  const {
      username,
      password
  } = req.body;

  try {
    const fieldsToBeValidated = {
        username: {
            value: username,
            type: 'alpha'
        },
        password: {
            value: password,
            type: 'ascii'
        }
    };

    validateFields(fieldsToBeValidated);

    const token = await UsersService.authenticate(username, password);

    res.status(200).json(token);
} catch (err) {
    // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
    next(err);
}

})
module.exports = router;