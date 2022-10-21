import {Injectable} from '@nestjs/common';
import {RegisterDto} from "./auth.controller";
import {UserRepository} from "../user/repositories/user.repository";
import {UserEntity} from "../user/entities/user.entity";
import {UserRole} from "../../../../../libs/interfaces/src/lib/user.interface";
import {User} from "../user/models/user.model";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {
  }

  async register({email, password, displayName}: RegisterDto) {
    const oldUser = this.userRepository.findUser(email)

    if (oldUser) {
      throw new Error('Такой пользователь уже существует')
    }
    const newUserEntity = await new UserEntity({
      displayName,
      email,
      passwordHash: '',
      role: UserRole.Student,
    }).setPassword(password);
    const newUser = await this.userRepository.createUser(newUserEntity)
    return {email: newUser.email}
  }

    async validateUser(email:string, password:string){
      const user = await this.userRepository.findUser(email)

      if(!user){
        throw new Error('Неверный логин или пароль')
      }
      const userEntity =  new UserEntity(user)
      const correctPassword = await userEntity.validatePassword(password)

      if(!correctPassword){
        throw new Error('Неверный логин или пароль')
      }
      return {id: user._id}
    }

    async login(id:string){
      return {
        access_token: this.jwtService.signAsync({id})
      }
    }
}
