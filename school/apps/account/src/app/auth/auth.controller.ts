import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {
  }


  @Post('register')
  async register (@Body() dto: RegisterDto){
  return this.authService.register(dto)
  }

  @Post('login')
  async login (@Body() { email, password } : LoginDto) {
    const { id } = await this.authService.validateUser(email, password)
  }
}

export class RegisterDto{
  displayName: string;
  email: string;
  password:string;
}

export class LoginDto{
  email: string;
  password:string;
}
