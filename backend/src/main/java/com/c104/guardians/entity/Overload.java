package com.c104.guardians.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "overload")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Overload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "overload_id")
    private Integer overloadId;

    @Column(name = "location", nullable = false)
    private Point location;

    @Column(name = "detect_at", nullable = false)
    @CreatedDate
    private LocalDateTime detectAt;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "type", nullable = false, length = 20)
    private String type;

    @Column(name = "car_number", nullable = false, length = 50)
    private String carNumber;

    @Column(name = "confirm", columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean confirm;

    @OneToOne(mappedBy = "overload", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference // 무한루프 방지
    private Report report;
}
