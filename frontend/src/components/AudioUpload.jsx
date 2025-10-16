// src/components/AudioUpload.jsx (actualizado)
import React, { useState, useRef } from 'react';
import { MicrophoneIcon, ArrowUpTrayIcon, StopIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

const AudioUpload = ({ user, onUploadSuccess }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const playbackUrlRef = useRef(null); // Para manejar la URL del blob

  const handleAudioChange = (e) => {
    setAudioFile(e.target.files[0]);
    setRecordedBlob(null); // Reset grabación si sube archivo
    setIsPlaying(false);
  };

  const startRecording = async () => {
    setUploadStatus(null);
    setRecordedBlob(null);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        // Crear y setear URL para preview
        if (playbackUrlRef.current) {
          URL.revokeObjectURL(playbackUrlRef.current);
        }
        const url = URL.createObjectURL(blob);
        playbackUrlRef.current = url;
        if (audioRef.current) {
          audioRef.current.src = url;
        }
        stream.getTracks().forEach(track => track.stop()); // Detener mic
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setUploadStatus('Grabando... Habla con calma sobre tu día.');
    } catch (error) {
      setUploadStatus('Error al acceder al micrófono. Verifica permisos.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      // No setear isPlaying aquí; usar eventos
    }
  };

  // Manejar eventos de audio para sincronizar estado
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => setIsPlaying(false);

  const handleAudioUpload = async (e) => {
    e.preventDefault();
    let fileToUpload = audioFile || recordedBlob;
    if (!fileToUpload) {
      setUploadStatus('Por favor, sube un archivo o graba un audio.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Subiendo y analizando... Esto puede tomar un momento.');

    try {
      // Convertir a base64
      const reader = new FileReader();
      reader.readAsDataURL(fileToUpload);
      reader.onloadend = async () => {
        const audioBase64 = reader.result.split(',')[1];

        // Llamar a Lambda (reemplaza con tu URL real)
        const lambdaResponse = await fetch('https://xwe6937cvk.execute-api.us-east-2.amazonaws.com/default/subirAudio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: user.username,
            audio_base64: audioBase64,
          }),
        });

        if (!lambdaResponse.ok) {
          throw new Error('Fallo al procesar el audio en el servicio de IA.');
        }

        const { url } = await lambdaResponse.json();

        // Guardar en DB
        const token = localStorage.getItem('token');
        const dbResponse = await fetch('http://localhost:4000/api/files/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ fileKey: url }),
        });

        if (!dbResponse.ok) {
          throw new Error('Fallo al guardar en la base de datos.');
        }

        setUploadStatus('¡Audio subido con éxito! El análisis de emociones estará disponible pronto.');
        setAudioFile(null);
        setRecordedBlob(null);
        if (playbackUrlRef.current) {
          URL.revokeObjectURL(playbackUrlRef.current);
          playbackUrlRef.current = null;
        }
        if (audioRef.current) {
          audioRef.current.src = '';
        }
        if (onUploadSuccess) onUploadSuccess();
      };
    } catch (error) {
      setUploadStatus(`Error: ${error.message}. Intenta de nuevo.`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <MicrophoneIcon className="h-8 w-8 text-green-500 mr-2" />
        <h3 className="text-xl font-semibold text-gray-700">Subir o Grabar Audio Diario</h3>
      </div>
      <p className="text-gray-500 mb-4 text-sm">
        Comparte tus reflexiones grabando directamente o subiendo un archivo. Nuestro IA de AWS analizará el tono emocional para insights personalizados y recomendaciones serenas.
      </p>

      {/* Opciones de grabación/subida */}
      <div className="space-y-6">
        {/* Grabación */}
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-700 mb-2">Grabar Audio</h4>
          <div className="flex space-x-4 items-center">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={isUploading}
                className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition flex items-center"
              >
                <MicrophoneIcon className="h-5 w-5 mr-2" /> Iniciar Grabación
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition flex items-center"
              >
                <StopIcon className="h-5 w-5 mr-2" /> Detener
              </button>
            )}
          </div>
          {recordedBlob && (
            <div className="mt-4">
              {/* Audio element oculto para control */}
              <audio 
                ref={audioRef} 
                src={playbackUrlRef.current} 
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                className="hidden"
              />
              <button
                onClick={togglePlayback}
                className="mt-2 text-green-600 hover:text-green-700 flex items-center"
              >
                {isPlaying ? <PauseIcon className="h-5 w-5 mr-1" /> : <PlayIcon className="h-5 w-5 mr-1" />} {isPlaying ? 'Pausar' : 'Reproducir'} Preview
              </button>
            </div>
          )}
        </div>

        {/* Subida de archivo */}
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-700 mb-2">O Subir Archivo</h4>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioChange}
            className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>
      </div>

      <form onSubmit={handleAudioUpload} className="mt-6">
        <button
          type="submit"
          disabled={isUploading || (!audioFile && !recordedBlob)}
          className={`w-full bg-gradient-to-r from-green-400 to-green-500 text-white py-3 rounded-lg hover:from-green-500 hover:to-green-600 transition duration-300 shadow-md font-medium flex items-center justify-center ${isUploading || (!audioFile && !recordedBlob) ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isUploading ? 'Procesando...' : <>Subir Audio <ArrowUpTrayIcon className="ml-2 h-5 w-5" /></>}
        </button>
      </form>

      {uploadStatus && <p className={`mt-4 text-center ${uploadStatus.includes('éxito') ? 'text-green-600' : uploadStatus.includes('Error') ? 'text-red-600' : 'text-gray-600'}`}>{uploadStatus}</p>}
      
      {/* Tips para calma */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium text-green-700 mb-1">Consejo Sereno: </p>
        <p>Respira profundo antes de grabar. El análisis detectará emociones como calma o ansiedad, ayudándote a equilibrar tu mente.</p>
      </div>
    </div>
  );
};

export default AudioUpload;