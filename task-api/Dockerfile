# Use a base image with Java (you can adjust the version as needed)
FROM openjdk:11-jre-slim

# Set the working directory in the container
WORKDIR /app

# Copy the packaged JAR file into the image
COPY target/task-api-0.0.1-SNAPSHOT.jar /app/task-api.jar

# Expose port 8080 (for the Spring Boot app)
EXPOSE 8080
#RUN apt-get update && apt-get install -y iputils-ping netcat

# Run the JAR file when the container starts
ENTRYPOINT ["java", "-jar", "/app/task-api.jar"]
# Stage 1: Build the frontend
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the frontend with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
