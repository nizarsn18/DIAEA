package com.diaea.parcinfo.controller;

import com.diaea.parcinfo.model.SuiviDSI;
import com.diaea.parcinfo.repository.SuiviDSIRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/suivi-dsi")
public class SuiviDSIController {

    @Autowired
    private SuiviDSIRepository suiviDSIRepository;

    @GetMapping
    public ResponseEntity<List<SuiviDSI>> getAll() {
        return ResponseEntity.ok(suiviDSIRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CELLULE_INFORMATIQUE', 'ADMINISTRATEUR')")
    public ResponseEntity<SuiviDSI> create(@RequestBody SuiviDSI dsi) {
        return ResponseEntity.ok(suiviDSIRepository.save(dsi));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CELLULE_INFORMATIQUE', 'ADMINISTRATEUR')")
    public ResponseEntity<SuiviDSI> update(@PathVariable Long id, @RequestBody SuiviDSI details) {
        return suiviDSIRepository.findById(id).map(dsi -> {
            dsi.setReferenceCourrierDSI(details.getReferenceCourrierDSI());
            dsi.setStatutDSI(details.getStatutDSI());
            dsi.setQuantiteAccordee(details.getQuantiteAccordee());
            dsi.setDateReponse(details.getDateReponse());
            dsi.setDateReception(details.getDateReception());
            dsi.setObservations(details.getObservations());
            return ResponseEntity.ok(suiviDSIRepository.save(dsi));
        }).orElse(ResponseEntity.notFound().build());
    }
}
