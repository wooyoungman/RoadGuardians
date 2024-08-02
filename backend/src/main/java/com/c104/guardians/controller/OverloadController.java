package com.c104.guardians.controller;

import com.c104.guardians.dto.RepairRequest;
import com.c104.guardians.dto.ReportRequest;
import com.c104.guardians.entity.*;
import com.c104.guardians.repository.OverloadRepository;
import com.c104.guardians.repository.ReportRepository;
import com.c104.guardians.service.EmployeeService;
import com.c104.guardians.service.OverloadService;
import com.c104.guardians.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    private EmployeeService employeeService;
    @Autowired
    private ReportRepository reportRepository;


<<<<<<< HEAD
    @CrossOrigin(origins = "http://localhost:5173")
=======

>>>>>>> f797fb2bc41b0f5e47a0e5216cb60a64d1ef2bdf
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

    // 신고하기
    @PostMapping("/report")
    public ResponseEntity<Report> createReport(
            @RequestBody ReportRequest reportRequest
    ) {
        Overload overload = overloadService.getOverloadById(reportRequest.getOverloadId());
        Employee employee = employeeService.getEmployeeById(reportRequest.getEmpId());

        // 오류
        if (overload == null || employee == null) {
            return ResponseEntity.badRequest().build();
        }


        overload.setConfirm(true);
        Report report = new Report();
        report.setOverload(overload);
        report.setEmployee(employee);

        Report createdReport = reportService.saveReport(report);
        return ResponseEntity.ok(createdReport);
    }



}