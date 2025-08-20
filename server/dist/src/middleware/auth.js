"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRequired = authRequired;
exports.requireRole = requireRole;
exports.isAdmin = isAdmin;
const jwt = __importStar(require("jsonwebtoken"));
const COOKIE = process.env.COOKIE_NAME || "token";
const SECRET = process.env.JWT_SECRET || "devsecret";
/** Lấy token từ Cookie hoặc Authorization: Bearer <token> */
function extractToken(req) {
    var _a;
    const fromCookie = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[COOKIE];
    if (fromCookie)
        return String(fromCookie);
    const auth = req.headers.authorization;
    if (auth === null || auth === void 0 ? void 0 : auth.startsWith("Bearer "))
        return auth.slice(7);
    return null;
}
/** Bắt buộc đăng nhập: không có/không hợp lệ → 401 */
function authRequired(req, res, next) {
    const raw = extractToken(req);
    if (!raw)
        return res.status(401).json({ message: "Unauthenticated" });
    try {
        const payload = jwt.verify(raw, SECRET);
        req.user = payload;
        return next();
    }
    catch (_a) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
/** Chặn theo role: nếu role không nằm trong danh sách → 403 */
function requireRole(...roles) {
    return (req, res, next) => {
        var _a;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (!role)
            return res.status(401).json({ message: "Unauthenticated" });
        if (!roles.includes(role)) {
            return res.status(403).json({ message: "Permission denied" });
        }
        return next();
    };
}
/** Helper (tuỳ chọn) */
function isAdmin(req) {
    var _a;
    return ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "ADMIN";
}
