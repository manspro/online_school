import {InjectModel} from "@nestjs/mongoose";
import {User} from "../models/user.model";
import {Model} from "mongoose";
import {UserEntity} from "../entities/user.entity";

export class UserRepository{
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

    async createUser(user: UserEntity){
    const newUser = new this.userModel(user)
      return newUser.save()
    }

    async findUser(email:string){
    return this.userModel.findOne({email}).exec()
    }

    async findUserById(id: string){
    return this.userModel.findOne(id).exec()
    }

    async deleteUser(email:string){
     await this.userModel.deleteOne({email}).exec()
    }

}
