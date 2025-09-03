package com.user.UserService.Controllers;

import com.user.UserService.DTOs.DoctorDTO;
import com.user.UserService.DTOs.DoctorScheduleDTO;
import com.user.UserService.DTOs.OTPVerfiyDTO;
import com.user.UserService.DTOs.UpdateScheduleDTO;
import com.user.UserService.Services.Implementations.ForgetPasswordService;
import com.user.UserService.Services.Implementations.UserService;
import com.user.UserService.entities.DoctorSchedule;
import com.user.UserService.entities.Doctors;
import com.user.UserService.entities.Patients;
import com.user.UserService.entities.Users;
import jakarta.mail.MessagingException;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/nepoHeal/user")
public class UserController {
    private final UserService userService;
    private final ForgetPasswordService forgetPasswordService;

    public UserController(UserService userService, ForgetPasswordService forgetPasswordService) {
        this.userService = userService;
        this.forgetPasswordService = forgetPasswordService;
    }

    @GetMapping("/allDoctors")
    public ResponseEntity<List<Users>> getAllDoctors() {
        List<Users> doctors = userService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/getDoctorById/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable long id) {
        DoctorDTO doctor = userService.getDoctorById(id);
        return new ResponseEntity<>(doctor, HttpStatus.OK);
    }

    @GetMapping("/get-doctorDetailById/{doctorId}")
    public ResponseEntity<Users> getDoctorDetailById(@PathVariable long doctorId) {
        Users user = userService.getDoctorDetail(doctorId);
        return new ResponseEntity<>(user, HttpStatus.OK);
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

    @GetMapping("/getUserByEmail/{email}")
    public ResponseEntity<Users> getUserByEmail(@PathVariable String email) {
        Users user = userService.getUserByEmail(email);
        return new ResponseEntity<>(user, HttpStatus.OK);
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

    @PostMapping("/forgetPassword")
    public ResponseEntity<String> forgetPassword(@RequestParam("email") String email) throws BadRequestException, MessagingException {
        String result = forgetPasswordService.addNewForgetPassword(email);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/verifyOtp")
    public ResponseEntity<String> verifyOTP(@RequestBody OTPVerfiyDTO verfiyDTO) throws BadRequestException {
        String result = forgetPasswordService.verifyOTP(verfiyDTO);
        return ResponseEntity.ok(result);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleBadRequestException(BadRequestException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentialException(BadCredentialsException ex){
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
