"use server";
import { query } from "@/../libs/database";
import crypto from "crypto";

import { sendEmail } from "./sendEmail";

export async function linkAccount(studentId, email, profile) {
  // Enhanced Email Validation (replace with a more comprehensive regex if needed)
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format provided");
  }

  // Specific Student ID Validation (adjust regex for your format)
  const studentIdRegex = /b\d{10}/;
  if (!studentIdRegex.test(studentId)) {
    throw new Error("Invalid student ID format provided");
  }

  // Generate secure random confirmation token
  const confirmationToken = crypto.randomBytes(64).toString("hex");

  // Format for DATETIME column
  const current_time = new Date();
  const expireTime = new Date(current_time.getTime() + 60 * 60 * 1000); // Add 1 hour in milliseconds

  try {
    // Check for existing email before insertion
    const existingEmailSql = `SELECT * FROM users WHERE email = ?`;
    const existingEmailResult = await query(existingEmailSql, [email]);

    if (existingEmailResult.length > 0) {
      throw new Error("Email address already exists");
    }

    // Check for existing user_id before insertion
    const existingUserIdSql = `SELECT * FROM users WHERE user_id = ?`;
    const existingUserIdResult = await query(existingUserIdSql, [
      profile.userId,
    ]);

    if (existingUserIdResult.length > 0) {
      throw new Error("User ID already exists");
    }

    // Prepare separate parameterized queries (consider transactions for consistency)
    const userSql = `
      INSERT INTO users (user_id, display_name, picture_url, student_id, email)
      VALUES (?, ?, ?, ?, ?)
    `;
    const userData = [
      profile.userId,
      profile.displayName,
      profile.pictureUrl,
      studentId,
      email,
    ];

    const tokenSql = `
      INSERT INTO confirmation_tokens (user_id, token, expire_at)
      VALUES (?, ?, ?)
    `;
    const tokenData = [userData[0], confirmationToken, expireTime];

    // Execute the queries in sequence (assuming user insertion must succeed before creating the token)
    await query(userSql, userData);
    await query(tokenSql, tokenData);

    sendEmail(email, confirmationToken);

    return {
      success: true,
      message: "User account created successfully",
    };
  } catch (error) {
    console.error("Error linking account:", error);

    if (error.message.includes("Email address already exists")) {
      throw new Error("This email address is already registered");
    }
    if (error.message.includes("User ID already exists")) {
      throw new Error("This LINE ID is already registered");
    } else {
      throw new Error("Failed to create user account");
    }
  }
}
