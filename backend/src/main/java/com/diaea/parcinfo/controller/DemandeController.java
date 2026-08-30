package com.diaea.parcinfo.controller;

import com.diaea.parcinfo.model.*;
import com.diaea.parcinfo.repository.DemandeMaterielRepository;
import com.diaea.parcinfo.repository.UtilisateurRepository;
import com.diaea.parcinfo.repository.ValidationRepository;
import com.diaea.parcinfo.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/demandes")
public class DemandeController {

    @Autowired
    private DemandeMaterielRepository demandeRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private ValidationRepository validationRepository;

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<DemandeMateriel>> getAllDemandes(
            Authentication authentication,
            @RequestParam(required = false) StatutDemande statut) {

        Utilisateur user = utilisateurRepository.findByUsername(authentication.getName()).orElseThrow();
        boolean isCelluleOrAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().contains("CELLULE_INFORMATIQUE") || a.getAuthority().contains("ADMINISTRATEUR"));

        if (isCelluleOrAdmin) {
            if (statut != null) {
                return ResponseEntity.ok(demandeRepository.findByStatut(statut));
            }
            return ResponseEntity.ok(demandeRepository.findAll());
        }

        boolean isChefService = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().contains("CHEF_SERVICE"));
        if (isChefService) {
            return ResponseEntity.ok(demandeRepository.findByDemandeurServiceAndStatut(user.getService(), StatutDemande.EN_ATTENTE_VALIDATION_CS));
        }

        boolean isChefDivision = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().contains("CHEF_DIVISION"));
        if (isChefDivision) {
            return ResponseEntity.ok(demandeRepository.findByDemandeurDivisionAndStatut(user.getDivision(), StatutDemande.EN_ATTENTE_VALIDATION_CD));
        }

        // Par défaut: demandes de l'utilisateur connecté
        return ResponseEntity.ok(demandeRepository.findByDemandeurId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<DemandeMateriel> createDemande(@RequestBody DemandeMateriel demande, Authentication authentication) {
        Utilisateur user = utilisateurRepository.findByUsername(authentication.getName()).orElseThrow();
        demande.setDemandeur(user);
        demande.setNumeroDemande("DEM-" + System.currentTimeMillis() / 1000);
        demande.setStatut(StatutDemande.EN_ATTENTE_VALIDATION_CS);
        DemandeMateriel saved = demandeRepository.save(demande);

        notificationService.envoyer(user, "DEMANDE", "Votre demande N° " + saved.getNumeroDemande() + " a été créée et transmise au Chef de Service.");
        return ResponseEntity.ok(saved);
    }

    // Validation Chef de Service
    @PutMapping("/{id}/valider-cs")
    @PreAuthorize("hasAnyRole('CHEF_SERVICE', 'ADMINISTRATEUR')")
    @Transactional
    public ResponseEntity<DemandeMateriel> validerChefService(
            @PathVariable Long id,
            @RequestParam Boolean valide,
            @RequestParam(required = false) String avis,
            Authentication authentication) {

        Utilisateur validateur = utilisateurRepository.findByUsername(authentication.getName()).orElseThrow();

        return demandeRepository.findById(id).map(demande -> {
            demande.setValidationChefService(valide);
            demande.setAvisChefService(avis);
            demande.setDateValidationCS(LocalDateTime.now());
            Validation.DecisionValidation decisionEnum = valide ? Validation.DecisionValidation.VALIDEE : Validation.DecisionValidation.REJETEE;

            if (valide) {
                demande.setStatut(StatutDemande.EN_ATTENTE_VALIDATION_CD);
            } else {
                demande.setStatut(StatutDemande.REJETEE);
            }

            Validation v = Validation.builder()
                    .demandeMateriel(demande)
                    .validateur(validateur)
                    .niveau(Validation.NiveauValidation.CHEF_SERVICE)
                    .decision(decisionEnum)
                    .commentaire(avis)
                    .build();
            validationRepository.save(v);

            demandeRepository.save(demande);

            notificationService.envoyer(
                    demande.getDemandeur(),
                    "DEMANDE",
                    "Votre demande N° " + demande.getNumeroDemande() + " a été " + (valide ? "validée par votre Chef de Service." : "rejetée par votre Chef de Service.")
            );

            return ResponseEntity.ok(demande);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Validation Chef de Division
    @PutMapping("/{id}/valider-cd")
    @PreAuthorize("hasAnyRole('CHEF_DIVISION', 'ADMINISTRATEUR')")
    @Transactional
    public ResponseEntity<DemandeMateriel> validerChefDivision(
            @PathVariable Long id,
            @RequestParam Boolean valide,
            @RequestParam(required = false) String avis,
            Authentication authentication) {

        Utilisateur validateur = utilisateurRepository.findByUsername(authentication.getName()).orElseThrow();

        return demandeRepository.findById(id).map(demande -> {
            demande.setValidationChefDivision(valide);
            demande.setAvisChefDivision(avis);
            demande.setDateValidationCD(LocalDateTime.now());
            Validation.DecisionValidation decisionEnum = valide ? Validation.DecisionValidation.VALIDEE : Validation.DecisionValidation.REJETEE;

            if (valide) {
                demande.setStatut(StatutDemande.TRANSMISE_CELLULE_INFO);
            } else {
                demande.setStatut(StatutDemande.REJETEE);
            }

            Validation v = Validation.builder()
                    .demandeMateriel(demande)
                    .validateur(validateur)
                    .niveau(Validation.NiveauValidation.CHEF_DIVISION)
                    .decision(decisionEnum)
                    .commentaire(avis)
                    .build();
            validationRepository.save(v);

            demandeRepository.save(demande);

            notificationService.envoyer(
                    demande.getDemandeur(),
                    "DEMANDE",
                    "Votre demande N° " + demande.getNumeroDemande() + " a été " + (valide ? "validée par votre Chef de Division." : "rejetée par votre Chef de Division.")
            );

            return ResponseEntity.ok(demande);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Décision Cellule Informatique
    @PutMapping("/{id}/decision-cellule")
    @PreAuthorize("hasAnyRole('CELLULE_INFORMATIQUE', 'ADMINISTRATEUR')")
    @Transactional
    public ResponseEntity<DemandeMateriel> decisionCelluleInfo(
            @PathVariable Long id,
            @RequestParam StatutDemande nouveauStatut,
            @RequestParam(required = false) String decision) {

        return demandeRepository.findById(id).map(demande -> {
            demande.setStatut(nouveauStatut);
            demande.setDecisionCelluleInfo(decision);
            demande.setDateDecisionCelluleInfo(LocalDateTime.now());
            DemandeMateriel saved = demandeRepository.save(demande);

            notificationService.envoyer(
                    demande.getDemandeur(),
                    "DEMANDE",
                    "Mise à jour de la demande N° " + demande.getNumeroDemande() + " par la Cellule Informatique: " + nouveauStatut
            );

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
