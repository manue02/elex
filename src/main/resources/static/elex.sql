-- Acceso a MySQL: root / root
-- Materias -> pág. 223
-- Documentos -> pág. 208
-- Tipos Expediente -> pag 66 y varias mas
-- Estados -> Página 165
-- Actuaciones -> Página 36

SET sql_mode = 'STRICT_ALL_TABLES';

DROP DATABASE IF EXISTS elex;
CREATE DATABASE IF NOT EXISTS elex
CHARACTER SET utf8mb4
  COLLATE utf8mb4_spanish_ci;

USE elex;

-- 1. Tabla Tipos Expediente
CREATE TABLE tipos_expediente
(
	id TINYINT NOT NULL UNIQUE AUTO_INCREMENT,
    materia VARCHAR (20) UNIQUE NOT NULL,
    acciones ENUM('H', 'P', 'R') DEFAULT 'H',
    activo BOOLEAN DEFAULT 1,
    PRIMARY KEY PK_tipos_expediente (id)
) 
COMMENT "Tabla Principal Tipos -> Expedientes";

-- 2. Tabla Expedientes
CREATE TABLE expedientes
(
	id INT NOT NULL UNIQUE AUTO_INCREMENT,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    fecha DATE NOT NULL,
    estado ENUM('Pendiente','Enviado', 'Erróneo') DEFAULT 'Pendiente',
    opciones VARCHAR(70) DEFAULT "",
    descripcion VARCHAR(255) NOT NULL,
	tipo TINYINT NOT NULL,
    FOREIGN KEY (tipo) REFERENCES tipos_expediente (id),
    PRIMARY KEY PK_expedientes (id)
)
COMMENT "Tabla Principal Expedientes";

-- 3. Tabla Actuaciones
CREATE TABLE actuaciones 
(
	id INT NOT NULL UNIQUE AUTO_INCREMENT,
    descripcion VARCHAR(255) NOT NULL,
    finalizado BOOLEAN DEFAULT 0,
    fecha DATE NOT NULL,
    expediente INT NOT NULL,
    observaciones VARCHAR(255) DEFAULT "",
    responsable VARCHAR(50) DEFAULT "",
    FOREIGN KEY (expediente) REFERENCES expedientes (id),
    PRIMARY KEY PK_actuaciones (id)
);

-- 4. Tabla Documentos
CREATE TABLE documentos
(
	id INT NOT NULL UNIQUE AUTO_INCREMENT,
	ruta VARCHAR(255) NOT NULL,
    tasa DECIMAL(6,2) NOT NULL,
    expediente INT NOT NULL,
    vigente BOOLEAN DEFAULT 1,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    archivo MEDIUMBLOB NOT NULL,
    FOREIGN KEY (expediente) REFERENCES expedientes (id),
    PRIMARY KEY PK_documentos (id)
);

INSERT INTO tipos_expediente (materia, acciones, activo) VALUES
("Civil", "H", 1),
("Penal", "P", 0),
("Administrativo", "R", 1);

INSERT INTO expedientes
(codigo, fecha, estado, opciones, descripcion, tipo)
VALUES
("CIV-001", "2024-03-20", "Pendiente", "Opción 1", "Expediente Civil 1", 1),
("PEN-001", "2024-03-20", "Enviado", "Opción 2", "Expediente Penal 1", 2),
("ADM-001", "2024-03-20", "Erróneo", "Opción 3", "Expediente Administrativo 1", 3);

INSERT INTO actuaciones
(descripcion, finalizado, fecha, expediente, observaciones, responsable)
VALUES
("Actuación 1", 0, "2024-03-20", 1, "Observación 1", "Miguel Ángel García"),
("Actuación 2", 1, "2024-03-20", 2, "Observación 2", "Santiago García Pérez"),
("Actuación 3", 0, "2024-03-20", 3, "Observación 3", "Jose Ángel Rodríguez");



