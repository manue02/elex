package com.soltel.elex.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;


@Entity
@Table(name = "documentos")
public class DocumentosModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ruta")
    private String ruta;

    @Column(name = "tasa")
    private float tasa;

    @Column(name = "vigente")
    private Boolean vigente;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "tipo")
    private String tipo;

    @Column(name = "archivo")
    @Lob
    @JsonIgnore
    private byte[] archivo;

    @ManyToOne
    @JoinColumn(name = "expediente",nullable = false)
    private ExpedientesModel expediente;

    public Integer getId() {
        return id;
    }

    public String getRuta() {
        return ruta;
    }

    public float getTasa() {
        return tasa;
    }

    public Boolean getVigente() {
        return vigente;
    }

    public String getNombre() {
        return nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setRuta(String ruta) {
        this.ruta = ruta;
    }

    public void setTasa(float tasa) {
        this.tasa = tasa;
    }

    public void setVigente(Boolean vigente) {
        this.vigente = vigente;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public ExpedientesModel getExpediente() {
        return expediente;
    }

    public byte[] getArchivo() {
        return archivo;
    }

    public void setExpediente(ExpedientesModel expediente) {
        this.expediente = expediente;
    }

    public DocumentosModel() {
    }

    public DocumentosModel(String ruta, float tasa, Boolean vigente, String nombre, String tipo, ExpedientesModel expediente, byte[] archivo) {
        this.ruta = ruta;
        this.tasa = tasa;
        this.vigente = vigente;
        this.nombre = nombre;
        this.tipo = tipo;
        this.expediente = expediente;
        this.archivo = archivo;
    }
}
