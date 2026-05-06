# Stage 1
## REST API Endpoints
### Get All Notifications
GET /notifications
### Get Unread Notifications
GET /notifications/unread
### Mark Notification As Read
PATCH /notifications/:id/read
### Send Notification
POST /notifications
## Real-Time Notification Mechanism
Socket.IO/WebSockets will be used for real-time notification delivery.