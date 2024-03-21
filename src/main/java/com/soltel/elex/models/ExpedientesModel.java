package com.soltel.elex.models;

import java.time.LocalDate;

import java.util.Set;
import jakarta.persistence.*;


@Entity
@Table(name = "expedientes")
public class ExpedientesModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "codigo")
    private String codigo;

    @Column(name = "fecha")
    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private Estado estado;

    @Column(name = "opciones")
    private String opciones;

    @Column(name = "descripcion")
    private String descripcion;

    @OneToMany(mappedBy = "expediente")
    private Set<ActuacionesModel> actuaciones;

    @ManyToOne
    @JoinColumn(name = "tipo", nullable = false)
    private TiposExpedienteModel tiposExpediente;

    @OneToMany(mappedBy = "expediente")
    private Set<DocumentosModel> documentos;

    public Integer getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public Estado getEstado() {
        return estado;
    }

    public String getOpciones() {
        return opciones;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    public void setOpciones(String opciones) {
        this.opciones = opciones;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public ExpedientesModel() {
    }

    public ExpedientesModel(Integer id, String codigo, LocalDate fecha, Estado estado, String opciones, String descripcion) {
        this.id = id;
        this.codigo = codigo;
        this.fecha = fecha;
        this.estado = estado;
        this.opciones = opciones;
        this.descripcion = descripcion;
    }
}
