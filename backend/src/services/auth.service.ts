
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UserRepository } from "../repositories/user.repository";

export class AuthService {
  static async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const email = data.email.trim().toLowerCase();

    const existingUser =
      await UserRepository.findByEmail(email);

    if (existingUser) {
      throw Object.assign(
        new Error("Email already registered"),
        { statusCode: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(
      data.password,
      12
    );

    const user = await UserRepository.create({
      name: data.name.trim(),
      email,
      passwordHash
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  static async login(data: {
    email: string;
    password: string;
  }) {
    const email = data.email.trim().toLowerCase();

    const user =
      await UserRepository.findByEmail(email);

    if (!user) {
      throw Object.assign(
        new Error("Invalid email or password"),
        { statusCode: 401 }
      );
    }

    const isValid = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!isValid) {
      throw Object.assign(
        new Error("Invalid email or password"),
        { statusCode: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      { role: user.role },
      secret,
      {
        subject: String(user.id),
        expiresIn: 3600
      }
    );

    return {
      accessToken: token,
      tokenType: "Bearer",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}
