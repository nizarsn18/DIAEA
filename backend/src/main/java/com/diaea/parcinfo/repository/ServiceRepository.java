package com.diaea.parcinfo.repository;

import com.diaea.parcinfo.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    Optional<Service> findByLibelle(String libelle);
    List<Service> findByDivisionId(Long divisionId);
}
