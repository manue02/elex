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

    @Column(name = "activo")
    private Boolean activo;

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

    public Boolean getActivo() {
        return activo;
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

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public TiposExpedienteModel getTiposExpediente() {
        return tiposExpediente;
    }

    public void setTiposExpediente(TiposExpedienteModel tiposExpediente) {
        this.tiposExpediente = tiposExpediente;
    }

    public ExpedientesModel() {
    }

    public ExpedientesModel(String codigo, LocalDate fecha,  Boolean activo , Estado estado,String opciones, String descripcion, TiposExpedienteModel tiposExpediente) {
        this.codigo = codigo;
        this.fecha = fecha;
        this.estado = estado;
        this.activo = activo;
        this.opciones = opciones;
        this.descripcion = descripcion;
        this.tiposExpediente = tiposExpediente;
    }
}
