package com.c104.guardians.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "repair")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Repair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "repair_id")
    private Integer repairId;


    @Column(name = "status", nullable = false, length = 50, columnDefinition = "VARCHAR(50) DEFAULT 'before'")
    private String status;

    @Column(name = "repair_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime repairAt;

    @OneToOne
    @JsonManagedReference // 반환시 무한루프 방지
    @JoinColumn(name = "pothole_id", nullable = false, unique = true)
    private Pothole pothole;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;

    @PrePersist // 실시간 시간 먼저 입력되도록
    protected void onCreate() {
        repairAt = LocalDateTime.now();
    }

}
