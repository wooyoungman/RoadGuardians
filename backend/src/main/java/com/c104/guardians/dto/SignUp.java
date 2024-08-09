package com.c104.guardians.dto;

import com.c104.guardians.entity.Department;
import com.c104.guardians.repository.DepartmentRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUp {
    private String id;
    private String email;
    private String name;
    private String password;
    private String phoneNumber;
    private String userType;
    private LocalDateTime createdAt;
    private LocalDateTime editedAt;
    private LocalDateTime lastLoginAt;
    private String token;

    private Integer deptId;
}