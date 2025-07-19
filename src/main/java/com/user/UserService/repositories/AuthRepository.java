package com.user.UserService.repositories;

import com.user.UserService.entities.Doctors;
import com.user.UserService.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthRepository extends JpaRepository<Users, Long> {
    Users findByEmail(String email);


    List<Users> findByRole(Users.Roles roles);
}
