package com.diaea.parcinfo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "affectations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Affectation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "materiel_id", nullable = false)
    private Materiel materiel;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "utilisateur_affectataire_id", nullable = false)
    private Utilisateur utilisateurAffectataire;

    @Column(name = "service_division", length = 150)
    private String serviceDivision;

    @Column(name = "date_affectation", nullable = false)
    private LocalDate dateAffectation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MotifAffectation motif;

    @Column(name = "etat_remise", length = 50)
    private String etatRemise; // Bon état, neuf, utilisé

    @Column(name = "accessoires_remis", columnDefinition = "TEXT")
    private String accessoiresRemis;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Column(name = "valide_par_cellule")
    @Builder.Default
    private Boolean valideParCellule = true;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
