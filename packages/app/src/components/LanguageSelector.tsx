import React from "react";
import { Button, ButtonProps } from "./Button";
import { ModalSelector } from "./ModalSelector";

export const LanguageSelector = (props: ButtonProps) => {
  // TODO: update redux state

  const initialOption = languages[0];

  const LanguageButton = ({ onPress }: ButtonProps) => {
    // TODO: display redux state language name

    return (
      <Button {...props} onPress={onPress}>
        English
      </Button>
    );
  };

  return (
    <ModalSelector
      initialOption={initialOption}
      options={languages}
      onSelect={() => {
        // TODO:
      }}
      ToggleComponent={LanguageButton}
    />
  );
};

const languages = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "Spanish",
    value: "es",
  },
];
