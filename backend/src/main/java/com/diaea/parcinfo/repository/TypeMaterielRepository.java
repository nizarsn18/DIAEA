package com.diaea.parcinfo.repository;

import com.diaea.parcinfo.model.TypeMateriel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TypeMaterielRepository extends JpaRepository<TypeMateriel, Long> {
    Optional<TypeMateriel> findByLibelle(String libelle);
}
