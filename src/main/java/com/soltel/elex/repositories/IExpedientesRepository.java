package com.soltel.elex.repositories;

import com.soltel.elex.models.Estado;
import com.soltel.elex.models.ExpedientesModel;

import java.util.Optional;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Interfaz para el repositorio de expedientes.
 */
@Repository
public interface IExpedientesRepository extends JpaRepository<ExpedientesModel, Integer> {

    Optional<ExpedientesModel> findByCodigo(String codigo);

    List<ExpedientesModel> findByEstadoAndFechaBetween(Estado estado, LocalDate fechaInicio, LocalDate fechaFin);

    @Query("SELECT e FROM ExpedientesModel e WHERE e.tiposExpediente.id = :idTipo")
    List<ExpedientesModel> findByTipoId(Integer idTipo);
}
