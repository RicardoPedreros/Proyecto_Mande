-- POSTGRESQL VERSION
-- PostgreSQL 12.2 - 64-bits
-- ***********************************************************************************
-- ****************************BASE DE DATOS MANDE V2**********************************

DROP TABLE IF EXISTS Servicio;
DROP TABLE IF EXISTS Usuario;
DROP TABLE IF EXISTS Trabajadores_realizan_Labores;
DROP TABLE IF EXISTS Trabajador;
DROP TABLE IF EXISTS Labor;

DROP SEQUENCE IF EXISTS secuencia1;
DROP SEQUENCE IF EXISTS secuencia2;

CREATE SEQUENCE secuencia1;
CREATE SEQUENCE secuencia2;


CREATE TABLE Labor(
	labor_id 			INT 			DEFAULT NEXTVAL('secuencia1'),
	labor_nombre 		VARCHAR(30) 	NOT NULL,
	labor_descripcion 	VARCHAR(200) 	NOT NULL,
	CONSTRAINT pk_labor PRIMARY KEY (labor_id)
);

CREATE TABLE Trabajador(
	trabajador_documento 		VARCHAR(20),
	trabajador_nombre 			VARCHAR(30) 	NOT NULL,
	trabajador_apellido 		VARCHAR(30) 	NOT NULL,
	trabajador_latitud 			DECIMAL(7,5)	NOT NULL,
	trabajador_longitud 		DECIMAL(7,5)	NOT NULL,
	trabajador_direccion 		VARCHAR(60) 	NOT NULL,
	trabajador_foto_documento 	BYTEA			NOT NULL,
	trabajador_foto_perfil 		BYTEA			NOT NULL,
	trabajador_ocupado 			BOOLEAN			DEFAULT FALSE,
	trabajador_password 		VARCHAR(32)		NOT NULL,
	trabajador_reputacion		DECIMAL(2,1)	DEFAULT -1,
	CONSTRAINT pk_trabajador PRIMARY KEY (trabajador_documento)
);

-- EL VALOR -1 EN REPUTACIÓN INDICA QUE NO HA SIDO CALIFICADO.

CREATE TABLE Trabajadores_realizan_Labores(
	trabajador_documento 	VARCHAR(20),
	labor_id 				INT,
	t_r_l_precio 			INT 		NOT NULL,
	t_r_l_tipo 				BOOLEAN 	NOT NULL,
	CONSTRAINT pk_t_r_l PRIMARY KEY (trabajador_documento, labor_id),
	CONSTRAINT fk_t_r_l1 FOREIGN KEY (trabajador_documento) 
		REFERENCES Trabajador(trabajador_documento) ON UPDATE CASCADE ON DELETE RESTRICT,
	CONSTRAINT fk_t_r_l2 FOREIGN KEY (labor_id) 
		REFERENCES Labor(labor_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE Usuario(
	usuario_celular 			VARCHAR(20),
	usuario_nombre 				VARCHAR(30) 	NOT NULL,
	usuario_apellido 			VARCHAR(30) 	NOT NULL,
	usuario_latitud 			DECIMAL(7,5) 	NOT NULL,
	usuario_longitud 			DECIMAL(7,5) 	NOT NULL,
	usuario_direccion 			VARCHAR(60) 	NOT NULL,
	usuario_foto_recibo 		BYTEA 			NOT NULL,
	usuario_numero_medio_pago 	VARCHAR(60) 	NOT NULL,
	usuario_tipo_medio_pago 	VARCHAR(60) 	NOT NULL,
	usuario_correo 				VARCHAR(60) 	NOT NULL,
	usuario_documento 			VARCHAR(20) 	NOT NULL,
	usuario_password 			VARCHAR(32)		NOT NULL,
	CONSTRAINT pk_usuario PRIMARY KEY (usuario_celular)
);

CREATE TABLE Servicio(
	servicio_id 			INT 			DEFAULT NEXTVAL('secuencia2'),
	servicio_cantidad 		INT				NOT NULL,
	servicio_costo 			INT				NOT NULL,
	servicio_calificacion 	SMALLINT 		NOT NULL,
	servicio_descripcion 	VARCHAR(200) 	NOT NULL,
	servicio_fecha_inicio 	TIMESTAMP		DEFAULT LOCALTIMESTAMP,
	servicio_fecha_pago 	TIMESTAMP,
	servicio_en_curso 		BOOLEAN 		DEFAULT TRUE,
	trabajador_documento 	VARCHAR(20) 	NOT NULL,
	usuario_celular 		VARCHAR(20) 	NOT NULL,
	CONSTRAINT pk_servicio PRIMARY KEY (servicio_id),
	CONSTRAINT fk_servicio1 FOREIGN KEY (trabajador_documento) 
		REFERENCES Trabajador(trabajador_documento) ON UPDATE CASCADE ON DELETE RESTRICT,
	CONSTRAINT fk_servicio2 FOREIGN KEY (usuario_celular) 
		REFERENCES Usuario(usuario_celular) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- PARA REALIZAR LA INSERCIÓN DE DATOS EN LAS TABLAS 'Labor' Y 'Servicio' NO ES NECESARIO
-- INDICAR EL ID, YA QUE SE DEFINE MEDIANTE UN AUTO-INCREMENT.