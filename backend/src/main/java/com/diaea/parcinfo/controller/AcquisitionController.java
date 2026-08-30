package com.diaea.parcinfo.controller;

import com.diaea.parcinfo.model.*;
import com.diaea.parcinfo.repository.AcquisitionRepository;
import com.diaea.parcinfo.repository.MaterielRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/acquisitions")
public class AcquisitionController {

    @Autowired
    private AcquisitionRepository acquisitionRepository;

    @Autowired
    private MaterielRepository materielRepository;

    @GetMapping
    public ResponseEntity<List<Acquisition>> getAll() {
        return ResponseEntity.ok(acquisitionRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CELLULE_INFORMATIQUE', 'ADMINISTRATEUR')")
    public ResponseEntity<Acquisition> create(@RequestBody Acquisition acq) {
        return ResponseEntity.ok(acquisitionRepository.save(acq));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CELLULE_INFORMATIQUE', 'ADMINISTRATEUR')")
    public ResponseEntity<Acquisition> update(@PathVariable Long id, @RequestBody Acquisition details) {
        return acquisitionRepository.findById(id).map(acq -> {
            acq.setObjet(details.getObjet());
            acq.setFournisseur(details.getFournisseur());
            acq.setMontant(details.getMontant());
            acq.setQuantiteLivree(details.getQuantiteLivree());
            acq.setStatut(details.getStatut());
            acq.setDateReception(details.getDateReception());
            return ResponseEntity.ok(acquisitionRepository.save(acq));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/enregistrer-reception")
    @PreAuthorize("hasAnyRole('CELLULE_INFORMATIQUE', 'ADMINISTRATEUR')")
    public ResponseEntity<Acquisition> enregistrerReception(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return acquisitionRepository.findById(id).map(acq -> {
            Integer qteLivree = body.get("quantiteLivree") != null ? Integer.parseInt(body.get("quantiteLivree").toString()) : acq.getQuantiteCommandee();
            acq.setQuantiteLivree(qteLivree);
            acq.setDateReception(LocalDate.now());
            if (qteLivree >= acq.getQuantiteCommandee()) {
                acq.setStatut(StatutAcquisition.LIVREE);
            } else {
                acq.setStatut(StatutAcquisition.COMMANDEE);
            }
            return ResponseEntity.ok(acquisitionRepository.save(acq));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/alimenter-stock")
    @PreAuthorize("hasAnyRole('CELLULE_INFORMATIQUE', 'ADMINISTRATEUR')")
    @Transactional
    public ResponseEntity<Map<String, Object>> alimenterStock(@PathVariable Long id) {
        return acquisitionRepository.findById(id).map(acq -> {
            int countToCreate = (acq.getQuantiteLivree() != null && acq.getQuantiteLivree() > 0) ? acq.getQuantiteLivree() : acq.getQuantiteCommandee();
            List<Materiel> createdList = new ArrayList<>();
            String typeMat = (acq.getMaterielConcerne() != null && !acq.getMaterielConcerne().isEmpty()) ? acq.getMaterielConcerne() : "Matériel Informatique";

            for (int i = 1; i <= countToCreate; i++) {
                String codeInv = "INV-ACQ" + acq.getId() + "-" + System.currentTimeMillis() % 10000 + "-" + i;
                Materiel mat = Materiel.builder()
                        .codeInventaire(codeInv)
                        .typeMateriel(typeMat)
                        .marque("Acquisition " + acq.getReference())
                        .modele(acq.getObjet())
                        .sourceAcquisition(SourceAcquisition.valueOf(acq.getTypeAcquisition().name()))
                        .referenceAcquisition(acq.getReference())
                        .dateAcquisition(acq.getDateReception() != null ? acq.getDateReception() : LocalDate.now())
                        .etatMateriel(EtatMateriel.DISPONIBLE)
                        .localisation("Stock Cellule Informatique")
                        .acquisition(acq)
                        .observations("Matériel issu de l'acquisition N° " + acq.getReference())
                        .build();
                createdList.add(materielRepository.save(mat));
            }
            acq.setStatut(StatutAcquisition.LIVREE);
            acquisitionRepository.save(acq);

            return ResponseEntity.ok(Map.of("message", countToCreate + " matériels ajoutés au stock avec succès.", "materiels", createdList));
        }).orElse(ResponseEntity.notFound().build());
    }
}
