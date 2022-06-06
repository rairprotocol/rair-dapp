import { UserType } from "./ducks/users/sagas";

export type TUserResponse = {
    success: boolean;
    user: UserType | null;
   }

export type TAuthenticationType = {
    success: boolean;
    token: string;
}

export type TAuthGetChallengeResponse = {
    success: boolean;
    response: string;
}

export type TOnlySuccessResponse = {
    success: boolean;
}
