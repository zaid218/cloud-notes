const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const { findById } = require('../models/User');
const JWT_SECRET = 'Harryisagoodb$oy';
var fetchuser = require('../middleware/fetchuser')
// ROUTE1:Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser',
    [
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
    ],
    async (req, res) => {
        // If there are errors, return Bad request and the errors
        let success=false
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Check whether the user with this email exists already
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({success, error: "Sorry a user with this email already exists" })
            }
            // Create a new user
            const salt = await bcrypt.genSalt(10)
            const secPass = await bcrypt.hash(req.body.password, salt)
            user = await User.create({
                name: req.body.name,
                password: secPass,
                email: req.body.email,
            })
            const data = {
                user: {
                    id: user.id
                }
            }
            success=true
            const authtoken = jwt.sign(data, JWT_SECRET);
            res.json({ success,authtoken })
        } catch (error) {
            console.error(error.message);
            res.status(500).send("internal server  Error occured");

        }
    }
)
//ROUTE2:AUthenticate a user using :post "/api/auth/login" no login required
router.post('/login',
    [
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password cant be blank ').exists(),
    ], async (req, res) => {
        let  success=false
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email })
            if (!user) {
                success=false
                return res.status(400).json({ error: "Please try to login with correct  credentials" })
            }
            const passwordCompare = await bcrypt.compare(password, user.password)
            if (!passwordCompare) {
                success=false 
                return res.status(400).json({success,error: "Please try to login with correct  credentials" })
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            success=true
            res.json({ success,authtoken })
        }

        catch (error) {
            console.error(error.message);
            res.status(500).send("internal server  Error occured");
        }
    }

)
//ROUTE3:GET LOGGED IN user  DETAILS using :post "/api/auth/getuser"  login required
router.post('/getuser', fetchuser,async (req, res) => {
    try {
        userId = req.user.id;
        const user = findById(userId).select("-password")
        res.send(user)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("internal server  Error occured");
    }
}
)
module.exports = router;