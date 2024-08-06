package com.c104.guardians.repository;

import com.c104.guardians.entity.Employee;
import com.c104.guardians.entity.Repair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query("SELECT employee FROM Employee  employee WHERE employee.username = :username ")
    Employee findEmployeeByUsername(@Param("username") String username);
}
