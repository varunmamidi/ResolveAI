
import {
  DataTypes,
  Model,
  Optional
} from "sequelize";

import { sequelize } from "../config/database";

export enum UserRole {
  ADMIN = "ADMIN",
  AGENT = "AGENT",
  CUSTOMER = "CUSTOMER"
}

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "role"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {

  declare id: number;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare role: UserRole;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },

    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.CUSTOMER
    }
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true
  }
);
