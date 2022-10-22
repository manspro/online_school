import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {getMongoConfig} from "./congigs/mongo.config";
import {RMQModule} from "nestjs-rmq";
import {getRMQConfig} from "./congigs/rmq.config";

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true, envFilePath: 'envs/.account.env'}),
    RMQModule.forRootAsync(getRMQConfig()),
    UserModule,
    AuthModule,
    MongooseModule.forRootAsync(getMongoConfig())

  ],
})
export class AppModule {}
