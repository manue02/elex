package com.soltel.elex.repositories;

import com.soltel.elex.models.ExpedientesModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IExpedientesRepository extends JpaRepository<ExpedientesModel, String> {
}
