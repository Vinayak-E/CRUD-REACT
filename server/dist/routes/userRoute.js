"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/register', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.get('/me', authMiddleware_1.authenticateToken, userController_1.getUser);
router.patch('/updateProfile', authMiddleware_1.authenticateToken, userController_1.updateProfile);
router.post('/getUser', authMiddleware_1.authenticateToken, userController_1.getUserData);
exports.default = router;
