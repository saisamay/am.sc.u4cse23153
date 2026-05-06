# Stage 1
# REST API Endpoints
# Get All Notifications
GET /notifications
# Get Unread Notifications
GET /notifications/unread
# Mark Notification As Read
PATCH /notifications/:id/read
# Send Notification
POST /notifications
# Real-Time Notification Mechanism
Socket.IO/WebSockets will be used for real-time notification delivery.

# Stage 2
# Database Choice
PostgreSQL is recommended because it provides:
- ACID compliance
- strong relational integrity
- indexing support
- scalability
- efficient querying
# Database Schema
# sudents
Column,Type
id,BIGINT PRIMARY KEY
name,VARCHAR(100)
email,VARCHAR(100)
# notifications
Column,Type
id,UUID PRIMARY KEY
type,VARCHAR(20)
message,TEXT
createdAt,TIMESTAMP
# notification reads
Column,Type
student_id,BIGINT
notification_id,UUID
is_read,BOOLEAN
# Scaling Problems
As data grows:
- slow queries
- heavy indexing cost
- high DB load
- increased latency
# Solutions
- indexing
- pagination
- caching
- query optimization
- partitioning
# Sample Query
```sql
SELECT *
FROM notifications
ORDER BY createdAt DESC
LIMIT 20;
```


# Stage 3
## Query Analysis
```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```
## Problems With The Query
- `SELECT *` fetches all columns even when unnecessary
- no pagination or limit is used
- sorting large datasets is expensive
- missing indexes can cause full table scans
- performance degrades heavily with millions of records
## Optimized Query
```sql
SELECT id, message, createdAt
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC
LIMIT 50;
```
## Recommended Index
```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt DESC);
```
## Why This Is Better
- only required columns are fetched
- latest notifications are shown first
- limited number of rows reduces DB load
- indexing improves search and sorting speed
## Estimated Computational Cost
### Without Index
- Time Complexity: O(n)
- Full table scan over millions of rows
### With Index
- Time Complexity: approximately O(log n)
- Faster filtering and retrieval
## Should Indexes Be Added On Every Column?
No.
Adding indexes on every column is inefficient because:
- inserts and updates become slower
- indexes consume extra storage
- maintaining unnecessary indexes increases overhead
Indexes should only be created on frequently searched or sorted columns.
## Query To Find Students Who Received Placement Notifications In Last 7 Days
```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```