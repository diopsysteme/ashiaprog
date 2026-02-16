import { HttpStatus } from '@nestjs/common';

export const ErrorCode = {
  BAD_REQUEST: { status: HttpStatus.BAD_REQUEST, message: 'Invalid request' },
  INVALID_PHONE_NUMBER: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Invalid phone number format',
  },
  INVALID_OTP: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Invalid OTP format',
  },
  INVALID_PIN: { status: HttpStatus.BAD_REQUEST, message: 'Invalid PIN' },
  MISSING_REQUIRED_HEADER: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Missing required header',
  },
  VALIDATION_ERROR: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Validation failed',
  },

  UNAUTHORIZED: { status: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' },
  INVALID_TOKEN: { status: HttpStatus.UNAUTHORIZED, message: 'Invalid token' },
  TOKEN_EXPIRED: { status: HttpStatus.UNAUTHORIZED, message: 'Token expired' },

  FORBIDDEN: { status: HttpStatus.FORBIDDEN, message: 'Access denied' },

  USER_NOT_FOUND: { status: HttpStatus.NOT_FOUND, message: 'User not found' },

  CONFLICT: { status: HttpStatus.CONFLICT, message: 'Conflict' },
  PHONE_ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: 'Phone number already registered',
  },

  INTERNAL_ERROR: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
  },
} as const;

export type ErrorCodeKey = keyof typeof ErrorCode;
