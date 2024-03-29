package com.soltel.elex.services;

import com.soltel.elex.models.DocumentosModel;
import com.soltel.elex.models.ExpedientesModel;
import com.soltel.elex.repositories.IDocumentosRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentosService {

    private final IDocumentosRepository documentosRepository;

    public DocumentosService(IDocumentosRepository documentosRepository) {
        this.documentosRepository = documentosRepository;
    }

    public List<DocumentosModel> findAllDocumentos() {
        return documentosRepository.findAll();
    }

    public List<DocumentosModel> findAllByExpedienteId(Integer idExpediente) {
        return documentosRepository.findAllByExpedienteId(idExpediente);
    }

    @SuppressWarnings("null")
    public Optional<DocumentosModel> findById(Integer id) {
        return documentosRepository.findById(id);
    }

    @SuppressWarnings("null")
    public DocumentosModel saveDocumento(DocumentosModel documento) {
        return documentosRepository.save(documento);
    }

    public List<DocumentosModel> findByExpediente(ExpedientesModel expediente) {
        return documentosRepository.findByExpediente(expediente);
    }

    public List<DocumentosModel> findByTipoAndVigente(String tipo , Boolean vigente) {
        return documentosRepository.findByTipoAndVigente(tipo, vigente);
    }
}
