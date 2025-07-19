package com.appointmentBooking.AppointmentBooking.Services;

import com.appointmentBooking.AppointmentBooking.DTOs.DoctorDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "USERSERVICE")
public interface DoctorClient {

    @GetMapping("/nepoHeal/user/getDoctorById/{id}")
    public DoctorDTO getDoctor(@PathVariable long id);

    @GetMapping("/nepoHeal/user/isPatientExist/{patientId}")
    public boolean isPatientExist(@PathVariable long patientId);
}
