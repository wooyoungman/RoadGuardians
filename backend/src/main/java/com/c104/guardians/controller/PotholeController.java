package com.c104.guardians.controller;

import com.c104.guardians.dto.RepairRequest;
import com.c104.guardians.entity.*;
import com.c104.guardians.repository.RepairRepository;
import com.c104.guardians.service.DepartmentService;
import com.c104.guardians.service.PotholeService;
import com.c104.guardians.service.RepairService;
import com.c104.guardians.repository.PotholeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.*;

@RestController
@RequestMapping("/api/v1/pothole")
public class PotholeController {

    @Autowired
    private PotholeRepository potholeRepository;
    @Autowired
    private RepairService repairService;
    @Autowired
    private RepairRepository repairRepository;
    @Autowired
    private PotholeService potholeService;
    @Autowired
    private DepartmentService departmentService;

    @GetMapping("/map")
    public ResponseEntity<List<PotholeMarker>> getPotholesByConfirm(
    ) {
        return ResponseEntity.ok(potholeRepository.findMarkerByConfirm(false));
    }


    @GetMapping(params = "confirm")
    public ResponseEntity<?> getPotholesByConfirm(
            @RequestParam Boolean confirm
    ) {
        if (confirm) return ResponseEntity.ok(repairRepository.findAll());
        return ResponseEntity.ok(potholeRepository.findByConfirm(confirm));
    }

    @GetMapping(value = "/detail/{pothole_id}")
    public ResponseEntity<Optional<Pothole>> getDetailPotholes(
            @PathVariable Integer pothole_id
    ) {
        return ResponseEntity.ok(potholeRepository.findById(pothole_id));
    }


    // 유지보수 작업 지시하기
    @PostMapping("/repair")
    public ResponseEntity<Repair> createRepair(
            @RequestBody RepairRequest repairRequest
    ) {
        Pothole pothole = potholeService.getPotholeById(repairRequest.getPotholeId());
        Department department = departmentService.getDepartmentById(repairRequest.getDeptId());

        // 오류
        if (pothole == null || department == null) {
            return ResponseEntity.badRequest().build();
        }

        pothole.setConfirm(true);
        Repair repair = new Repair();
        repair.setPothole(pothole);
        repair.setDepartment(department);
        repair.setStatus("before"); // 기본 상태 설정

        Repair createdRepair = repairService.saveRepair(repair);
        return ResponseEntity.ok(createdRepair);
    }



}