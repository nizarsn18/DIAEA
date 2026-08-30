package com.diaea.parcinfo.repository;

import com.diaea.parcinfo.model.Intervention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    List<Intervention> findByIncidentIdOrderByDateInterventionDesc(Long incidentId);
    List<Intervention> findByAgentCelluleId(Long agentId);
}
