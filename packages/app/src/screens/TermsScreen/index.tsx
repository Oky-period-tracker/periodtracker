import * as React from "react";
import { ScrollView } from "react-native";
import { InfoDisplay } from "../../components/InfoDisplay";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { useSelector } from "../../redux/useSelector";
import { termsAndConditionsContent } from "../../redux/selectors";

const TermsScreen: ScreenComponent<"Terms"> = () => {
  const content = useSelector(termsAndConditionsContent);

  return (
    <ScrollView>
      <InfoDisplay content={content} />
    </ScrollView>
  );
};

export default TermsScreen;
