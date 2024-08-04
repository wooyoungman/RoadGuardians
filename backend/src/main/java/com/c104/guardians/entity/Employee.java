package com.c104.guardians.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "employee")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emp_id")
    private Integer empId;

    @Column(name = "username", nullable = false, length = 20, unique = true)
    private String username;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "phone", nullable = false, length = 11, unique = true)
    private String phone;

    @Column(name = "email", nullable = false, length = 50, unique = true)
    private String email;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;
}
