import './AnimatedBackground.css';

export default function AnimatedBackground() {
  return (
    <div className="abg" aria-hidden="true">
      {/* Layer 1: Deep navy base */}
      <div className="abg-base" />

      {/* Layer 2: Soft ambient gradients */}
      <div className="abg-ambient abg-ambient--blue" />
      <div className="abg-ambient abg-ambient--purple" />

      {/* Layer 3: Subtle grid overlay (fixed) */}
      <div className="abg-grid" />

      {/* Layer 4: Ambient particles */}
      <div className="abg-particle abg-p1" />
      <div className="abg-particle abg-p2" />
      <div className="abg-particle abg-p3" />
      <div className="abg-particle abg-p4" />
      <div className="abg-particle abg-p5" />
      <div className="abg-particle abg-p6" />
      <div className="abg-particle abg-p7" />
      <div className="abg-particle abg-p8" />

      {/* Layer 5: Soft vignette */}
      <div className="abg-vignette" />

      {/* Layer 6: Subtle noise texture */}
      <div className="abg-noise" />
    </div>
  );
}
