import { IsString} from "class-validator";
import {IUser} from "@school/interfaces";

export namespace AccountUserInfo {
  export const topic = 'account.user-info.command'

  export class Request {
    @IsString()
    id: string;

  }

  export class Response {
    user: Omit<IUser, 'passwordHash'>
  }
}
