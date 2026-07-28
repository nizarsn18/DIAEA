package com.diaea.parcinfo.repository;

import com.diaea.parcinfo.model.Affectation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AffectationRepository extends JpaRepository<Affectation, Long> {
    List<Affectation> findByMaterielId(Long materielId);
    List<Affectation> findByUtilisateurAffectataireId(Long utilisateurId);
}
