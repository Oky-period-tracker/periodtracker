import { Swiper } from "../../../../components/Swiper";
import { JourneyProvider, JourneyStep, useJourney } from "./JourneyContext";
import { AskFirst } from "./components/AskFirst";
import { AskLast } from "./components/AskLast";
import { AskDays } from "./components/AskDays";
import { AskWeeks } from "./components/AskWeeks";
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

  const pages = Object.values(stepComponents).map((StepComponent) => (
    <StepComponent />
  ));

  return <Swiper index={state.stepIndex} setIndex={setIndex} pages={pages} />;
};

const stepComponents: Record<JourneyStep, React.FC> = {
  first_period: AskFirst,
  when_last_period: AskLast,
  number_days: AskDays,
  number_weeks_between: AskWeeks,
  review: JourneyReview,
};
