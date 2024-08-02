package com.c104.guardians.service;

import com.c104.guardians.entity.Repair;
import com.c104.guardians.repository.RepairRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class RepairService {

    @Autowired
    private RepairRepository repairRepository;

    public Repair saveRepair(Repair repair) {
        return repairRepository.save(repair);
    }



}
