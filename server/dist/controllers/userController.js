"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserData = exports.updateProfile = exports.getUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../models/db"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    try {
        const userExists = yield db_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ error: 'Email already registered' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new db_1.default({
            name,
            email,
            password: hashedPassword,
            isAdmin: false
        });
        yield newUser.save();
        res.status(201).json({ user: newUser });
    }
    catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.registerUser = registerUser;
// Login User
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield db_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: 'Please Enter the correct Password' });
            return;
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                image: user.image,
                isAdmin: user.isAdmin
            }
        });
    }
    catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.loginUser = loginUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Received request to /api/me');
        console.log('Request headers:', req.headers);
        console.log('Decoded user ID:', req.body.decodedUser.id);
        const user = yield db_1.default.findById(req.body.decodedUser.id).select('-password');
        console.log("The user:", user);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Get User Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.getUser = getUser;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, email, image } = req.body;
        const updatedUser = yield db_1.default.findOneAndUpdate({ _id: id }, { $set: { name, email, image } }, { new: true, runValidators: true });
        if (updatedUser) {
            res.status(200).json({ user: updatedUser });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Email already exists' });
        }
        else {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.updateProfile = updateProfile;
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return;
        }
        console.log(email, 'email new req call');
        const user = yield db_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid email' });
        }
        res.status(200).json({ user, message: 'fetched successfull' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUserData = getUserData;
