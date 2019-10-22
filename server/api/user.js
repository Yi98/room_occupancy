const express = require('express');
const router = express.Router();

const UserController = require('../controller/user');
const auth = require('../middleware/auth');

router.get('/', auth, UserController.getUsers);

// this will match every /string. Be careful with it.
router.get('/:id', auth, UserController.getUser);

router.put('/:id', auth, UserController.editUser);

router.delete('/:id', auth, UserController.deleteUser);

router.post('/', auth, UserController.addUser);

router.post('/login', UserController.login);

router.post('/forgotPassword', UserController.forgotPassword);

router.post('/resetPassword', UserController.resetPassword);

module.exports = router;