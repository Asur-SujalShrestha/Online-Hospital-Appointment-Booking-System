package com.user.UserService.repositories;

import com.user.UserService.entities.Doctors;
import com.user.UserService.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorRepository extends JpaRepository<Doctors, Long> {

    Doctors findByUser(Users user);
}
