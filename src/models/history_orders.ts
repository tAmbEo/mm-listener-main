import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface history_ordersAttributes {
  id?: number;
  order_id?: number;
  type?: string;
  buyer?: string;
  seller?: string;
  accepted_token?: string;
  nft_token?: string;
  token_id?: number;
  filled_qty?: number;
  total_price?: string;
  createdAt?: Date;
  finished_time?: Date;
  total_fee?: string;
  priority_fee?: string;
  tx_hash?: string;
}

@Table({ tableName: "history_orders", timestamps: false })
export class history_orders
  extends Model<history_ordersAttributes, history_ordersAttributes>
  implements history_ordersAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id?: number;

  @Column({ allowNull: true, type: DataType.BIGINT })
  order_id?: number;

  @Column({ allowNull: true, type: DataType.ENUM("EGG", "DARLING", "FASHION") })
  type?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  buyer?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  seller?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  accepted_token?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  nft_token?: string;

  @Column({ allowNull: true, type: DataType.BIGINT })
  token_id?: number;

  @Column({ allowNull: true, type: DataType.INTEGER })
  filled_qty?: number;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  total_price?: string;

  @Column({ allowNull: true, type: DataType.DATE })
  createdAt?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  finished_time?: Date;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  total_fee?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  priority_fee?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  tx_hash?: string;
}
