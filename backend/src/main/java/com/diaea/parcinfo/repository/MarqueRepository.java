package com.diaea.parcinfo.repository;

import com.diaea.parcinfo.model.Marque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MarqueRepository extends JpaRepository<Marque, Long> {
    Optional<Marque> findByLibelle(String libelle);
}
