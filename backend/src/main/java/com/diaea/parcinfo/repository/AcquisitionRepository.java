package com.diaea.parcinfo.repository;

import com.diaea.parcinfo.model.Acquisition;
import com.diaea.parcinfo.model.TypeAcquisition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AcquisitionRepository extends JpaRepository<Acquisition, Long> {
    Optional<Acquisition> findByReference(String reference);
    List<Acquisition> findByTypeAcquisition(TypeAcquisition typeAcquisition);
}
