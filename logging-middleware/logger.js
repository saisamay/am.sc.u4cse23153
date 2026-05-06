const axios = require("axios");
const {
  stacks,
  levels,
  packages
} = require("./constants");

const LOG_API = "http://20.207.122.201/evaluation-service/logs";
async function Log(stack, level, packageName, message) {

  try {
    if (!stacks.includes(stack)) {
      throw new Error("Stack value is invalid");
    }
    if (!levels.includes(level)) {
      throw new Error("Level value is invalid");
    }
    if (!packages.includes(packageName)) {
      throw new Error("Package value is invalid");
    }

    const requestBody = {
      stack,
      level,
      package: packageName,
      message
    };

    const response = await axios.post(
        LOG_API,
        requestBody,
        {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhbS5zYy51NGNzZTIzMTUzQGFtLnN0dWRlbnRzLmFtcml0YS5lZHUiLCJleHAiOjE3NzgwNjE4NzcsImlhdCI6MTc3ODA2MDk3NywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6Ijc3YmZkMTNmLWM2YWQtNGI0Yi05MWExLWQ2OWMxNzA0MzYxNSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InNpbGxhIHNhaSBzYW1heSIsInN1YiI6ImU0YjY0NTk4LWY3MGItNDIwNy04ZjY5LWI5YWM2YjA5NTJmMSJ9LCJlbWFpbCI6ImFtLnNjLnU0Y3NlMjMxNTNAYW0uc3R1ZGVudHMuYW1yaXRhLmVkdSIsIm5hbWUiOiJzaWxsYSBzYWkgc2FtYXkiLCJyb2xsTm8iOiJhbS5zYy51NGNzZTIzMTUzIiwiYWNjZXNzQ29kZSI6IlBUQk1tUSIsImNsaWVudElEIjoiZTRiNjQ1OTgtZjcwYi00MjA3LThmNjktYjlhYzZiMDk1MmYxIiwiY2xpZW50U2VjcmV0IjoiWkh1SGhYblBSQXVOWllLbiJ9.01u_0qQQLeHkHkXWRD4ZxhWXjepkMOY129iVjl0M9f8",
                "Content-Type": "application/json"
            }
        }
    );

    return response.data;

  } catch (error) {

    console.error(
      "Logging middleware error:",
        error.response ? error.response.data : error.message
    );

  }
}
module.exports = Log;