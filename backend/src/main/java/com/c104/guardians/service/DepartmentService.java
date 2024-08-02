package com.c104.guardians.service;

import com.c104.guardians.entity.Department;
import com.c104.guardians.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public Department getDepartmentById(Integer deptId) {
        return departmentRepository.findById(deptId).orElse(null);
    }
}
