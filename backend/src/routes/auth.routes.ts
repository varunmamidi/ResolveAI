
import { Router, Response } from "express";

import { AuthController } from "../controllers/auth.controller";

import {
  authenticate,
  AuthRequest
} from "../middlewares/auth.middleware";

const router = Router();



/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new customer
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Test Customer
 *               email:
 *                 type: string
 *                 example: customer@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Email already registered
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and generate JWT
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: customer@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       401:
 *         description: Unauthorized
 */


router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.get(
  "/me",
  authenticate,
  (req: AuthRequest, res: Response) => {
    const user = req.user!;

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  }
);

export default router;
