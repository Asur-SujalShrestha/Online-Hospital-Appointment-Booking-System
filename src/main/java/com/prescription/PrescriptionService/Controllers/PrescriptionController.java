package com.prescription.PrescriptionService.Controllers;

import com.prescription.PrescriptionService.DTOs.AddPrescriptionDTO;
import com.prescription.PrescriptionService.Entites.Prescriptions;
import jakarta.ws.rs.NotFoundException;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/nepoHeal/prescription")
public class PrescriptionController {
    private final com.prescription.PrescriptionService.Services.Implementations.PrescriptionService prescriptionService;

    public PrescriptionController(com.prescription.PrescriptionService.Services.Implementations.PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @PostMapping("/add-prescription")
    public ResponseEntity<String> addPrescription(@RequestBody AddPrescriptionDTO prescriptionDTO) throws BadRequestException {
        String result = prescriptionService.addPrescriptionService(prescriptionDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/get-all-prescription")
    public ResponseEntity<List<Prescriptions>> GetAllPrescription() {
        List<Prescriptions> allPrescription = prescriptionService.getAllPrescription();
        return ResponseEntity.ok(allPrescription);
    }

    @GetMapping("/get-prescriptionByDoctorId/{doctorId}")
    public ResponseEntity<List<Prescriptions>> getPrescriptionByDoctorId(@PathVariable long doctorId) {
        List<Prescriptions> prescriptionsList = prescriptionService.getPrescriptionByDoctorId(doctorId);
        return ResponseEntity.ok(prescriptionsList);
    }

    @GetMapping("/get-prescriptionByPatientId/{patientId}")
    public ResponseEntity<List<Prescriptions>> getPrescriptionByPatientId(@PathVariable long patientId) {
       List<Prescriptions> prescriptions = prescriptionService.getPrescriptionByPatientId(patientId);
       return ResponseEntity.ok(prescriptions);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleBadRequestException(BadRequestException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<String> handleNotFoundException(NotFoundException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }
}
