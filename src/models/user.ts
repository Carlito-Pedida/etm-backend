import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from "sequelize";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare user_id: number;
  declare fullname: string;
  declare username: string;
  declare password: string;
  declare email: string;
  declare city: string;
  declare state: string;
  declare profilePicture: string | null;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}
export function UserFactory(sequelize: Sequelize) {
  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "compositeIndex"
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "compositeIndex"
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true
      },
      profilePicture: {
        type: DataTypes.STRING(255),
        allowNull: true // Allow null as the user may not have a profile picture
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
      tableName: "users",
      freezeTableName: true,
      sequelize
    }
  );
}
