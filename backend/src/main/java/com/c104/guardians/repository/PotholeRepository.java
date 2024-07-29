package com.c104.guardians.repository;


import com.c104.guardians.entity.Pothole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PotholeRepository extends JpaRepository<Pothole, Integer> {
}
