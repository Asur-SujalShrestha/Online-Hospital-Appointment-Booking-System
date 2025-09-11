package com.user.UserService.repositories;

import com.user.UserService.entities.Patients;
import com.user.UserService.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patients, Long> {
    Patients findByUser(Users user);
}
