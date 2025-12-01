import { User } from "../entities/user";

export type SignupResponse = string;

export type VerifyAccountResponse = string;

export type SigninResponse = { user: User };

export type SignoutResponse = string;

export type RecoverPasswordResponse = string;

export type ResetPasswordResponse = string;
