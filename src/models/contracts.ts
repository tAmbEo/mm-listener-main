import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface contractsAttributes {
  contract: string;
  type?: string;
}

@Table({ tableName: "contracts", timestamps: false })
export class contracts
  extends Model<contractsAttributes, contractsAttributes>
  implements contractsAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(255) })
  contract!: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  type?: string;
}
