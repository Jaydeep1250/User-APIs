const express = require('express');
const route = express.Router();
const { User } = require('../models/models.service');
const jwt = require('jsonwebtoken');
const secretKey = "XM8RVSq4Tds6afuQqtpgyJKi";

function generateToken(user) {
    console.log(secretKey)
    const token = jwt.sign({ email: user.email, password: user.password }, secretKey, { expiresIn: '1h' });
    return token;
  }
  
const Joi = require('joi');

const schema = Joi.object({
    first_name: Joi.string().alphanum().min(3).max(30).required(),
    last_name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the user
 *         first_name:
 *           type: string
 *           description: The name of the user
 *         last_name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         role:
 *           type: string
 *           description: The password of the user
 *         status:
 *           type: string
 *           description: The password of the user
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns a list of all users
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
route.get('/users', function(req, res) {

    User.find({}, function(err, users) {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(users);
        }
    });
});
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Returns a single user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
route.get('/users/:id', function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            res.status(500).json({ error: err });
        } else if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(user);
        }
    });
});
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Creates a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request body
 */
route.post('/users', function(req, res) {
    const result = schema.validate({ first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password });
    if (result.error) {
        // Return an error response
        return res.status(400).json({ error: result.error.details[0].message });
    }
    var newUser = new User(result.value);
    newUser.save(function(err, user) {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(user);
        }
    });
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Updates a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid request body
 */
route.put('/users/:id', function(req, res) {
    const result = schema.validate({ first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password });
    if (result.error) {
        // Return an error response
        return res.status(400).json({ error: result.error.details[0].message });
    }
    User.findByIdAndUpdate(req.params.id, result, { new: true }, function(err, user) {
        if (err) {
            res.status(500).json({ error: err });
        } else if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(user);
        }
    });
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Deletes a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
route.delete('/users/:id', function(req, res) {
    User.findByIdAndDelete(req.params.id, function(err, user) {
        if (err) {
            res.status(500).json({ error: err });
        } else if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ message: 'User deleted successfully' });
        }
    });
});




route.post('/login', (req, res, next) => {
    User.findOne({email:req.body.email, password:req.body.password}, function(err, user) {
        if (err) {
            res.status(500).json({ error: err });
        } else if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
              // Generate JWT token
              const token = generateToken(req.body);
            res.json({ message: 'Login successfully', token, data:user });
        }
    });
})


module.exports = route;