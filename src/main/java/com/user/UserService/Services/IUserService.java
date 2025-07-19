package com.user.UserService.Services;

import com.user.UserService.DTOs.DoctorScheduleDTO;
import com.user.UserService.DTOs.UpdateScheduleDTO;
import com.user.UserService.entities.DoctorSchedule;
import com.user.UserService.entities.Doctors;
import com.user.UserService.entities.Patients;
import com.user.UserService.entities.Users;

import java.util.List;

public interface IUserService {
    List<Users> getAllDoctors();

    Doctors getDoctorById(long id);

    Boolean isPatientExist(long patientId);

    String addSchedule(DoctorScheduleDTO doctorScheduleDTO);

    String updateSchedule(long scheduleId, UpdateScheduleDTO updateScheduleDTO);

    String deleteSchedule(long scheduleId);

    Patients getPatientById(long patientId);

    String updateDoctorStatus(long doctorId, String status);
}
