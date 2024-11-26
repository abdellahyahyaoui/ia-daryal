import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Video.css';
import videoSrc from './0001-0150.mkv';

const VideoBackground = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      // Animación para el video (un pequeño zoom al inicio)
      gsap.fromTo(
        videoRef.current,
        { scale: 1 },
        { scale: 1, duration: 3, ease: 'power2.out' }
      );

      // Asegurarse de que el video se detenga en el último fotograma
      videoRef.current.addEventListener('ended', () => {
        videoRef.current.currentTime = videoRef.current.duration;
      });
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

