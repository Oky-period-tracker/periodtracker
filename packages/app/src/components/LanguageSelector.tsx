import { Button, ButtonProps } from "./Button";
import { ModalSelector } from "./ModalSelector";

export const LanguageSelector = () => {
  // TODO: update redux state

  return (
    <ModalSelector
      options={languages}
      onSelect={() => {
        // TODO:
      }}
      ToggleComponent={LanguageButton}
    />
  );
};

const LanguageButton = (props: ButtonProps) => {
  // TODO: display redux state language name

  return (
    <Button status={"basic"} {...props}>
      English
    </Button>
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
