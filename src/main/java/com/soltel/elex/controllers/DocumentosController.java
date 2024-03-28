package com.soltel.elex.controllers;

import com.soltel.elex.models.DocumentosModel;
import com.soltel.elex.models.ExpedientesModel;
import com.soltel.elex.services.DocumentosService;
import com.soltel.elex.services.ExpedientesService;
import com.soltel.elex.services.TiposExpedientesService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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

    @Value("${app.pdf-directory}")
    private File fileDirectory;

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
     * @param tipo El tipo de documento a buscar.
     * @param vigente El estado de vigencia del documento a buscar.
     * @return Una respuesta HTTP con los documentos encontrados o un mensaje de error.
     */
    @GetMapping("/filtrado/{tipo}/{vigente}")
    public ResponseEntity<?> getDocumentosPorNombreTipoVigente(@PathVariable String tipo, @PathVariable Boolean vigente) {
        try {
            List<DocumentosModel> documentos = documentosService.findByTipoAndVigente(tipo.toUpperCase(), vigente);
            if (documentos.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron ningún documento con el tipo " + tipo + " y que este " + vigente);
            }
            return ResponseEntity.ok().body(documentos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener los documentos: " + e.getMessage());
        }
    }
    
    /**
     * Método para guardar un nuevo documento.
     *
     * @param file El archivo a guardar.
     * @param tasa La tasa asociada con el documento.
     * @param expediente El expediente al que pertenece el documento.
     * @param vigente Si el documento está vigente o no.
     * @param nombre El nombre del documento.
     * @param tipo El tipo de documento (PDF, DOC, etc.).
     * @return Una respuesta HTTP con el documento guardado o un mensaje de error.
     */
    @PostMapping(value = "/insertar/{tasa}/{vigente}/{nombre}/{tipo}/{expediente}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> guardarDocumento(@RequestPart("file") MultipartFile file, @PathVariable Float tasa, @PathVariable Integer expediente, @PathVariable Boolean vigente, @PathVariable String nombre, @PathVariable String tipo) {
        try {
            Optional<ExpedientesModel> expedienteEncontrado = expedientesService.findById(expediente);

            if (expedienteEncontrado.isPresent()) {
                String nombreArchivo = file.getOriginalFilename();
                assert nombreArchivo != null;
                File destino = new File(fileDirectory, nombreArchivo);
                Files.copy(file.getInputStream(), destino.toPath(), StandardCopyOption.REPLACE_EXISTING);
                byte[] archivo = Files.readAllBytes(destino.toPath());

                ExpedientesModel todoExpediente = expedienteEncontrado.get();
                String tipoMayusculas = tipo.toUpperCase();
                nombre = tiposExpedientesService.subStringMateria(nombre);

                String rutaRelativa = destino.getPath().replaceFirst("^.*?src", "src");
                DocumentosModel documento = new DocumentosModel(rutaRelativa, tasa,  vigente, nombre, tipoMayusculas, todoExpediente, archivo);
                return ResponseEntity.ok(documentosService.saveDocumento(documento));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se a podido insertar una nueva Actuacion revise los datos");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el documento: " + e.getMessage());
        }
    }

    /**
     * Maneja una solicitud GET para descargar un archivo de la carpeta de recursos.
     *
     * @param nombreArchivo el nombre del archivo que se va a descargar
     * @return una ResponseEntity que contiene el archivo como un recurso si el archivo existe,
     *         o un mensaje de error si el archivo no se encuentra o si ocurre un error
     */
    @GetMapping("/descargar/{nombreArchivo}")
    public ResponseEntity<?> descargarArchivo(@PathVariable String nombreArchivo) {
        try {
            String rutaArchivo = fileDirectory + "/" + nombreArchivo + ".pdf";
            System.out.println(rutaArchivo);
            Resource resource = new UrlResource(Paths.get(rutaArchivo).toUri());
    
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + resource.getFilename() + "\"")                        
                .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se pudo leer el archivo " + nombreArchivo);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al descargar el archivo: " + e.getMessage());
        }
    }

    /**
     * Maneja una solicitud GET para descargar un archivo BLOB de la base de datos.
     *
     * @param idDocumento el ID del documento que se va a descargar
     * @return una ResponseEntity que contiene el archivo como un recurso si el documento existe,
     *         o un mensaje de error si el documento no se encuentra o si ocurre un error
     */
    @GetMapping("/descargar-blob/{idDocumento}")
    public ResponseEntity<?> descargarArchivoBlob(@PathVariable Integer idDocumento) {
        try {
            Optional<DocumentosModel> documentoOptional = documentosService.findById(idDocumento);

            if (documentoOptional.isPresent()) {
                DocumentosModel documento = documentoOptional.get();
                byte[] archivo = documento.getArchivo();

                ByteArrayResource resource = new ByteArrayResource(archivo);

                return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + documento.getNombre() + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se pudo encontrar el documento con ID " + idDocumento);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al descargar el archivo: " + e.getMessage());
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
    @PutMapping("/modificar/{id}/{tasa}/{vigente}/{nombre}/{tipo}/{expediente}")
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
    @PutMapping("/eliminar/{id}/{vigente}")
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

    /**
     * Método para obtener todos los documentos asociados a un expediente específico.
     *
     * @param expediente El ID del expediente para el cual se deben obtener los documentos.
     * @return Una respuesta HTTP que contiene una lista de documentos si la operación fue exitosa y se encontraron documentos,
     *         un mensaje de error si ocurrió un error, o un mensaje indicando que no se encontraron documentos si el expediente no tiene documentos asociados.
     */
    @GetMapping("inner-joinExpediente/{expediente}")
    public ResponseEntity<?> getDocumentosInnerJoinExpediente(@PathVariable Integer expediente) {
        try {
            List<DocumentosModel> documentos = documentosService.findAllByExpedienteId(expediente);
            if (documentos.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron documentos para el expediente con ID " + expediente);
            }
            return ResponseEntity.ok().body(documentos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener los documentos: " + e.getMessage());
        }
    }
    
}
