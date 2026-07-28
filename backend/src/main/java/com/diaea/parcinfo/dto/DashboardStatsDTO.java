package com.diaea.parcinfo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {
    private long totalEquipements;
    private long materielsAffectes;
    private long materielsDisponibles;
    private long materielsEnPanne;
    private long demandesEnAttente;
    private long demandesTransmisesDSI;
    private long demandesSatisfaites;
    private long incidentsOuverts;
    private long incidentsClotures;
    private Map<String, Long> materielParType;
}
