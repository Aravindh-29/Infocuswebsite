import { Button } from "@/components/Interface";
export default function NotFound() {
  return (
    <main id="main" className="container section not-found">
      <span className="eyebrow">404 / A NEW DIRECTION</span>
      <h1>
        Let’s get you
        <br />
        back in focus.
      </h1>
      <p>This page could not be found.</p>
      <Button href="/">Return home</Button>
    </main>
  );
}
