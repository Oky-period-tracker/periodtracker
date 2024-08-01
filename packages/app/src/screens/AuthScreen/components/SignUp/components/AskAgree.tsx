import React from "react";
import { useSignUp } from "../SignUpContext";
import { Checkbox } from "../../../../../components/Checkbox";
import { A } from "../../../../../components/A";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../../../../../components/Text";
import { AuthCardBody } from "../../AuthCardBody";
import { StyleSheet } from "react-native";
import { useTranslate } from "../../../../../hooks/useTranslate";

export const AskAgree = () => {
  const translate = useTranslate();
  const { state, dispatch } = useSignUp();
  const toggleAgree = () => dispatch({ type: "agree", value: !state.agree });

  const navigation = useNavigation();
  // @ts-expect-error TODO:
  const goToPrivacy = () => navigation.navigate("Privacy");
  // @ts-expect-error TODO:
  const goToTerms = () => navigation.navigate("Terms");

  return (
    <AuthCardBody style={styles.container}>
      <Text>
        <Text>accept_conditions_1</Text>

        <A
          onPress={goToPrivacy}
          accessibilityLabel={translate(`privacy_and_policy_link`)}
          enableTranslate
        >
          accept_conditions_2
        </A>
        <Text>accept_conditions_3</Text>

        <A
          onPress={goToTerms}
          accessibilityLabel={translate("t_and_c_link")}
          enableTranslate
        >
          accept_conditions_4
        </A>
        <Text>accept_conditions_5</Text>
      </Text>
      <Checkbox
        label={"i_agree"}
        onPress={toggleAgree}
        checked={state.agree}
        accessibilityLabel={translate("i_agree")}
      />
    </AuthCardBody>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
