import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const saveUploadedFile = (
    file: Express.Multer.File,
    baseDir: string,
) : {
  savedPath: string;
  originalName: string;
  mimeType: string;
  size: number;
} => {

    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');


    const rootBasePath = process.env.FILE_REPOSITORY_ROOT + baseDir

    fs.mkdirSync(rootBasePath, { recursive: true });

    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;
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
}

export const getMimeType = (filePath: string) => {
    const ext = path.extname(filePath).toLowerCase();

    switch (ext) {
        case '.png': return 'image/png';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.webp': return 'image/webp';
        case '.gif': return 'image/gif';
        default: return 'application/octet-stream';
    }
}