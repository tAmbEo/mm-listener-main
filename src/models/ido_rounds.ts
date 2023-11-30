import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface ido_roundsAttributes {
  key: string;
  tge?: number;
  start_time?: string;
  end_time?: string;
  createdAt?: Date;
  updatedAt?: Date;
  claims?: object;
  merkleRoot?: string;
}

@Table({ tableName: "ido_rounds", timestamps: false })
export class ido_rounds
  extends Model<ido_roundsAttributes, ido_roundsAttributes>
  implements ido_roundsAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(255) })
  key!: string;

  @Column({ allowNull: true, type: DataType.FLOAT(12) })
  tge?: number;

  @Column({ allowNull: true, type: DataType.DECIMAL(18) })
  start_time?: string;

  @Column({ allowNull: true, type: DataType.DECIMAL(18) })
  end_time?: string;

  @Column({ allowNull: true, type: DataType.DATE })
  createdAt?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  updatedAt?: Date;

  @Column({ allowNull: true, type: DataType.JSON })
  claims?: object;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  merkleRoot?: string;
}
