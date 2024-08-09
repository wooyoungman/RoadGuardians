package com.c104.guardians.controller;

import com.c104.guardians.dto.ReportRequest;
import com.c104.guardians.entity.*;
import com.c104.guardians.repository.OverloadRepository;
import com.c104.guardians.repository.ReportRepository;
import com.c104.guardians.service.UserService;
import com.c104.guardians.service.OverloadService;
import com.c104.guardians.service.ReportService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.google.firebase.cloud.StorageClient;


import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/overload")
public class OverloadController {

    @Autowired
    private OverloadRepository overloadRepository;
    @Autowired
    private ReportService reportService;
    @Autowired
    private OverloadService overloadService;
    @Autowired
    private UserService userService;
    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private StorageClient storageClient;



    @GetMapping(params = "confirm")
    public ResponseEntity<?> getOverloadByConfirm(
            @RequestParam Boolean confirm
    ) {
        if (confirm) return ResponseEntity.ok(reportRepository.findAll());
        return ResponseEntity.ok(overloadRepository.findByConfirm(confirm));
    }

    @GetMapping(value = "/detail/{overload_id}")
    public ResponseEntity<Optional<Overload>> getDetailOverload(
            @PathVariable Integer overload_id
    ) {
        return ResponseEntity.ok(overloadRepository.findById(overload_id));
    }

    @PostMapping("/report")
    public ResponseEntity<?> createReport(
            @RequestParam("image") MultipartFile image,
            @RequestParam("data") String data
    ) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        ReportRequest reportRequest = objectMapper.readValue(data, ReportRequest.class);

        if (image.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("image error");
        }

        Overload overload = overloadService.getOverloadById(reportRequest.getOverloadId());
        User user = userService.getUserById(reportRequest.getId());

        if (overload == null || user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("employee or overload not found");
        }

        overload.setConfirm(true);
        Report report = new Report();
        report.setOverload(overload);
        report.setUser(user);

        Report createdReport = reportService.saveReport(report);


        String imageName = createdReport.getReportId() + ".png";
        String blobString = "report/" + imageName;

        storageClient.bucket().create(blobString, image.getInputStream(), image.getContentType());

        System.out.println(imageName);
//        https://firebasestorage.googleapis.com/v0/b/c104-10f5a.appspot.com/o/report%2F1.png?alt=media

        return ResponseEntity.ok(createdReport);

    }

}