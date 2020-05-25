-- POSTGRESQL VERSION
-- PostgreSQL 11.2 - 64-bits
--
-- POSTGIS VERSION
-- PostGIS 2.5
-- ***********************************************************************************
-- ****************************BASE DE DATOS MANDE V5**********************************
DROP TRIGGER IF EXISTS tr_actualizar_usuario ON Usuario;
DROP TRIGGER IF EXISTS tr_insertar_usuario ON Usuario;
DROP TRIGGER IF EXISTS tr_actualizar_punto_geografico ON Punto_Geografico;
DROP TRIGGER IF EXISTS tr_insertar_punto_geografico ON Punto_Geografico;
DROP TRIGGER IF EXISTS tr_gestionar_servicio ON Servicio;
DROP TRIGGER IF EXISTS tr_codificar_servicio ON Servicio;
DROP TRIGGER IF EXISTS tr_codificar_labor ON Labor;

DROP FUNCTION IF EXISTS activar_servicio;
DROP FUNCTION IF EXISTS terminar_servicio;
DROP FUNCTION IF EXISTS calificar_servicio;
DROP FUNCTION IF EXISTS cancelar_servicio;
DROP FUNCTION IF EXISTS agregar_servicio;
DROP FUNCTION IF EXISTS servicio_pendiente;
DROP FUNCTION IF EXISTS buscar_trabajadores;
DROP FUNCTION IF EXISTS modificar_usuario;
DROP FUNCTION IF EXISTS agregar_usuario;
DROP FUNCTION IF EXISTS actualizar_usuario;
DROP FUNCTION IF EXISTS insertar_usuario;
DROP FUNCTION IF EXISTS modificar_trabajador;
DROP FUNCTION IF EXISTS agregar_trabajador;
DROP FUNCTION IF EXISTS confirmar_ubicacion;
DROP FUNCTION IF EXISTS actualizar_punto_geografico;
DROP FUNCTION IF EXISTS insertar_punto_geografico;
DROP FUNCTION IF EXISTS gestionar_servicio;
DROP FUNCTION IF EXISTS codificar_servicio;
DROP FUNCTION IF EXISTS codificar_labor;

DROP VIEW IF EXISTS Labor_Disponible;

DROP INDEX IF EXISTS idx_usu_cel;
DROP INDEX IF EXISTS idx_trab_doc;
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
	pg_ubicacion 		GEOGRAPHY(POINT,4686) 	NOT NULL,
	pg_ciudad 			VARCHAR(40) 			NOT NULL,
	pg_comuna 			VARCHAR(40) 			NOT NULL,
	pg_direccion 		VARCHAR (50) 			NOT NULL,
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
	t_r_l_precio 			INT 		 	NOT NULL,
	t_r_l_tipo 				VARCHAR(20) 	DEFAULT 'Horas',
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
	usuario_numero_medio_pago 	VARCHAR(32) 			NOT NULL,
	usuario_tipo_medio_pago 	VARCHAR(60) 			NOT NULL,
	usuario_correo 				VARCHAR(60) 			NOT NULL,
	usuario_documento 			VARCHAR(20) 			NOT NULL,
	usuario_validado 			BOOLEAN 				DEFAULT TRUE,
	usuario_password 			VARCHAR(60)				NOT NULL,
	CONSTRAINT pk_usuario PRIMARY KEY (usuario_celular),
	CONSTRAINT fk_usuario FOREIGN KEY (usuario_latitud,usuario_longitud) 
		REFERENCES Punto_Geografico(pg_latitud,pg_longitud) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE Servicio(
	servicio_id 			INT,
	servicio_cantidad 		INT,
	servicio_costo 			INT,
	servicio_calificacion 	SMALLINT,
	servicio_descripcion 	VARCHAR(200) 	NOT NULL,
	servicio_fecha_inicio 	VARCHAR(25)		NOT NULL,
	servicio_fecha_fin 		VARCHAR(25),
	servicio_estado 		INT 			DEFAULT 1, -- ESTADOS: 0:Cancelado //1:En espera // 2:Activo // 3:finalizado // 4.Calificado
	usuario_celular 		VARCHAR(20) 	NOT NULL,
	trabajador_documento 	VARCHAR(20) 	NOT NULL,
	labor_id 				INT 			NOT NULL,
	CONSTRAINT pk_servicio PRIMARY KEY (servicio_id),
	CONSTRAINT fk_servicio1 FOREIGN KEY (trabajador_documento,labor_id) 
		REFERENCES Trabajadores_realizan_Labores(trabajador_documento,labor_id) ON UPDATE CASCADE ON DELETE RESTRICT,
	CONSTRAINT fk_servicio2 FOREIGN KEY (usuario_celular) 
		REFERENCES Usuario(usuario_celular) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE INDEX idx_trab_doc ON Servicio USING HASH (trabajador_documento);
CREATE INDEX idx_usu_cel ON Servicio USING HASH (usuario_celular);

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
ocupado BOOLEAN;
validado BOOLEAN;
BEGIN
	SELECT trabajador_ocupado,trabajador_validado INTO ocupado,validado 
	FROM Trabajador WHERE trabajador_documento = NEW.trabajador_documento;
	IF(ocupado = TRUE OR validado = FALSE) THEN
		RAISE EXCEPTION 'Trabajador no elegible';
	END IF;
	NEW.servicio_id := NEXTVAL('secuencia_servicio');
	NEW.servicio_fecha_inicio := TO_CHAR(LOCALTIMESTAMP - INTERVAL '5 hours','YYYY-MM-DD HH24:MI:SS');
	UPDATE Trabajador SET trabajador_ocupado = TRUE WHERE trabajador_documento = NEW.trabajador_documento; 
	RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_codificar_servicio BEFORE INSERT 
ON Servicio FOR EACH ROW 
EXECUTE PROCEDURE codificar_servicio();


CREATE FUNCTION gestionar_servicio() RETURNS TRIGGER AS $$
DECLARE
reputacion DECIMAL;
precio INT;
BEGIN
	IF(NEW.servicio_estado != OLD.servicio_estado) THEN
		IF (OLD.servicio_estado = 0 OR OLD.servicio_estado = 4)THEN
			RAISE EXCEPTION 'No se permite cambiar del estado actual';
		END IF;
		IF (OLD.servicio_estado = 1 AND NEW.servicio_estado != 0 AND NEW.servicio_estado != 2) THEN
			RAISE EXCEPTION 'No se permite este cambio de estado';
		END IF;
		IF (OLD.servicio_estado = 2 AND NEW.servicio_estado != 3) THEN
			RAISE EXCEPTION 'No se permite este cambio de estado';
		END IF;
		IF (OLD.servicio_estado = 2 AND NEW.servicio_estado != 3) THEN
			RAISE EXCEPTION 'No se permite este cambio de estado';
		END IF;
		IF(NEW.servicio_estado = 3 ) THEN
			IF (NEW.servicio_cantidad IS NULL) THEN
				RAISE EXCEPTION 'servicio_cantidad es necesaria';
			END IF;
			UPDATE Trabajador SET trabajador_ocupado = FALSE WHERE trabajador_documento = OLD.trabajador_documento;
			SELECT t_r_l_precio INTO precio 
			FROM Trabajadores_realizan_Labores 
			WHERE trabajador_documento = NEW.trabajador_documento 
			AND labor_id = NEW.labor_id;
			NEW.servicio_costo := NEW.servicio_cantidad * precio;
			NEW.servicio_fecha_fin := TO_CHAR(LOCALTIMESTAMP - INTERVAL '5 hours','YYYY-MM-DD HH24:MI:SS');
		END IF;
		IF(NEW.servicio_estado = 4 ) THEN
			IF (NEW.servicio_calificacion IS NULL) THEN
				RAISE EXCEPTION 'servicio_calificacion es necesaria';
			END IF;
		END IF;
	END IF;
	RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_gestionar_servicio BEFORE UPDATE 
ON Servicio FOR EACH ROW 
EXECUTE PROCEDURE gestionar_servicio();


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


CREATE FUNCTION confirmar_ubicacion(lat DECIMAL, long DECIMAL) RETURNS BOOLEAN AS $$
DECLARE
lat_recortada DECIMAL;
long_recortada DECIMAL;
cant INT;
res BOOLEAN;
BEGIN
	lat_recortada := ROUND(lat,6);
	long_recortada := ROUND(long,6);
	res := TRUE;
	SELECT COUNT(*) INTO cant FROM Punto_Geografico WHERE pg_latitud=lat_recortada 
		AND pg_longitud=long_recortada;
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
	NEW.usuario_numero_medio_pago := MD5(NEW.usuario_numero_medio_pago);
	RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_insertar_usuario BEFORE INSERT 
ON Usuario FOR EACH ROW 
EXECUTE PROCEDURE insertar_usuario();


CREATE FUNCTION actualizar_usuario() RETURNS TRIGGER AS $$
DECLARE
BEGIN
	IF (NEW.usuario_numero_medio_pago != OLD.usuario_numero_medio_pago) THEN
		NEW.usuario_numero_medio_pago := MD5(NEW.usuario_numero_medio_pago);
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


-- Funcion encargada de buscar los trabajadores activos y disponibles que realizan determinada labor 
-- en una distancia maxima con respecto a un usuario 
CREATE FUNCTION buscar_trabajadores(laborid INT, usuariocel VARCHAR, distmax INT, ordenapor INT) -- 1dista 2 puntos 3precio) 
RETURNS TABLE (
documento VARCHAR,
nombre VARCHAR,
apellido VARCHAR,
costo INT,
tipo VARCHAR,
reputacion DECIMAL,
distancia DOUBLE PRECISION
) AS $$
DECLARE
BEGIN
IF (ordenapor = 1) THEN
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
ELSIF (ordenapor = 2) THEN
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
		ORDER BY tr.trabajador_reputacion DESC;
ELSIF (ordenapor = 3) THEN
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
		ORDER BY tlr.t_r_l_precio;
ELSE
	RAISE EXCEPTION 'Criterio de orden invalido';
END IF;
END
$$ LANGUAGE plpgsql;

-- Funcion encargada de indicar si un usuario tiene pendiente por calificar
-- algún servicio con un trabajador
CREATE FUNCTION servicio_pendiente(usu_cel VARCHAR, trab_doc VARCHAR) RETURNS BOOLEAN AS $$
DECLARE
cant INT;
res BOOLEAN;
BEGIN
	res := FALSE;
	SELECT COUNT(*) INTO cant FROM Servicio
	WHERE trabajador_documento = trab_doc
	AND usuario_celular = usu_cel
	AND servicio_estado = 3;
	IF(cant > 0) THEN
		res := TRUE;
	END IF;
	RETURN res;
END
$$ LANGUAGE plpgsql;


CREATE FUNCTION agregar_servicio(usu_cel VARCHAR, trab_doc VARCHAR, laborid INT, descr VARCHAR) RETURNS BOOLEAN AS $$
DECLARE
ocupado BOOLEAN;
res BOOLEAN;
BEGIN
	res := FALSE;
	IF (servicio_pendiente(usu_cel,trab_doc) = FALSE) THEN
		INSERT INTO Servicio (usuario_celular,trabajador_documento,labor_id,servicio_descripcion)
			VALUES (usu_cel,trab_doc,laborid,descr);
		res := TRUE;
	END IF;
	RETURN res;
	EXCEPTION WHEN OTHERS THEN	
	RETURN FALSE;
END
$$ LANGUAGE plpgsql;


CREATE FUNCTION activar_servicio(trab_doc VARCHAR) RETURNS BOOLEAN AS $$
DECLARE
servicioid INT;
res BOOLEAN;
BEGIN
	res := TRUE;
	SELECT servicio_id INTO servicioid FROM Servicio 
	WHERE trabajador_documento = trab_doc
	AND servicio_estado = 1;
	UPDATE Servicio SET servicio_estado = 2 WHERE servicio_id = servicioid;
	IF(servicioid IS NULL) THEN
		res := FALSE;
	END IF;
	RETURN res;
	EXCEPTION WHEN OTHERS THEN	
	RETURN FALSE;
END
$$ LANGUAGE plpgsql;

CREATE FUNCTION terminar_servicio(trab_doc VARCHAR, cantidad INT) RETURNS BOOLEAN AS $$
DECLARE
servicioid INT;
res BOOLEAN;
BEGIN
	res := TRUE;
	SELECT servicio_id INTO servicioid FROM Servicio 
	WHERE trabajador_documento = trab_doc
	AND servicio_estado = 2;
	UPDATE Servicio SET servicio_estado = 3, servicio_cantidad = cantidad WHERE servicio_id = servicioid;
	IF(servicioid IS NULL) THEN
		res := FALSE;
	END IF;
	RETURN res;
	EXCEPTION WHEN OTHERS THEN	
	RETURN FALSE;

END
$$ LANGUAGE plpgsql;


CREATE FUNCTION calificar_servicio(usu_cel VARCHAR, trab_doc VARCHAR, calificacion INT)RETURNS BOOLEAN AS $$
DECLARE
reputacion DECIMAL;
servicioid INT;
res BOOLEAN;
BEGIN
	res := TRUE;
	SELECT servicio_id INTO servicioid FROM Servicio 
	WHERE trabajador_documento = trab_doc
	AND usuario_celular = usu_cel
	AND servicio_estado = 3;
	UPDATE Servicio SET servicio_estado = 4, servicio_calificacion = calificacion 
	WHERE servicio_id = servicioid;
	IF(servicioid IS NULL) THEN
		res := FALSE;
	ELSE
		SELECT AVG(servicio_calificacion) INTO reputacion 
		FROM Servicio WHERE trabajador_documento = trab_doc;
		UPDATE Trabajador SET trabajador_reputacion = reputacion 
		WHERE trabajador_documento = trab_doc;
	END IF;
	RETURN res;
	EXCEPTION WHEN OTHERS THEN	
	RETURN FALSE;
END
$$ LANGUAGE plpgsql;

CREATE FUNCTION cancelar_servicio(trab_doc VARCHAR) RETURNS BOOLEAN AS $$
DECLARE
servicioid INT;
res BOOLEAN;
BEGIN
	res := TRUE;
	SELECT servicio_id INTO servicioid FROM Servicio 
	WHERE trabajador_documento = trab_doc
	AND servicio_estado = 1;
	UPDATE Servicio SET servicio_estado = 0 WHERE servicio_id = servicioid;
	IF(servicioid IS NULL) THEN
		res := FALSE;
	END IF;
	RETURN res;
	EXCEPTION WHEN OTHERS THEN	
	RETURN FALSE;
END
$$ LANGUAGE plpgsql;

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
SELECT agregar_trabajador('789','Eddie','Salsa','photodocs/789id.jpg','profileph/789.jpg','salsa000',
							3.371941,-76.53021,'Cali','Comuna 19','yyyyy');

UPDATE Trabajador SET trabajador_validado = FALSE WHERE trabajador_documento = '789';
/*LUGARES
Ciencias Comp: 3.37565,-76.52976
Herbario: 3.37773,-76.5344
Coliseo: 3.37167,-76.5338
Plazoleta UV: 3.37595,-76.532765
Porteria Peatonal: 3.37508,-76.5371
Servicio Medico Profesores: 3.379722,-76.53705
Portería Coca-Cola: 3.371941,-76.53021
*/

INSERT INTO Trabajadores_realizan_Labores VALUES
('123',1,5000,'Horas'),
('123',2,7000,'Horas'),
('123',3,50000,'Metro cuadrado'),
('234',4,5600,'Horas'),
('234',6,3500,'Horas'),
('345',5,7800,'Horas'),
('345',3,8000,'Horas'),
('456',6,6000,'Horas'),
('456',7,30000,'Horas'),
('678',8,6000,'Horas'),
('789',3,5200,'Metro cuadrado'),
('789',1,1300,'Horas'),
('789',2,2200,'Horas'),
('789',4,5600,'Horas');

SELECT agregar_usuario('321','Andres','Perez','photorec/321xxx.jpg','001','Credito','ap@ap.com','987','$2a$10$xb9HVvCjS7I8yv95nAeyaurWdrz8mCtITfL/KEA/ECIt2W1JLvjeK',
							3.385, -76.53765,'Cali','Compuna 5','dir1');
SELECT agregar_usuario('311','Cristian','Pascu','photorec/311xxx.jpg','002','Debito','pp@pp.com','876','$2y$10$CTwZWx4oabSwr/9uKkU2i.LXT7wpLvpa159ClYJLHWKED6YLMav72',
							3.36446, -76.53305,'Cali','Comuna 4','dir2');
SELECT agregar_usuario('316','Marcos','Mejia','photorec/316xxx.jpg','003','Credito','mm@mm.com','765','$2y$10$d.V545d0Yb4diuZ4sfeegOHugNMd9XZcMUpO.6HqLs8KaAwReQbNe',
							3.374206,-76.523103,'Cali','Comuna 2','dir3'); 
SELECT agregar_usuario('304','Manuela','Giraldo','photorec/304xxx.jpg','0004','Debito','mg@mg.com','654','$2y$10$aO8ooidrhpMZQhH8Wld40ehbyqvTgoryzA.fDGMMTLV1igS0nwYCC',
							3.373614,-76.5389,'Cali','Comuna 20','dir4');

/*
LOGINS'S DE PRUEBA
321 -- perez
311 -- pascu
316 -- mejia
304 -- Giraldo
*/
/*
LUGARES
Alkomprar:3.385, -76.53765
Pizzeria Sur: 3.36446, -76.53305
Makro: 3.374206,-76.523103
Oasis Unicentro: 3.373614,-76.5389
*/
-- *************************************************************************************************
/* LINEA DE FUNCIONES USUARIO
REGISTRO:
SELECT agregar_usuario(...);

LISTA DE LABORES A ESCOGER:
SELECT * FROM Labor_Disponible;

LISTA DE TRABAJADORES DISPONIBLES DE UNA LABOR ESPECÍFICA(Escogida de la vista anterior):
SELECT buscar_trabajadores(...);

CREAR UN SERVICIO CON UN TRABAJADOR:
SELECT agregar_servicio(...);


LISTA SERVICIOS ACTIVOS:
-- SELECT * FROM SERVICIO WHERE servicio_estado = 1 AND usuario_celular = usercel;

-- PAGAR AUTOMATICAMENTE
LISTA SERVICIOS A PAGAR:
-- SELECT * FROM SERVICIO WHERE servicio_estado = 2 AND usuario_celular = usercel; 

NOTA: PARA PODER VOLVER A SOLICITAR UN SERVICIO CON UN TRABAJADOR DEBE CANCELAR LOS SERVICIOS QUE TENGA PENDIENTES
DE PAGAR CON ÉL.

NOTA 2: LUEGO DE SOLICITAR UN SERVICIO EL USUARIO DEBE ESPERAR A QUE EL TRABAJADOR DESDE SU APP FINALICE EL TRABAJO
PARA PODER PAGARLO

PAGAR SERVICIO:
SELECT pagar_servicio(...);

-- **************************************************************
LINEA DE FUNCIONES TRABAJADOR
REGISTRO:
SELECT agregar_trabajador(...);

LISTA DE LABORES:
SELECT * FROM Labor;

ASOCIARSE A UNA LABOR:
((¡¡¡FALTA FUNCION!!!))
Podría hacerse por insert.

TERMINAR UN SERVICIO:
SELECT terminar_servicio(...);

CANCELAR SERVICIO:
((FALTAAA))

SELECT tr.trabajador_documento, trabajador_nombre, trabajador_apellido, labor_id, labor_nombre,
FROM Trabajador AS tr
NATURAL JOIN
Trabajadores_realizan_Labores
NATURAL JOIN
Labor;
*/