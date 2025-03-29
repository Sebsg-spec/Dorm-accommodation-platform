USE [inno]
GO

-- -------------------------

INSERT INTO [role]
	([name])
VALUES
	(N'Student'),
	(N'Secretar'),
	(N'Admin')

-- https://www.ubbcluj.ro/ro/facultati
INSERT INTO [faculty]
	([name])
VALUES
	(N'Facultatea de Matematică şi Informatică'),
	(N'Facultatea de Fizică'),
	(N'Facultatea de Chimie şi Inginerie Chimică'),
	(N'Facultatea de Biologie şi Geologie'),
	(N'Facultatea de Geografie'),
	(N'Facultatea de Ştiinţa şi Ingineria Mediului'),
	(N'Facultatea de Drept'),
	(N'Facultatea de Litere'),
	(N'Facultatea de Istorie şi Filosofie'),
	(N'Facultatea de Sociologie şi Asistenţă Socială'),
	(N'Facultatea de Psihologie şi Ştiinţe ale Educaţiei'),
	(N'Facultatea de Ştiinţe Economice şi Gestiunea Afacerilor'),
	(N'Facultatea de Studii Europene'),
	(N'Facultatea de Business'),
	(N'Facultatea de Ştiinţe Politice, Administrative şi ale Comunicării'),
	(N'Facultatea de Educaţie Fizică şi Sport'),
	(N'Facultatea de Teologie Ortodoxă'),
	(N'Facultatea de Teologie Greco-Catolică'),
	(N'Facultatea de Teologie Reformată și Muzică'),
	(N'Facultatea de Teologie Romano-Catolică'),
	(N'Facultatea de Teatru şi FILM'),
	(N'Facultatea de Inginerie'),
	(N'School of Health')

INSERT INTO [status]
	([name])
VALUES
	(N'În curs de verificare'),	-- New dorm application
	(N'În așteptare'),			-- Application is missing information
	(N'Validat'),				-- Application approved
	(N'Repartizat'),			-- Dorm assigned to student
	(N'Cămin acceptat'),		-- Dorm accepted by student
	(N'Respins'),				-- Application denied by secretary
	(N'Cămin refuzat')			-- Dorm declied by student

-- -------------------------

INSERT INTO [dorm]
	([name], [location])
VALUES
	(N'Căminul A1-A2', 'Str. B.P. Haşdeu nr. 90-92, Jud. Cluj'),
	(N'Căminul A3-A4', 'Str. B.P. Haşdeu nr. 90-92, Jud. Cluj'),
	(N'Căminul 1', 'Str. B.P. Haşdeu nr. 45, Jud. Cluj'),
	(N'Căminul 2', 'Str. B.P. Haşdeu nr. 45, Jud. Cluj'),
	(N'Căminul 3', 'Str. B.P. Haşdeu nr. 45, Jud. Cluj'),
	(N'Căminul 4', 'Str. B.P. Haşdeu nr. 45, Jud. Cluj'),
	(N'Căminul 5', 'Str. B.P. Haşdeu nr. 45, Jud. Cluj'),
	(N'Căminul 6', 'Str. B.P. Haşdeu nr. 45, Jud. Cluj'),
	(N'Căminul 14', 'Str. B.P. Haşdeu nr. 45, Jud. Cluj'),
	(N'Căminul 16', 'Str. B.P. Haşdeu nr. 90-92, Jud. Cluj'),
	(N'Căminul 17', 'Str. B.P. Haşdeu nr. 90-92, Jud. Cluj'),
	(N'Cămin Economica I', 'Str. Teodor Mihali nr. 58, Jud. Cluj'),
	(N'Cămin Economica II', 'Str. Teodor Mihali nr. 59, Jud. Cluj'),
	(N'Căminul "Sport XXI"', 'Str. Pandurilor nr. 7, Jud. Cluj'),
	(N'Cămin Teologic I', 'Str. Bisericii Sf. Toma nr. 2, Jud. Cluj'),
	(N'Complexul de cazare al Universităţii "Babeş-Bolyai"', 'Str. Pandurilor nr. 7, Jud. Cluj'),
	(N'Extensia Universitară Bistriţa', 'Str. Andrei Mureşanu nr. 3-5, Jud. Bistriţa Năsăud'),
	(N'Extensia Universitară Sighetu Marmaţiei', 'Str. Avram Iancu nr. 6, Jud. Maramureş')
