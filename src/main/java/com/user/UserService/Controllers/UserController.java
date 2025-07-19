package com.user.UserService.Controllers;

import com.user.UserService.DTOs.DoctorScheduleDTO;
import com.user.UserService.DTOs.UpdateScheduleDTO;
import com.user.UserService.Services.Implementations.UserService;
import com.user.UserService.entities.DoctorSchedule;
import com.user.UserService.entities.Doctors;
import com.user.UserService.entities.Patients;
import com.user.UserService.entities.Users;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/nepoHeal/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/allDoctors")
    public ResponseEntity<List<Users>> getAllDoctors() {
        List<Users> doctors = userService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/getDoctorById/{id}")
    public ResponseEntity<Doctors> getDoctorById(@PathVariable long id) {
        Doctors doctor = userService.getDoctorById(id);
        return new ResponseEntity<>(doctor, HttpStatus.OK);
    }

    @GetMapping("/getpatientById/{patientId}")
    public ResponseEntity<Patients> getPatientById(@PathVariable long patientId) {
        Patients patient = userService.getPatientById(patientId);
        return new ResponseEntity<>(patient, HttpStatus.OK);
    }

    @GetMapping("/isPatientExist/{patientId}")
    public ResponseEntity<Boolean> isPatientExist(@PathVariable long patientId) {
        Boolean result = userService.isPatientExist(patientId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/addSchedule")
    public ResponseEntity<String> addSchedule(@RequestBody DoctorScheduleDTO doctorScheduleDTO) {
        String result = userService.addSchedule(doctorScheduleDTO);
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/updateSchedule/{scheduleId}")
    public ResponseEntity<String> updateSlot(@PathVariable long scheduleId, @RequestBody UpdateScheduleDTO updateScheduleDTO) {
        String result = userService.updateSchedule(scheduleId, updateScheduleDTO);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/deleteSchedule/{scheduleId}")
    public ResponseEntity<String> deleteSchedule(@PathVariable long scheduleId) {
        String result = userService.deleteSchedule(scheduleId);
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/updateDoctorStatus/{doctorId}")
    public ResponseEntity<String> updateDoctorStatus(@PathVariable long doctorId, @RequestParam String status) {
        String result = userService.updateDoctorStatus(doctorId, status);
        return ResponseEntity.ok(result);
    }
}
