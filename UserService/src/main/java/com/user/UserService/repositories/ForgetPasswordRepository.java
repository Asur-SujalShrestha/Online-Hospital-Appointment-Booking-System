package com.user.UserService.repositories;

import com.user.UserService.entities.ForgetPassword;
import com.user.UserService.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ForgetPasswordRepository extends JpaRepository<ForgetPassword, Long> {
    ForgetPassword findByUser(Users user);
}
