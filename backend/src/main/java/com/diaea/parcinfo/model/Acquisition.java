package com.diaea.parcinfo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "acquisitions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Acquisition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_acquisition", nullable = false, length = 20)
    private TypeAcquisition typeAcquisition; // BDC ou MARCHE

    @Column(unique = true, nullable = false, length = 100)
    private String reference; // N° BDC ou marché

    @Column(nullable = false, length = 255)
    private String objet;

    @Column(nullable = false, length = 150)
    private String fournisseur;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseurRef;

    @Column(name = "date_lancement")
    private LocalDate dateLancement;

    @Column(name = "date_notification")
    private LocalDate dateNotification;

    @Column(name = "delai_livraison", length = 100)
    private String delaiLivraison;

    @Column(precision = 12, scale = 2)
    private BigDecimal montant;

    @Column(name = "materiel_concerne", length = 150)
    private String materielConcerne;

    @Column(name = "quantite_commandee", nullable = false)
    private Integer quantiteCommandee;

    @Column(name = "quantite_livree")
    @Builder.Default
    private Integer quantiteLivree = 0;

    @Column(name = "date_reception")
    private LocalDate dateReception;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private StatutAcquisition statut = StatutAcquisition.EN_PREPARATION;

    @Column(name = "documents_joints", length = 255)
    private String documentsJoints;

    @OneToMany(mappedBy = "acquisition", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("acquisition")
    @Builder.Default
    private List<DocumentJoint> documents = new ArrayList<>();

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
