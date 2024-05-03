"use server";
import { query } from "@/../libs/database";

export async function getUser(userId) {
  const userSql = `SELECT * FROM users WHERE user_id = ?`;
  const userResult = await query(userSql, [userId]);

  if (userResult.length === 0) {
    throw new Error("User not found");
  }

  return userResult[0];
}
