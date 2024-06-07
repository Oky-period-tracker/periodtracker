import {
  Modal as RNModal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScreenDimensions } from "../hooks/useScreenDimensions";
import { IS_WEB } from "../services/device";

export const Modal = ({
  visible,
  toggleVisible,
  children,
}: {
  visible: boolean;
  toggleVisible: () => void;
  children: React.ReactNode;
}) => {
  const { width, height } = useScreenDimensions();
  const maxWidth = Math.min(width, 800);
  const maxHeight = height * 0.6;

  return (
    <RNModal
      visible={visible}
      onRequestClose={toggleVisible}
      animationType={"fade"}
      transparent={true}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backDrop} onPress={toggleVisible} />
        <SafeAreaView style={[styles.children, { maxWidth, maxHeight }]}>
          {children}
        </SafeAreaView>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: IS_WEB ? "center" : undefined,
  },
  children: {
    margin: 24,
  },
});
