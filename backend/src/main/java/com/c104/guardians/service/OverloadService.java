package com.c104.guardians.service;

import com.c104.guardians.entity.Overload;
import com.c104.guardians.entity.Pothole;
import com.c104.guardians.repository.OverloadRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class OverloadService {
    @Autowired
    private OverloadRepository overloadRepository;



    public Overload saveOverload(Overload overload) {
        return overloadRepository.save(overload);
    }

    public Overload getOverloadById(Integer overloadId) {

        return overloadRepository.findById(overloadId).orElse(null);
    }

    public void deleteOverloadByOverloadId(Integer overloadId) {
        overloadRepository.deleteOverloadByOverloadId(overloadId);
    }
}
