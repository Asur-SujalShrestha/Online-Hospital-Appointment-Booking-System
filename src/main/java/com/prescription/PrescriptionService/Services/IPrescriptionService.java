package com.prescription.PrescriptionService.Services;

import com.prescription.PrescriptionService.DTOs.AddPrescriptionDTO;
import com.prescription.PrescriptionService.Entites.Prescriptions;
import org.apache.coyote.BadRequestException;

import java.util.List;

public interface IPrescriptionService {
    String addPrescriptionService(AddPrescriptionDTO prescriptionDTO) throws BadRequestException;

    List<Prescriptions> getAllPrescription();

    List<Prescriptions> getPrescriptionByDoctorId(long doctorId);

    List<Prescriptions> getPrescriptionByPatientId(long patientId);
}
