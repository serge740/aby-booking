import { Request } from 'express';
// employee.enums.ts
export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  TERMINATED = 'TERMINATED',
  RESIGNED = 'RESIGNED',
  PROBATION = 'PROBATION'
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED'
}

// experience.interface.ts
export interface Experience {
  description: string;
  end_date: Date;
  start_date: Date;
  company_name: string;
}




export interface RequestWithEmployee extends Request {
  employee: {
    id: string;
    role: string;
  };
}
