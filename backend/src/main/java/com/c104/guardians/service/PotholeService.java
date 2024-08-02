package com.c104.guardians.service;

import com.c104.guardians.entity.Overload;
import com.c104.guardians.entity.Pothole;
import com.c104.guardians.repository.OverloadRepository;
import com.c104.guardians.repository.PotholeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PotholeService {
    @Autowired
    private PotholeRepository potholeRepository;

    public Pothole savePothole(Pothole pothole) {
        return potholeRepository.save(pothole);
    }

    public Pothole getPotholeById(Integer potholeId) {
        return potholeRepository.findById(potholeId).orElse(null);
    }
}
