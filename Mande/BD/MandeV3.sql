-- POSTGRESQL VERSION
-- PostgreSQL 11.2 - 64-bits
--
-- POSTGIS VERSION
-- PostGIS 2.5
-- ***********************************************************************************
-- ****************************BASE DE DATOS MANDE V3**********************************

DROP TRIGGER IF EXISTS tr_actualizar_usuario ON Usuario;
DROP TRIGGER IF EXISTS tr_insertar_usuario ON Usuario;
DROP TRIGGER IF EXISTS tr_actualizar_trabajador ON Trabajador;
DROP TRIGGER IF EXISTS tr_insertar_trabajador ON Trabajador;
DROP TRIGGER IF EXISTS tr_actualizar_punto_geografico ON Punto_Geografico;
DROP TRIGGER IF EXISTS tr_insertar_punto_geografico ON Punto_Geografico;
DROP TRIGGER IF EXISTS tr_codificar_servicio ON Servicio;
DROP TRIGGER IF EXISTS tr_codificar_labor ON Labor;

DROP FUNCTION IF EXISTS buscar_trabajadores; -- NO TIENE TR
DROP FUNCTION IF EXISTS modificar_usuario; -- NO TIENE TR
DROP FUNCTION IF EXISTS agregar_usuario; -- NO TIENE TR
DROP FUNCTION IF EXISTS actualizar_usuario;
DROP FUNCTION IF EXISTS insertar_usuario;
DROP FUNCTION IF EXISTS modificar_trabajador; -- NO TIENE TR
DROP FUNCTION IF EXISTS agregar_trabajador; -- NO TIENE TR
DROP FUNCTION IF EXISTS confirmar_ubicacion; -- NO TIENE TR
DROP FUNCTION IF EXISTS actualizar_trabajador;
DROP FUNCTION IF EXISTS insertar_trabajador;
DROP FUNCTION IF EXISTS actualizar_punto_geografico;
DROP FUNCTION IF EXISTS insertar_punto_geografico;
DROP FUNCTION IF EXISTS codificar_servicio;
DROP FUNCTION IF EXISTS codificar_labor;

DROP VIEW IF EXISTS Labor_Disponible;

DROP INDEX IF EXISTS idx_trab_ocup;

DROP TABLE IF EXISTS Servicio;
DROP TABLE IF EXISTS Usuario;
DROP TABLE IF EXISTS Trabajadores_realizan_Labores;
DROP TABLE IF EXISTS Trabajador;
DROP TABLE IF EXISTS Punto_Geografico;
DROP TABLE IF EXISTS Labor;

DROP SEQUENCE IF EXISTS secuencia_servicio;
DROP SEQUENCE IF EXISTS secuencia_labor;

DROP EXTENSION IF EXISTS postgis;

CREATE EXTENSION postgis;

CREATE SEQUENCE secuencia_labor;
CREATE SEQUENCE secuencia_servicio;


CREATE TABLE Labor(
	labor_id 			INT,
	labor_nombre 		VARCHAR(30) 	NOT NULL,
	labor_descripcion 	VARCHAR(200) 	NOT NULL,
	CONSTRAINT pk_labor PRIMARY KEY (labor_id)
);

CREATE TABLE Punto_Geografico(
	pg_latitud 			DECIMAL(8,6),
	pg_longitud 		DECIMAL(8,6),
	pg_ubicacion 		GEOGRAPHY(POINT,4686),
	pg_ciudad 			VARCHAR(40),
	pg_comuna 			VARCHAR(40),
	pg_direccion 		VARCHAR (50),
	CONSTRAINT pk_punto_geografico PRIMARY KEY (pg_latitud,pg_longitud)
);

CREATE TABLE Trabajador(
	trabajador_documento 		VARCHAR(20),
	trabajador_nombre 			VARCHAR(30) 			NOT NULL,
	trabajador_apellido 		VARCHAR(30) 			NOT NULL,
	trabajador_latitud 			DECIMAL(8,6)			NOT NULL,
	trabajador_longitud 		DECIMAL(8,6)			NOT NULL,
	trabajador_foto_documento 	VARCHAR(60)				NOT NULL,
	trabajador_foto_perfil 		VARCHAR(60)				NOT NULL,
	trabajador_ocupado 			BOOLEAN					DEFAULT FALSE,
	trabajador_validado 		BOOLEAN 				DEFAULT TRUE,
	trabajador_password 		VARCHAR(32)				NOT NULL,
	trabajador_reputacion		DECIMAL(2,1)			DEFAULT 0,
	CONSTRAINT pk_trabajador PRIMARY KEY (trabajador_documento),
	CONSTRAINT fk_trabajador FOREIGN KEY (trabajador_latitud,trabajador_longitud) 
		REFERENCES Punto_Geografico(pg_latitud,pg_longitud) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE INDEX idx_trab_ocup ON Trabajador USING HASH (trabajador_ocupado);

CREATE TABLE Trabajadores_realizan_Labores(
	trabajador_documento 	VARCHAR(20),
	labor_id 				INT,
	t_r_l_precio 			INT 		NOT NULL,
	t_r_l_tipo 				BOOLEAN 	NOT NULL,
	t_r_l_descripcion_tipo 	VARCHAR(100),
	CONSTRAINT pk_t_r_l PRIMARY KEY (trabajador_documento, labor_id),
	CONSTRAINT fk_t_r_l1 FOREIGN KEY (trabajador_documento) 
		REFERENCES Trabajador(trabajador_documento) ON UPDATE CASCADE ON DELETE RESTRICT,
	CONSTRAINT fk_t_r_l2 FOREIGN KEY (labor_id) 
		REFERENCES Labor(labor_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE Usuario(
	usuario_celular 			VARCHAR(20),
	usuario_nombre 				VARCHAR(30) 			NOT NULL,
	usuario_apellido 			VARCHAR(30) 			NOT NULL,
	usuario_latitud 			DECIMAL(8,6) 			NOT NULL,
	usuario_longitud 			DECIMAL(8,6) 			NOT NULL,
	usuario_foto_recibo 		VARCHAR(100)			NOT NULL,
	usuario_numero_medio_pago 	VARCHAR(60) 			NOT NULL,
	usuario_tipo_medio_pago 	VARCHAR(60) 			NOT NULL,
	usuario_correo 				VARCHAR(60) 			NOT NULL,
	usuario_documento 			VARCHAR(20) 			NOT NULL,
	usuario_validado 			BOOLEAN 				DEFAULT TRUE,
	usuario_password 			VARCHAR(32)				NOT NULL,
	CONSTRAINT pk_usuario PRIMARY KEY (usuario_celular),
	CONSTRAINT fk_usuario FOREIGN KEY (usuario_latitud,usuario_longitud) 
		REFERENCES Punto_Geografico(pg_latitud,pg_longitud) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE Servicio(
	servicio_id 			INT,
	servicio_cantidad 		INT				NOT NULL,
	servicio_costo 			INT				NOT NULL,
	servicio_calificacion 	SMALLINT 		NOT NULL,
	servicio_descripcion 	VARCHAR(200) 	NOT NULL,
	servicio_fecha_inicio 	TIMESTAMP		DEFAULT LOCALTIMESTAMP,
	servicio_fecha_pago 	TIMESTAMP,
	servicio_finalizado 	BOOLEAN 		DEFAULT FALSE,
	servicio_cancelado 		BOOLEAN 		DEFAULT FALSE,
	trabajador_documento 	VARCHAR(20) 	NOT NULL,
	usuario_celular 		VARCHAR(20) 	NOT NULL,
	CONSTRAINT pk_servicio PRIMARY KEY (servicio_id),
	CONSTRAINT fk_servicio1 FOREIGN KEY (trabajador_documento) 
		REFERENCES Trabajador(trabajador_documento) ON UPDATE CASCADE ON DELETE RESTRICT,
	CONSTRAINT fk_servicio2 FOREIGN KEY (usuario_celular) 
		REFERENCES Usuario(usuario_celular) ON UPDATE CASCADE ON DELETE RESTRICT
);
-- ***************************************************************************
-- ************************VISTAS**********************************
CREATE VIEW Labor_Disponible
(labor_id,labor_nombre,labor_descripcion,cantidad_trabajadores) AS
SELECT l.labor_id,l.labor_nombre,l.labor_descripcion,COUNT(l.labor_id)
	FROM Trabajadores_realizan_Labores AS trl
	INNER JOIN Trabajador AS tr
	ON tr.trabajador_documento = trl.trabajador_documento
	AND tr.trabajador_ocupado = FALSE
	AND tr.trabajador_validado = TRUE
	NATURAL JOIN Labor AS l
	GROUP BY l.labor_id,l.labor_nombre,l.labor_descripcion
	ORDER BY labor_nombre;
-- ************************************************************************************
-- ************************PROCEDIMIENTOS ALMACENADOS**********************************

CREATE FUNCTION codificar_labor() RETURNS TRIGGER AS $$
DECLARE
BEGIN
	NEW.labor_id := NEXTVAL('secuencia_labor');
	RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_codificar_labor BEFORE INSERT 
ON Labor FOR EACH ROW 
EXECUTE PROCEDURE codificar_labor();


CREATE FUNCTION codificar_servicio() RETURNS TRIGGER AS $$
DECLARE
BEGIN
	NEW.servicio_id := NEXTVAL('secuencia_servicio');
	RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_codificar_servicio BEFORE INSERT 
ON Servicio FOR EACH ROW 
EXECUTE PROCEDURE codificar_servicio();


CREATE FUNCTION insertar_punto_geografico() RETURNS TRIGGER AS $$
DECLARE
BEGIN
	NEW.pg_ubicacion := ST_SetSRID(ST_MakePoint(NEW.pg_longitud,NEW.pg_latitud),4686);
	RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_insertar_punto_geografico BEFORE INSERT 
ON Punto_Geografico FOR EACH ROW 
EXECUTE PROCEDURE insertar_punto_geografico();


CREATE FUNCTION actualizar_punto_geografico() RETURNS TRIGGER AS $$
DECLARE
BEGIN
	IF (NEW.pg_longitud != OLD.pg_longitud OR NEW.pg_latitud != OLD.pg_latitud) THEN
		NEW.pg_ubicacion := ST_SetSRID(ST_MakePoint(NEW.pg_longitud,NEW.pg_latitud),4686);
	END IF;
	RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_actualizar_punto_geografico BEFORE UPDATE 
ON Punto_Geografico FOR EACH ROW 
EXECUTE PROCEDURE actualizar_punto_geografico();


CREATE FUNCTION insertar_trabajador() RETURNS TRIGGER AS $$
DECLARE
BEGIN
	NEW.trabajador_password := MD5(NEW.trabajador_password);
	RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_insertar_trabajador BEFORE INSERT 
ON Trabajador FOR EACH ROW 
EXECUTE PROCEDURE insertar_trabajador();


CREATE FUNCTION actualizar_trabajador() RETURNS TRIGGER AS $$
DECLARE
BEGIN
	IF (NEW.trabajador_password != OLD.trabajador_password) THEN
		NEW.trabajador_password := MD5(NEW.trabajador_password);
	END IF;
	RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_actualizar_trabajador BEFORE UPDATE 
ON Trabajador FOR EACH ROW 
EXECUTE PROCEDURE actualizar_trabajador();


CREATE FUNCTION confirmar_ubicacion(lat DECIMAL, long DECIMAL) RETURNS BOOLEAN AS $$
DECLARE
cant INT;
res BOOLEAN;
BEGIN
	res := TRUE;
	SELECT COUNT(*) INTO cant FROM Punto_Geografico WHERE pg_latitud=lat AND pg_longitud=long;
	IF (cant = 0) THEN
		res := FALSE;
	END IF;
	RETURN res;
END
$$ LANGUAGE plpgsql;


-- Funcion encargada de insertar un trabajador y generar una nueva ubicacion si se ingresa una latitud y/o
-- y longitud a unas que no estan registradas en la tabla Punto_Geografico
CREATE FUNCTION agregar_trabajador(doc VARCHAR,nom VARCHAR,ape VARCHAR,fotdoc VARCHAR,
								   fotperf VARCHAR,pass VARCHAR,lat DECIMAL, long DECIMAL,
								   ciu VARCHAR,comu VARCHAR, dirc VARCHAR) 
RETURNS BOOLEAN AS $$
DECLARE
BEGIN
	IF (confirmar_ubicacion(lat,long) = FALSE) THEN
		INSERT INTO Punto_Geografico(pg_latitud,pg_longitud,pg_ciudad,pg_comuna,pg_direccion)
		VALUES (lat,long,ciu,comu,dirc);
	END IF;
	INSERT INTO Trabajador (trabajador_documento, trabajador_nombre, trabajador_apellido, trabajador_latitud, 
								trabajador_longitud,trabajador_foto_documento, trabajador_foto_perfil, trabajador_password)
		VALUES (doc,nom,ape,lat,long,fotdoc,fotperf,pass);
	RETURN TRUE;
	EXCEPTION WHEN OTHERS THEN	
	RETURN FALSE;
END
$$ LANGUAGE plpgsql;


-- Funcion encargada de actualizar un trabajador y generar una nueva ubicacion si se actualiza la latitud y/o
-- la longitud a unas que no estan registradas en la tabla Punto_Geografico
CREATE FUNCTION modificar_trabajador(doc VARCHAR,nom VARCHAR,ape VARCHAR,fotdoc VARCHAR,
								   fotperf VARCHAR,pass VARCHAR,lat DECIMAL, long DECIMAL,
								   ciu VARCHAR,comu VARCHAR, dirc VARCHAR) 
RETURNS BOOLEAN AS $$
DECLARE
BEGIN
	IF (confirmar_ubicacion(lat,long) = FALSE) THEN
		INSERT INTO Punto_Geografico(pg_latitud,pg_longitud,pg_ciudad,pg_comuna,pg_direccion)
		VALUES (lat,long,ciu,comu,dirc);
	END IF;
	UPDATE Trabajador SET trabajador_nombre = nom, trabajador_apellido = ape, trabajador_latitud = lat ,trabajador_longitud = long,
	trabajador_foto_documento = fotdoc, trabajador_foto_perfil = fotperf, trabajador_password = pass
	WHERE trabajador_documento = doc;
	RETURN TRUE;
	EXCEPTION WHEN OTHERS THEN	
	RETURN FALSE;
END
$$ LANGUAGE plpgsql;


CREATE FUNCTION insertar_usuario() RETURNS TRIGGER AS $$
DECLARE
BEGIN
	NEW.usuario_password := MD5(NEW.usuario_password);
	RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_insertar_usuario BEFORE INSERT 
ON Usuario FOR EACH ROW 
EXECUTE PROCEDURE insertar_usuario();


CREATE FUNCTION actualizar_usuario() RETURNS TRIGGER AS $$
DECLARE
BEGIN
	IF (NEW.usuario_password != OLD.usuario_password) THEN
		NEW.usuario_password := MD5(NEW.usuario_password);
	END IF;
	RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_actualizar_usuario BEFORE UPDATE 
ON Usuario FOR EACH ROW 
EXECUTE PROCEDURE actualizar_usuario();


-- Funcion encargada de insertar un usuario y generar una nueva ubicacion si se ingresa una latitud y/o
-- y longitud a unas que no estan registradas en la tabla Punto_Geografico
CREATE FUNCTION agregar_usuario(cel VARCHAR,nom VARCHAR,ape VARCHAR,fotrec VARCHAR,
								   numpag VARCHAR,tipo VARCHAR,emai VARCHAR,doc VARCHAR, pass VARCHAR,
								   lat DECIMAL, long DECIMAL,ciu VARCHAR,comu VARCHAR, dirc VARCHAR) 
RETURNS BOOLEAN AS $$
DECLARE
BEGIN
	IF (confirmar_ubicacion(lat,long) = FALSE) THEN
		INSERT INTO Punto_Geografico(pg_latitud,pg_longitud,pg_ciudad,pg_comuna,pg_direccion)
		VALUES (lat,long,ciu,comu,dirc);
	END IF;
	INSERT INTO Usuario (usuario_celular, usuario_nombre, usuario_apellido, usuario_latitud, usuario_longitud,usuario_foto_recibo, 
		usuario_numero_medio_pago, usuario_tipo_medio_pago, usuario_correo, usuario_documento, usuario_password)
	VALUES (cel,nom,ape,lat,long,fotrec,numpag,tipo,emai,doc,pass);
	RETURN TRUE;
	EXCEPTION WHEN OTHERS THEN	
	RETURN FALSE;
END
$$ LANGUAGE plpgsql;


-- Funcion encargada de actualizar un usuario y generar una nueva ubicacion si se actualiza la latitud y/o
-- la longitud a unas que no estan registradas en la tabla Punto_Geografico
CREATE FUNCTION modificar_usuario(cel VARCHAR,nom VARCHAR,ape VARCHAR,fotrec VARCHAR,
								   numpag VARCHAR,tipo VARCHAR,emai VARCHAR,doc VARCHAR, pass VARCHAR,
								   lat DECIMAL, long DECIMAL,ciu VARCHAR,comu VARCHAR, dirc VARCHAR) 
RETURNS BOOLEAN AS $$
DECLARE
BEGIN
	IF (confirmar_ubicacion(lat,long) = FALSE) THEN
		INSERT INTO Punto_Geografico(pg_latitud,pg_longitud,pg_ciudad,pg_comuna,pg_direccion)
		VALUES (lat,long,ciu,comu,dirc);
	END IF;
	UPDATE Usuario SET usuario_nombre = nom, usuario_apellido = ape, usuario_latitud = lat, usuario_longitud = long,
		usuario_foto_recibo = fotrec,usuario_numero_medio_pago=numpag, usuario_tipo_medio_pago=tipo, usuario_correo=emai,
		usuario_documento = doc, usuario_password=pass
		WHERE usuario_celular = cel;
	RETURN TRUE;
	EXCEPTION WHEN OTHERS THEN	
	RETURN FALSE;
END
$$ LANGUAGE plpgsql;


-- Funcion encargada de buscar los trabajadores activos y disponibles que realizan determinada labor en una distancia maxima con
-- respecto a un usuario 
CREATE FUNCTION buscar_trabajadores(laborid INT, usuariocel VARCHAR, distmax INT) 
RETURNS TABLE (
documento VARCHAR,
nombre VARCHAR,
apellido VARCHAR,
costo INT,
tipo BOOLEAN,
reputacion DECIMAL,
distancia DOUBLE PRECISION
) AS $$
DECLARE
BEGIN
 RETURN QUERY SELECT tr.trabajador_documento,tr.trabajador_nombre, tr.trabajador_apellido,tlr.t_r_l_precio,tlr.t_r_l_tipo,tr.trabajador_reputacion,ST_Distance(pg1.pg_ubicacion,usuario_ubicacion) AS distancia
	FROM trabajadores_realizan_labores AS tlr
	INNER JOIN Labor AS l
	ON tlr.labor_id = l.labor_id
	AND l.labor_id = laborid
	INNER JOIN Trabajador AS tr
	ON tlr.trabajador_documento = tr.trabajador_documento
	AND tr.trabajador_ocupado = FALSE
	AND tr.trabajador_validado = TRUE
	INNER JOIN Punto_Geografico AS pg1
	ON tr.trabajador_latitud = pg1.pg_latitud
	AND tr.trabajador_longitud = pg1.pg_longitud,
	LATERAL(
		SELECT u.usuario_nombre,pg2.pg_ubicacion AS usuario_ubicacion
		FROM Usuario AS u
		INNER JOIN Punto_Geografico AS pg2
		ON u.usuario_latitud = pg2.pg_latitud
		AND u.usuario_longitud = pg2.pg_longitud
		WHERE u.usuario_celular = usuariocel
	) AS u
	WHERE ST_Distance(pg1.pg_ubicacion,usuario_ubicacion) < distmax
	ORDER BY distancia;
END
$$ LANGUAGE plpgsql;


-- Funcion encargada de mostrar las labores que tienen trabajadores disponibles para solicitar trabajos
-- ************************************************************************************
-- ************************INSERTS PERMANENTES**********************************

INSERT INTO Labor (labor_nombre, labor_descripcion) VALUES
('Plomero/a',CONCAT('Realiza instalaciones de agua potable, agua no potable y la recogida de aguas pluviales y de aguas residuales, ', 
	'además reparaciones de tuberías, desagües, roturas de bajantes, grifería.')),
('Cerrajero/a',CONCAT('Realiza la reparación y mantenimiento de cerraduras, candados, cerrojos y cilindros, ',
	'tanto de puertas comunes como de vehículos.')),
('Pintor/a','Encargado/a de la decoración, corrección y protección de paredes, cubiertas y otras superficies interiores o exteriores.'),
('Tecnico/a en sistemas','Realiza mantenimiento, supervisión y reparación de equipos de computo.'),
('Ebanista','Trabaja la madera para la realización de muebles.'),
('Mesero/a','Encargado/a de atender a los asistentes a eventos o restaurantes.'),
('Chef','Encargado de la realización de comida ya sea en eventos, restaurantes, hoteles, etc.'),
('Niñero/a','Su labor es el cuidado de bebés, niños y jovenes.'),
('Paseador/a de mascotas','Se encarga de ofrecer el servicio de pasear y cuidar a las mascotas.'),
('Empleado/a doméstico/a','Realiza el mantenimiento y labores del hogar.');

-- ************************************************************************************
-- ************************INSERTS DE PRUEBA**********************************
SELECT agregar_trabajador('123','Juan','Caicedo','photodocs/123id.jpg','profileph/123.jpg','marcos123',
							3.37565,-76.52976,'Cali','Comuna 17','Direccion1');
SELECT agregar_trabajador('234','Danilo','Pascumal','photodocs/234id.jpg','profileph/234.jpg','cristian234',
							3.37773,-76.5344,'Cali','Comuna 18','Direccion2');
SELECT agregar_trabajador('345','Kevin','Loaiza','photodocs/345id.jpg','profileph/345.jpg','uribe345',
							3.37167,-76.5338,'Cali','Comuna 12','Direccion3');
SELECT agregar_trabajador('456','Ricardo','Pedreros','photodocs/456id.jpg','profileph/456.jpg','andres456',
							3.37595,-76.532765,'Cali','Comuna 2','Dir');
SELECT agregar_trabajador('567','Pepe','Perez','photodocs/567id.jpg','profileph/567.jpg','ppp567',
							3.37508,-76.5371,'Cali','Comuna 3','ddd');
SELECT agregar_trabajador('678','Cosme','Fulano','photodocs/678id.jpg','profileph/678.jpg','fulanito678',
							3.379722,-76.53705,'Cali','Comuna 1','fsdsf');

UPDATE Trabajador SET trabajador_validado = FALSE WHERE trabajador_documento = '123';
/*LUGARES
Ciencias Comp: 3.37565,-76.52976
Herbario: 3.37773,-76.5344
Coliseo: 3.37167,-76.5338
Plazoleta UV: 3.37595,-76.532765
Porteria Peatonal: 3.37508,-76.5371
Servicio Medico Profesores: 3.379722,-76.53705
*/

INSERT INTO Trabajadores_realizan_Labores VALUES
('123',1,5000,FALSE,''),
('123',2,7000,FALSE,''),
('123',3,50000,TRUE,''),
('234',4,5600,FALSE,''),
('234',6,3500,FALSE,''),
('345',5,7800,FALSE,''),
('345',3,8000,FALSE,''),
('456',6,6000,FALSE,''),
('456',7,30000,FALSE,''),
('678',8,6000,FALSE,'');

SELECT agregar_usuario('321xx','Andres','Perez','photorec/321xxx.jpg','001','Credito','ap@ap.com','987','perez',
							3.385, -76.53765,'Cali','Comuna 5','dir1');
SELECT agregar_usuario('311xx','Cristian','Pascu','photorec/311xxx.jpg','002','Debito','pp@pp.com','876','pascu',
							3.36446, -76.53305,'Cali','Comuna 4','dir2');
SELECT agregar_usuario('316xx','Marcos','Mejia','photorec/316xxx.jpg','003','Credito','mm@mm.com','765','mejia',
							3.374206,-76.523103,'Cali','Comuna 2','dir3');
SELECT agregar_usuario('304xx','Manuela','Giraldo','photorec/304xxx.jpg','0004','Debito','mg@mg.com','654','giraldo',
							3.373614,-76.5389,'Cali','Comuna 20','dir4');
/*
LUGARES
Alkomprar:3.385, -76.53765
Pizzeria Sur: 3.36446, -76.53305
Makro: 3.374206,-76.523103
Oasis Unicentro: 3.373614,-76.5389
*/