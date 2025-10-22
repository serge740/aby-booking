import { Request } from 'express';

export interface RequestWithPurchasingUser extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    phoneNumber: string;
  };
}
