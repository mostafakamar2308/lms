import { IError } from "@/types";
import { NextResponse } from "next/server";
const error = (code: IError.ApiErrorCode, message: string, status: number) =>
  NextResponse.json({ message, code }, { status });

export const apiError = error;

export const forbidden = () =>
  error(IError.ApiErrorCode.ForbiddenRequest, "Unauthorized access", 401);

export const bad = () =>
  error(IError.ApiErrorCode.BadRequest, "Bad request", 400);

export const empty = () =>
  error(IError.ApiErrorCode.EmptyRequest, "Empty request", 400);
export const internalError = () =>
  error(IError.ApiErrorCode.InternalError, "Internal Server Error", 500);

export const passwordMisMatch = () =>
  error(
    IError.ApiErrorCode.PasswordMisMatch,
    "password and confirm password are not the same",
    400
  );

export const userNotFound = () =>
  error(
    IError.ApiErrorCode.UserNotFound,
    "No user was found with this email",
    404
  );
export const userAlreadyExists = () =>
  error(
    IError.ApiErrorCode.UserAlreadyExists,
    "User with this email already exists",
    400
  );
export const wrongPassword = () =>
  error(IError.ApiErrorCode.WrongPassword, "password is incorrect", 400);
