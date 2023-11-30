import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface ordersAttributes {
  id?: number;
  item_type?: string;
  nft_token?: string;
  order_id?: number;
  token_id?: number;
  creator?: string;
  accepted_token?: string;
  qty?: number;
  target_price?: string;
  base_fee_percent?: string;
  priority_fee?: string;
  created_time?: number;
  is_selling?: number;
  state?: string;
  tx_hash?: string;
  createdAt?: Date;
  updatedAt?: Date;
  finishedAt?: Date;
  remain_qty?: number;
  expire_time?: number;
  exec_sc?: string;
}

@Table({ tableName: "orders", timestamps: false })
export class orders
  extends Model<ordersAttributes, ordersAttributes>
  implements ordersAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id?: number;

  @Column({
    allowNull: true,
    type: DataType.ENUM("EGG", "DARLING", "FASHION"),
    defaultValue: "DARLING",
  })
  item_type?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  nft_token?: string;

  @Column({ allowNull: true, type: DataType.BIGINT })
  order_id?: number;

  @Column({ allowNull: true, type: DataType.BIGINT })
  token_id?: number;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  creator?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  accepted_token?: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  qty?: number;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  target_price?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  base_fee_percent?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  priority_fee?: string;

  @Column({ allowNull: true, type: DataType.BIGINT })
  created_time?: number;

  @Column({ allowNull: true, type: DataType.TINYINT })
  is_selling?: number;

  @Column({
    allowNull: true,
    type: DataType.ENUM("PENDING", "FILLED", "PARTIAL_FILLED", "CANCEL"),
    defaultValue: "PENDING",
  })
  state?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  tx_hash?: string;

  @Column({ allowNull: true, type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  updatedAt?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  finishedAt?: Date;

  @Column({ allowNull: true, type: DataType.INTEGER })
  remain_qty?: number;

  @Column({ allowNull: true, type: DataType.BIGINT })
  expire_time?: number;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  exec_sc?: string;
}
