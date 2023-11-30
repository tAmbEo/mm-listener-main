import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface transfer_item_logsAttributes {
  id?: number;
  contract?: string;
  from?: string;
  to?: string;
  token_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: "transfer_item_logs", timestamps: false })
export class transfer_item_logs
  extends Model<transfer_item_logsAttributes, transfer_item_logsAttributes>
  implements transfer_item_logsAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id?: number;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  contract?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  from?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  to?: string;

  @Column({ allowNull: true, type: DataType.BIGINT })
  token_id?: number;

  @Column({ allowNull: true, type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  updatedAt?: Date;
}
