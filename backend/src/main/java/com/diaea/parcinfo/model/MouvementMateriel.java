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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agent_cellule_id")
    private Utilisateur agentCellule;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_mouvement", nullable = false, length = 40)
    private TypeMouvement typeMouvement;

    @Column(name = "date_mouvement", nullable = false)
    private LocalDateTime dateMouvement;

    @Column(name = "ancienne_localisation", length = 150)
    private String ancienneLocalisation;

    @Column(name = "nouvelle_localisation", length = 150)
    private String nouvelleLocalisation;

    @Column(length = 255)
    private String motif;

    @Column(name = "etat_materiel_constate", length = 100)
    private String etatMaterielConstate;

    @Column(name = "etat_materiel_transfert", length = 100)
    private String etatMaterielTransfert;

    @Column(name = "accessoires_remis", columnDefinition = "TEXT")
    private String accessoiresRemis;

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
        if (this.etatMaterielConstate == null && this.etatMaterielTransfert != null) {
            this.etatMaterielConstate = this.etatMaterielTransfert;
        }
    }
}
