import { AskUserConfirmation } from "./AskUserConfirmation";
import { SignUpHeader } from "./SignUpHeader";
import { Hr } from "../../../../components/Hr";
import { SignUpProvider, useSignUp } from "./SignUpContext";
import { ConfirmButton } from "./ConfirmButton";

export const SignUp = () => {
  return (
    <SignUpProvider>
      <SignUpInner />
    </SignUpProvider>
  );
};

export const SignUpInner = () => {
  const { step } = useSignUp();

  return (
    <>
      <SignUpHeader />
      {step === "confirmation" && <AskUserConfirmation />}
      <Hr />
      <ConfirmButton />
    </>
  );
};
