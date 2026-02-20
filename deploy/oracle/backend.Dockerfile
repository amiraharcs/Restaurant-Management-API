FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app

COPY backend/pom.xml ./backend/pom.xml
COPY backend/src ./backend/src

WORKDIR /app/backend
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=builder /app/backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
