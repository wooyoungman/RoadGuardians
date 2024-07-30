package com.c104.guardians.repository;

import com.c104.guardians.entity.Pothole;
import com.c104.guardians.entity.Repair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RepairRepository extends JpaRepository<Repair, Integer> {

    @Query("SELECT repair FROM Repair repair WHERE repair.status = :status")
    List<Repair> findRepair(@Param("status") String status);
}
