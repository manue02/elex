package com.soltel.elex.repositories;
import com.soltel.elex.models.Acciones;
import com.soltel.elex.models.TiposExpedienteModel;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITiposExpedienteRepository extends JpaRepository<TiposExpedienteModel, Integer> {

    List<TiposExpedienteModel> findByAccionesAndActivo(Acciones acciones, Boolean activo);

}
