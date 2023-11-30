import { Injectable,Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { orders } from "src/models/orders";

// import { QueryTypes } from "sequelize/types";

@Injectable()
export class OrdersService {
  // private readonly logger = new Logger(DBService.name);
  constructor(

    @InjectModel(orders)
    private orderModel: typeof orders,
    private sequelize: Sequelize
  ) {

  }

  async createOrder(request: any) {
    await this.orderModel.create(request);
  }

  async takeOrder({ order_id, nft_token, seller, buyer, qty, remain_qty, total_price, total_fee, tx_hash, exec_sc }) {
    await this.sequelize.query('call sp_market_take_order(:order_id,:nft_token, :buyer, :seller, :qty , :remain_qty, :total_price, :total_fee, :tx_hash,:exec_sc)', {
      replacements: {
        order_id, nft_token, seller, buyer, qty, remain_qty, total_price, total_fee, tx_hash, exec_sc
      },
      type:'SELECT'
    })
  }

  async cancelOrder({ order_id, exec_sc, tx_hash }) {
    await this.sequelize.query('call sp_market_cancel_order(:order_id,:exec_sc)', {
      replacements: {
        order_id, exec_sc
      },
      type:'SELECT'
    })
  }


}