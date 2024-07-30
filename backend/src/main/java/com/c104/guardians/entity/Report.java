package com.c104.guardians.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "report")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Integer reportId;

    @Column(name = "report_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime reportAt;

    @OneToOne
    @JsonManagedReference // 반환시 무한루프 방지
    @JoinColumn(name = "overload_id", nullable = false, unique = true)
    private Overload overload;

    @ManyToOne
    @JoinColumn(name = "emp_id")
    private Employee employee;

    @PrePersist // 실시간 시간 먼저 입력되도록
    protected void onCreate() {
        reportAt = LocalDateTime.now();
    }
}
