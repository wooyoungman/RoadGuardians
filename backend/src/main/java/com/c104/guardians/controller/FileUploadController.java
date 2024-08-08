package com.c104.guardians.controller;

import com.c104.guardians.entity.Overload;
import com.c104.guardians.entity.Pothole;
import com.c104.guardians.repository.OverloadRepository;
import com.c104.guardians.repository.PotholeRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.cloud.StorageClient;
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

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

import com.c104.guardians.websocket.WebSocketHandler;

import javax.swing.text.html.parser.Entity;


@RestController
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
    public ResponseEntity<?> addPotholeWithImage(
            @RequestParam("image") MultipartFile image,
            @RequestParam("data") String data
    ) {

        ObjectMapper objectMapper = new ObjectMapper();

        JsonNode jsonNode;
        try {
            jsonNode = objectMapper.readTree(data);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }


        double x = jsonNode.get("x").asDouble();
        double y = jsonNode.get("y").asDouble();


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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("fail image upload");
        }

        Pothole newPothole = new Pothole();
        newPothole.setLocation(location);
        newPothole.setImageUrl(baseUrl + "/pothole%2F" + imageName + "?alt=media" );
        newPothole.setConfirm(false);

//        potholeRepository.save(newPothole);
        try {
            potholeRepository.save(newPothole);
            System.out.println("포트홀 업로드 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("fail pothole save");
        }


        // 웹소켓 ; 새로운 마커 추가
        webSocketHandler.sendMessageToClients("newMarker");
        System.out.println("추가된 마커 알림");

        return ResponseEntity.ok().build();
    }

    @PostMapping("/overload")
    public ResponseEntity<?> addOverloadWithImage(
            @RequestParam("image") MultipartFile image,
            @RequestParam("data") String data
    ) {
        ObjectMapper objectMapper = new ObjectMapper();

        JsonNode jsonNode;
        try {
            jsonNode = objectMapper.readTree(data);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }


        double x = jsonNode.get("x").asDouble();
        double y = jsonNode.get("y").asDouble();


        Point location = new GeometryFactory().createPoint(new Coordinate(x, y));

        LocalDateTime now = LocalDateTime.now();
        String imageName =
                now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                        + "-" + UUID.randomUUID().toString().substring(0, 7) + ".jpg";


        try {
            storageClient.bucket().create("overload" + "/" + imageName, image.getInputStream(), image.getContentType());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("fail image upload");
        }


        Overload newOverload = new Overload();
            newOverload.setLocation(location);
            newOverload.setImageUrl(baseUrl + "/overload%2F" + imageName + "?alt=media" );
            newOverload.setType("과적");
            newOverload.setCarNumber(jsonNode.get("carNumber").asText());
            newOverload.setConfirm(false);


//        overloadRepository.save(newOverload);
            try {
                overloadRepository.save(newOverload);
                System.out.println("과적 차량 업로드 완료");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("fail overload save");
            }

            return ResponseEntity.ok().build();
        }



}

