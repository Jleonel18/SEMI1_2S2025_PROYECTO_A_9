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

CREATE TABLE files (
    Id_File SERIAL PRIMARY KEY,
    User_Id INTEGER NOT NULL REFERENCES Usuario(Id_Usuario) ON DELETE CASCADE,
    file_key VARCHAR(255) NOT NULL,  -- Key en S3 (ej. 'users/1/audio123.mp3')
    file_type VARCHAR(50) CHECK (file_type IN ('text', 'pdf', 'audio', 'video')),  -- Tipo de archivo
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE analyses (
    id_analyses SERIAL PRIMARY KEY,
    file_id INTEGER NOT NULL REFERENCES files(Id_File) ON DELETE CASCADE,  -- FK a file subido
    User_Id INTEGER NOT NULL REFERENCES Usuario(Id_Usuario) ON DELETE CASCADE,
    statusAnalysis TEXT ,
    sentiment_result JSONB,  -- Resultado de Comprehend (ej. {"Sentiment": "NEGATIVE", "Scores": {...}})
    transcription TEXT,  -- Texto transcrito de Transcribe (para audios)
    recommendation TEXT,  -- Recomendación generada (ej. 'Prueba ejercicio de respiración')
    analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_key ON files (User_Id, file_key);
CREATE INDEX idx_file_date ON analyses (file_id, analysis_date);
