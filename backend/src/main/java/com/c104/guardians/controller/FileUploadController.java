package com.c104.guardians.controller;

import com.c104.guardians.entity.Overload;
import com.c104.guardians.entity.Pothole;
import com.c104.guardians.repository.OverloadRepository;
import com.c104.guardians.repository.PotholeRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.cloud.StorageClient;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

import com.c104.guardians.websocket.WebSocketHandler;


@RestController
@Slf4j
@RequestMapping("/api/v1/upload")
public class FileUploadController {

    @Autowired
    private WebSocketHandler webSocketHandler;
    @Autowired
    private PotholeRepository potholeRepository;
    @Autowired
    private OverloadRepository overloadRepository;
    @Autowired
    private StorageClient storageClient;

    private final String baseUrl = "https://firebasestorage.googleapis.com/v0/b/c104-10f5a.appspot.com/o";

    @PostMapping("/pothole")
    public ResponseEntity<?> uploadPotholeWithImage(
            @RequestParam("image") MultipartFile image,
            @RequestParam("data") String data
    ) {

        ObjectMapper objectMapper = new ObjectMapper();

        JsonNode jsonNode;
        double x;
        double y;
        try {
            jsonNode = objectMapper.readTree(data);
            x = jsonNode.get("x").asDouble();
            y = jsonNode.get("y").asDouble();
            log.info("OK data : pothole");
        } catch (JsonProcessingException e) {
            log.error("Fail data : pothole");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to get data");
        } catch (NullPointerException e) {
            log.error("Fail data key : pothole");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid data key");
        }


        Point location = new GeometryFactory().createPoint(new Coordinate(x, y));

        LocalDateTime now = LocalDateTime.now();
        String imageName =
                now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                        + "-" + UUID.randomUUID().toString().substring(0, 7) + ".jpg";

        List<Pothole> duplication = potholeRepository.checkDuplication(now.minusDays(7), location, 10);

        if (!duplication.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Same report within 10m recently");
        }


        try {
            storageClient.bucket().create("pothole" + "/" + imageName, image.getInputStream(), image.getContentType());
            log.info("OK image : pothole");
        } catch (Exception e) {
            log.error("Fail image : pothole");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
        }


        Pothole newPothole = new Pothole();
        newPothole.setLocation(location);
        newPothole.setImageUrl(baseUrl + "/pothole%2F" + imageName + "?alt=media" );
        newPothole.setConfirm(false);

//        potholeRepository.save(newPothole);
        try {
            potholeRepository.save(newPothole);
            log.info("OK DB save : pothole");
        } catch (Exception e) {
            log.error("Fail DB save : pothole");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to DB save");
        }


        // 웹소켓 ; 새로운 마커 추가
        try {
            webSocketHandler.sendMessageToClients("newDB");
            log.info("OK websocket : pothole");
        } catch (Exception e) {
            log.error("Fail WebSocket : pothole");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send message to websocket");
        }

        log.info("Successfully upload pothole");
        System.out.println();
        System.out.println();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/overload")
    public ResponseEntity<?> uploadOverloadWithImage(
            @RequestParam("image") MultipartFile image,
            @RequestParam("data") String data
    ) {
        ObjectMapper objectMapper = new ObjectMapper();

        JsonNode jsonNode;
        double x;
        double y;
        String carNumber;
        try {
            jsonNode = objectMapper.readTree(data);
            x = jsonNode.get("x").asDouble();
            y = jsonNode.get("y").asDouble();
            carNumber = jsonNode.get("carNumber").asText();
            log.info("OK data : overload");
        } catch (JsonProcessingException e) {
            log.error("Fail data : overload");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to get data");
        } catch (NullPointerException e) {
            log.error("Fail data key : overload");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid data key");
        }


        Point location = new GeometryFactory().createPoint(new Coordinate(x, y));

        LocalDateTime now = LocalDateTime.now();
        String imageName =
                now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                        + "-" + UUID.randomUUID().toString().substring(0, 7) + ".jpg";


        try {
            storageClient.bucket().create("overload" + "/" + imageName, image.getInputStream(), image.getContentType());
            log.info("OK  image : overload");
        } catch (Exception e) {
            log.error("Fail  image : overload");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
        }


        Overload newOverload = new Overload();
            newOverload.setLocation(location);
            newOverload.setImageUrl(baseUrl + "/overload%2F" + imageName + "?alt=media" );
            newOverload.setType("과적");
            newOverload.setCarNumber(carNumber);
            newOverload.setConfirm(false);


//        overloadRepository.save(newOverload);
            try {
                overloadRepository.save(newOverload);
                log.info("OK DB save : overload");
            } catch (Exception e) {
                log.error("Fail DB save : overload");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to DB save");
            }

        // websocket 웹소켓
        try {
            webSocketHandler.sendMessageToClients("newDB");
            log.info("OK websocket : overload");
        } catch (Exception e) {
            log.error("Fail WebSocket : overload");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send message to websocket");
        }

            log.info("Successfully upload overload");
            System.out.println();
            System.out.println();
            return ResponseEntity.ok().build();
        }



}

