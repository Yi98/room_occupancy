const express = require('express');
const router = express.Router();

const UserController = require('../controller/user');
const auth = require('../middleware/auth');
const cache = require('../middleware/cache');


router.get('/', cache.getUsers, UserController.getUsers);

// this will match every /string. Be careful with it.
router.get('/:id', UserController.getUser);

router.put('/:id', cache.deleteUsers, UserController.editUser);

router.delete('/:id', cache.deleteUsers, UserController.deleteUser);

router.post('/', cache.deleteUsers, UserController.addUser);

router.post('/login', UserController.login);

router.post('/forgotPassword', UserController.forgotPassword);

router.post('/resetPassword', UserController.resetPassword);

module.exports = router;