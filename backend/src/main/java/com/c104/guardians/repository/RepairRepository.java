package com.c104.guardians.repository;

import com.c104.guardians.entity.Repair;
import com.c104.guardians.entity.RepairMarker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepairRepository extends JpaRepository<Repair, Integer> {
    List<Repair> findByStatus(String status);

    // 필드들이 매핑이 잘 안돼서 as로 지정해줌
    @Query("SELECT r.repairId as repairId, " +
            "r.pothole as pothole, " +
            "p.potholeId as potholeId, " +
            "p.location as location " +
            "FROM Repair r JOIN r.pothole p WHERE r.status = 'before'")
    List<RepairMarker> findMarkerByStatus();


    @Query("SELECT repair FROM Repair repair WHERE repair.status = :status")
    List<Repair> findRepair(@Param("status") String status);
}
