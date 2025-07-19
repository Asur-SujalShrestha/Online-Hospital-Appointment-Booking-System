package com.prescription.PrescriptionService.Services;

import com.prescription.PrescriptionService.DTOs.DoctorDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "USERSERVICE")
public interface UserPrescriptionClient {
    @GetMapping("/nepoHeal/user/getDoctorById/{id}")
    DoctorDTO getDoctorById(@PathVariable long id);

    @GetMapping("/nepoHeal/user/isPatientExist/{patientId}")
    boolean isPatientExist(@PathVariable long patientId);

}
