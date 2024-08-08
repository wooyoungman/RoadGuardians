package com.c104.guardians.controller;

import com.c104.guardians.entity.Overload;
import com.c104.guardians.entity.Pothole;
import com.c104.guardians.repository.OverloadRepository;
import com.c104.guardians.repository.PotholeRepository;
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
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/v1/upload")
public class FileUploadController {

    @Autowired
    private PotholeRepository potholeRepository;
    @Autowired
    private OverloadRepository overloadRepository;

    @Autowired
    private StorageClient storageClient;

    private final String baseUrl = "https://firebasestorage.googleapis.com/v0/b/c104-10f5a.appspot.com/o";

    // 포트홀 DB 추가
    @PostMapping("/pothole")
    public ResponseEntity<?> addPotholeWithImage(
            @RequestParam("image") MultipartFile image,
            @RequestParam("data") String data
    ) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(data);

        double x = jsonNode.get("x").asDouble();
        double y = jsonNode.get("y").asDouble();
        LocalDateTime now = LocalDateTime.now();

        Point location = new GeometryFactory().createPoint(new Coordinate(x, y));

        List<Pothole> duplication = potholeRepository.checkDuplication(now.minusDays(7), location, 10);

        if (!duplication.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Same report within 10m recently");
        }

        String imageName =
                now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + "-" + UUID.randomUUID().toString();

        String blobString = "pothole" + "/" + imageName + ".jpg";

        storageClient.bucket().create(blobString, image.getInputStream(), image.getContentType());

        // https://firebasestorage.googleapis.com/v0/b/c104-10f5a.appspot.com/o/pothole%2F27025c38-b622-4dbc-9006-0d10388a4cfb-pot1.JPG?alt=media
        System.out.println(baseUrl + "/pothole%" + imageName + ".JPG" + "?alt=media");


        Pothole newPothole = new Pothole();
        newPothole.setLocation(location);
        newPothole.setImageUrl(baseUrl + "/pothole%" + imageName + ".JPG" + "?alt=media" );
        newPothole.setConfirm(false);

        potholeRepository.save(newPothole);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/overload")
    public ResponseEntity<?> addOverloadWithImage(
            @RequestParam("image") MultipartFile image,
            @RequestParam("data") String data
    ) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(data);

        LocalDateTime now = LocalDateTime.now();

        double x = jsonNode.get("x").asDouble();
        double y = jsonNode.get("y").asDouble();
        Point location = new GeometryFactory().createPoint(new Coordinate(x, y));

        String imageName =
                now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                        + "-" + UUID.randomUUID().toString();

        String blobString = "overload" + "/" + imageName + ".jpg";

        storageClient.bucket().create(blobString, image.getInputStream(), image.getContentType());


        System.out.println(baseUrl + "/overload%" + imageName + ".JPG" + "?alt=media");

        Overload newOverload = new Overload();
        newOverload.setLocation(location);
        newOverload.setImageUrl(baseUrl + "/overload%" + imageName + ".JPG" + "?alt=media" );
        newOverload.setType("");
        newOverload.setCarNumber(jsonNode.get("carNumber").asText());
        newOverload.setConfirm(false);

        overloadRepository.save(newOverload);

        return ResponseEntity.ok().build();
    }


}
