import { IsString} from "class-validator";
import {IUser, IUserCourses} from "@school/interfaces";

export namespace AccountUserCourses {
  export const topic = 'account.user-courses.command'

  export class Request {
    @IsString()
    id: string;

  }

  export class Response {
    courses: IUserCourses[]
  }
}
