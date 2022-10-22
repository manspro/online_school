import {Body, Controller} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AccountLogin} from "@school/contracts";
import {AccountRegister} from "../../../../../libs/contracts/src/lib/account/account.register";
import {RMQRoute, RMQValidate} from "nestjs-rmq";


@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {
  }

  @RMQValidate()
  @RMQRoute(AccountRegister.topic)
  async register (@Body() dto: AccountRegister.Request) : Promise<AccountRegister.Response>{
  return this.authService.register(dto)
  }
  
  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  async login (@Body() { email, password } : AccountLogin.Request)  {
    const { id } = await this.authService.validateUser(email, password)
    return this.authService.login(id)
  }
}


