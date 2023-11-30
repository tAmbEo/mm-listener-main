import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface buy_egg_logsAttributes {
  id?: number;
  address?: string;
  price?: string;
  tx_hash: string;
  block?: number;
  amount?: number;
}

@Table({ tableName: "buy_egg_logs", timestamps: false })
export class buy_egg_logs
  extends Model<buy_egg_logsAttributes, buy_egg_logsAttributes>
  implements buy_egg_logsAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id?: number;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  address?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  price?: string;

  @Column({ type: DataType.STRING(255) })
  tx_hash!: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  block?: number;

  @Column({ allowNull: true, type: DataType.INTEGER })
  amount?: number;
}
