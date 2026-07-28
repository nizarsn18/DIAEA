package com.diaea.parcinfo.repository;

import com.diaea.parcinfo.model.EtatMateriel;
import com.diaea.parcinfo.model.Materiel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterielRepository extends JpaRepository<Materiel, Long> {
    Optional<Materiel> findByCodeInventaire(String codeInventaire);
    List<Materiel> findByEtatMateriel(EtatMateriel etatMateriel);
    List<Materiel> findByTypeMateriel(String typeMateriel);
    List<Materiel> findByUtilisateurAffectataireId(Long utilisateurId);

    long countByEtatMateriel(EtatMateriel etatMateriel);

    @Query("SELECT m.typeMateriel, COUNT(m) FROM Materiel m GROUP BY m.typeMateriel")
    List<Object[]> countByGroupedType();
}
