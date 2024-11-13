"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
router.get('/getUsers', authMiddleware_1.authenticateToken, adminController_1.getUsers);
router.post('/addUser', authMiddleware_1.authenticateToken, adminController_1.addUser);
router.put('/updateUser/:userId', authMiddleware_1.authenticateToken, adminController_1.updateUser);
router.delete('/deleteUser/:userId', authMiddleware_1.authenticateToken, adminController_1.deleteUser);
exports.default = router;
