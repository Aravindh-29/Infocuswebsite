const logos = [
  ["par-or (4).webp", "Oracle"],
  ["ltm-logo.webp", "LTM"],
  ["par-or (1).webp", "Charter Communications"],
  ["par-or (3).webp", "Verizon"],
  ["par-or (2).webp", "MindPec Solutions"],
  ["pure-storage.png", "Pure Storage"],
  ["ltimindtree.png", "LTIMindtree"],
  ["spectrum.svg", "Spectrum"],
];
export function OriginalLogoStrip() {
  return (
    <section className="original-network container section">
      <span className="eyebrow">A CONNECTED TECHNOLOGY COMMUNITY</span>
      <h2>
        Experience built
        <br />
        through connection.
      </h2>
      <div className="original-logo-grid">
        {logos.map(([file, name]) => (
          <div key={file}>
            <img src={"/images/" + file} alt={name} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}
export function OriginalPhotoStory() {
  return (
    <section className="container section original-photo-story">
      <div>
        <img
          src="/images/greater.webp"
          alt="A team collaborating on a business technology challenge"
          loading="lazy"
        />
        <h3>Better thinking, together.</h3>
        <p>Bring different perspectives to the same ambition.</p>
      </div>
      <div>
        <img
          src="/images/build.webp"
          alt="A parent helping a child take the next step"
          loading="lazy"
        />
        <h3>Progress with purpose.</h3>
        <p>Build a future that creates opportunities for people.</p>
      </div>
      <div>
        <img
          src="/images/our-promise.webp"
          alt="A city street illuminated by the evening sun"
          loading="lazy"
        />
        <h3>A wider perspective.</h3>
        <p>Connect local understanding with global possibilities.</p>
      </div>
    </section>
  );
}
