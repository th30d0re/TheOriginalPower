// Plays a Manim-rendered MP4 (served from public/animations). Autoplays while
// scrolled into view and pauses when scrolled away, so multiple scenes on a
// long chapter page don't all fight for audio/CPU at once.
import { useEffect, useRef } from 'react';
import './visuals.css';

interface ManimPlayerProps {
  src: string;
  caption?: string;
}

const ManimPlayer = ({ src, caption }: ManimPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void video.play().catch(() => {
              // Autoplay can be rejected by the browser; controls remain available.
            });
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className="visual-figure manim-figure">
      <video
        ref={videoRef}
        className="manim-video"
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        controls
      />
      {caption ? <figcaption className="visual-caption">{caption}</figcaption> : null}
    </figure>
  );
};

export default ManimPlayer;
