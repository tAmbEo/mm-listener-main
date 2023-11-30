import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface proofsAttributes {
  key: string;
  address: string;
  proof?: object;
  createdAt?: Date;
  updatedAt?: Date;
  amount?: string;
  index?: number;
  merkleRoot?: string;
}

@Table({ tableName: "proofs", timestamps: false })
export class proofs
  extends Model<proofsAttributes, proofsAttributes>
  implements proofsAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(255) })
  key!: string;

  @Column({ primaryKey: true, type: DataType.STRING(255) })
  address!: string;

  @Column({ allowNull: true, type: DataType.JSON })
  proof?: object;

  @Column({ allowNull: true, type: DataType.DATE })
  createdAt?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  updatedAt?: Date;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  amount?: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  index?: number;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  merkleRoot?: string;
}
