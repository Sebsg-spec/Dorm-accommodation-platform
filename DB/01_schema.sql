USE [inno];
GO

-- -------------------------

DECLARE @sql NVARCHAR(MAX) = N'';

-- Drop all foreign key constraints
SELECT @sql += 'ALTER TABLE ' + QUOTENAME(s.name) + '.' + QUOTENAME(t.name) + 
               ' DROP CONSTRAINT ' + QUOTENAME(f.name) + '; '
FROM sys.foreign_keys f
JOIN sys.tables t ON f.parent_object_id = t.object_id
JOIN sys.schemas s ON t.schema_id = s.schema_id;

-- Execute the constraint drops if any exist
IF @sql <> '' EXEC sp_executesql @sql;
SET @sql = N'';

-- Drop all tables
SELECT @sql += 'DROP TABLE ' + QUOTENAME(s.name) + '.' + QUOTENAME(t.name) + '; '
FROM sys.tables t
JOIN sys.schemas s ON t.schema_id = s.schema_id;

-- Execute the table drops if any exist
IF @sql <> '' EXEC sp_executesql @sql;

-- -------------------------

CREATE TABLE [role] (
    [id] INT PRIMARY KEY IDENTITY,
	[name] NVARCHAR(255) NOT NULL
);

CREATE TABLE [faculty] (
    [id] INT PRIMARY KEY IDENTITY,
	[name] NVARCHAR(255) NOT NULL
);

CREATE TABLE [status] (
    [id] INT PRIMARY KEY IDENTITY,
	[name] NVARCHAR(255) NOT NULL
);

CREATE TABLE [dorm_group] (
    [id] INT PRIMARY KEY IDENTITY,
	[name] NVARCHAR(255) NOT NULL
);

-- -------------------------

CREATE TABLE [user] (
    [id] INT PRIMARY KEY IDENTITY,

	[email] VARCHAR(255) NOT NULL,
	[password] VARCHAR(255) NOT NULL,

	[role] INT NOT NULL FOREIGN KEY REFERENCES [role]([id])
);

CREATE TABLE [profile] (
	[id] INT PRIMARY KEY FOREIGN KEY REFERENCES [user]([id]),
	[pin] CHAR(13) CHECK(LEN(LTRIM(RTRIM([pin]))) = 13),
	[sex] CHAR(1) CHECK([sex] IN('F', 'M', 'O')),
	
	[first_name] NVARCHAR(255),
	[last_name] NVARCHAR(255),
	[faculty] INT FOREIGN KEY REFERENCES [faculty]([id]),
	[year_of_study] INT CHECK([year_of_study] > 0 AND [year_of_study] < 4)
);

CREATE TABLE [dorm] (
    [id] INT PRIMARY KEY IDENTITY,
	[dorm_group] INT NOT NULL FOREIGN KEY REFERENCES [dorm_group]([id]),

	[name] NVARCHAR(255) NOT NULL,
	[location] NVARCHAR(255) NOT NULL
);

CREATE TABLE [room] (
    [id] INT PRIMARY KEY IDENTITY,
	[dorm] INT NOT NULL FOREIGN KEY REFERENCES [dorm]([id]),

	[number] CHAR(3) NOT NULL CHECK(LEN(LTRIM(RTRIM([number]))) = 3),
	[capacity] INT NOT NULL,
	[size] FLOAT(24) NOT NULL
);

CREATE TABLE [application] (
    [id] INT PRIMARY KEY IDENTITY,
	[application_name] NVARCHAR(255) NOT NULL,
	[user] INT NOT NULL FOREIGN KEY REFERENCES [user]([id]),
	[faculty] INT NOT NULL FOREIGN KEY REFERENCES [faculty]([id]),

	[uuid] CHAR(36) NOT NULL CHECK(LEN(LTRIM(RTRIM([uuid]))) = 36),
	[year] INT NOT NULL,

	[last_update] DATETIME2(7),
	[status] INT NOT NULL FOREIGN KEY REFERENCES [status]([id]),
	[comment] NVARCHAR(255),
	[assigned_dorm] INT FOREIGN KEY REFERENCES [dorm]([id])
);

-- -------------------------

CREATE TABLE [dorm_preference] (
	[application] INT NOT NULL FOREIGN KEY REFERENCES [application]([id]),
	[dorm] INT NOT NULL FOREIGN KEY REFERENCES [dorm]([id]),
	CONSTRAINT [PK_dorm_preference] PRIMARY KEY([application], [dorm]),

	[preference] INT NOT NULL
);
