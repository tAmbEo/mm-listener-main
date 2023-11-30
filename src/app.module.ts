import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
const envModule = ConfigModule.forRoot({
  envFilePath: `.${process.env.NODE_ENV.trim()}.env`,
  isGlobal: true,
});


import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { BSCNetwork } from './contract/bscnetwork.service';
import { RedisService } from './redis.service';
import {  orders } from './models'
import { DBService } from './database.service';
import { OrdersService } from './orders/orders.service';


@Global()
@Module({
  imports: [
    envModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize :true,
      models:[orders]
    }),
    SequelizeModule.forFeature([orders])
  ],
  controllers: [
  ],
  providers: [
    BSCNetwork,
    RedisService,
    DBService
  ],
  exports: [RedisService],
})
export class AppModule { }
