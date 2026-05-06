const axios = require("axios");
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhbS5zYy51NGNzZTIzMTUzQGFtLnN0dWRlbnRzLmFtcml0YS5lZHUiLCJleHAiOjE3NzgwNjQzMjIsImlhdCI6MTc3ODA2MzQyMiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjAzNDA0ZmRjLWE0NTktNDI5MC05OGJmLTkxNWM4ZGJmYmQ4NyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InNpbGxhIHNhaSBzYW1heSIsInN1YiI6ImU0YjY0NTk4LWY3MGItNDIwNy04ZjY5LWI5YWM2YjA5NTJmMSJ9LCJlbWFpbCI6ImFtLnNjLnU0Y3NlMjMxNTNAYW0uc3R1ZGVudHMuYW1yaXRhLmVkdSIsIm5hbWUiOiJzaWxsYSBzYWkgc2FtYXkiLCJyb2xsTm8iOiJhbS5zYy51NGNzZTIzMTUzIiwiYWNjZXNzQ29kZSI6IlBUQk1tUSIsImNsaWVudElEIjoiZTRiNjQ1OTgtZjcwYi00MjA3LThmNjktYjlhYzZiMDk1MmYxIiwiY2xpZW50U2VjcmV0IjoiWkh1SGhYblBSQXVOWllLbiJ9._vUGCBB1IOelo6wFRW-pYW2ruJpqKGKdctldTaEgNSM";
const API = "http://20.207.122.201/evaluation-service/notifications";
const priorityWeights = {
  Placement: 3,
  Result: 2,
  Event: 1
};
async function fetchNotifications() {
  try {
    const response = await axios.get(API, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    const notifications = response.data.notifications;

    const rankedNotifications = notifications.map((notification) => {

      const priority =
        priorityWeights[notification.Type] || 0;

      const timestamp =
        new Date(notification.Timestamp).getTime();

      return {
        ...notification,
        score: priority * 1000000000 + timestamp
      };

    });

    rankedNotifications.sort((a, b) => b.score - a.score);

    const top10 = rankedNotifications.slice(0, 10);

    console.log("\nTop 10 Priority Notifications:\n");

    top10.forEach((notification, index) => {

      console.log(
        `${index + 1}. [${notification.Type}] ${notification.Message}`
      );

      console.log(
        `Timestamp: ${notification.Timestamp}\n`
      );

    });

  } catch (error) {

    console.error(
      "Error fetching notifications:",
      error.response?.data || error.message
    );

  }

}

fetchNotifications();