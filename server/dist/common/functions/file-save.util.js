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
exports.getMimeType = exports.saveUploadedFile = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const saveUploadedFile = (file, baseDir) => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const rootBasePath = process.env.FILE_REPOSITORY_ROOT + baseDir;
    fs.mkdirSync(rootBasePath, { recursive: true });
    const ext = path.extname(file.originalname);
    const fileName = `${(0, uuid_1.v4)()}${ext}`;
    const fullPath = path.join(rootBasePath, fileName);
    fs.writeFileSync(fullPath, file.buffer);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`File not saved: ${fullPath}`);
    }
    return {
        savedPath: fullPath.replace(/\\/g, '/'), // windows 대응
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
    };
};
exports.saveUploadedFile = saveUploadedFile;
const getMimeType = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.png': return 'image/png';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.webp': return 'image/webp';
        case '.gif': return 'image/gif';
        default: return 'application/octet-stream';
    }
};
exports.getMimeType = getMimeType;
//# sourceMappingURL=file-save.util.js.map