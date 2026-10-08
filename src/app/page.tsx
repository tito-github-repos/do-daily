import Contact from "./components/contact";
import WhatIsDoDaily from "./components/doDaily";
import Goal from "./components/goal";
import Hero from "./components/hero";
import HowItWorks from "./components/howItWorks";
import Mission from "./components/mission";
import StartExercise from "./components/startExcercise";



export default function Home() {
   return (
    <>
      <Hero />
      <Mission />
      <WhatIsDoDaily/>
      <HowItWorks/>
      <StartExercise/>
      <Goal/>
      <Contact/>
    </>
  );
}