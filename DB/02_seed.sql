USE [inno];
GO

-- -------------------------

INSERT INTO [role]
	([name])
VALUES
	(N'Student'),
	(N'Secretar'),
	(N'Admin');

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
	(N'School of Health');

INSERT INTO [status]
	([name])
VALUES
	(N'În curs de verificare'),	-- New dorm application
	(N'În așteptare'),			-- Application is missing information
	(N'Validat'),				-- Application approved
	(N'Repartizat'),			-- Dorm assigned to student
	(N'Cămin acceptat'),		-- Dorm accepted by student
	(N'Respins'),				-- Application denied by secretary
	(N'Cămin refuzat');			-- Dorm refused by student

INSERT INTO [dorm_group]
	([name])
VALUES
	(N'Complexul Studenţesc "Haşdeu"'),
	(N'Complex "Economica"'),
	(N'Căminul "Sport XXI"'),
	(N'Cămin "Teologic I"'),
	(N'Complexul de cazare al Universităţii "Babeş-Bolyai"'),
	(N'Căminele studenţeşti de la Extensiile Universitare');

-- -------------------------

-- Test users with password 'test'
INSERT INTO [user]
	([email], [password], [role])
VALUES
	('admin@test.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 3),
	('secretar@test.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 2),
	('student@test.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 1),
	('student1@test.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 1),
	('student2@test.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 1),
	('student3@test.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 1),
	('student4@test.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 1),
	('student5@test.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 1),
	('student6@test.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 1),
	('student7@test.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 1),
	('student8@test.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 1),
	('secretar2@test.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 2);

INSERT INTO [profile]
	([id], [pin], [sex], [first_name], [last_name], [faculty], [year_of_study])
VALUES
	(1, '1234567890123', 'O', N'Admin', N'Test', NULL, NULL),
	(2, '1234567890123', 'F', N'Secretar', N'FMI Test', 2, NULL),
	(3, '1234567890123', 'M', N'Student', N'FMI Test', 1, 1),
	(4, '1234567890123', 'F', N'Student', N'FMI În curs de verificare', 1, 2),
	(5, '1234567890123', 'F', N'Student', N'FMI În așteptare', 1, 3),
	(6, '1234567890123', 'F', N'Student', N'FMI Validat', 1, 1),
	(7, '1234567890123', 'M', N'Student', N'FMI Repartizat', 1, 2),
	(8, '1234567890123', 'M', N'Student', N'FMI Cămin acceptat', 1, 3),
	(9, '1234567890123', 'M', N'Student', N'FMI Respins', 1, 1),
	(10, '1234567890123', 'O', N'Student', N'Fizică Cămin refuzat', 2, 2),
	(11, '1234567890123', 'F', N'Student', N'Fizică Test', 2, 3),
	(12, '1234567890123', 'M', N'Secretar', N'Fizică Test', 2, NULL);

-- -------------------------

INSERT INTO [dorm]
	([dorm_group], [name], [location])
VALUES
	(1, N'Căminul A1-A2', N'Str. B.P. Haşdeu nr. 90-92, Jud. Cluj'),
	(1, N'Căminul A3-A4', N'Str. B.P. Haşdeu nr. 90-92, Jud. Cluj'),
	(1, N'Căminul 1', N'Str. B.P. Haşdeu nr. 45, Jud. Cluj'),
	(1, N'Căminul 2', N'Str. B.P. Haşdeu nr. 45, Jud. Cluj'),
	(1, N'Căminul 3', N'Str. B.P. Haşdeu nr. 45, Jud. Cluj'),
	(1, N'Căminul 4', N'Str. B.P. Haşdeu nr. 45, Jud. Cluj'),
	(1, N'Căminul 5', N'Str. B.P. Haşdeu nr. 45, Jud. Cluj'),
	(1, N'Căminul 6', N'Str. B.P. Haşdeu nr. 45, Jud. Cluj'),
	(1, N'Căminul 14', N'Str. B.P. Haşdeu nr. 45, Jud. Cluj'),
	(1, N'Căminul 16', N'Str. B.P. Haşdeu nr. 90-92, Jud. Cluj'),
	(1, N'Căminul 17', N'Str. B.P. Haşdeu nr. 90-92, Jud. Cluj'),
	(2, N'Cămin Economica I', N'Str. Teodor Mihali nr. 58, Jud. Cluj'),
	(2, N'Cămin Economica II', N'Str. Teodor Mihali nr. 59, Jud. Cluj'),
	(3, N'Căminul "Sport XXI"', N'Str. Pandurilor nr. 7, Jud. Cluj'),
	(4, N'Cămin Teologic I', N'Str. Bisericii Sf. Toma nr. 2, Jud. Cluj'),
	(5, N'Complexul de cazare al Universităţii "Babeş-Bolyai"', N'Str. Pandurilor nr. 7, Jud. Cluj'),
	(6, N'Extensia Universitară Bistriţa', N'Str. Andrei Mureşanu nr. 3-5, Jud. Bistriţa Năsăud'),
	(6, N'Extensia Universitară Sighetu Marmaţiei', N'Str. Avram Iancu nr. 6, Jud. Maramureş');

-- -------------------------

DECLARE @dormId INT;
DECLARE @groupName NVARCHAR(255);

DECLARE @floors INT;
DECLARE @roomsPerFloor INT;
DECLARE @capacity INT;
DECLARE @size FLOAT;

DECLARE dorm_cursor CURSOR FOR
    SELECT d.[id], dg.[name]
    FROM [dorm] d
    INNER JOIN [dorm_group] dg ON d.[dorm_group] = dg.[id];

OPEN dorm_cursor;
FETCH NEXT FROM dorm_cursor INTO @dormId, @groupName;

WHILE @@FETCH_STATUS = 0
BEGIN
	IF @groupName = N'Complexul Studenţesc "Haşdeu"'
    BEGIN
        SET @floors = 4;
        SET @roomsPerFloor = 25;
        SET @capacity = 5;
        SET @size = 21.5;
    END
	ELSE IF @groupName = N'Complex "Economica"'
    BEGIN
        SET @floors = 4;
        SET @roomsPerFloor = 25;
        SET @capacity = 3;
        SET @size = 18.5;
    END
    ELSE IF @groupName = N'Căminul "Sport XXI"'
    BEGIN
        SET @floors = 4;
        SET @roomsPerFloor = 25;
        SET @capacity = 3;
        SET @size = 18.5;
    END
    ELSE IF @groupName = N'Cămin "Teologic I"'
    BEGIN
        SET @floors = 4;
        SET @roomsPerFloor = 25;
        SET @capacity = 4;
        SET @size = 20.0;
    END
    ELSE IF @groupName = N'Complexul de cazare al Universităţii "Babeş-Bolyai"'
    BEGIN
        SET @floors = 4;
        SET @roomsPerFloor = 25;
        SET @capacity = 3;
        SET @size = 18.5;
    END
    ELSE IF @groupName = N'Căminele studenţeşti de la Extensiile Universitare'
    BEGIN
        SET @floors = 4;
        SET @roomsPerFloor = 25;
        SET @capacity = 4;
        SET @size = 20.0;
    END
	ELSE
	BEGIN
	    DECLARE @errorMessage NVARCHAR(511);
		SET @errorMessage = 
			'Unknown dorm group: ' + @groupName + ' (Dorm ID: ' + CAST(@dormId AS NVARCHAR) + ')';
    
		THROW 51000, @errorMessage, 1;
	END

    -- Room generation
    DECLARE @floor INT = 1;
    WHILE @floor <= @floors
    BEGIN
        DECLARE @roomNum INT = 1;
        WHILE @roomNum <= @roomsPerFloor
        BEGIN
            DECLARE @number CHAR(3);
            SET @number = CAST(@floor AS CHAR(1)) + 
				RIGHT('00' + CAST(@roomNum AS VARCHAR), 2);

            INSERT INTO [room] ([dorm], [number], [capacity], [size])
            VALUES (@dormId, @number, @capacity, @size);

            SET @roomNum += 1;
        END

        SET @floor += 1;
    END

    FETCH NEXT FROM dorm_cursor INTO @dormId, @groupName;
END

CLOSE dorm_cursor;
DEALLOCATE dorm_cursor;

-- -------------------------

INSERT INTO [application]
	([application_name], [user], [faculty], [uuid], [year], [last_update], [status], [comment], [assigned_dorm])
VALUES
	('SF1240924', 4, 1, '0b228048-05b1-4392-af25-87379858596e', 2025, '2024-09-24 09:12:34', 1, NULL, NULL),
	('SF2240917', 5, 1, '334be039-e905-4246-a35f-43ffa6a4bd06', 2025, '2024-09-17 09:12:34', 2, N'Lipsă adeverință de venit', NULL),
	('SF3240924', 6, 1, '494412be-d931-4cfc-84fb-417305edd492', 2025, '2024-09-24 09:12:34', 3, NULL, NULL),
	('SF4240924', 7, 1, '0ebdfbbe-0128-4f3f-af5b-8daa8e5b2075', 2025, '2024-09-24 09:12:34', 4, NULL, 6),	-- assigned to first preference
	('SF1240924', 8, 1, 'a82f6f9c-a025-4abc-9242-8e0393e5f4d6', 2025, '2025-09-24 09:12:34', 5, NULL, 9),	-- accepted second preference
	('SF1240924', 8, 1, 'a82f6f9c-a025-4abc-9242-8e0393e5f4d6', 2023, '2023-09-24 09:12:34', 5, NULL, 9),	-- accepted second preference
	('FMI-SFCA25-E9R1', 8, 1, 'a82f6f9c-a025-4abc-9242-8e0393e5f4d6', 2022, '2022-09-24 09:32:34', 5, NULL, 9),	-- accepted second preference
	('SF2240324', 9, 1, '8139b3c5-37de-4b56-9ae5-d4e8a0ffdf05', 2025, '2024-03-24 09:12:34', 6, N'Media este mai mică decât ultima medie admisă', NULL),
	('SF3240324', 10, 2, 'f546666d-7bee-48d3-b9fe-3fcd41268059', 2025, '2024-03-24 09:12:34', 7, NULL, 8);	-- refused last preference

INSERT INTO [dorm_preference]
	([application], [dorm], [preference])
VALUES
	(1, 12, 1),
	(1, 13, 2),
	(1, 8, 3),
	(2, 1, 1),
	(2, 2, 2),
	(3, 3, 1),
	(3, 4, 2),
	(3, 5, 3),
	(4, 6, 1),
	(4, 7, 2),
	(5, 8, 1),
	(5, 9, 2),
	(5, 10, 3),
	(6, 8, 1),
	(6, 9, 2),
	(6, 10, 3),
	(7, 8, 1),
	(7, 9, 2),
	(7, 10, 3),
	(8, 11, 1),
	(8, 12, 2),
	(9, 13, 1),
	(9, 14, 2),
	(9, 8, 3);
