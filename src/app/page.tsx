import Contact from "./components/contact";
import WhatIsDoDaily from "./components/doDaily";
import ExerciseSheets from "./components/exercisesheets";
import Goal from "./components/goal";
import Hero from "./components/hero";
import HowItWorks from "./components/howItWorks";
import Mission from "./components/mission";
import Pillars from "./components/pillars";
import StartExercise from "./components/startExcercise";
   import Register from "./components/register";


export default function Home() {
   return (
    <>
      <Hero />
      <Mission />
      <Pillars />
      <WhatIsDoDaily />
      <ExerciseSheets />
      <Register />     
     
      {/* <HowItWorks/> */}
      {/* <StartExercise/> */}
      {/* <Goal/> */}
      <Contact/>
    </>
  );
}