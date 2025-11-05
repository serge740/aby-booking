import { Request } from 'express';

export interface RequestWithClient extends Request {
  client?: {
    id: string;
    role: string;
  };
}
