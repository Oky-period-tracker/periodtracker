import * as React from "react";

import { EmojiQuestionCard } from "./EmojiQuestionCard";
import { QuizCard } from "./QuizCard";
import { DidYouKnowCard } from "./DidYouKnowCard";
import { NotesCard } from "./NotesCard";
import { Swiper } from "../../../../components/Swiper";

export const DayTracker = () => {
  const [index, setIndex] = React.useState(0);

  const isOnPeriod = false;
  const dateIsEven = true;
  // const dateIsEven = Date.getDay() % 2 === 0 // TODO:
  const ContentCard = dateIsEven ? QuizCard : DidYouKnowCard;

  const components = [
    <EmojiQuestionCard topic={"mood"} />,
    <EmojiQuestionCard topic={"body"} />,
    <EmojiQuestionCard topic={"activity"} />,
    <EmojiQuestionCard topic={"flow"} />,
    <NotesCard />,
  ];

  // Insert Quiz | DidYouKnow at Start or End
  const contentIndex = isOnPeriod ? components.length - 1 : 0;
  components.splice(contentIndex, 0, <ContentCard />);

  // Add key prop
  const pages = components.map((page, i) =>
    React.cloneElement(page, { key: `day-card-${i}` })
  );

  return <Swiper index={index} setIndex={setIndex} pages={pages} />;
};
