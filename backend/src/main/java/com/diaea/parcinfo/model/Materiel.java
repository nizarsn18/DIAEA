package com.diaea.parcinfo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "materiels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Materiel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code_inventaire", unique = true, nullable = false, length = 50)
    private String codeInventaire;

    @Column(name = "type_materiel", nullable = false, length = 50)
    private String typeMateriel; // PC bureau, Imprimante, Scanner, etc.

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_materiel_id")
    private TypeMateriel typeMaterielRef;

    @Column(nullable = false, length = 100)
    private String marque;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "marque_id")
    private Marque marqueRef;

    @Column(nullable = false, length = 100)
    private String modele;

    @Column(name = "numero_serie", length = 100)
    private String numeroSerie;

    @Column(name = "caracteristiques_techniques", columnDefinition = "TEXT")
    private String caracteristiquesTechniques;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_acquisition", length = 30)
    private SourceAcquisition sourceAcquisition;

    @Column(name = "reference_acquisition", length = 100)
    private String referenceAcquisition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acquisition_id")
    @JsonIgnoreProperties("documents")
    private Acquisition acquisition;

    @Column(name = "date_acquisition")
    private LocalDate dateAcquisition;

    @Column(name = "date_fin_garantie")
    private LocalDate dateFinGarantie;

    @Column(length = 100)
    private String garantie; // Durée ou description

    @Enumerated(EnumType.STRING)
    @Column(name = "etat_materiel", nullable = false, length = 30)
    @Builder.Default
    private EtatMateriel etatMateriel = EtatMateriel.DISPONIBLE;

    @Column(length = 150)
    private String localisation; // Bureau, Service, Division

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_affectataire_id")
    private Utilisateur utilisateurAffectataire;

    @Column(name = "date_affectation")
    private LocalDate dateAffectation;

    @Column(columnDefinition = "TEXT")
    private String observations;

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
