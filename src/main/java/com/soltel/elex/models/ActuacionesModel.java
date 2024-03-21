package com.soltel.elex.models;

import java.time.LocalDate;

import jakarta.persistence.*;


@Entity
@Table(name = "actuaciones")
public class ActuacionesModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "finalizado")
    private Boolean finalizado;

    @Column(name = "fecha")
    private LocalDate fecha;

    @Column(name = "observaciones")
    private String observaciones;

    @Column(name = "responsable")
    private String responsable;

    @ManyToOne
    @JoinColumn(name = "expediente",nullable = false)
    private ExpedientesModel expediente;

    public Integer getId() {
        return id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Boolean getFinalizado() {
        return finalizado;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public String getResponsable() {
        return responsable;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setFinalizado(Boolean finalizado) {
        this.finalizado = finalizado;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public ActuacionesModel() {
    }

    public ActuacionesModel(Integer id, String descripcion, Boolean finalizado, LocalDate fecha, String observaciones, String responsable) {
        this.id = id;
        this.descripcion = descripcion;
        this.finalizado = finalizado;
        this.fecha = fecha;
        this.observaciones = observaciones;
        this.responsable = responsable;
    }
}
