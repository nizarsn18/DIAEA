package com.diaea.parcinfo.repository;

import com.diaea.parcinfo.model.MouvementMateriel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MouvementMaterielRepository extends JpaRepository<MouvementMateriel, Long> {
    List<MouvementMateriel> findByMaterielIdOrderByDateMouvementDesc(Long materielId);
}
