import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from "sequelize";
import { Qak } from "../models/qak";
import { User } from "../models/user";

export class QakReply extends Model<
  InferAttributes<QakReply>,
  InferCreationAttributes<QakReply>
> {
  declare qakReply_id: number;
  declare qak_id: number;
  declare user_id: number;
  declare qakReply: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

export function QakReplyFactory(sequelize: Sequelize) {
  QakReply.init(
    {
      qakReply_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      qak_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      qakReply: {
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
      tableName: "qakReply",
      sequelize
    }
  );
}

export function AssociateUserQakReply() {
  QakReply.belongsTo(User, { foreignKey: "user_id" });
  QakReply.belongsTo(Qak, { foreignKey: "qak_id" });
  User.hasMany(QakReply, { foreignKey: "user_id" });
}
