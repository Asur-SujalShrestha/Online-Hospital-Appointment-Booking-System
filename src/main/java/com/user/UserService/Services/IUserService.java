package com.user.UserService.Services;

import com.user.UserService.DTOs.*;
import com.user.UserService.entities.DoctorSchedule;
import com.user.UserService.entities.Doctors;
import com.user.UserService.entities.Patients;
import com.user.UserService.entities.Users;

import java.util.List;

public interface IUserService {
    List<Users> getAllDoctors();

    DoctorDTO getDoctorById(long id);

    Boolean isPatientExist(long patientId);

    String addSchedule(DoctorScheduleDTO doctorScheduleDTO);

    String updateSchedule(long scheduleId, UpdateScheduleDTO updateScheduleDTO);

    String deleteSchedule(long scheduleId);

    PatientDTO getPatientById(long patientId);

    String updateDoctorStatus(long doctorId, String status);

    Users getUserByEmail(String email);

    Users getDoctorDetail(long DoctorId);

    Users getUser(long id);

    String updateUserProfile(long id, UserDTO userDTO);

    List<Users> getAllUser();
}
