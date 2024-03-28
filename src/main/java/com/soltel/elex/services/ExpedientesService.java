package com.soltel.elex.services;

import org.springframework.stereotype.Service;

import com.soltel.elex.models.Estado;
import com.soltel.elex.models.ExpedientesModel;
import com.soltel.elex.repositories.IExpedientesRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para gestionar expedientes.
 */
@Service
public class ExpedientesService {

    private final IExpedientesRepository expedientesRepository;

    /**
     * Constructor para la clase ExpedientesService.
     *
     * @param expedientesRepository el repositorio de expedientes
     */
    public ExpedientesService(IExpedientesRepository expedientesRepository) {
        this.expedientesRepository = expedientesRepository;
    }

    /**
     * Encuentra todos los expedientes.
     *
     * @return una lista de todos los expedientes
     */
    public List<ExpedientesModel> findAllExpedientes() {
        return expedientesRepository.findAll();
    }

    /**
     * Busca un expediente por su código.
     *
     * @param codigo el código del expediente a buscar
     * @return un Optional que contiene el expediente si se encontró, o está vacío si no se encontró
     */
    public Optional<ExpedientesModel> findByCodigo(String codigo) {
        return expedientesRepository.findByCodigo(codigo);
    }

    /**
     * Guarda un expediente.
     *
     * @param expediente el expediente a guardar
     * @return el expediente guardado
     */
    public ExpedientesModel saveExpediente(ExpedientesModel expediente) {
        return expedientesRepository.save(expediente);
    }

    public List <ExpedientesModel> findByEstadoAndFechaBetween (Estado estado, LocalDate fechaInicio, LocalDate fechaFin) {
        return expedientesRepository.findByEstadoAndFechaBetween(estado, fechaInicio, fechaFin);
    }

    public Optional<ExpedientesModel> findById(Integer id) {
        return expedientesRepository.findById(id);
    }

    public List<ExpedientesModel> findByTipoId(Integer idTipo) {
        return expedientesRepository.findByTipoId(idTipo);
    }
}
