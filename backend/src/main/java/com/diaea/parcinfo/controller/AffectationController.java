package com.diaea.parcinfo.controller;

import com.diaea.parcinfo.model.*;
import com.diaea.parcinfo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/affectations")
public class AffectationController {

    @Autowired
    private AffectationRepository affectationRepository;

    @Autowired
    private MaterielRepository materielRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private MouvementMaterielRepository mouvementRepository;

    @GetMapping
    public ResponseEntity<List<Affectation>> getAll() {
        return ResponseEntity.ok(affectationRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CELLULE_INFORMATIQUE', 'ADMINISTRATEUR')")
    public ResponseEntity<?> affecterMateriel(@RequestBody Affectation affectation, Authentication authentication) {
        Materiel materiel = materielRepository.findById(affectation.getMateriel().getId()).orElseThrow();
        Utilisateur nouvelUtilisateur = utilisateurRepository.findById(affectation.getUtilisateurAffectataire().getId()).orElseThrow();
        Utilisateur ancienUtilisateur = materiel.getUtilisateurAffectataire();
        Utilisateur validateur = utilisateurRepository.findByUsername(authentication.getName()).orElseThrow();

        // 1. Mettre à jour l'équipement
        materiel.setUtilisateurAffectataire(nouvelUtilisateur);
        materiel.setEtatMateriel(EtatMateriel.AFFECTE);
        materiel.setDateAffectation(LocalDate.now());
        materielRepository.save(materiel);

        // 2. Enregistrer l'affectation
        affectation.setDateAffectation(LocalDate.now());
        Affectation saved = affectationRepository.save(affectation);

        // 3. Enregistrer l'historique dans MouvementMateriel
        MouvementMateriel mvt = MouvementMateriel.builder()
                .materiel(materiel)
                .ancienAffectataire(ancienUtilisateur)
                .nouveauAffectataire(nouvelUtilisateur)
                .typeMouvement(TypeMouvement.MUTATION_UTILISATEUR)
                .dateMouvement(LocalDateTime.now())
                .motif(affectation.getMotif() != null ? affectation.getMotif().name() : "Affectation matériel")
                .etatMaterielTransfert(affectation.getEtatRemise())
                .validateur(validateur)
                .observations(affectation.getObservations())
                .build();
        mouvementRepository.save(mvt);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/mouvements/{materielId}")
    public ResponseEntity<List<MouvementMateriel>> getHistoriqueMouvements(@PathVariable Long materielId) {
        return ResponseEntity.ok(mouvementRepository.findByMaterielIdOrderByDateMouvementDesc(materielId));
    }
}
