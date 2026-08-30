package com.diaea.parcinfo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents_joints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentJoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom_fichier", nullable = false, length = 150)
    private String nomFichier;

    @Column(name = "type_document", length = 50)
    private String typeDocument;

    @Column(name = "chemin_fichier", nullable = false, length = 255)
    private String cheminFichier;

    @Column(name = "date_ajout")
    private LocalDateTime dateAjout;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acquisition_id")
    @JsonIgnore
    private Acquisition acquisition;

    @PrePersist
    protected void onCreate() {
        if (this.dateAjout == null) {
            this.dateAjout = LocalDateTime.now();
        }
    }
}
