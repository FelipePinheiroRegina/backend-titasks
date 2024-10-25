// @types/express/index.d.ts
import { Request } from 'express'

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
      };
      file: {
        filename: string;
        path?: string;
        fieldname?: string;
        originalname?: string;
        encoding?: string;
        mimetype?: string;
        size?: number;
        destination?: string;
      };
    }
  }
}
