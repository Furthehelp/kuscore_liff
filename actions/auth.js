"use server";
import { query } from "@/../libs/database";

export async function auth(token) {
  try {
    const verificationResult = await verifyConfirmationToken(token);
    if (verificationResult.error) {
      throw new Error(verificationResult.error);
    }

    const email = verificationResult.email;
    await markAccountAsConfirmed(email);

    return { message: `${email} has been verified` };
  } catch (error) {
    console.error("Error verifying account:", error);
    if (error.message.includes("Invalid or expired confirmation token")) {
      throw new Error("Invalid or expired confirmation token");
    }
    throw new Error("An error occurred while confirming your account");
  }
}

export async function verifyConfirmationToken(token) {
  try {
    // Prevent SQL injection with parameterized queries
    const result = await query(
      "SELECT user_id FROM confirmation_tokens WHERE token = ? AND expire_at > NOW()",
      [token]
    );

    if (!result || result.length === 0) {
      throw new Error("Invalid or expired confirmation token");
    }

    const { user_id } = result[0];
    const email = await query("SELECT email FROM users WHERE user_id = ?", [
      user_id,
    ]);
    return { email: email[0].email };
  } catch (error) {
    throw new Error(error);
  }
}

export async function markAccountAsConfirmed(email) {
  try {
    // Prevent SQL injection with parameterized queries
    await query("UPDATE users SET is_verified = 1 WHERE email = ?", [email]);

    return { message: `${email} has been confirmed` };
  } catch (error) {
    throw new Error(error);
  }
}
