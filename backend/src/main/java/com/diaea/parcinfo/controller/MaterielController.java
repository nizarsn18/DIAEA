package com.diaea.parcinfo.controller;

import com.diaea.parcinfo.model.EtatMateriel;
import com.diaea.parcinfo.model.Materiel;
import com.diaea.parcinfo.repository.MaterielRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/materiels")
public class MaterielController {

    @Autowired
    private MaterielRepository materielRepository;

    @GetMapping
    public ResponseEntity<List<Materiel>> getAllMateriels(
            @RequestParam(required = false) EtatMateriel etat,
            @RequestParam(required = false) String type) {
        if (etat != null) {
            return ResponseEntity.ok(materielRepository.findByEtatMateriel(etat));
        }
        if (type != null) {
            return ResponseEntity.ok(materielRepository.findByTypeMateriel(type));
        }
        return ResponseEntity.ok(materielRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Materiel> getMaterielById(@PathVariable Long id) {
        return materielRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'CELLULE_INFORMATIQUE')")
    public ResponseEntity<Materiel> createMateriel(@RequestBody Materiel materiel) {
        return ResponseEntity.ok(materielRepository.save(materiel));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'CELLULE_INFORMATIQUE')")
    public ResponseEntity<Materiel> updateMateriel(@PathVariable Long id, @RequestBody Materiel details) {
        return materielRepository.findById(id).map(materiel -> {
            materiel.setTypeMateriel(details.getTypeMateriel());
            materiel.setMarque(details.getMarque());
            materiel.setModele(details.getModele());
            materiel.setNumeroSerie(details.getNumeroSerie());
            materiel.setCaracteristiquesTechniques(details.getCaracteristiquesTechniques());
            materiel.setSourceAcquisition(details.getSourceAcquisition());
            materiel.setReferenceAcquisition(details.getReferenceAcquisition());
            materiel.setDateAcquisition(details.getDateAcquisition());
            materiel.setGarantie(details.getGarantie());
            materiel.setEtatMateriel(details.getEtatMateriel());
            materiel.setLocalisation(details.getLocalisation());
            materiel.setObservations(details.getObservations());
            return ResponseEntity.ok(materielRepository.save(materiel));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<?> deleteMateriel(@PathVariable Long id) {
        return materielRepository.findById(id).map(materiel -> {
            materielRepository.delete(materiel);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
