package com.diaea.parcinfo.repository;

import com.diaea.parcinfo.model.Incident;
import com.diaea.parcinfo.model.StatutIncident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    Optional<Incident> findByNumeroTicket(String numeroTicket);
    List<Incident> findByDeclarantId(Long declarantId);
    List<Incident> findByMaterielId(Long materielId);
    List<Incident> findByStatut(StatutIncident statut);

    long countByStatut(StatutIncident statut);
}
