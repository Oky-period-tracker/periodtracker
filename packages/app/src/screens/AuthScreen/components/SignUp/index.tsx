import { AskAgree } from "./components/AskAgree";
import { SignUpHeader } from "./components/SignUpHeader";
import { Hr } from "../../../../components/Hr";
import { SignUpProvider, useSignUp } from "./SignUpContext";
import { ConfirmButton } from "./components/ConfirmButton";
import { AskAge } from "./components/AskAge";
import { AskUserInfo } from "./components/AskUserInfo";
import { AskSecret } from "./components/AskSecret";
import { AskLocation } from "./components/AskLocation";

export const SignUp = () => {
  return (
    <SignUpProvider>
      <SignUpInner />
    </SignUpProvider>
  );
};

const SignUpInner = () => {
  const { step } = useSignUp();

  return (
    <>
      <SignUpHeader />
      {step === "confirmation" && <AskAgree />}
      {step === "information" && <AskUserInfo />}
      {step === "secret" && <AskSecret />}
      {step === "age" && <AskAge />}
      {step === "location" && <AskLocation />}
      <Hr />
      <ConfirmButton />
    </>
  );
};
