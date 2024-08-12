package com.c104.guardians.controller;

import com.c104.guardians.dto.RepairRequest;
import com.c104.guardians.entity.*;
import com.c104.guardians.repository.RepairRepository;
import com.c104.guardians.service.DepartmentService;
import com.c104.guardians.service.PotholeService;
import com.c104.guardians.service.RepairService;
import com.c104.guardians.repository.PotholeRepository;
import com.c104.guardians.websocket.WebSocketHandler;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/pothole")
public class PotholeController {

    private static final Logger log = LoggerFactory.getLogger(PotholeController.class);
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
    @Autowired
    private WebSocketHandler webSocketHandler;

<<<<<<< HEAD
    @CrossOrigin(origins = "http://localhost:5173")
=======
>>>>>>> f797fb2bc41b0f5e47a0e5216cb60a64d1ef2bdf
    @GetMapping("/map")
    public ResponseEntity<List<PotholeMarker>> getPotholesByConfirm(
    ) {
        return ResponseEntity.ok(potholeRepository.findMarkerByConfirm(false));
    }

<<<<<<< HEAD
    @CrossOrigin(origins = "http://localhost:5173")
=======

>>>>>>> f797fb2bc41b0f5e47a0e5216cb60a64d1ef2bdf
    @GetMapping(params = "confirm")
    public ResponseEntity<?> getPotholesByConfirm(
            @RequestParam Boolean confirm
    ) {
        if (confirm) return ResponseEntity.ok(repairRepository.findAll());
        return ResponseEntity.ok(potholeRepository.findByConfirm(confirm));
    }

<<<<<<< HEAD
    @CrossOrigin(origins = "http://localhost:5173")
=======
>>>>>>> f797fb2bc41b0f5e47a0e5216cb60a64d1ef2bdf
    @GetMapping(value = "/detail/{pothole_id}")
    public ResponseEntity<Optional<Pothole>> getDetailPotholes(
            @PathVariable Integer pothole_id
    ) {
        return ResponseEntity.ok(potholeRepository.findById(pothole_id));
    }
    @DeleteMapping("/delete/{pothole_id}")
    public ResponseEntity<?> deletePothole(
            @PathVariable Integer pothole_id
    ){
        potholeRepository.deletePotholeByPotholeId(pothole_id);

        // 웹소켓 ; 새로운 마커 추가
        try {
            webSocketHandler.sendMessageToClients("delete");
            log.info("OK websocket : delete pothole");
        } catch (Exception e) {
            log.error("Fail WebSocket : delete pothole");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send message to websocket");
        }

        return ResponseEntity.ok().build();
    }

    // 유지보수 작업 지시하기
<<<<<<< HEAD
    @CrossOrigin(origins = "http://localhost:5173")
=======
>>>>>>> f797fb2bc41b0f5e47a0e5216cb60a64d1ef2bdf
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