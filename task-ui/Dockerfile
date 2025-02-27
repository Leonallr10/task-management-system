# Stage 1: Build the frontend using Node
FROM node:18-alpine as build
WORKDIR /app
# Copy package files and install dependencies
COPY package*.json ./
RUN npm install
# Copy the rest of the source code
COPY . .
# Build the frontend (adjust the command if using a different build tool)
RUN npm run build

# Stage 2: Serve the built frontend with Nginx
FROM nginx:alpine
# Remove default Nginx content
RUN rm -rf /usr/share/nginx/html/*
# Copy build output from the previous stage to Nginx's static directory
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
