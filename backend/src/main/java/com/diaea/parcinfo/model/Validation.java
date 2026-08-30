package com.diaea.parcinfo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "validations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Validation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "demande_materiel_id", nullable = false)
    @JsonIgnoreProperties("validations")
    private DemandeMateriel demandeMateriel;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "validateur_id", nullable = false)
    private Utilisateur validateur;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private NiveauValidation niveau; // CHEF_SERVICE, CHEF_DIVISION

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DecisionValidation decision; // VALIDEE, REJETEE, RETOUR

    @Column(name = "date_validation", nullable = false)
    private LocalDateTime dateValidation;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    public enum NiveauValidation {
        CHEF_SERVICE,
        CHEF_DIVISION
    }

    public enum DecisionValidation {
        VALIDEE,
        REJETEE,
        RETOUR
    }

    @PrePersist
    protected void onCreate() {
        if (this.dateValidation == null) {
            this.dateValidation = LocalDateTime.now();
        }
    }
}
