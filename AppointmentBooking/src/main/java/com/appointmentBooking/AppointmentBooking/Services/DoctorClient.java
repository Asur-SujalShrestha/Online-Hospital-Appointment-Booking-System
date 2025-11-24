package com.appointmentBooking.AppointmentBooking.Services;

import com.appointmentBooking.AppointmentBooking.DTOs.DoctorDTO;
import com.appointmentBooking.AppointmentBooking.DTOs.PatientDTO;
import com.appointmentBooking.AppointmentBooking.DTOs.UserDTO;
import jakarta.ws.rs.BadRequestException;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "USERSERVICE")
public interface DoctorClient {

    @GetMapping("/nepoHeal/user/getDoctorById/{id}")
    public DoctorDTO getDoctor(@PathVariable long id);

    @GetMapping("/nepoHeal/user/isPatientExist/{patientId}")
    public boolean isPatientExist(@PathVariable long patientId);

    @GetMapping("/nepoHeal/user/getUserByEmail/{email}")
    public UserDTO getUserByEmail(@PathVariable String email);

    @GetMapping("/nepoHeal/user/getpatientById/{patientId}")
    public PatientDTO getPatientById(@PathVariable long patientId);

    @GetMapping("/nepoHeal/user/getUserById/{userId}")
    public UserDTO getUserById(@PathVariable long userId);
}
