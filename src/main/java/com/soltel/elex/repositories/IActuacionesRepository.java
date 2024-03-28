package com.soltel.elex.repositories;


import com.soltel.elex.models.ActuacionesModel;

import java.time.LocalDate;
import java.util.List;

import com.soltel.elex.models.ExpedientesModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface IActuacionesRepository extends JpaRepository<ActuacionesModel, Integer>{

    List<ActuacionesModel> findByExpediente(ExpedientesModel expediente);

    List<ActuacionesModel> findByResponsableAndFechaBetweenAndFinalizado(String responsable, LocalDate fechaInicio, LocalDate fechaFin , Boolean finalizado);

    @Query("SELECT d FROM ActuacionesModel d WHERE d.expediente.id = :idExpediente")
    List<ActuacionesModel> findAllByExpedienteId(Integer idExpediente);
}
