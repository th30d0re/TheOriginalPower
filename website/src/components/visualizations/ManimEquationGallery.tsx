import PhasorResonance from './PhasorResonance';
import './ManimEquationGallery.css';

interface AnimationItem {
  file: string;
  title: string;
  caption: string;
}

const ANIMATIONS: AnimationItem[] = [
  {
    file: '/animations/UnifiedLorentzForce.mp4',
    title: 'Unified Lorentz Force',
    caption:
      'The total force on a buffer-class worker: material wage E does real work, while the superposed cultural B fields only deflect through q(v × ΣρₖBₖ).',
  },
  {
    file: '/animations/ComplexWage.mp4',
    title: 'Complex Wage',
    caption:
      'W = ψₘ + jψₛ maps the material wage onto the real axis and the status wage onto the imaginary axis. Past θ = 90° the material term reverses.',
  },
  {
    file: '/animations/MaxwellEquations.mp4',
    title: 'Maxwell Equations',
    caption:
      'The extraction field obeys the same divergence/curl structure as classical electromagnetism, with E⊥B propagation and ∇·E = ρ_suppression.',
  },
  {
    file: '/animations/PhaseKick.mp4',
    title: 'Phase Kick',
    caption:
      'A sudden phase rotation in the complex wage transfers energy from the material arm to the status arm, modeling a policy shock or rhetorical pivot.',
  },
  {
    file: '/animations/DrivenHarmonicOscillator.mp4',
    title: 'Driven Harmonic Oscillator',
    caption:
      'The buffer class behaves like a damped oscillator driven at resonance by periodic status pulses, storing kinetic energy while losing net displacement.',
  },
  {
    file: '/animations/InterferenceIntensity.mp4',
    title: 'Interference Intensity',
    caption:
      'Superposed cultural axes create constructive and destructive interference zones; intensity scales with the squared magnitude of the suppression field.',
  },
  {
    file: '/animations/SnellsLaw.mp4',
    title: "Snell's Law",
    caption:
      'A status narrative refracts across the boundary between two material regimes, bending the path of political energy toward the elite normal.',
  },
];

export default function ManimEquationGallery() {
  return (
    <div className="meg-root">
      <header className="meg-header">
        <h1>Manim Equation Gallery</h1>
        <p>Rendered UEF animations from Manim, served as static video assets.</p>
      </header>

      <section className="meg-grid">
        {ANIMATIONS.map((anim) => (
          <article key={anim.file} className="meg-card">
            <div className="meg-video-wrap">
              <video
                src={anim.file}
                title={anim.title}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="meg-video"
              />
            </div>
            <div className="meg-card-body">
              <h2>{anim.title}</h2>
              <p>{anim.caption}</p>
            </div>
          </article>
        ))}
      </section>

      <PhasorResonance />
    </div>
  );
}
