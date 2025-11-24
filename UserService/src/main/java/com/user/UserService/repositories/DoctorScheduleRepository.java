package com.user.UserService.repositories;

import com.user.UserService.entities.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {
    DoctorSchedule findByDayOfWeek(DoctorSchedule.Days days);
}
