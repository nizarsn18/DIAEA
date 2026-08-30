package com.diaea.parcinfo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "incidents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_ticket", unique = true, nullable = false, length = 50)
    private String numeroTicket;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "declarant_id", nullable = false)
    private Utilisateur declarant;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "materiel_id")
    private Materiel materiel;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_incident", nullable = false, length = 40)
    private TypeIncident typeIncident;

    @Column(name = "description_probleme", columnDefinition = "TEXT", nullable = false)
    private String descriptionProbleme;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PrioriteIncident priorite = PrioriteIncident.NORMALE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agent_traitement_id")
    private Utilisateur agentTraitement;

    @Column(name = "action_realisee", columnDefinition = "TEXT")
    private String actionRealisee;

    @OneToMany(mappedBy = "incident", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("incident")
    @Builder.Default
    private List<Intervention> interventions = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private StatutIncident statut = StatutIncident.NOUVEAU;

    @Column(name = "date_cloture")
    private LocalDateTime dateCloture;

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
