package com.c104.guardians.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;

public interface PotholeAndRepair {
    Integer getPotholeId();

    @JsonSerialize(using = ToStringSerializer.class) // Point 타입 json으로 문제 없도록
    Point getLocation();

    LocalDateTime getDetectAt();

    String getImageUrl();

    Boolean getConfirm();

    Repair getRepair();

}
