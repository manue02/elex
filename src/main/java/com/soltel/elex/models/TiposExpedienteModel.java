package com.soltel.elex.models;

import java.util.Set;
import jakarta.persistence.*;


@Entity
@Table(name = "tipos_expediente")
public class TiposExpedienteModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "materia")
    private String materia;

    @Enumerated(EnumType.STRING)
    @Column(name = "acciones")
    private Acciones acciones;

    @Column(name = "activo")
    private Boolean activo;

    @OneToMany(mappedBy = "tiposExpediente")
    private Set<ExpedientesModel> expedientes;

    public Integer getId() {
        return id;
    }

    public String getMateria() {
        return materia;
    }

    public Acciones getAcciones() {
        return acciones;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setMateria(String materia) {
        this.materia = materia;
    }

    public void setAcciones(Acciones acciones) {
        this.acciones = acciones;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public TiposExpedienteModel() {
    }

    public TiposExpedienteModel(String materia, Acciones acciones, Boolean activo) {
        this.materia = materia;
        this.acciones = acciones;
        this.activo = activo;
    }
}
