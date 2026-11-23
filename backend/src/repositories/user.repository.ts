
import { User } from "../models";

export class UserRepository {
  static async findByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  static async findById(id: number) {
    return User.findByPk(id);
  }

  static async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    return User.create(data);
  }
}
