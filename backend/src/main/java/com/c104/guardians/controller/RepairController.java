package com.c104.guardians.controller;

import com.c104.guardians.entity.Repair;
import com.c104.guardians.dto.RepairList;
import com.c104.guardians.repository.RepairRepository;
import com.c104.guardians.service.RepairService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

import java.util.Optional;

@RestController
@RequestMapping("/api/repair")
public class RepairController {

    @Autowired
    private RepairService repairService;
    @Autowired
    private RepairRepository repairRepository;

    @GetMapping("")
    public ResponseEntity<List<Repair>> getRepairAll(
    ) {
        return ResponseEntity.ok(repairRepository.findAll());
    }

    @GetMapping(params = "status")
    public ResponseEntity<List<Repair>> getRepairByStatus(
            @RequestParam String status
    ) {
        return ResponseEntity.ok(repairRepository.findRepair("before"));
    }

    // 경로 생성 시작시 {id : [1,2,3]}
    @PostMapping("/start")
    public ResponseEntity<?> startRepair(
            @RequestParam("data") String data
    ) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        RepairList repairList = objectMapper.readValue(data, RepairList.class);

        for (Integer repair_id : repairList.getRepairId()) {
            Optional<Repair> optionalRepair = repairRepository.findById(repair_id);
            if (optionalRepair.isPresent()) {
                Repair repair = optionalRepair.get();
                repair.setStatus("during");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Error, repair not found");
            }
        }
        return ResponseEntity.ok(repairList);
    }


}