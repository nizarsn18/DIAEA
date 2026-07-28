package com.diaea.parcinfo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mouvements_materiel")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MouvementMateriel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "materiel_id", nullable = false)
    private Materiel materiel;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ancien_affectataire_id")
    private Utilisateur ancienAffectataire;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "nouveau_affectataire_id")
    private Utilisateur nouveauAffectataire;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_mouvement", nullable = false, length = 40)
    private TypeMouvement typeMouvement;

    @Column(name = "date_mouvement", nullable = false)
    private LocalDateTime dateMouvement;

    @Column(length = 255)
    private String motif;

    @Column(name = "etat_materiel_transfert", length = 50)
    private String etatMaterielTransfert;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "validateur_id")
    private Utilisateur validateur;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @PrePersist
    protected void onCreate() {
        if (this.dateMouvement == null) {
            this.dateMouvement = LocalDateTime.now();
        }
    }
}
