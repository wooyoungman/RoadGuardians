package com.c104.guardians.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import org.locationtech.jts.geom.Point;

public interface PotholeMarker {
    Integer getPotholeId();

    @JsonSerialize(using = ToStringSerializer.class) // Point 타입 json으로 문제 없도록
    Point getLocation();
}
