package com.diaea.parcinfo.repository;

import com.diaea.parcinfo.model.DocumentJoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentJointRepository extends JpaRepository<DocumentJoint, Long> {
    List<DocumentJoint> findByAcquisitionId(Long acquisitionId);
}
