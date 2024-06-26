"use server";
import axios from "axios";

export async function LinkAccount(formData, displayName, userId, pictureUrl) {
  const studentId = formData.get("studentId");
  const email = formData.get("email");

  console.log("displayName:", displayName);
  console.log("studentId:", studentId);
  console.log("email:", email);
  console.log("userId:", userId);
  console.log("pictureUrl:", pictureUrl);

  const date = new Date();

  const optionsDate = {
    timeZone: "Asia/Bangkok",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const optionsTime = {
    timeZone: "Asia/Bangkok",
    hour: "numeric",
    minute: "numeric",
  };

  const formattedDate = date.toLocaleDateString("th-TH", optionsDate);
  const formattedTime = date.toLocaleTimeString("th-TH", optionsTime);

  const accessToken = process.env.LINE_ACCESS_TOKEN;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const message = {
    type: "flex",
    altText: "KUScore Linked Successful!",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "KUScore",
            weight: "bold",
            size: "sm",
          },
          {
            type: "text",
            text: "Linked Successful!",
            weight: "bold",
            size: "xl",
            margin: "md",
            color: "#1DB446",
          },
          {
            type: "separator",
            margin: "lg",
          },
          {
            type: "box",
            layout: "vertical",
            margin: "xl",
            contents: [
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "image",
                    url: `${pictureUrl}`,
                    aspectMode: "cover",
                  },
                ],
                width: "100px",
                height: "100px",
                cornerRadius: "100px",
              },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: `${displayName}`,
                    size: "sm",
                    color: "#555555",
                    margin: "sm",
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "ID",
                    weight: "bold",
                  },
                ],
                spacing: "sm",
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: `${studentId}`,
                    color: "#555555",
                    size: "sm",
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "Email",
                    weight: "bold",
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: `${email}`,
                    color: "#555555",
                    size: "sm",
                  },
                ],
              },
            ],
            alignItems: "center",
            spacing: "xs",
          },
          {
            type: "separator",
            margin: "md",
          },
          {
            type: "box",
            layout: "horizontal",
            margin: "md",
            contents: [
              {
                type: "text",
                text: `${formattedDate} / ${formattedTime} น.`,
                color: "#aaaaaa",
                size: "xs",
                align: "end",
              },
            ],
          },
        ],
      },
      styles: {
        footer: {
          separator: true,
        },
      },
    },
  };

  const body = {
    to: userId,
    messages: [message],
  };

  // try {
  //   const response = await axios.post(
  //     "https://api.line.me/v2/bot/message/push",
  //     body,
  //     { headers }
  //   );
  //   console.log("Message sent successfully:", response.data);
  //   return response.data;
  // } catch (error) {
  //   console.error("Error sending message:", error);
  //   throw error;
  // }
}
