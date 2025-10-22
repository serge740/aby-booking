// src/types/express.d.ts
import { ClientPayload } from '../common/interfaces/client-payload.interface';

declare global {
  namespace Express {
    interface Request {
      client?: ClientPayload;
    }
  }
}
