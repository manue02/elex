package com.soltel.elex.controllers;

import com.soltel.elex.models.DocumentosModel;
import com.soltel.elex.models.ExpedientesModel;
import com.soltel.elex.services.DocumentosService;
import com.soltel.elex.services.ExpedientesService;
import com.soltel.elex.services.TiposExpedientesService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.*;



@RestController
@RequestMapping("/documentos")
public class DocumentosController {

    private final DocumentosService documentosService;
    private final ExpedientesService expedientesService;
    private final TiposExpedientesService tiposExpedientesService;

    public DocumentosController(DocumentosService documentosService, ExpedientesService expedientesService, TiposExpedientesService tiposExpedientesService) {
        this.documentosService = documentosService;
        this.expedientesService = expedientesService;
        this.tiposExpedientesService = tiposExpedientesService;
    }

    /**
     * Método para obtener todos los documentos.
     *
     * @return Una respuesta HTTP con todos los documentos o un mensaje de error.
     */
    @GetMapping("/todos")
    public ResponseEntity<?> getTodosDocumentos() {
        try {
            List<DocumentosModel> documentos = documentosService.findAllDocumentos();
            return ResponseEntity.ok(documentos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener los documentos: " + e.getMessage());
        }
    }

    /**
     * Método para obtener documentos por nombre, tipo y estado de vigencia.
     *
     * @param nombre El nombre del documento a buscar.
     * @param tipo El tipo de documento a buscar.
     * @param vigente El estado de vigencia del documento a buscar.
     * @return Una respuesta HTTP con los documentos encontrados o un mensaje de error.
     */
    @GetMapping("/filtrado/{nombre}/{tipo}/{vigente}")
    public ResponseEntity<?> getDocumentosPorNombreTipoVigente(@PathVariable String nombre, @PathVariable String tipo, @PathVariable Boolean vigente) {
        try {
            List<DocumentosModel> documentos = documentosService.findByNombreAndTipoAndVigente(nombre, tipo, vigente);
            if (documentos.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron ningún documento con el nombre " + nombre + " y tipo " + tipo + " y que este " + vigente);
            }
            return ResponseEntity.ok().body("Documentos encontrados");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener los documentos: " + e.getMessage());
        }
    }
    
    /**
     * Método para guardar un nuevo documento.
     *
     * @param file El archivo a guardar.
     * @param ruta La ruta donde se guardará el archivo.
     * @param tasa La tasa asociada con el documento.
     * @param expediente El expediente al que pertenece el documento.
     * @param vigente Si el documento está vigente o no.
     * @param nombre El nombre del documento.
     * @param tipo El tipo de documento (PDF, DOC, etc.).
     * @return Una respuesta HTTP con el documento guardado o un mensaje de error.
     */
    @PostMapping("/insertar/{ruta}/{tasa}/{vigente}/{nombre}/{tipo}/{expediente}")
    public ResponseEntity<?> guardarDocumento(@RequestParam("file") MultipartFile file, @PathVariable String ruta, @PathVariable Float tasa, @PathVariable Integer expediente, @PathVariable Boolean vigente, @PathVariable String nombre, @PathVariable String tipo) {
        try {
            Optional<ExpedientesModel> expedienteEncontrado = expedientesService.findById(expediente);

            String rutaPDF = "/var/www/html/Proyectos/Spring/elex/src/main/resources/PDF";
            String nombreArchivo = file.getOriginalFilename();
            File destino = new File(rutaPDF + "/" + nombreArchivo);
            file.transferTo(destino);

            byte[] archivo = file.getBytes();

            if (expedienteEncontrado.isPresent()) {
                ExpedientesModel todoExpediente = expedienteEncontrado.get();
                String tipoMayusculas = tipo.toUpperCase();
                nombre = tiposExpedientesService.subStringMateria(nombre);
                DocumentosModel documento = new DocumentosModel(destino.getAbsolutePath(), tasa,  vigente, nombre, tipoMayusculas, todoExpediente, archivo);
                return ResponseEntity.ok(documentosService.saveDocumento(documento));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se a podido insertar una nueva Actuacion revise los datos");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el documento: " + e.getMessage());
        }
    }

    /**
     * Método para modificar un documento existente.
     *
     * @param id El ID del documento a modificar.
     * @param tasa La nueva tasa para el documento.
     * @param vigente El nuevo estado de vigencia del documento.
     * @param nombre El nuevo nombre del documento.
     * @param tipo El nuevo tipo de documento.
     * @param expediente El expediente al que pertenece el documento.
     * @return Una respuesta HTTP con el documento modificado o un mensaje de error.
     */
    @PostMapping("/modificar/{id}/{tasa}/{vigente}/{nombre}/{tipo}/{expediente}")
    public ResponseEntity<?> modificarDocumento(@PathVariable Integer id, @PathVariable Float tasa, @PathVariable Boolean vigente, @PathVariable String nombre, @PathVariable String tipo, @PathVariable Integer expediente) {
        try {
            Optional<ExpedientesModel> expedienteEncontrado = expedientesService.findById(expediente);
            Optional<DocumentosModel> documento = documentosService.findById(id);

            if (expedienteEncontrado.isPresent() && documento.isPresent()) {
                ExpedientesModel todoExpediente = expedienteEncontrado.get();
                DocumentosModel documentoEncontrado = documento.get();
                documentoEncontrado.setTasa(tasa);
                documentoEncontrado.setVigente(vigente);
                documentoEncontrado.setNombre(tiposExpedientesService.subStringMateria(nombre));
                documentoEncontrado.setTipo(tipo);
                documentoEncontrado.setExpediente(todoExpediente);
                return ResponseEntity.ok(documentosService.saveDocumento(documentoEncontrado));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se a podido insertar una nueva Actuacion revise los datos");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el documento: " + e.getMessage());
        }
    }

    /**
     * Método para eliminar un documento existente.
     *
     * @param id El ID del documento a eliminar.
     * @param vigente El estado de vigencia del documento a eliminar.
     * @return Una respuesta HTTP indicando si el documento fue eliminado o un mensaje de error.
     */
    @DeleteMapping("/eliminar/{id}/{vigente}")
    public ResponseEntity<?> eliminarDocumento(@PathVariable Integer id, @PathVariable Boolean vigente) {
        try {
            Optional<DocumentosModel> documento = documentosService.findById(id);
            if (documento.isPresent()) {
                DocumentosModel documentoEncontrado = documento.get();
                documentoEncontrado.setVigente(vigente);
                documentosService.saveDocumento(documentoEncontrado);
                return ResponseEntity.ok("Documento eliminado");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se a podido eliminar el documento revise los datos");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el documento: " + e.getMessage());
        }
    }
}
