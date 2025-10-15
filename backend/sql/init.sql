CREATE TABLE Usuario(
    Id_Usuario SERIAL PRIMARY KEY,
    Usuario VARCHAR(50) NOT NULL,
    Nombre VARCHAR(70) NOT NULL,
    Contrasena VARCHAR(200) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    emergency_email VARCHAR(150),
    phone VARCHAR(20),
    address TEXT,
    Foto VARCHAR(150)
);

CREATE TABLE Mood (
    Id_Mood SERIAL PRIMARY KEY,
    User_Id INT REFERENCES Usuario(Id_Usuario) ON DELETE CASCADE,
    Fecha DATE DEFAULT CURRENT_DATE,
    Puntuacion INT CHECK (Puntuacion BETWEEN 1 AND 10),
    Nota TEXT
);
