import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from "sequelize-typescript";

export interface claimable_nftsAttributes {
  id?: number;
  type?: string;
  nonce?: string;
  proof?: string;
  data?: object;
  claimed?: number;
  address?: string;
  tx_hash?: string;
}

@Table({ tableName: "claimable_nfts", timestamps: false })
export class claimable_nfts
  extends Model<claimable_nftsAttributes, claimable_nftsAttributes>
  implements claimable_nftsAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id?: number;

  @Column({
    allowNull: true,
    type: DataType.ENUM("EGG", "DARLING", "FASHION"),
    defaultValue: "EGG",
  })
  type?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  nonce?: string;

  @Column({ allowNull: true, type: DataType.STRING })
  proof?: string;

  @Column({ allowNull: true, type: DataType.JSON })
  data?: object;

  @Column({ type: DataType.TINYINT, defaultValue: "0" })
  claimed?: number;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  address?: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  tx_hash?: string;
}
