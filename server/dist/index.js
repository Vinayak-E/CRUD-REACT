"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: false }));
// Routes
app.get('/', (req, res) => {
    res.send('server is Running');
});
// Mount user routes
app.use('/api/auth', userRoute_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
exports.default = app;
