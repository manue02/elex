package com.soltel.elex.repositories;
import com.soltel.elex.models.DocumentosModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;


@Repository
public interface IDocumentosRepository extends JpaRepository<DocumentosModel, Integer> {
    
    List<DocumentosModel> findByExpediente(Integer expediente);

    List<DocumentosModel> findByNombreAndTipoAndVigente(String nombre, String tipo , Boolean vigente);
}
