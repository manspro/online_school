import {IUser, UserRole} from "../../../../../../libs/interfaces/src/lib/user.interface";
import {compare, genSalt, hash} from "bcryptjs";

export class UserEntity implements IUser {
  _id: string;
  displayName: string;
  email: string;
  passwordHash: string;
  role: UserRole;

  constructor(user :IUser) {
    this._id = user._id;
    this.passwordHash = user.passwordHash;
    this.displayName = user.displayName;
    this.email = user.email;
    this.role = user.role
  }

  async setPassword(password:string){
    const salt = await genSalt(10)
    this.passwordHash = await hash(password, salt)
    return this
  }

  validatePassword(password:string){
    return compare(password, this.passwordHash)
  }
}
