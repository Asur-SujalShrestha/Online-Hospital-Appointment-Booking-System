FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/ConfigurationService.jar app.jar
EXPOSE 8090
ENTRYPOINT ["java", "-jar", "app.jar"]