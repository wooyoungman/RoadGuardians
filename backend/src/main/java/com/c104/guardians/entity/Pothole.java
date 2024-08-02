package com.c104.guardians.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.locationtech.jts.geom.Point;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "pothole")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pothole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pothole_id")
    private Integer potholeId;

    @Column(name = "location", nullable = false)
    @JsonSerialize(using = ToStringSerializer.class) // Point 타입 json으로 문제 없도록
    private Point location;

    @Column(name = "detect_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime detectAt;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "confirm", columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean confirm;

    @OneToOne(mappedBy = "pothole", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference // 무한 루프 방지
    private Repair repair;

    @PrePersist // 실시간 시간 먼저 입력되도록
    protected void onCreate() {
        detectAt = LocalDateTime.now();
    }

    public Repair getRepair() {
        return repair;
    }
}
