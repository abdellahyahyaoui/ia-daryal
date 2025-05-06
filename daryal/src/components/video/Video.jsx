import React, { useEffect, useRef } from 'react';
import './Video.scss';
import videoSrc from './0001-0150.mkv'; // Cambia la ruta según corresponda

const VideoBackground = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      // Detener el video en el último fotograma
      const handleVideoEnd = () => {
        video.pause(); // Pausa el video
        video.currentTime = video.duration; // Detiene en el último fotograma
      };

      video.addEventListener('ended', handleVideoEnd);

      return () => {
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, []);

  return (
    <div className="video-background-container">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="video-background"
      >
        <source src={videoSrc} type="video/mp4" />
        Tu navegador no soporta la etiqueta de video.
      </video>
    </div>
  );
};

export default VideoBackground;
