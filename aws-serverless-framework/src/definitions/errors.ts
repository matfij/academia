import { ValidationDetail } from "./dtos";

export class ValidationError extends Error {
  details: ValidationDetail[];

  constructor(message: string, details: ValidationDetail[]) {
    super(message);
    this.name = "ValidationError"; // matches SFN error type
    this.details = details;
  }
}
