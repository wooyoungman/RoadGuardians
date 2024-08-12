package com.c104.guardians.repository;

import com.c104.guardians.entity.Overload;
import com.c104.guardians.entity.Pothole;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public interface OverloadRepository extends JpaRepository<Overload, Integer> {
    List<Overload> findByConfirm(Boolean confirm);

    void deleteOverloadByOverloadId(Integer overloadId);



}
