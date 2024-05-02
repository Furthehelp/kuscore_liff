"use server";
import axios from "axios";

export async function LinkAccount(formData) {
  const displayName = formData.get("displayName");
  const studentId = formData.get("studentId");
  const email = formData.get("email");
  const userId = formData.get("userId");

  console.log(displayName, studentId, email, userId);

  const accessToken = process.env.LINE_ACCESS_TOKEN;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const message = `displayName: ${displayName}\nstudentId: ${studentId}\nemail: ${email}`;

  const body = {
    to: userId, // Replace LINE_USER_ID with the recipient's LINE user ID
    messages: [
      {
        type: "text",
        text: message,
      },
    ],
  };

  try {
    const response = await axios.post(
      "https://api.line.me/v2/bot/message/push",
      body,
      { headers }
    );
    console.log("Message sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
