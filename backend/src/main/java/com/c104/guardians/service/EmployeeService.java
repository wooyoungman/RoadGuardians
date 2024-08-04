package com.c104.guardians.service;

import com.c104.guardians.entity.Employee;
import com.c104.guardians.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public Employee getEmployeeById(Integer empId) {
        return employeeRepository.findById(empId).orElse(null);
    }

}
