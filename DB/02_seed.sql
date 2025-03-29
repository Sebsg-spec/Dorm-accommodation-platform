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
	(N'Cămin refuzat');			-- Dorm declied by student

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

-- Test users with password 'a'
INSERT INTO [user]
	([email], [password], [role])
VALUES
	('student', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 1),
	('secretar', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 2),
	('admin', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 3);

INSERT INTO [profile]
	([id], [pin], [sex], [first_name], [last_name], [faculty])
VALUES
	(1, '1234567890123', 'F', N'First', N'Last', 1),
	(2, '1234567890123', 'M', N'First', N'Last', 2),
	(3, '1234567890123', 'O', N'First', N'Last', 3);

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
