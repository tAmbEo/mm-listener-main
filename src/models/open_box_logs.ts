import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface open_box_logsAttributes {
  tx_hash: string;
  address?: string;
  proof?: string;
  type?: string;
  claimed?: number;
  none?: string;
  rarity?: string;
  signature?: string;
}

@Table({ tableName: "open_box_logs", timestamps: false })
export class open_box_logs
  extends Model<open_box_logsAttributes, open_box_logsAttributes>
  implements open_box_logsAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(255) })
  tx_hash!: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  address?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  proof?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  type?: string;

  @Column({ allowNull: true, type: DataType.TINYINT })
  claimed?: number;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  none?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  rarity?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  signature?: string;
}
