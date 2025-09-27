import { User } from "../entities/user";

export type SignupResponse = { user: User };

export type SigninReponse = { user: User };

export type SignoutResponse = string;
