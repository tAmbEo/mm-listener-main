import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface whitelist_eventsAttributes {
  id?: number;
  address?: string;
  tx_hash?: string;
  amount?: number;
  amount_mtm?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: "whitelist_events", timestamps: false })
export class whitelist_events
  extends Model<whitelist_eventsAttributes, whitelist_eventsAttributes>
  implements whitelist_eventsAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id?: number;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  address?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  tx_hash?: string;

  @Column({ allowNull: true, type: DataType.BIGINT })
  amount?: number;

  @Column({ allowNull: true, type: DataType.BIGINT })
  amount_mtm?: number;

  @Column({ allowNull: true, type: DataType.DATE })
  createdAt?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  updatedAt?: Date;
}
