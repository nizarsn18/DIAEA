package com.diaea.parcinfo.repository;

import com.diaea.parcinfo.model.StatutDSI;
import com.diaea.parcinfo.model.SuiviDSI;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuiviDSIRepository extends JpaRepository<SuiviDSI, Long> {
    List<SuiviDSI> findByStatutDSI(StatutDSI statutDSI);
    long countByStatutDSI(StatutDSI statutDSI);
}
