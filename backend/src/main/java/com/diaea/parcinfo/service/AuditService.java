package com.diaea.parcinfo.service;

import com.diaea.parcinfo.model.AuditLog;
import com.diaea.parcinfo.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(String username, String action, String entite, String reference, String details) {
        AuditLog logEntry = AuditLog.builder()
                .username(username)
                .action(action)
                .entiteConcernee(entite)
                .referenceEntite(reference)
                .details(details)
                .build();
        auditLogRepository.save(logEntry);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc();
    }
}
