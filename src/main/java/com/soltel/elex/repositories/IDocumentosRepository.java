package com.soltel.elex.repositories;
import com.soltel.elex.models.DocumentosModel;
import com.soltel.elex.models.ExpedientesModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.*;


@Repository
public interface IDocumentosRepository extends JpaRepository<DocumentosModel, Integer> {
    
    List<DocumentosModel> findByExpediente(ExpedientesModel expediente);

    List<DocumentosModel> findByTipoAndVigente(String tipo , Boolean vigente);

    @Query("SELECT d FROM DocumentosModel d WHERE d.expediente.id = :idExpediente")
    List<DocumentosModel> findAllByExpedienteId(Integer idExpediente);
    
}
