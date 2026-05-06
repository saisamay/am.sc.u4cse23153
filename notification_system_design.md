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

# Stage 2
## Database Choice
PostgreSQL is recommended because it provides:
- ACID compliance
- strong relational integrity
- indexing support
- scalability
- efficient querying
## Database Schema
### sudents
| Column | Type |
|---|---|
| id | BIGINT PRIMARY KEY |
| name | VARCHAR(100) |
| email | VARCHAR(100) |
### notifications
| Column | Type |
|---|---|
| id | UUID PRIMARY KEY |
| type | VARCHAR(20) |
| message | TEXT |
| createdAt | TIMESTAMP |
### notification reads
| Column | Type |
|---|---|
| student_id | BIGINT |
| notification_id | UUID |
| is_read | BOOLEAN |
## Scaling Problems
As data grows:
- slow queries
- heavy indexing cost
- high DB load
- increased latency
## Solutions
- indexing
- pagination
- caching
- query optimization
- partitioning
## Sample Query
```sql
SELECT *
FROM notifications
ORDER BY createdAt DESC
LIMIT 20;