package com.soltel.elex.services;

import java.time.LocalDate;
import java.util.*;

import com.soltel.elex.models.ExpedientesModel;
import org.springframework.stereotype.Service;

import com.soltel.elex.models.ActuacionesModel;
import com.soltel.elex.repositories.IActuacionesRepository;

@Service
public class ActuacionesService {

    private final IActuacionesRepository actuacionesRepository;

    public ActuacionesService(IActuacionesRepository actuacionesRepository) {
        this.actuacionesRepository = actuacionesRepository;
    }

    public List<ActuacionesModel> findAllActuaciones() {
        return actuacionesRepository.findAll();
    }

    public Optional<ActuacionesModel> findById(Integer id) {
        return actuacionesRepository.findById(id);
    }

    public ActuacionesModel saveActuacion(ActuacionesModel actuacion) {
        return actuacionesRepository.save(actuacion);
    }

    public List<ActuacionesModel> findByExpediente(ExpedientesModel expediente) {
        return actuacionesRepository.findByExpediente(expediente);
    }

    public List<ActuacionesModel> findByResponsableAndFechaBetweenAndFinalizado (String responsable, LocalDate fechaInicio, LocalDate fechaFin , Boolean finalizado) {
        return actuacionesRepository.findByResponsableAndFechaBetweenAndFinalizado(responsable, fechaInicio, fechaFin, finalizado);
    }

    public String formatoResponsable(String responsable) throws IllegalArgumentException{
        String[] partes = responsable.split(" ");
        if (partes.length != 3) {
            throw new IllegalArgumentException("El formato del responsable es incorrecto. Debe ser 'Nombre Apellido1 Apellido2'.");
        }

        for (int i = 0; i < partes.length; i++) {
            partes[i] = partes[i].substring(0, 1).toUpperCase() + partes[i].substring(1).toLowerCase();
        }

        return String.join(" ", partes);
    }

}
