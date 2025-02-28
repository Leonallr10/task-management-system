# Kaiburr Java Backend - REST API

## Overview
This project implements a REST API for managing and executing shell commands as tasks within a Kubernetes pod. The API provides endpoints to create, search, delete, and execute tasks, storing execution history in MongoDB.

## Features
- **Create Tasks**: Add a new task with a unique ID, name, owner, and shell command.
- **Search Tasks**: Retrieve tasks by ID or name.
- **Execute Tasks**: Run shell commands and store execution results.
- **Delete Tasks**: Remove tasks from the database.
- **MongoDB Integration**: Store and retrieve tasks using MongoDB.

## Technologies Used
- Java (Spring Boot)
- MongoDB
- Docker (optional for deployment)
- Kubernetes (optional for deployment)

---

## API Endpoints
### 1. Get All Tasks
```http
GET /tasks
```
**Response:** Returns a list of all tasks stored in MongoDB.

### 2. Get Task by ID
```http
GET /tasks/{id}
```
**Response:** Returns the task with the given ID or `404 Not Found`.

### 3. Create a New Task
```http
PUT /tasks
```
**Request Body:**
```json
{
  "id": "123",
  "name": "Print Hello",
  "owner": "John Smith",
  "command": "echo Hello World!"
}
```
**Response:** Task created successfully.

### 4. Delete a Task
```http
DELETE /tasks/{id}
```
**Response:** `204 No Content` if successful, or `404 Not Found` if the task doesn't exist.

### 5. Find Tasks by Name
```http
GET /tasks/find?name=Hello
```
**Response:** Returns tasks containing the specified string in their name.

### 6. Execute a Task
```http
PUT /tasks/{id}/execute
```
**Response:**
```json
{
  "startTime": "2023-04-21 15:52:42.276Z",
  "endTime": "2023-04-21 15:52:43.276Z",
  "output": "Hello World again!"
}
```

---

## Database Schema
**Task Object:**
```json
{
  "id": "123",
  "name": "Print Hello",
  "owner": "John Smith",
  "command": "echo Hello World!",
  "taskExecutions": [
    {
      "startTime": "2023-04-21 15:51:42.276Z",
      "endTime": "2023-04-21 15:51:43.276Z",
      "output": "Hello World!"
    }
  ]
}
```

---

## Running the Application
### Prerequisites
- Java 17+
- MongoDB installed and running
- Maven installed

### Steps to Run
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd kaiburr-java-backend
   ```
2. Build and run the application:
   ```sh
   mvn spring-boot:run
   ```
3. The API will be available at `http://localhost:8080`.

### Running with Docker
1. Build the Docker image:
   ```sh
   docker build -t kaiburr-java-backend .
   ```
2. Run the container:
   ```sh
   docker run -p 8080:8080 kaiburr-java-backend
   ```

---

## Deployment with Kubernetes
1. Apply the Kubernetes deployment configuration:
   ```sh
   kubectl apply -f app.yaml
   ```
2. Expose the service:
   ```sh
   kubectl expose deployment kaiburr-java-backend --type=LoadBalancer --port=8080
   ```
3. Get the external IP:
   ```sh
   kubectl get services
   ```

---

## Testing with Postman or cURL
**Example: Create a Task using cURL**
```sh
curl -X PUT "http://localhost:8080/tasks" -H "Content-Type: application/json" -d '{
  "id": "123",
  "name": "Print Hello",
  "owner": "John Smith",
  "command": "echo Hello World!"
}'
```

**Example: Execute a Task using cURL**
```sh
curl -X PUT "http://localhost:8080/tasks/123/execute"
```

---

## Screenshots

## image for docker image :
![Image](https://github.com/user-attachments/assets/802ca390-4ed6-4465-91ca-ca98fe4e3aa4)
## GET : http://localhost:30080/tasks?id=123
![Image](https://github.com/user-attachments/assets/25a8179f-10ce-4c0a-9385-938fce998d77)
## PUT: http://localhost:30080/tasks
![Image](https://github.com/user-attachments/assets/883afbb0-4267-45a5-ad35-6f37ff5487c5)
## GET: http://localhost:30080/tasks?id=123
![Image](https://github.com/user-attachments/assets/31d24549-b11c-4491-9e36-6fa81d0f4a98)
## DELETE: http://localhost:30080/tasks/123
![Image](https://github.com/user-attachments/assets/d3de9252-be5a-4dfd-b6f9-72da3a06edc9)
