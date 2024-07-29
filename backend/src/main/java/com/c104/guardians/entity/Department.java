package com.c104.guardians.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "department")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dept_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;
}
