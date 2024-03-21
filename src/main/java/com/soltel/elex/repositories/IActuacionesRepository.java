package com.soltel.elex.repositories;


import com.soltel.elex.models.ActuacionesModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IActuacionesRepository extends JpaRepository<ActuacionesModel, Integer>{
}
