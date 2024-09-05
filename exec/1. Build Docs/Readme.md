# React Dockerfile 및 nginx.config

```
# react Dockerfile
FROM node:16 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```
---

# nginx.config

```
server {
    listen 80;

    server_name _;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```
---

# spring boot dockerfile
```
FROM openjdk:17
COPY build/libs/backend-0.0.1-SNAPSHOT.jar app.jar
COPY serviceAccountKey.json /app/serviceAccountKey.json
ENV TZ Asia/Seoul
ENTRYPOINT ["java","-jar","/app.jar"]
```
---

# FIREBASE serviceAccountKey.json
```
### 보안 상의 이유로 삭제합니다.
```
---

```
### DB 접속 정보
계정 : c104
비밀번호 : souffle1903
```
---

# application.properties
```
spring.application.name=guardians

SPRING_DATASOURCE_URL = jdbc:mysql://i11c104.p.ssafy.io:3306/c104DB
SPRING_DATASOURCE_USERNAME=c104
SPRING_DATASOURCE_PASSWORD=souffle1903

logging.level.org.springframework=debug
logging.level.org.springframework.web=debug

jwt.security.key=aVeryLongAndSecureKeyThatShouldBe32BytesLong!

spring.jackson.deserialization.adjust-dates-to-context-time-zone=false
spring.jackson.time-zone=Asia/Seoul

spring.servlet.multipart.max-file-size=3GB
spring.servlet.multipart.max-request-size=3GB
```
---

# application.yml
```
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect

app:
  firebase-configuration-file: ./serviceAccountKey.json
  firebase-bucket: c104-10f5a.appspot.com
```
