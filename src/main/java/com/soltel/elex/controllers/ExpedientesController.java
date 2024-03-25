package com.soltel.elex.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.soltel.elex.services.TiposExpedientesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soltel.elex.models.Estado;
import com.soltel.elex.models.ExpedientesModel;
import com.soltel.elex.models.TiposExpedienteModel;
import com.soltel.elex.services.ExpedientesService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

/**
 * Controlador para la gestión de expedientes.
 */
@RestController
@RequestMapping("/expedientes")
public class ExpedientesController {

    private final ExpedientesService expedientesService;
    private final TiposExpedientesService tiposExpedientesService;

    /**
     * Constructor para las dependencias.
     *
     * @param expedientesService el servicio de expedientes
     * @param tiposExpedientesService el servicio de tiposExpedientesService
     */
    public ExpedientesController(ExpedientesService expedientesService, TiposExpedientesService tiposExpedientesService) {
        this.expedientesService = expedientesService;
        this.tiposExpedientesService = tiposExpedientesService;
    }

    /**
     * Obtiene todos los expedientes.
     *
     * @return una lista de todos los expedientes
     */
    @GetMapping("/todos")
    public ResponseEntity<?> getTodosExpedientes() {
        try {
            List<ExpedientesModel> expedientes = expedientesService.findAllExpedientes();
            return ResponseEntity.ok(expedientes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener todos los expedientes: " + e.getMessage());
        }
    }

    /**
     * Obtiene un expediente por su código.
     *
     * @param codigo el código del expediente
     * @return el expediente si se encuentra, o un mensaje de error si no se encuentra
     */
    @GetMapping("/porCodigo/{codigo}")
    public ResponseEntity<?> getExpedientePorCodigo(@PathVariable String codigo) {
        try {
            codigo = codigo.toUpperCase();
            Optional<ExpedientesModel> expedientePorCodigo = expedientesService.findByCodigo(codigo);
    
            if (expedientePorCodigo.isPresent()) {
                return ResponseEntity.ok(expedientePorCodigo.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expediente no encontrado");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener el expediente por código: " + e.getMessage());
        }
    }

    /**
     * Inserta un nuevo expediente.
     * @param idTipoExpediente el tipo del nuevo expediente
     * @param codigo el código del nuevo expediente
     * @param fecha la fecha del nuevo expediente
     * @param estado el estado del nuevo expediente
     * @param opciones las opciones del nuevo expediente
     * @param descripcion la descripción del nuevo expediente
     * @return el expediente insertado
     */
    @PostMapping("/insertar/{idTipoExpediente}/{codigo}/{fecha}/{estado}/{opciones}/{descripcion}")
    public ResponseEntity<?> postInsertarExpediente(@PathVariable Integer idTipoExpediente, @PathVariable String codigo, @PathVariable LocalDate fecha, @PathVariable Estado estado,
                                                    @PathVariable String opciones, @PathVariable String descripcion) {
        try {
            Optional<TiposExpedienteModel> tipoExpedienteBusqueda = tiposExpedientesService.findById(idTipoExpediente);
    
            if (tipoExpedienteBusqueda.isPresent()) {
                TiposExpedienteModel tipoExpediente = tipoExpedienteBusqueda.get();
                String codigoMayusculas = codigo.toUpperCase();
                ExpedientesModel nuevoExpediente = new ExpedientesModel(codigoMayusculas, fecha, estado, opciones, descripcion, tipoExpediente);
                return ResponseEntity.ok(expedientesService.saveExpediente(nuevoExpediente));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se a podido insertar un nuevo Expediente revise los datos");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al insertar el expediente: " + e.getMessage());
        }
    }

    /**
     * Modifica un expediente existente.
     * @param idTipoExpediente el tipo del nuevo expediente
     * @param codigo el código del expediente a modificar
     * @param fecha la nueva fecha del expediente
     * @param estado el nuevo estado del expediente -> enum(pendiente, enviado, erroneo)
     * @param opciones las nuevas opciones del expediente
     * @param descripcion la nueva descripción del expediente
     * @return un mensaje indicando si la modificación fue exitosa o no
     */
    @PutMapping("modificar/{idTipoExpediente}/{codigo}/{fecha}/{estado}/{opciones}/{descripcion}")
    public ResponseEntity<?> putModificarExpediente(@PathVariable Integer idTipoExpediente, @PathVariable String codigo, @PathVariable LocalDate fecha, @PathVariable Estado estado,
                                                    @PathVariable String opciones, @PathVariable String descripcion) {
        try {
            Optional<ExpedientesModel> expedientePorCodigo = expedientesService.findByCodigo(codigo);
            Optional<TiposExpedienteModel> tipoExpedienteBusqueda = tiposExpedientesService.findById(idTipoExpediente);
    
            if (expedientePorCodigo.isPresent() && tipoExpedienteBusqueda.isPresent()) {
                ExpedientesModel expediente = expedientePorCodigo.get();
                TiposExpedienteModel tipoExpediente = tipoExpedienteBusqueda.get();
    
                expediente.setFecha(fecha);
                expediente.setEstado(estado);
                expediente.setOpciones(opciones);
                expediente.setDescripcion(descripcion);
                expediente.setTiposExpediente(tipoExpediente);
                expedientesService.saveExpediente(expediente);
                return ResponseEntity.ok().body("Expediente modificado");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expediente no encontrado");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al modificar el expediente: " + e.getMessage());
        }
    }

    /**
     * Obtiene los expedientes por estado y fecha.
     *
     * @param estado el estado de los expedientes a buscar
     * @param fechaInicio la fecha de inicio del rango de búsqueda
     * @param fechaFin la fecha de fin del rango de búsqueda
     * @return una lista de expedientes que cumplen con los criterios de búsqueda
     */
    @GetMapping("/filtrado/{estado}/{fechaInicio}/{fechaFin}")
    public ResponseEntity<?> getExpedientesPorEstadoYFecha(@PathVariable Estado estado, @PathVariable LocalDate fechaInicio, @PathVariable LocalDate fechaFin) {
        try {
            List<ExpedientesModel> expedientes = expedientesService.findByEstadoAndFechaBetween(estado, fechaInicio, fechaFin);
            return ResponseEntity.ok(expedientes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener los expedientes por estado y fecha: " + e.getMessage());
        }
    }
}
