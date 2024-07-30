package com.c104.guardians.service;

import com.c104.guardians.entity.Overload;
import com.c104.guardians.repository.OverloadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OverloadService {
    @Autowired
    private OverloadRepository overloadRepository;



    public Overload saveOverload(Overload overload) {
        return overloadRepository.save(overload);
    }
}
