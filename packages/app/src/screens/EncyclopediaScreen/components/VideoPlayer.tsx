import React from "react";
import { Alert, Modal, StyleSheet, View } from "react-native";
import { ResizeMode, Video } from "expo-av";
import YoutubePlayer from "react-native-youtube-iframe";
import { FontAwesome } from "@expo/vector-icons";
import { useEncyclopedia } from "../EncyclopediaContext";
import { Button } from "../../../components/Button";
import { assets } from "../../../assets";
import { useScreenDimensions } from "../../../hooks/useScreenDimensions";
import { useSelector } from "../../../redux/useSelector";
import { videoByIDSelector } from "../../../redux/selectors";
import {
  OrientationLock,
  lockAsync,
  unlockAsync,
} from "expo-screen-orientation";
import { IS_TABLET, IS_WEB } from "../../../services/device";

export const VideoPlayerModal = () => {
  const { width: screenWidth, height: screenHeight } = useScreenDimensions();
  const { selectedVideoId, setSelectedVideoId } = useEncyclopedia();

  const videoData = useSelector((state) =>
    videoByIDSelector(state, selectedVideoId)
  );

  const close = () => {
    setSelectedVideoId(undefined);
  };

  React.useEffect(() => {
    if (videoData) {
      unlockAsync();
      return;
    }

    if (IS_TABLET || IS_WEB) {
      return;
    }

    lockAsync(OrientationLock.PORTRAIT_UP);
  }, [videoData]);

  const [canUseInternet, setCanUseInternet] = React.useState(false);

  const onConfirm = () => {
    setCanUseInternet(true);
  };

  // @ts-expect-error TODO:
  const bundledSource = assets?.videos?.[videoData?.assetName];

  const hasYoutubeVideo =
    videoData?.youtubeId && videoData?.youtubeId.length > 0;
  const canPlayYoutubeVideo = hasYoutubeVideo && canUseInternet;

  React.useEffect(() => {
    if (bundledSource || canPlayYoutubeVideo || !hasYoutubeVideo) {
      return;
    }

    ConfirmAlert({
      title: "internet_required_title",
      text: "internet_required_text",
      // title: translate('internet_required_title'),
      // text: translate('internet_required_text'),
      onPress: onConfirm,
      onCancel: close,
    });
  }, []);

  const videoAspectRatio = 16 / 9; // Aspect ratios might need to be saved in VideoData object if they vary

  let width = screenWidth;
  let height = width / videoAspectRatio;

  if (screenWidth > screenHeight) {
    height = screenHeight;
    width = height * videoAspectRatio;
  }

  if (!videoData) {
    return null;
  }

  if (!bundledSource && !canPlayYoutubeVideo) {
    return null;
  }

  return (
    <Modal visible={true} supportedOrientations={["portrait", "landscape"]}>
      <View style={styles.container}>
        <View style={styles.body}>
          {bundledSource ? (
            <Video
              source={bundledSource}
              resizeMode={ResizeMode.CONTAIN}
              style={{ width, height }}
              shouldPlay={true}
              useNativeControls
            />
          ) : (
            <YoutubePlayer
              videoId={videoData.youtubeId}
              height={height}
              width={width}
            />
          )}
          <Button style={styles.closeButton} status={"basic"} onPress={close}>
            <FontAwesome name="close" size={12} color="white" />
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const ConfirmAlert = ({
  title,
  text,
  onPress,
  onCancel,
}: {
  title: string;
  text: string;
  onPress: () => void;
  onCancel: () => void;
}) => {
  Alert.alert(
    title,
    text,
    [
      {
        text: "cancel",
        // text: translate('cancel'),
        onPress: onCancel,
        style: "cancel",
      },
      {
        text: "yes",
        // text: translate("yes"),
        onPress,
      },
    ],
    { cancelable: false }
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000",
    paddingVertical: 80,
  },
  body: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    left: 24,
    width: 24,
    height: 24,
  },
  youtubeContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
