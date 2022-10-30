import {JwtModule, JwtModuleAsyncOptions, JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";


export const getJWTConfig = (): JwtModuleAsyncOptions =>({
  imports: [JwtModule],
  inject: [JwtService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET')
  })
})

