package com.c104.guardians.repository;

import com.c104.guardians.dto.PotholeMarker;
import com.c104.guardians.entity.Pothole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface PotholeRepository extends JpaRepository<Pothole, Integer> {
    // 담당자 확인 여부 = 유지 보수 작업으로 연계 여부
    List<Pothole> findByConfirm(Boolean confirm);

    Optional<Pothole> findById(Integer pothole_id);

    List<PotholeMarker> findMarkerByConfirm(Boolean confirm);


    // 중복 7일 이내 가까운 곳에서 신고
    @Query("SELECT pothole FROM Pothole pothole WHERE pothole.detectAt >= :detectAt AND ST_Distance_Sphere(pothole.location, :location) <= :buffer")
    List<Pothole> checkDuplication(
            @Param("detectAt") LocalDateTime detectAt,
            @Param("location") Point location,
            @Param("buffer") Integer buffer
    );


}





