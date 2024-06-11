import { Swiper } from "../../../../components/Swiper";
import { JourneyProvider, journeySteps, useJourney } from "./JourneyContext";
import { JourneyCard } from "./components/JourneyCard";
import { JourneyReview } from "./components/JourneyReview";

export const Journey = () => {
  return (
    <JourneyProvider>
      <JourneyInner />
    </JourneyProvider>
  );
};

const JourneyInner = () => {
  const { state, dispatch } = useJourney();
  const setIndex = (value: number) => dispatch({ type: "stepIndex", value });

  const pages = [
    ...journeySteps.map((step) => <JourneyCard step={step} />),
    <JourneyReview />,
  ];

  return <Swiper index={state.stepIndex} setIndex={setIndex} pages={pages} />;
};
