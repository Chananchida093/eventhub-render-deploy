# Build the Vite frontend first.
FROM node:22-alpine AS frontend-build
WORKDIR /workspace/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Build the Spring Boot application and bundle the frontend into its static resources.
FROM maven:3.9-eclipse-temurin-21 AS backend-build
WORKDIR /workspace

COPY backend/ ./backend/
COPY --from=frontend-build /workspace/frontend/dist/ ./backend/src/main/resources/static/

WORKDIR /workspace/backend
RUN mvn -DskipTests package

# Small runtime image. Render provides PORT; keep 8080 as the local default.
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend-build /workspace/backend/target/eventhub-0.0.1-SNAPSHOT.jar app.jar

ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75"
CMD ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
