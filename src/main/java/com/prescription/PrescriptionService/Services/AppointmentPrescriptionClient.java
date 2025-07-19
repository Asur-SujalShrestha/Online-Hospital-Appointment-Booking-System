package com.prescription.PrescriptionService.Services;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "APPOINTMENTBOOKING")
public interface AppointmentPrescriptionClient {
    @GetMapping("/nepoHeal/appointment/isAppointmentExist/{appointmentId}")
    public boolean appointmentExist(@PathVariable long appointmentId);
}
