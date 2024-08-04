FROM openjdk:17
COPY build/libs/backend-0.0.1-SNAPSHOT.jar app.jar
COPY serviceAccountKey.json /app/serviceAccountKey.json
ENTRYPOINT ["java","-jar","/app.jar"]