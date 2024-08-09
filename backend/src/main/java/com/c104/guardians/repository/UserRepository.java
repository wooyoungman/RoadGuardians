package com.c104.guardians.repository;

import com.c104.guardians.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    public boolean existsByIdAndPassword(String id, String password);


    @Query("SELECT user FROM User user WHERE user.name = :name ")
    User findUserByName(@Param("name") String name);

}
