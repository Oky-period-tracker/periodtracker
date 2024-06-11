import React from "react";
import { AskAgree } from "./components/AskAgree";
import { SignUpHeader } from "./components/SignUpHeader";
import { Hr } from "../../../../components/Hr";
import { SignUpProvider, SignUpStep, useSignUp } from "./SignUpContext";
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
  const StepComponent = stepComponents[step] || React.Fragment;

  return (
    <>
      <SignUpHeader />
      <StepComponent />
      <Hr />
      <ConfirmButton />
    </>
  );
};

const stepComponents: Record<SignUpStep, React.FC> = {
  confirmation: AskAgree,
  information: AskUserInfo,
  secret: AskSecret,
  age: AskAge,
  location: AskLocation,
};
