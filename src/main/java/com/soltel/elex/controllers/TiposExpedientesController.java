package com.soltel.elex.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soltel.elex.models.Acciones;
import com.soltel.elex.models.TiposExpedienteModel;
import com.soltel.elex.services.TiposExpedientesService;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

/**
 * Controlador para manejar las solicitudes HTTP relacionadas con los tipos de expedientes.
 */
@RestController
@RequestMapping("/tiposExpedientes")
public class TiposExpedientesController {

    private final TiposExpedientesService tiposExpedientesService;

    /**
     * Constructor dependencia de TiposExpedientesService.
     *
     * @param tiposExpedientesService El servicio para manejar los tipos de expedientes.
     */
    public TiposExpedientesController(TiposExpedientesService tiposExpedientesService) {
        this.tiposExpedientesService = tiposExpedientesService;
    }

    /**
     * Maneja la solicitud GET para obtener todos los tipos de expedientes.
     *
     * @return Una lista de todos los tipos de expedientes.
     */
    @GetMapping("/todos")
    public ResponseEntity<?> getTodosTiposExpedientes() {
        try {
            List<TiposExpedienteModel> tiposExpedientes = tiposExpedientesService.findAllTiposExpedientes();
            return ResponseEntity.ok(tiposExpedientes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener todos los tipos de expedientes: " + e.getMessage());
        }
    }

    /**
     * Maneja la solicitud GET para obtener un tipo de expediente por materia y estado activo.
     *
     * @param acciones Las acciones del tipo de expediente.
     * @param activo El estado activo del tipo de expediente.
     * @return Una respuesta con el tipo de expediente encontrado o un mensaje de error si no se encuentra.
     */
    @GetMapping("/filtrado/{acciones}/{activo}")
    public ResponseEntity<?> getTipoExpedientePorMateriaYActivo(@PathVariable Acciones acciones, @PathVariable boolean activo) {
        try {
            List<TiposExpedienteModel> tipoExpedientePorMateriaAndActivo = tiposExpedientesService.findByAccionesAndActivo(acciones, activo);
    
            if (!tipoExpedientePorMateriaAndActivo.isEmpty()) {
                return ResponseEntity.ok(tipoExpedientePorMateriaAndActivo);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el tipo de expediente con la accion buscada " + acciones + " y que este " + tiposExpedientesService.isImprimirActivo(activo));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener el tipo de expediente por materia y activo: " + e.getMessage());
        }
    }

    /**
     * Maneja la solicitud POST para insertar un nuevo tipo de expediente.
     *
     * @param materia La materia del nuevo tipo de expediente.
     * @param acciones Las acciones del nuevo tipo de expediente.
     * @param activo El estado activo del nuevo tipo de expediente.
     * @return Una respuesta con el tipo de expediente insertado.
     */
    @PostMapping("/insertar/{materia}/{acciones}/{activo}")
    public ResponseEntity<?> postInsertarTipoExpediente(@PathVariable String materia, @PathVariable Acciones acciones, @PathVariable boolean activo) {
        try {
            materia = tiposExpedientesService.subStringMateria(materia);
    
            TiposExpedienteModel tipoExpediente = new TiposExpedienteModel(materia, acciones, activo);
            TiposExpedienteModel tipoExpedienteGuardado = tiposExpedientesService.saveTipoExpediente(tipoExpediente);
    
            return ResponseEntity.ok(tipoExpedienteGuardado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al insertar el tipo de expediente: " + e.getMessage());
        }
    }

    /**
     * Maneja la solicitud PUT para modificar un tipo de expediente existente.
     *
     * @param id El ID del tipo de expediente a modificar.
     * @param materia La nueva materia del tipo de expediente.
     * @param acciones Las nuevas acciones del tipo de expediente.
     * @param activo El nuevo estado activo del tipo de expediente.
     * @return Una respuesta con un mensaje de éxito o un mensaje de error si no se encuentra el tipo de expediente.
     */
    @PutMapping("/modificar/{id}/{materia}/{acciones}")
    public ResponseEntity<?> putModificarTiposExpediente(@PathVariable Integer id,@PathVariable String materia, @PathVariable Acciones acciones) {
        try {
            materia = tiposExpedientesService.subStringMateria(materia);
    
            Optional<TiposExpedienteModel> tipoExpedientePorMateriaAndActivo = tiposExpedientesService.findById(id);
    
            if (tipoExpedientePorMateriaAndActivo.isPresent()) {
                TiposExpedienteModel tipoExpediente = tipoExpedientePorMateriaAndActivo.get();
                tipoExpediente.setMateria(materia);
                tipoExpediente.setAcciones(acciones);
                return ResponseEntity.ok(tiposExpedientesService.saveTipoExpediente(tipoExpediente));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tipo expediente no encontrado");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al modificar el tipo de expediente: " + e.getMessage());
        }
    }

    /**
     * Maneja la solicitud PUT para modificar el estado activo de un tipo de expediente existente.
     *
     * @param id El ID del tipo de expediente a modificar.
     * @param activo El nuevo estado activo del tipo de expediente.
     * @return Una respuesta con un mensaje de éxito o un mensaje de error si no se encuentra el tipo de expediente.
     */
    @PutMapping("/eliminar/{id}/{activo}")
    public ResponseEntity<?> putModificarTiposExpediente(@PathVariable Integer id, @PathVariable boolean activo) {
        try {
            Optional<TiposExpedienteModel> tipoExpedientePorMateriaAndActivo = tiposExpedientesService.findById(id);
    
            if (tipoExpedientePorMateriaAndActivo.isPresent()) {
                TiposExpedienteModel tipoExpediente = tipoExpedientePorMateriaAndActivo.get();

                if (activo) {
                    tipoExpediente.setActivo(false);
                    TiposExpedienteModel tipoExpedienteGuardado = tiposExpedientesService.saveTipoExpediente(tipoExpediente);
                    return ResponseEntity.ok(tipoExpedienteGuardado);

                } else {
                    tipoExpediente.setActivo(true);
                    TiposExpedienteModel tipoExpedienteGuardado = tiposExpedientesService.saveTipoExpediente(tipoExpediente);
                    return ResponseEntity.ok(tipoExpedienteGuardado);
                }

            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tipo expediente no encontrado");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al modificar el estado del tipo de expediente: " + e.getMessage());
        }
    }
}
