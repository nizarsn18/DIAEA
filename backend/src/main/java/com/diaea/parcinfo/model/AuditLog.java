package com.diaea.parcinfo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String username;

    @Column(nullable = false, length = 100)
    private String action; // CREATION_DEMANDE, VALIDATION_CS, VALIDATION_CD, AFFECTATION_MATERIEL, CLOTURE_INCIDENT...

    @Column(nullable = false, length = 100)
    private String entiteConcernee; // MATERIEL, DEMANDE, INCIDENT, AFFECTATION

    @Column(length = 100)
    private String referenceEntite; // ID ou Code inventaire / N° demande

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(length = 50)
    private String adresseIp;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}
