package com.diaea.parcinfo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "referentiels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Referentiel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String categorie; // MARQUE, FOURNISSEUR, TYPE_MATERIEL, DIVISION, SERVICE

    @Column(nullable = false, length = 100)
    private String code;

    @Column(nullable = false, length = 150)
    private String libelle;

    @Column(length = 255)
    private String description;

    @Builder.Default
    private Boolean actif = true;
}
