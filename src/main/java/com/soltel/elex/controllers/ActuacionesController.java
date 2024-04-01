package com.soltel.elex.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

import com.soltel.elex.models.ActuacionesModel;
import com.soltel.elex.models.ExpedientesModel;
import com.soltel.elex.services.ActuacionesService;
import com.soltel.elex.services.ExpedientesService;
import com.soltel.elex.services.TiposExpedientesService;

@RestController
@RequestMapping("/actuaciones")
public class ActuacionesController {

    private final ActuacionesService actuacionesService;
    private final ExpedientesService expedientesService;
    private final TiposExpedientesService tiposExpedientesService;


    public ActuacionesController(ActuacionesService actuacionesService, ExpedientesService expedientesService, TiposExpedientesService tiposExpedientesService) {
        this.actuacionesService = actuacionesService;
        this.expedientesService = expedientesService;
        this.tiposExpedientesService = tiposExpedientesService;
    }

    /**
     * Obtiene todas las actuaciones.
     *
     * @return una lista de todas las actuaciones
     */
    @GetMapping("/todos")
    public ResponseEntity<?> getTodasActuaciones() {
        try {
            List<ActuacionesModel> actuaciones = actuacionesService.findAllActuaciones();
            return ResponseEntity.ok(actuaciones);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener las actuaciones: " + e.getMessage());
        }
    }

    /**
     * Obtiene las actuaciones por responsable y fecha.
     *
     * @param responsable el responsable de las actuaciones
     * @param fechaInicio la fecha de inicio del rango de fechas
     * @param fechaFin la fecha de fin del rango de fechas
     * @param finalizado si la actuación está finalizada
     * @return una lista de actuaciones que coinciden con los criterios de búsqueda
     */
    @GetMapping("/filtrado/{responsable}/{fechaInicio}/{fechaFin}/{finalizado}")
    public ResponseEntity<?> getActuacionesPorResponsableYFecha(@PathVariable String responsable, @PathVariable LocalDate fechaInicio, 
                                                                @PathVariable LocalDate fechaFin, @PathVariable Boolean finalizado) {
        try {
            String responsableFormato = actuacionesService.formatoResponsable(responsable);
            List<ActuacionesModel> actuacionesPorResponsableYFecha = actuacionesService.findByResponsableAndFechaBetweenAndFinalizado(responsableFormato, fechaInicio, fechaFin, finalizado);
    
            if (!actuacionesPorResponsableYFecha.isEmpty()) {
                return ResponseEntity.ok(actuacionesPorResponsableYFecha);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró ninguna actuación con el responsable " + responsableFormato + " y que este en el rango de fechas " + fechaInicio + " - " + fechaFin + " y que este " + finalizado);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener las actuaciones: " + e.getMessage());
        }
    }

    /**
     * Inserta una nueva actuación.
     *
     * @param descripcion la descripción de la actuación
     * @param finalizado si la actuación está finalizada
     * @param fecha la fecha de la actuación
     * @param idExpediente el ID del expediente asociado a la actuación
     * @param observaciones las observaciones de la actuación
     * @param responsable el responsable de la actuación
     * @return la actuación insertada o un mensaje de error si no se pudo insertar
     */
    @PostMapping("/insertar/{descripcion}/{finalizado}/{fecha}/{idExpediente}/{observaciones}/{responsable}")
    public ResponseEntity<?> insertarActuacion(@PathVariable String descripcion, 
                                               @PathVariable Boolean finalizado, @PathVariable LocalDate fecha, @PathVariable Integer idExpediente, 
                                               @PathVariable String observaciones, @PathVariable String responsable) {
        try {
            String responsableFormato = actuacionesService.formatoResponsable(responsable);
            Optional<ExpedientesModel> expediente = expedientesService.findById(idExpediente);
    
            if (expediente.isPresent()) {
                ExpedientesModel expedienteEncontrado = expediente.get();
                descripcion = tiposExpedientesService.subStringMateria(descripcion);
                observaciones = tiposExpedientesService.subStringMateria(observaciones);

                ActuacionesModel actuacion = new ActuacionesModel(descripcion, finalizado, fecha, observaciones, responsableFormato, expedienteEncontrado);
                return ResponseEntity.ok(actuacionesService.saveActuacion(actuacion));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se a podido insertar una nueva Actuacion revise los datos si están bien");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al insertar la actuación: " + e.getMessage());
        }
    }

    /**
     * Modifica una actuación existente.
     *
     * @param idActuacion el ID de la actuación a modificar
     * @param descripcion la nueva descripción de la actuación
     * @param finalizado si la actuación está finalizada
     * @param fecha la nueva fecha de la actuación
     * @param idExpediente el nuevo ID del expediente asociado a la actuación
     * @param observaciones las nuevas observaciones de la actuación
     * @param responsable el nuevo responsable de la actuación
     * @return un mensaje de éxito o un mensaje de error si no se pudo modificar
     */
    @PutMapping("/modificar/{idActuacion}/{descripcion}/{finalizado}/{fecha}/{idExpediente}/{observaciones}/{responsable}")
    public ResponseEntity<?> modificarActuacion(@PathVariable Integer idActuacion,@PathVariable String descripcion, 
                                                @PathVariable Boolean finalizado, @PathVariable LocalDate fecha, @PathVariable Integer idExpediente, 
                                                @PathVariable String observaciones, @PathVariable String responsable) {
        try {
            Optional<ExpedientesModel> expediente = expedientesService.findById(idExpediente);
            Optional<ActuacionesModel> actuacion = actuacionesService.findById(idActuacion);
    
            if (expediente.isPresent() && actuacion.isPresent()) {
                ExpedientesModel expedienteEncontrado = expediente.get();
                ActuacionesModel actuacionEncontrada = actuacion.get();
    
                String responsableFormato = actuacionesService.formatoResponsable(responsable);
                
                actuacionEncontrada.setDescripcion(tiposExpedientesService.subStringMateria(descripcion));
                actuacionEncontrada.setFinalizado(finalizado);
                actuacionEncontrada.setFecha(fecha);
                actuacionEncontrada.setObservaciones(tiposExpedientesService.subStringMateria(observaciones));
                actuacionEncontrada.setResponsable(responsableFormato);
                actuacionEncontrada.setExpediente(expedienteEncontrado);
                actuacionesService.saveActuacion(actuacionEncontrada);
                return ResponseEntity.ok().body("Expediente modificado");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se a podido insertar una nueva Actuacion revise los datos");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al modificar la actuación: " + e.getMessage());
        }
    }

    /**
     * Elimina una actuación existente.
     *
     * @param id el ID de la actuación a eliminar
     * @param finalizado si la actuación está finalizada
     * @return un mensaje de éxito o un mensaje de error si no se pudo eliminar
     */
    @PutMapping("/eliminar/{id}/{finalizado}")
    public ResponseEntity<?> eliminarActuacion(@PathVariable Integer id, @PathVariable Boolean finalizado) {
        try {
            Optional<ActuacionesModel> actuacion = actuacionesService.findById(id);
    
            if (actuacion.isPresent()) {
                ActuacionesModel actuacionEncontrada = actuacion.get();

                if (finalizado){
                    actuacionEncontrada.setFinalizado(false);
                    ActuacionesModel actuacionGuardada = actuacionesService.saveActuacion(actuacionEncontrada);
                    return ResponseEntity.ok(actuacionGuardada);
                }else{
                    actuacionEncontrada.setFinalizado(true);
                    ActuacionesModel actuacionGuardada = actuacionesService.saveActuacion(actuacionEncontrada);
                    return ResponseEntity.ok(actuacionGuardada);
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se a podido eliminar la Actuacion revise los datos");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar la actuación: " + e.getMessage());
        }
    }
    

    /**
     * Método para obtener todas las actuaciones asociadas a un expediente específico.
     *
     * @param expediente El ID del expediente para el cual se deben obtener las actuaciones.
     * @return Una respuesta HTTP que contiene una lista de actuaciones si la operación fue exitosa,
     *         o un mensaje de error si ocurrió un error.
     */
    @GetMapping("inner-joinExpediente/{expediente}")
    public ResponseEntity<?> getActuacionesInnerJoinExpediente(@PathVariable Integer expediente) {
        try {
            List<ActuacionesModel> actuaciones = actuacionesService.findAllByExpedienteId(expediente);
            return ResponseEntity.ok(actuaciones);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener las actuaciones: " + e.getMessage());
        }
    }
}
