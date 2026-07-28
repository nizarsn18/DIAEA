package com.diaea.parcinfo.repository;

import com.diaea.parcinfo.model.DemandeMateriel;
import com.diaea.parcinfo.model.StatutDemande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DemandeMaterielRepository extends JpaRepository<DemandeMateriel, Long> {
    Optional<DemandeMateriel> findByNumeroDemande(String numeroDemande);
    List<DemandeMateriel> findByDemandeurId(Long demandeurId);
    List<DemandeMateriel> findByStatut(StatutDemande statut);
    List<DemandeMateriel> findByDemandeurServiceAndStatut(String service, StatutDemande statut);
    List<DemandeMateriel> findByDemandeurDivisionAndStatut(String division, StatutDemande statut);

    long countByStatut(StatutDemande statut);
}
