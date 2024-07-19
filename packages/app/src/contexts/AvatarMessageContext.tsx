import React from "react";
import { useSelector } from "react-redux";
import { allAvatarText } from "../redux/selectors";
import { useScreenFocus } from "../hooks/useScreenFocus";
import _ from "lodash";

export type AvatarMessageContext = {
  message: null | string;
  setAvatarMessage: (translationKey: string) => void;
};

const defaultValue: AvatarMessageContext = {
  message: null,
  setAvatarMessage: () => {},
};

const AvatarMessageContext =
  React.createContext<AvatarMessageContext>(defaultValue);

const MESSAGE_DURATION = 5000;
const RANDOM_MESSAGE_INTERVAL = 10000;

export const AvatarMessageProvider = ({
  children,
}: React.PropsWithChildren) => {
  const allMessages = useSelector(allAvatarText);
  const isScreenFocussed = useScreenFocus();
  const [message, setMessage] = React.useState("");

  const setAvatarMessage = (translationKey: string) => {
    setMessage(translationKey);
    // setMessage(translate(translationKey)); // TODO: translate
  };

  const setRandomAvatarMessage = () => {
    setMessage(_.sample(allMessages)?.content ?? "");
  };

  // ===== Random message ===== //
  React.useEffect(() => {
    if (message || !isScreenFocussed) {
      return;
    }

    const timeout = setTimeout(setRandomAvatarMessage, RANDOM_MESSAGE_INTERVAL);

    return () => {
      clearTimeout(timeout);
    };
  }, [isScreenFocussed, message]);

  // ===== Clear message ===== //
  React.useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = setTimeout(() => {
      setMessage("");
    }, MESSAGE_DURATION);

    return () => {
      clearTimeout(timeout);
    };
  }, [message]);

  return (
    <AvatarMessageContext.Provider
      value={{
        message,
        setAvatarMessage,
      }}
    >
      {children}
    </AvatarMessageContext.Provider>
  );
};

export const useAvatarMessage = () => {
  return React.useContext(AvatarMessageContext);
};
