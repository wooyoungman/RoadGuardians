package com.c104.guardians.controller;

import com.c104.guardians.entity.Overload;
import com.c104.guardians.entity.Report;
import com.c104.guardians.repository.OverloadRepository;
import com.c104.guardians.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/overload")
public class OverloadController {

    @Autowired
    private OverloadRepository overloadRepository;
    @Autowired
    private ReportService reportService;


    @GetMapping(params = "confirm")
    public ResponseEntity<List<Overload>> getOverloadByConfirm(
            @RequestParam Boolean confirm
    ) {
        return ResponseEntity.ok(overloadRepository.findByConfirm(confirm));
    }

    // 신고하기
    @PostMapping("/report")
    public ResponseEntity<Report> createRepair(
            @RequestBody Report report
    ) {

        Overload overload = report.getOverload();
        overload.setConfirm(true);
        Report createdReport = reportService.saveReport(report);

        return new ResponseEntity<>(createdReport, HttpStatus.CREATED);

    }



}