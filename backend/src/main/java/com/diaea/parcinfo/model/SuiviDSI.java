package com.diaea.parcinfo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "suivi_dsi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuiviDSI {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_demande_interne", nullable = false, length = 50)
    private String numeroDemandeInterne;

    @Column(name = "reference_courrier_dsi", length = 100)
    private String referenceCourrierDSI;

    @Column(name = "date_transmission", nullable = false)
    private LocalDate dateTransmission;

    @Column(name = "type_materiel_demande", nullable = false, length = 100)
    private String typeMaterielDemande;

    @Column(name = "quantite_demandee", nullable = false)
    private Integer quantiteDemandee;

    @Column(name = "quantite_accordee")
    private Integer quantiteAccordee;

    @Column(name = "delai_livraison")
    private Integer delaiLivraison; // Delai en jours

    @Enumerated(EnumType.STRING)
    @Column(name = "statut_dsi", nullable = false, length = 30)
    @Builder.Default
    private StatutDSI statutDSI = StatutDSI.ENVOYEE;

    @Column(name = "date_reponse")
    private LocalDate dateReponse;

    @Column(name = "date_reception")
    private LocalDate dateReception;

    @Column(columnDefinition = "TEXT")
    private String observations;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
