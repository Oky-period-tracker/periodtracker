import React from "react";
import { useSignUp } from "../SignUpContext";
import { Checkbox } from "../../../../../components/Checkbox";
import { A } from "../../../../../components/A";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../../../../../components/Text";
import { AuthCardBody } from "../../AuthCardBody";

export const AskAgree = () => {
  const { state, dispatch } = useSignUp();
  const toggleAgree = () => dispatch({ type: "agree", value: !state.agree });

  const navigation = useNavigation();
  // @ts-expect-error TODO:
  const goToPrivacy = () => navigation.navigate("Privacy");
  // @ts-expect-error TODO:
  const goToTerms = () => navigation.navigate("Terms");

  return (
    <AuthCardBody>
      <Text>
        <Text>accept_conditions_1</Text>
        <A onPress={goToPrivacy} enableTranslate>
          accept_conditions_2
        </A>
        <Text>accept_conditions_3</Text>
        <A onPress={goToTerms} enableTranslate>
          accept_conditions_4
        </A>
        <Text>accept_conditions_5</Text>
      </Text>
      <Checkbox label={"i_agree"} onPress={toggleAgree} checked={state.agree} />
    </AuthCardBody>
  );
};
