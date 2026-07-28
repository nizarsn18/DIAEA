package com.diaea.parcinfo.repository;

import com.diaea.parcinfo.model.Referentiel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferentielRepository extends JpaRepository<Referentiel, Long> {
    List<Referentiel> findByCategorieAndActifTrue(String categorie);
    List<Referentiel> findByCategorie(String categorie);
}
