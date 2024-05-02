"use server";
import liff from "@line/liff";

export async function LinkAccount(formData) {
  const displayName = formData.get("displayName");
  const studentId = formData.get("studentId");
  const email = formData.get("email");
  await liff.sendMessages([
    {
      type: "text",
      text: `displayName: ${displayName}\nstudentId: ${studentId}\nemail: ${email}`,
    },
  ]);

  console.log(displayName, studentId, email);
}
