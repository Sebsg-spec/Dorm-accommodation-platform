USE [inno]
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
)

CREATE TABLE [faculty] (
    [id] INT PRIMARY KEY IDENTITY,
	[name] NVARCHAR(255) NOT NULL
)

CREATE TABLE [status] (
    [id] INT PRIMARY KEY IDENTITY,
	[name] NVARCHAR(255) NOT NULL
)

-- -------------------------

CREATE TABLE [user] (
    [id] INT PRIMARY KEY IDENTITY,

	[email] NVARCHAR(255) NOT NULL,
	[password] NVARCHAR(255) NOT NULL,

	[role] INT NOT NULL FOREIGN KEY REFERENCES [role]([id])
)

CREATE TABLE [profile] (
	[id] INT PRIMARY KEY FOREIGN KEY REFERENCES [user]([id]),
	[pin] NCHAR(13),
	[sex] NCHAR(1) CHECK(sex IN('M', 'F', 'O')),
	
	[first_name] NVARCHAR(255),
	[last_name] NVARCHAR(255),
	[faculty] INT FOREIGN KEY REFERENCES [faculty]([id])
)

CREATE TABLE [dorm] (
    [id] INT PRIMARY KEY IDENTITY,
	[name] NVARCHAR(255) NOT NULL,
	[location] NVARCHAR(255) NOT NULL
)

CREATE TABLE [room] (
    [id] INT PRIMARY KEY IDENTITY,
	[dorm] INT NOT NULL FOREIGN KEY REFERENCES [dorm]([id]),

	[number] NCHAR(3) NOT NULL,
	[capacity] INT NOT NULL,
	[size] FLOAT(24) NOT NULL
)

CREATE TABLE [application] (
    [id] INT PRIMARY KEY IDENTITY,
	[user] INT NOT NULL FOREIGN KEY REFERENCES [user]([id]),
	[faculty] INT NOT NULL FOREIGN KEY REFERENCES [faculty]([id]),

	[uuid] NCHAR(36) NOT NULL,
	[year] INT NOT NULL,

	[last_update] DATETIME2(7),
	[status] INT NOT NULL FOREIGN KEY REFERENCES [status]([id])
)

-- -------------------------

CREATE TABLE [dorm_preference] (
	[application] INT NOT NULL FOREIGN KEY REFERENCES [application]([id]),
	[dorm] INT NOT NULL FOREIGN KEY REFERENCES [dorm]([id]),
	CONSTRAINT [PK_dorm_preference] PRIMARY KEY([application], [dorm]),

	[preference] INT NOT NULL
)
