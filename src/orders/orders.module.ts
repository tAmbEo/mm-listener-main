
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { orders } from '../models';

import { OrdersService } from './orders.service';

@Module({
  imports: [SequelizeModule.forFeature([orders])],
  providers: [OrdersService]  
})
export class UsersModule {}