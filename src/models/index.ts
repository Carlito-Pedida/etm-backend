import { Sequelize } from "sequelize";
import { UserFactory } from "./user";
import { QakFactory, AssociateUserQak } from "./qak";
import { QakReplyFactory, AssociateUserQakReply } from "./qakReply";

const dbName = "empowerDB";
const username = "root";
const password = "Password1!";

const sequelize = new Sequelize(dbName, username, password, {
  host: "127.0.0.1",
  port: 3306,
  dialect: "mysql",
});

UserFactory(sequelize);
QakFactory(sequelize);
QakReplyFactory(sequelize);
AssociateUserQak();
AssociateUserQakReply();

export const db = sequelize;
