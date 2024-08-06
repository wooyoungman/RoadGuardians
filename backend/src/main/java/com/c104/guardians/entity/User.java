package com.c104.guardians.entity;

import com.c104.guardians.dto.SignUp;
import com.c104.guardians.repository.DepartmentRepository;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import com.c104.guardians.repository.DepartmentRepository;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name="user")			// 본인 테이블명과 맞춰주어야 함
public class User {
    @Id
    private String id;
    @Column(name = "email")
    private String email;
    @Column(name = "password")
    private String password;
    @Column(name = "name")
    private String name;
    @Column(name = "phoneNumber")
    private String phoneNumber;
    @Column(name = "userType")
    private String userType;
    @Column(name = "token")
    private String token;
    @Column(name = "createdAt")
    private LocalDateTime createdAt;
    @Column(name = "editedAt")
    private LocalDateTime editedAt;
    @Column(name = "lastLoginAt")
    private LocalDateTime lastLoginAt;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;


    public User(SignUp dto, Department department) {
        this.id = dto.getId();
        this.email = dto.getEmail();
        this.password = dto.getPassword();
        this.name = dto.getName();
        this.phoneNumber = dto.getPhoneNumber();
        this.userType = dto.getUserType();
        this.token = "";
        this.createdAt = LocalDateTime.now();
        this.editedAt = LocalDateTime.now();
        this.department = department;

    }
}