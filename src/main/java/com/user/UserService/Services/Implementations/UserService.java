package com.user.UserService.Services.Implementations;

import com.user.UserService.DTOs.*;
import com.user.UserService.Services.IUserService;
import com.user.UserService.entities.DoctorSchedule;
import com.user.UserService.entities.Doctors;
import com.user.UserService.entities.Patients;
import com.user.UserService.entities.Users;
import com.user.UserService.repositories.AuthRepository;
import com.user.UserService.repositories.DoctorRepository;
import com.user.UserService.repositories.DoctorScheduleRepository;
import com.user.UserService.repositories.PatientRepository;
import jakarta.ws.rs.BadRequestException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService implements IUserService {
    private final AuthRepository authRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;

    public UserService(AuthRepository authRepository, DoctorRepository doctorRepository, PatientRepository patientRepository, DoctorScheduleRepository doctorScheduleRepository) {
        this.authRepository = authRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.doctorScheduleRepository = doctorScheduleRepository;
    }

    @Override
    public List<Users> getAllDoctors() {
        return authRepository.findByRole(Users.Roles.DOCTORS);
    }

    @Override
    public DoctorDTO getDoctorById(long id) {
        Doctors doctors =  doctorRepository.findById(id).orElseThrow(()-> new BadRequestException("Doctor not found"));
        if(doctors == null){
            throw new BadRequestException("Doctor not found");
        }
        return DoctorDTO.builder()
                .doctor_id(doctors.getDoctor_id())
                .user(doctors.getUser().getUserId())
                .specialization(doctors.getSpecialization())
                .qualification(doctors.getQualification())
                .status(String.valueOf(doctors.getStatus()))
                .experience(doctors.getExperience())
                .bio(doctors.getBio())
                .build();
    }

    @Override
    public Boolean isPatientExist(long patientId) {
        boolean result = true;
        Patients patients = patientRepository.findById(patientId).orElse(null);
        if (patients == null) {
            result = false;
        }
        return result;
    }

    @Override
    public String addSchedule(DoctorScheduleDTO doctorScheduleDTO) {
        Doctors doctors = doctorRepository.findById(doctorScheduleDTO.getDoctorId()).orElseThrow(()-> new BadRequestException("Doctor not found"));
        DoctorSchedule RegisteredDoctorSchedule = doctorScheduleRepository.findByDayOfWeek(Enum.valueOf(DoctorSchedule.Days.class, doctorScheduleDTO.getDayOfWeek()));
        if (RegisteredDoctorSchedule != null) {
            throw new BadRequestException("Schedule already exists");
        }
        DoctorSchedule doctorSchedule = DoctorSchedule.builder()
                .doctor(doctors)
                .dayOfWeek(Enum.valueOf(DoctorSchedule.Days.class, doctorScheduleDTO.getDayOfWeek()))
                .startTime(doctorScheduleDTO.getStartTime())
                .endTime(doctorScheduleDTO.getEndTime())
                .build();

        doctorScheduleRepository.save(doctorSchedule);
        return "Schedule added successfully";

    }

    @Override
    public String updateSchedule(long scheduleId, UpdateScheduleDTO updateScheduleDTO) {
        DoctorSchedule schedule = doctorScheduleRepository.findById(scheduleId).orElseThrow(()-> new BadRequestException("Schedule not found"));
        schedule.setStartTime(updateScheduleDTO.getStartTime());
        schedule.setEndTime(updateScheduleDTO.getEndTime());
        doctorScheduleRepository.save(schedule);
        return "Schedule updated successfully";
    }

    @Override
    public String deleteSchedule(long scheduleId) {
        DoctorSchedule schedule = doctorScheduleRepository.findById(scheduleId).orElseThrow(()-> new BadRequestException("Schedule not found"));
        doctorScheduleRepository.delete(schedule);
        return "Schedule deleted successfully";
    }

    @Override
    public PatientDTO getPatientById(long patientId) {
        Patients patients =  patientRepository.findById(patientId).orElseThrow(()-> new BadRequestException("Patient not found"));
        return PatientDTO.builder()
                .patient_id(patients.getPatient_id())
                .user(patients.getUser().getUserId())
                .bloodGroup(patients.getBloodGroup())
                .medicalNotes(patients.getMedicalNotes())
                .allergies(patients.getAllergies())
                .build();
    }

    @Override
    public String updateDoctorStatus(long doctorId, String status) {
        Doctors doctor = doctorRepository.findById(doctorId).orElseThrow(()-> new BadRequestException("Doctor not found"));
        doctor.setStatus(Enum.valueOf(Doctors.Status.class, status));
        doctorRepository.save(doctor);
        return "Doctor status updated successfully";
    }

    @Override
    public Users getUserByEmail(String email) {
        Users user = authRepository.findByEmail(email).orElse(null);
        if(user == null){
            throw new UsernameNotFoundException("User not found");
        }
        return user;
    }

    @Override
    public Users getDoctorDetail(long doctorId) {
        Doctors doctors = doctorRepository.findById(doctorId).orElseThrow(()-> new BadRequestException("Doctor not found"));
        return authRepository.findById(doctors.getUser().getUserId()).orElseThrow(()-> new BadRequestException("User not found"));
    }

    @Override
    public Users getUser(long id) {
        return authRepository.findById(id).orElseThrow(()->new RuntimeException("User not found"));
    }

    @Override
    @Transactional
    public String updateUserProfile(long id, UserDTO userDTO) {
        Users user = authRepository.findById(id).orElseThrow(()-> new BadRequestException("User not found"));
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        user.setGender(userDTO.getGender());
        user.setDob(userDTO.getDob());

        if(user.getRole().equals(Users.Roles.PATIENTS)){
            Patients patient = patientRepository.findByUser(user);
            if(patient == null){
                throw new BadRequestException("Patient not found");
            }
            patient.setBloodGroup(userDTO.getBloodGroup());
            patient.setMedicalNotes(userDTO.getMedicalNotes());
            patient.setAllergies(userDTO.getAllergies());
            patientRepository.save(patient);
        }

        else if(user.getRole().equals(Users.Roles.DOCTORS)){
            Doctors doctors = doctorRepository.findByUser(user);
            if(doctors == null){
                throw new BadRequestException("Doctor not found");
            }
            doctors.setSpecialization(userDTO.getSpecialization());
            doctors.setQualification(userDTO.getQualification());
            doctors.setExperience(userDTO.getExperience());
            doctors.setBio(userDTO.getBio());
            doctorRepository.save(doctors);
        }
        authRepository.save(user);
        return "User profile updated successfully";
    }

    @Override
    public List<Users> getAllUser() {
        return authRepository.findAll();
    }
}
