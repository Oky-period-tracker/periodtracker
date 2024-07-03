import * as React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/Button";
import { avatarNames, themeNames } from "../../core/modules";
import { getAsset } from "../../services/asset";
import { CheckButton } from "../../components/CheckButton";
import { useSelector } from "../../redux/useSelector";
import {
  currentAvatarSelector,
  currentThemeSelector,
} from "../../redux/selectors";
import { useDispatch } from "react-redux";
import { setAvatar, setTheme } from "../../redux/actions";
import { PaletteStatus } from "../../config/theme";

const AvatarAndThemeScreen = () => {
  return <AvatarAndThemeSelect />;
};

export default AvatarAndThemeScreen;

type AvatarAndThemeSelectProps = {
  onConfirm?: () => void;
};

export const AvatarAndThemeSelect = ({
  onConfirm,
}: AvatarAndThemeSelectProps) => {
  const currentAvatar = useSelector(currentAvatarSelector);
  const currentTheme = useSelector(currentThemeSelector);
  const dispatch = useDispatch();

  const [selectedAvatar, setSelectedAvatar] = React.useState(currentAvatar);
  const [selectedTheme, setSelectedTheme] = React.useState(currentTheme);

  const confirm = () => {
    dispatch(setAvatar(selectedAvatar));
    dispatch(setTheme(selectedTheme));
    onConfirm?.();
  };

  const avatarChanged = currentAvatar !== selectedAvatar;
  const themeChanged = currentTheme !== selectedTheme;
  const hasChanged = avatarChanged || themeChanged;

  const isInitialSelection = !!onConfirm;
  const confirmStatus = hasChanged || isInitialSelection ? "primary" : "basic";

  return (
    <Screen style={styles.screen}>
      <View style={styles.avatars}>
        {avatarNames.map((avatar) => {
          const { showCheck, checkStatus } = getCheckStatus({
            isSelected: avatar === selectedAvatar,
            isCurrent: avatar === currentAvatar,
            changed: avatarChanged,
            isInitialSelection,
          });

          const onPress = () => {
            setSelectedAvatar(avatar);
          };

          return (
            <TouchableOpacity onPress={onPress} style={styles.avatar}>
              <Image
                source={getAsset(`avatars.${avatar}.theme`)}
                style={styles.avatarImage}
              />
              {showCheck && (
                <CheckButton style={styles.check} status={checkStatus} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.themes}>
        {themeNames.map((theme) => {
          const { showCheck, checkStatus } = getCheckStatus({
            isSelected: theme === selectedTheme,
            isCurrent: theme === currentTheme,
            changed: themeChanged,
            isInitialSelection,
          });

          const onPress = () => {
            setSelectedTheme(theme);
          };

          return (
            <TouchableOpacity onPress={onPress} style={styles.theme}>
              <Image
                source={getAsset(`backgrounds.${theme}.default`)}
                style={styles.themeImage}
              />
              {showCheck && (
                <CheckButton style={styles.check} status={checkStatus} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Button onPress={confirm} status={confirmStatus}>
        Confirm
      </Button>
    </Screen>
  );
};

const getCheckStatus = ({
  isSelected,
  isCurrent,
  changed,
  isInitialSelection,
}: {
  isSelected: boolean;
  isCurrent: boolean;
  changed: boolean;
  isInitialSelection: boolean;
}): {
  showCheck: boolean;
  checkStatus: PaletteStatus;
} => {
  // When making selection for the first time, indicate selection with primary (green) status
  if (isInitialSelection) {
    return {
      showCheck: isSelected,
      checkStatus: "primary",
    };
  }

  // When editing, show current as basic and selected as secondary, to indicate unsaved changes
  return {
    showCheck: isSelected || (isCurrent && !isSelected),
    checkStatus: isSelected ? (changed ? "secondary" : "primary") : "basic",
  };
};

const styles = StyleSheet.create({
  screen: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  avatars: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: "#fff",
    width: 80,
    height: 80,
    borderRadius: 20,
    margin: 4,
    overflow: "hidden",
  },
  themes: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexWrap: "wrap",
  },
  theme: {
    backgroundColor: "#fff",
    minWidth: 100,
    height: 100,
    borderRadius: 20,
    flexBasis: "40%",
    margin: 8,
    overflow: "hidden",
    borderColor: "#fff",
    borderWidth: 4,
  },
  check: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    aspectRatio: 1,
    resizeMode: "contain",
  },
  themeImage: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    resizeMode: "cover",
  },
});
