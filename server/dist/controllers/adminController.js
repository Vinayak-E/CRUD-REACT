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
exports.deleteUser = exports.updateUser = exports.addUser = exports.getUsers = void 0;
const db_1 = __importDefault(require("../models/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.default.find({ isAdmin: false });
        return res.status(200).json({ users });
    }
    catch (error) {
    }
});
exports.getUsers = getUsers;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, isAdmin, password } = req.body;
    try {
        const existingUser = yield db_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new db_1.default({ name, email, isAdmin, password: hashedPassword });
        yield newUser.save();
        res.status(201).json({ message: 'User added successfully', user: newUser });
    }
    catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Failed to add user. Please try again later.' });
    }
});
exports.addUser = addUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { name, email, isAdmin } = req.body;
    try {
        // Find the user to be updated
        const user = yield db_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Only check for duplicate email if it's being changed
        if (email && email !== user.email) {
            const existingUser = yield db_1.default.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email already exists.' });
            }
        }
        // Update the user
        user.name = name;
        user.email = email;
        user.isAdmin = isAdmin;
        yield user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user. Please try again later.' });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield db_1.default.findByIdAndDelete(userId);
        if (!user) {
            console.log('User not found');
            res.status(404).json({ message: 'User not found' });
            return;
        }
        console.log('User deleted successfully');
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user. Please try again later.' });
    }
});
exports.deleteUser = deleteUser;
