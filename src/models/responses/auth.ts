import { Session } from "../entities/session";
import { User } from "../entities/user";

export type SignupResponse = { session: Session; user: User };

export type SigninReponse = { session: Session; user: User };
