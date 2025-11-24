package com.appointmentBooking.AppointmentBooking.Services;

import com.appointmentBooking.AppointmentBooking.DTOs.Prescriptions;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "PRESCRIPTIONSERVICE")
public interface PrescriptionClient {

    @GetMapping("/nepoHeal/prescription/getPrescriptionByAppointment/{appointmentId}")
    public List<Prescriptions> getPrescriptionByAppointment(@PathVariable("appointmentId") long appointmentId);
}
