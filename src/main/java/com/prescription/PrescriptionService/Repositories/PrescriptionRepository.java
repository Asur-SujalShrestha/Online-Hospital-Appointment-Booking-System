package com.prescription.PrescriptionService.Repositories;

import com.prescription.PrescriptionService.Entites.Prescriptions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescriptions, Long> {
    List<Prescriptions> findByDoctorId(long doctorId);

    List<Prescriptions> findByPatientId(long patientId);
}
