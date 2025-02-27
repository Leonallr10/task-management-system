# Use a base image with Java
FROM openjdk:11-jre-slim

# Set the working directory in the container
WORKDIR /app

# Copy the packaged JAR file into the image
COPY target/task-api-0.0.1-SNAPSHOT.jar /app/task-api.jar

# Expose port 8080 (for the Spring Boot app)
EXPOSE 8080

# Run the JAR file when the container starts
ENTRYPOINT ["java", "-jar", "/app/task-api.jar"]
