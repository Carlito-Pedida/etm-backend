import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from "sequelize";
import { User } from "../models/user";
import { QakReply } from "./qakReply";
export class Qak extends Model<
  InferAttributes<Qak>,
  InferCreationAttributes<Qak>
> {
  declare qak_id: number;
  declare user_id: number;
  declare qak: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

export function QakFactory(sequelize: Sequelize) {
  Qak.init(
    {
      qak_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      qak: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      freezeTableName: true,
      tableName: "qaks",
      sequelize
    }
  );
}

export function AssociateUserQak() {
  User.hasMany(Qak, { foreignKey: "user_id" });
  Qak.belongsTo(User, { foreignKey: "user_id" });
  Qak.hasMany(QakReply, { foreignKey: "qak_id" });
}
