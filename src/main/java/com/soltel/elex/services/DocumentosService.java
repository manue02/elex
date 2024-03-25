package com.soltel.elex.services;

import java.util.*;
import org.springframework.stereotype.Service;

import com.soltel.elex.models.DocumentosModel;
import com.soltel.elex.repositories.IDocumentosRepository;

@Service
public class DocumentosService {

    private final IDocumentosRepository documentosRepository;

    public DocumentosService(IDocumentosRepository documentosRepository) {
        this.documentosRepository = documentosRepository;
    }

    public List<DocumentosModel> findAllDocumentos() {
        return documentosRepository.findAll();
    }

    public Optional<DocumentosModel> findById(Integer id) {
        return documentosRepository.findById(id);
    }

    public DocumentosModel saveDocumento(DocumentosModel documento) {
        return documentosRepository.save(documento);
    }

    public List<DocumentosModel> findByExpediente(Integer expediente) {
        return documentosRepository.findByExpediente(expediente);
    }

    public List<DocumentosModel> findByNombreAndTipoAndVigente(String nombre, String tipo , Boolean vigente) {
        return documentosRepository.findByNombreAndTipoAndVigente(nombre, tipo, vigente);
    }
}
