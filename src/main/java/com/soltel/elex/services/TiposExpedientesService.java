package com.soltel.elex.services;

import java.util.List;
import java.util.Optional;

import com.soltel.elex.models.Acciones;
import org.springframework.stereotype.Service;

import com.soltel.elex.models.TiposExpedienteModel;
import com.soltel.elex.repositories.ITiposExpedienteRepository;

@Service
public class TiposExpedientesService {

    private final ITiposExpedienteRepository tiposExpedientesRepository;


    public TiposExpedientesService(ITiposExpedienteRepository tiposExpedientesRepository) {
        this.tiposExpedientesRepository = tiposExpedientesRepository;
    }

    /**
     * Encuentra todos los expedientes.
     *
     * @return una lista de todos los tipos de expedientes
     */
    public List<TiposExpedienteModel> findAllTiposExpedientes() {
        return tiposExpedientesRepository.findAll();
    }

    /**
     * Busca un expediente por su código.
     *
     * @param acciones la materia del expediente a buscar
     * @param activo si el expediente está activo
     * @return un Optional que contiene el expediente si se encontró, o está vacío si no se encontró
     */
    public List<TiposExpedienteModel> findByAccionesAndActivo(Acciones acciones, boolean activo) {
        return tiposExpedientesRepository.findByAccionesAndActivo(acciones, activo);
    }

    /**
     * Busca un expediente por su id.
     *
     * @param id el id del expediente a buscar
     * @return un Optional que contiene el expediente si se encontró, o está vacío si no se encontró
     */
    public Optional<TiposExpedienteModel> findById(Integer id) {
        return tiposExpedientesRepository.findById(id);
    }

    /**
     * Guarda un tipo de expediente.
     *
     * @param tipoExpediente el tipo de expediente a guardar
     * @return el tipo de expediente guardado
     */
    public TiposExpedienteModel saveTipoExpediente(TiposExpedienteModel tipoExpediente) {
        return tiposExpedientesRepository.save(tipoExpediente);
    }

    /**
    * Convierte la primera letra de la materia a mayúscula y el resto a minúscula.
    *
    * @param materia La materia a convertir.
    * @return La materia con la primera letra en mayúscula y el resto en minúscula.
    */
    public String subStringMateria(String materia) {
        if (materia != null && !materia.isEmpty()) {
            materia = materia.substring(0, 1).toUpperCase() + materia.substring(1).toLowerCase();
        }
        return materia;
    }

    /**
    * Convierte el estado activo a una cadena para imprimir.
    *
    * @param activo El estado activo a convertir.
    * @return "activo" si el estado es verdadero, "inactivo" si es falso.
    */
    public String isImprimirActivo (boolean activo) {

        if (activo) {
            return "activo";
        } else {
            return "inactivo";
        }
    }
}
