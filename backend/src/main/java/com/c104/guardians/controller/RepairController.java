package com.c104.guardians.controller;

import com.c104.guardians.entity.Repair;
import com.c104.guardians.dto.RepairList;
import com.c104.guardians.entity.RepairMarker;
import com.c104.guardians.repository.RepairRepository;
import com.c104.guardians.service.RepairService;
import com.c104.guardians.websocket.WebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/v1/repair")
public class RepairController {


    @Autowired
    private WebSocketHandler webSocketHandler;
    @Autowired
    private RepairService repairService;
    @Autowired
    private RepairRepository repairRepository;

    private void statusEdit(String status, RepairList repairList) {
        for (Integer repair_id : repairList.getRepairId()) {
            Repair repair = repairRepository.findById(repair_id).orElseThrow();
            repair.setStatus(status);
            repairRepository.save(repair);
        }
    }

    @GetMapping("/map")
    public ResponseEntity<List<RepairMarker>> getRepairByStatus(
    ) {
        return ResponseEntity.ok(repairRepository.findMarkerByStatus());
    }


    @GetMapping(params = "status")
    public ResponseEntity<List<Repair>> getRepairByStatus(
            @RequestParam String status
    ) {
        return ResponseEntity.ok(repairRepository.findByStatus(status));
    }


    @PostMapping("/start")
    public ResponseEntity<?> startRepair(
            @RequestBody RepairList repairList
    ) throws IOException {

        statusEdit("ongoing", repairList);

        // websocket 웹소켓
        try {
            webSocketHandler.sendMessageToClients("newDB");
            log.info("OK websocket");
        } catch (Exception e) {
            log.error("Fail WebSocket");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send message to websocket");
        }
        return ResponseEntity.ok(repairList);
    }

    @PostMapping("/end")
    public ResponseEntity<?> endRepair(
            @RequestBody RepairList repairList
    ) throws IOException {

        statusEdit("complete", repairList);

        // websocket 웹소켓
        try {
            webSocketHandler.sendMessageToClients("newDB");
            log.info("OK websocket");
        } catch (Exception e) {
            log.error("Fail WebSocket");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send message to websocket");
        }
        return ResponseEntity.ok(repairList);
    }




}