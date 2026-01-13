/**
 * Custom error handling utilities
 */

export class APIClientError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = "APIClientError"
  }
}

export class PaymentError extends Error {
  constructor(
    public transactionId?: string,
    message = "Payment processing failed",
  ) {
    super(message)
    this.name = "PaymentError"
  }
}

export class ValidationError extends Error {
  constructor(
    public field: string,
    message: string,
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

export function isAPIClientError(error: unknown): error is APIClientError {
  return error instanceof APIClientError
}

export function isPaymentError(error: unknown): error is PaymentError {
  return error instanceof PaymentError
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "An unexpected error occurred"
}
