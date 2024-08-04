package com.c104.guardians.dto;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import org.locationtech.jts.geom.Point;

public interface RepairMarker {
    Integer getRepairId();
    PotholeInfo getPothole();

    interface PotholeInfo {
        Integer getPotholeId();

        @JsonSerialize(using = ToStringSerializer.class)
        Point getLocation();
    }
}
