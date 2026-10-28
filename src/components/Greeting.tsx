import React from "react";
import { greetingStyles } from "../lib/tailwind";

export const Greeting = () => (
  <div className={greetingStyles.wrapper}>
    <h1 className={greetingStyles.heading}>Welcome to Suburban Gardener</h1>
    <p className={greetingStyles.text}>Begin your backyard gardening journey today!</p>
  </div>
);

export default Greeting;
