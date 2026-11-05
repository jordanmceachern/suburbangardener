import React from "react";
import { greetingStyles } from "../lib/tailwind";

// Renders the Greeting UI.
export const Greeting = () => (
  <div className={greetingStyles.wrapper}>
    <h1 className={greetingStyles.heading}>Welcome to Suburban Gardener</h1>
    <p className={greetingStyles.text}>
      Nourish your garden with mother nature&apos;s provided dew and rain using
      our sustainable energy fueled systems.
    </p>
  </div>
);

export default Greeting;
