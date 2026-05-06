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
# Query Analysis
```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```
# Problems With The Query
- `SELECT *` fetches all columns even when unnecessary
- no pagination or limit is used
- sorting large datasets is expensive
- missing indexes can cause full table scans
- performance degrades heavily with millions of records
# Optimized Query
```sql
SELECT id, message, createdAt
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC
LIMIT 50;
```
# Recommended Index
```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt DESC);
```
# Why This Is Better
- only required columns are fetched
- latest notifications are shown first
- limited number of rows reduces DB load
- indexing improves search and sorting speed
# Estimated Computational Cost
# Without Index
- Time Complexity: O(n)
- Full table scan over millions of rows
# With Index
- Time Complexity: approximately O(log n)
- Faster filtering and retrieval
# Should Indexes Be Added On Every Column?
No.
Adding indexes on every column is inefficient because:
- inserts and updates become slower
- indexes consume extra storage
- maintaining unnecessary indexes increases overhead
Indexes should only be created on frequently searched or sorted columns.
# Query To Find Students Who Received Placement Notifications In Last 7 Days
```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

# Stage 4
# Problem
Notifications are being fetched from the database on every page load for every student. This creates excessive database traffic and increases latency.
# Solutions To Improve Performance
# 1. Caching Using Redis
Frequently accessed notifications can be stored in Redis cache instead of repeatedly querying the database.
# Advantages
- reduces database load
- faster response time
- improves scalability
# Tradeoffs
- additional infrastructure required
- cache invalidation complexity
- extra memory usage
# 2. Pagination
Instead of loading all notifications, only a limited number should be fetched.
Example:
- 20 notifications per request
# Advantages
- smaller DB queries
- reduced network traffic
- faster frontend rendering
# Tradeoffs
- additional frontend pagination logic required
# 3. Real-Time Notifications Using WebSockets
Instead of repeatedly fetching notifications, the server can push notifications to users in real time using Socket.IO/WebSockets.
# Advantages
- reduces repeated API calls
- real-time user experience
- lower unnecessary DB traffic
# Tradeoffs
- more complex backend implementation
- maintaining persistent socket connections increases server memory usage
# 4. Database Indexing
Indexes should be created on frequently searched columns.
Example:
- studentID
- isRead
- createdAt
# Advantages
- faster query execution
# Tradeoffs
- slower inserts and updates
- additional storage overhead
# 5. Lazy Loading
Notifications can be loaded only when the user scrolls or requests more data.
# Advantages
- reduced initial load time
- improved user experience
# Tradeoffs
- slightly more frontend complexity

# Stage 5
# Problems With Current Implementation
```python
function notify_all(student_ids: array, message: string):
    for student_id in student_ids:
        send_email(student_id, message)
        save_to_db(student_id, message)
        push_to_app(student_id, message)
```
# Issues
- synchronous execution is slow
- one failure can interrupt the process
- email API failures are not retried
- database and notification operations are tightly coupled
- poor scalability for 50,000 students
- high response time
- no fault tolerance
# What Happens If send_email Fails For 200 Students?

Those students will not receive notifications.

Without retry mechanisms:
- notifications may be permanently lost
- system reliability decreases
# Improved Solution
A queue-based asynchronous architecture should be used.
Technologies:
- RabbitMQ
- Kafka
- BullMQ
# Revised Architecture
1. Save notification data to database
2. Push notification jobs into message queue
3. Worker services process jobs asynchronously
4. Failed jobs are retried automatically
5. Dead-letter queue stores permanently failed job
# Revised Pseudocode
```python
function notify_all(student_ids, message):
    notification_id = save_notification(message)
    for student_id in student_ids:
        add_to_queue({
            student_id,
            notification_id,
            message
        })

worker_process():
    while queue_not_empty():
        job = get_next_job()
        try:
            send_email(job.student_id, job.message)
            push_to_app(job.student_id, job.message)
            mark_success(job)
        except Exception:
            retry_job(job)
```
# Should Database Save And Email Sending Happen Together?
No.
# Reason
Saving notification data and sending emails should be separated.
# Why?
- database operations should remain reliable
- email APIs may fail or become slow
- asynchronous processing improves scalability
- failures can be retried independently
- prevents blocking the main request flow


```md
# Stage 6

## Approach

The notifications are fetched from the given Notification API and ranked based on two factors:

1. Notification priority type
2. Recency of the notification

The priority order used is:

- Placement notifications have the highest priority
- Result notifications have medium priority
- Event notifications have the lowest priority

Each notification is assigned a score by combining its priority weight and timestamp value. The notifications are then sorted in descending order based on this score, and the top 10 notifications are displayed to the user.

---

## Logic Used

A weight value is assigned to every notification type:

- Placement → 3
- Result → 2
- Event → 1

The timestamp is also considered so that newer notifications appear before older ones when priorities are similar.

After calculating scores for all notifications:
- notifications are sorted
- the top 10 highest ranked notifications are selected

---

## Time Complexity

### Sorting Notifications
O(n log n)

### Fetching Top 10 Notifications
O(10)

---

## Efficient Maintenance Of Top 10 Notifications

Since new notifications may continue to arrive continuously, maintaining and sorting the complete dataset repeatedly is inefficient.

A better approach would be to use a Min Heap or Priority Queue of size 10.

### Advantages

- faster insertion of new notifications
- avoids sorting the entire dataset every time
- memory efficient
- scalable for large notification streams

This approach is more suitable for real-time systems where notifications are generated frequently.
```
