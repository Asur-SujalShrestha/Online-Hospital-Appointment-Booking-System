package com.appointmentBooking.AppointmentBooking.Controllers;

import com.appointmentBooking.AppointmentBooking.DTOs.AddAppointmentDTO;
import com.appointmentBooking.AppointmentBooking.DTOs.AddedAppointmentResponse;
import com.appointmentBooking.AppointmentBooking.DTOs.UpdateAppointmentDTO;
import com.appointmentBooking.AppointmentBooking.Entities.Appointments;
import com.appointmentBooking.AppointmentBooking.Services.IAppointmentService;
import com.appointmentBooking.AppointmentBooking.Services.Implementations.AppointmentService;
import org.apache.coyote.BadRequestException;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/nepoHeal/appointment")
public class AppointmentController {
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/book-appointment")
    public ResponseEntity<AddedAppointmentResponse> addAppointment(@RequestBody AddAppointmentDTO appointmentDto) throws BadRequestException {
        AddedAppointmentResponse message = appointmentService.addAppointment(appointmentDto);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/getAllAppointment")
    public ResponseEntity<List<Appointments>> getAllAppointment() {
        List<Appointments> appointmentsList = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointmentsList);
    }

    @GetMapping("/get-appointment-by-doctorId/{doctorId}")
    public ResponseEntity<List<Appointments>> getAppointmentsByDoctorId(@PathVariable Long doctorId) throws BadRequestException {
        List<Appointments> appointmentsList = appointmentService.getAppointmentByDoctorId(doctorId);
        return ResponseEntity.ok(appointmentsList);
    }

    @GetMapping("/get-appointment-by-patientId/{patientId}")
    public ResponseEntity<List<Appointments>> getAppointmentsByPatientId(@PathVariable Long patientId) throws BadRequestException {
        List<Appointments> appointmentsList = appointmentService.getAppointmentByPatientId(patientId);
        return ResponseEntity.ok(appointmentsList);
    }

    @GetMapping("/isAppointmentExist/{appointmentId}")
    public ResponseEntity<Boolean> isAppointmentExist(@PathVariable Long appointmentId) throws BadRequestException {
        boolean result = appointmentService.checkAppointment(appointmentId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PatchMapping("/updateAppointmentTime/{appointmentId}")
    public ResponseEntity<String> updateAppointment(@PathVariable Long appointmentId, @RequestBody UpdateAppointmentDTO updateAppointmentDTO) throws BadRequestException {
        String result = appointmentService.updateAppointment(appointmentId, updateAppointmentDTO);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/deleteAppointment/{appointmentId}")
    public ResponseEntity<String> deleteAppointment(@PathVariable Long appointmentId) throws BadRequestException {
        String result = appointmentService.deleteAppointment(appointmentId);
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/updateAppointmentStatus/{appointmentId}")
    public ResponseEntity<String> updateAppointmentStatus(@PathVariable Long appointmentId, @RequestParam("status") String status) throws BadRequestException {
        String result = appointmentService.updateAppointmentStatus(appointmentId, status);
        return ResponseEntity.ok(result);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleBadRequestException(BadRequestException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST) ;
    }
    
}
