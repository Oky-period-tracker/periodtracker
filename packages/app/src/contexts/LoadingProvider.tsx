import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Spinner } from "../components/Spinner";
import { Background } from "../components/Background";

export type LoadingContext = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultValue: LoadingContext = {
  loading: false,
  setLoading: () => {},
};

const LoadingContext = React.createContext<LoadingContext>(defaultValue);

export const LoadingProvider = ({ children }: React.PropsWithChildren) => {
  const [loading, setLoading] = React.useState(false);

  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
      <Modal
        visible={loading}
        animationType={"fade"}
        transparent={true}
        statusBarTranslucent={true}
        supportedOrientations={["portrait", "landscape"]}
      >
        <Background>
          <View style={styles.backDrop} />
          <Spinner />
        </Background>
      </Modal>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  return React.useContext(LoadingContext);
};

export const useStopLoadingEffect = (duration = 1000) => {
  const { loading, setLoading } = useLoading();
  React.useEffect(() => {
    if (!loading) {
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, duration);

    return () => {
      clearTimeout(timeout);
    };
  });
};

const styles = StyleSheet.create({
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.75)",
  },
});
