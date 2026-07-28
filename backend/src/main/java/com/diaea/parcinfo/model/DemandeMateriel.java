package com.diaea.parcinfo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "demandes_materiel")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandeMateriel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_demande", unique = true, nullable = false, length = 50)
    private String numeroDemande;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "demandeur_id", nullable = false)
    private Utilisateur demandeur;

    @Column(name = "type_materiel_demande", nullable = false, length = 100)
    private String typeMaterielDemande;

    @Column(name = "quantite_demande", nullable = false)
    @Builder.Default
    private Integer quantiteDemande = 1;

    @Column(name = "justification_besoin", columnDefinition = "TEXT", nullable = false)
    private String justificationBesoin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UrgenceDemande urgence = UrgenceDemande.NORMALE;

    @Column(name = "pieces_jointes", length = 255)
    private String piecesJointes;

    // Avis & Validations
    @Column(name = "avis_chef_service", columnDefinition = "TEXT")
    private String avisChefService;

    @Column(name = "validation_chef_service")
    private Boolean validationChefService;

    @Column(name = "date_validation_cs")
    private LocalDateTime dateValidationCS;

    @Column(name = "avis_chef_division", columnDefinition = "TEXT")
    private String avisChefDivision;

    @Column(name = "validation_chef_division")
    private Boolean validationChefDivision;

    @Column(name = "date_validation_cd")
    private LocalDateTime dateValidationCD;

    @Column(name = "decision_cellule_info", columnDefinition = "TEXT")
    private String decisionCelluleInfo;

    @Column(name = "date_decision_cellule_info")
    private LocalDateTime dateDecisionCelluleInfo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    @Builder.Default
    private StatutDemande statut = StatutDemande.SOUMISE;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
