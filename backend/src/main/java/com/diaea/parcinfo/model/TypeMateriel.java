package com.diaea.parcinfo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "types_materiel")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TypeMateriel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String libelle;
}
