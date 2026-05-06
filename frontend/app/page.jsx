"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem
} from "@mui/material";

export default function Home() {

  const [notifications, setNotifications] = useState([
  {
    ID: "1",
    Type: "Placement",
    Message: "Microsoft hiring for SDE roles",
    Timestamp: "2026-05-06 10:00:00"
  },
  {
    ID: "2",
    Type: "Result",
    Message: "Mid-semester results published",
    Timestamp: "2026-05-06 09:30:00"
  },
  {
    ID: "3",
    Type: "Event",
    Message: "Tech Fest registrations open",
    Timestamp: "2026-05-06 08:00:00"
  }
]);
  const [filter, setFilter] = useState("All");

  const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhbS5zYy51NGNzZTIzMTUzQGFtLnN0dWRlbnRzLmFtcml0YS5lZHUiLCJleHAiOjE3NzgwNjQzMjIsImlhdCI6MTc3ODA2MzQyMiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjAzNDA0ZmRjLWE0NTktNDI5MC05OGJmLTkxNWM4ZGJmYmQ4NyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InNpbGxhIHNhaSBzYW1heSIsInN1YiI6ImU0YjY0NTk4LWY3MGItNDIwNy04ZjY5LWI5YWM2YjA5NTJmMSJ9LCJlbWFpbCI6ImFtLnNjLnU0Y3NlMjMxNTNAYW0uc3R1ZGVudHMuYW1yaXRhLmVkdSIsIm5hbWUiOiJzaWxsYSBzYWkgc2FtYXkiLCJyb2xsTm8iOiJhbS5zYy51NGNzZTIzMTUzIiwiYWNjZXNzQ29kZSI6IlBUQk1tUSIsImNsaWVudElEIjoiZTRiNjQ1OTgtZjcwYi00MjA3LThmNjktYjlhYzZiMDk1MmYxIiwiY2xpZW50U2VjcmV0IjoiWkh1SGhYblBSQXVOWllLbiJ9._vUGCBB1IOelo6wFRW-pYW2ruJpqKGKdctldTaEgNSM";



  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter(
          (item) => item.Type === filter
        );

  return (

    <Container sx={{ marginTop: 4 }}>

      <Typography
        variant="h4"
        gutterBottom
      >
        Campus Notifications
      </Typography>

      <Select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ marginBottom: 3, minWidth: 200 }}
      >

        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Placement">Placement</MenuItem>
        <MenuItem value="Result">Result</MenuItem>
        <MenuItem value="Event">Event</MenuItem>

      </Select>

      <Grid container spacing={2}>

        {filteredNotifications.map((notification) => (

          <Grid size={{ xs: 12, md: 6 }} key={notification.ID}>

            <Card
  sx={{
    backgroundColor:
      notification.Type === "Placement"
        ? "#e3f2fd"
        : "#ffffff"
  }}
>

              <CardContent>

                <Typography variant="h6">
                  {notification.Type}
                </Typography>

                <Typography>
                  {notification.Message}
                </Typography>

                <Typography variant="body2">
                  {notification.Timestamp}
                </Typography>

              </CardContent>

            </Card>

          </Grid>

        ))}

      </Grid>

    </Container>

  );

}