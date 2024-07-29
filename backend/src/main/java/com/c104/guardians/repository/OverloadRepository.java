package com.c104.guardians.repository;

import com.c104.guardians.entity.Overload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OverloadRepository extends JpaRepository<Overload, Integer> {
}
