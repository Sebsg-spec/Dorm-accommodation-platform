USE [inno]
GO

-- -------------------------

INSERT INTO [role]
	([name])
VALUES
	('Student'),
	('Secretar'),
	('Admin')

-- https://www.ubbcluj.ro/ro/facultati
INSERT INTO [faculty]
	([name])
VALUES
	('Facultatea de Matematică şi Informatică'),
	('Facultatea de Fizică'),
	('Facultatea de Chimie şi Inginerie Chimică'),
	('Facultatea de Biologie şi Geologie'),
	('Facultatea de Geografie'),
	('Facultatea de Ştiinţa şi Ingineria Mediului'),
	('Facultatea de Drept'),
	('Facultatea de Litere'),
	('Facultatea de Istorie şi Filosofie'),
	('Facultatea de Sociologie şi Asistenţă Socială'),
	('Facultatea de Psihologie şi Ştiinţe ale Educaţiei'),
	('Facultatea de Ştiinţe Economice şi Gestiunea Afacerilor'),
	('Facultatea de Studii Europene'),
	('Facultatea de Business'),
	('Facultatea de Ştiinţe Politice, Administrative şi ale Comunicării'),
	('Facultatea de Educaţie Fizică şi Sport'),
	('Facultatea de Teologie Ortodoxă'),
	('Facultatea de Teologie Greco-Catolică'),
	('Facultatea de Teologie Reformată și Muzică'),
	('Facultatea de Teologie Romano-Catolică'),
	('Facultatea de Teatru şi FILM'),
	('Facultatea de Inginerie'),
	('School of Health')

INSERT INTO [status]
	([name])
VALUES
	('În curs de verificare'),	-- New dorm application
	('În așteptare'),			-- Application is missing information
	('Validat'),				-- Application approved
	('Repartizat'),				-- Dorm assigned to student
	('Cămin acceptat'),			-- Dorm accepted by student
	('Respins'),				-- Application denied by secretary
	('Cămin refuzat')			-- Dorm declied by student
