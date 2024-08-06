package com.c104.guardians.repository;

import com.c104.guardians.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    public boolean existsByIdAndPassword(String id, String password);
}
