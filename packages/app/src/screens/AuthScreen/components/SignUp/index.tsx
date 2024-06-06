import { AskUserConfirmation } from "./components/AskUserConfirmation";
import { SignUpHeader } from "./components/SignUpHeader";
import { Hr } from "../../../../components/Hr";
import { SignUpProvider, useSignUp } from "./SignUpContext";
import { ConfirmButton } from "./components/ConfirmButton";

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
