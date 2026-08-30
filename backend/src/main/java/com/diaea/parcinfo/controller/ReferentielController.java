package com.diaea.parcinfo.controller;

import com.diaea.parcinfo.model.*;
import com.diaea.parcinfo.service.ReferentielService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/referentiels")
@RequiredArgsConstructor
public class ReferentielController {

    private final ReferentielService referentielService;

    // --- Divisions ---
    @GetMapping("/divisions")
    public ResponseEntity<List<Division>> getDivisions() {
        return ResponseEntity.ok(referentielService.getAllDivisions());
    }

    @PostMapping("/divisions")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'CELLULE_INFORMATIQUE')")
    public ResponseEntity<Division> createDivision(@RequestBody Division division) {
        return ResponseEntity.ok(referentielService.saveDivision(division));
    }

    @DeleteMapping("/divisions/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR')")
    public ResponseEntity<Void> deleteDivision(@PathVariable Long id) {
        referentielService.deleteDivision(id);
        return ResponseEntity.noContent().build();
    }

    // --- Services ---
    @GetMapping("/services")
    public ResponseEntity<List<Service>> getServices() {
        return ResponseEntity.ok(referentielService.getAllServices());
    }

    @PostMapping("/services")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'CELLULE_INFORMATIQUE')")
    public ResponseEntity<Service> createService(@RequestBody Service service) {
        return ResponseEntity.ok(referentielService.saveService(service));
    }

    @DeleteMapping("/services/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR')")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        referentielService.deleteService(id);
        return ResponseEntity.noContent().build();
    }

    // --- Profils ---
    @GetMapping("/profils")
    public ResponseEntity<List<Profil>> getProfils() {
        return ResponseEntity.ok(referentielService.getAllProfils());
    }

    @PostMapping("/profils")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR')")
    public ResponseEntity<Profil> createProfil(@RequestBody Profil profil) {
        return ResponseEntity.ok(referentielService.saveProfil(profil));
    }

    // --- Marques ---
    @GetMapping("/marques")
    public ResponseEntity<List<Marque>> getMarques() {
        return ResponseEntity.ok(referentielService.getAllMarques());
    }

    @PostMapping("/marques")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'CELLULE_INFORMATIQUE')")
    public ResponseEntity<Marque> createMarque(@RequestBody Marque marque) {
        return ResponseEntity.ok(referentielService.saveMarque(marque));
    }

    @DeleteMapping("/marques/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'CELLULE_INFORMATIQUE')")
    public ResponseEntity<Void> deleteMarque(@PathVariable Long id) {
        referentielService.deleteMarque(id);
        return ResponseEntity.noContent().build();
    }

    // --- Types Materiel ---
    @GetMapping("/types-materiel")
    public ResponseEntity<List<TypeMateriel>> getTypesMateriel() {
        return ResponseEntity.ok(referentielService.getAllTypesMateriel());
    }

    @PostMapping("/types-materiel")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'CELLULE_INFORMATIQUE')")
    public ResponseEntity<TypeMateriel> createTypeMateriel(@RequestBody TypeMateriel typeMateriel) {
        return ResponseEntity.ok(referentielService.saveTypeMateriel(typeMateriel));
    }

    @DeleteMapping("/types-materiel/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'CELLULE_INFORMATIQUE')")
    public ResponseEntity<Void> deleteTypeMateriel(@PathVariable Long id) {
        referentielService.deleteTypeMateriel(id);
        return ResponseEntity.noContent().build();
    }

    // --- Fournisseurs ---
    @GetMapping("/fournisseurs")
    public ResponseEntity<List<Fournisseur>> getFournisseurs() {
        return ResponseEntity.ok(referentielService.getAllFournisseurs());
    }

    @PostMapping("/fournisseurs")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'CELLULE_INFORMATIQUE')")
    public ResponseEntity<Fournisseur> createFournisseur(@RequestBody Fournisseur fournisseur) {
        return ResponseEntity.ok(referentielService.saveFournisseur(fournisseur));
    }

    @DeleteMapping("/fournisseurs/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'CELLULE_INFORMATIQUE')")
    public ResponseEntity<Void> deleteFournisseur(@PathVariable Long id) {
        referentielService.deleteFournisseur(id);
        return ResponseEntity.noContent().build();
    }
}
