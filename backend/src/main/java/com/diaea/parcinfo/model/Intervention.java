package com.diaea.parcinfo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "interventions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Intervention {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incident_id", nullable = false)
    @JsonIgnoreProperties("interventions")
    private Incident incident;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agent_cellule_id", nullable = false)
    private Utilisateur agentCellule;

    @Column(name = "date_intervention", nullable = false)
    private LocalDateTime dateIntervention;

    @Column(name = "action_realisee", columnDefinition = "TEXT", nullable = false)
    private String actionRealisee;

    @Column(name = "duree_minutes")
    private Integer dureeMinutes;

    @Column(name = "statut_intervention", length = 50)
    private String statutIntervention; // EN_COURS, TERMINEE, EN_ATTENTE

    @PrePersist
    protected void onCreate() {
        if (this.dateIntervention == null) {
            this.dateIntervention = LocalDateTime.now();
        }
    }
}
