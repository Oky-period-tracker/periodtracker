import * as React from "react";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { Screen } from "../../components/Screen";
import { Swiper } from "../../components/Swiper";
import { EmojiQuestionCard } from "./components/EmojiQuestionCard";
import { QuizCard } from "./components/QuizCard";
import { DidYouKnowCard } from "./components/DidYouKnowCard";
import { NotesCard } from "./components/NotesCard";

const DayScreen: ScreenComponent<"Day"> = () => {
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

  return (
    <Screen>
      <Swiper index={index} setIndex={setIndex} pages={pages} />
    </Screen>
  );
};

export default DayScreen;
