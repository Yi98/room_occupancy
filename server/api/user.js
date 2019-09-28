const express = require('express');
const router = express.Router();

const UserController = require('../controller/user');

router.get('/', UserController.getUsers);

// this will match every /string. Be careful with it.
router.get('/:id', UserController.getUser);

router.put('/:id', UserController.editUser);

router.delete('/:id', UserController.deleteUser);

router.post('/', UserController.addUser);

router.post('/login', UserController.login);

router.post('/resetPassword', UserController.resetPassword);

router.post('/updatePassword', UserController.updatePassword);

module.exports = router;