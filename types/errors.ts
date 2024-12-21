export enum ApiErrorCode {
  ForbiddenRequest = "forbidden-request",
  BadRequest = "bad-request",
  EmptyRequest = "empty-request",
  PasswordMisMatch = "password-mismatch",
  UserNotFound = "user-not-found",
  UserAlreadyExists = "user-already-exists",
  WrongPassword = "wrong-password",
  InternalError = "internal-error",
  MultipleDevices = "multiple-devices",
  InvalidToken = "invalid-token",
}
