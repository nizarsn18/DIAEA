package com.diaea.parcinfo.controller;

import com.diaea.parcinfo.model.Acquisition;
import com.diaea.parcinfo.repository.AcquisitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/acquisitions")
public class AcquisitionController {

    @Autowired
    private AcquisitionRepository acquisitionRepository;

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
}
