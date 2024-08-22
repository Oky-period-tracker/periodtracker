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
import { PaletteStatus, globalStyles, palette } from "../../config/theme";
import { Text } from "../../components/Text";

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
      {isInitialSelection && (
        <Text style={styles.title}>avatar_amp_themes_login</Text>
      )}
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
            <TouchableOpacity
              key={avatar}
              onPress={onPress}
              style={[styles.avatar, globalStyles.shadow]}
            >
              <View style={styles.body}>
                <Image
                  source={getAsset(`avatars.${avatar}.theme`)}
                  style={styles.avatarImage}
                />
                <Text style={styles.name} enableTranslate={false}>
                  {avatar}
                </Text>
                {showCheck && (
                  <CheckButton style={styles.check} status={checkStatus} />
                )}
              </View>
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
            <TouchableOpacity
              key={theme}
              onPress={onPress}
              style={[styles.theme, globalStyles.shadow]}
            >
              <Image
                source={getAsset(`backgrounds.${theme}.icon`)}
                style={styles.themeImage}
              />
              <Text style={styles.name} enableTranslate={false}>
                {theme}
              </Text>
              {showCheck && (
                <CheckButton style={styles.check} status={checkStatus} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Button onPress={confirm} status={confirmStatus}>
        confirm
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: palette["secondary"].base,
    textAlign: "center",
    marginBottom: 12,
  },
  avatars: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    margin: 4,
  },
  themes: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexWrap: "wrap",
  },
  theme: {
    minWidth: 100,
    height: 100,
    flexBasis: "40%",
    margin: 8,
  },
  body: {
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderWidth: 4,

    overflow: "hidden",
    width: "100%",
    height: "100%",
    borderRadius: 20,
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
    borderColor: "#fff",
    borderWidth: 4,
    borderRadius: 20,
  },
  name: {
    position: "absolute",
    top: 2,
    left: 0,
    width: "100%",
    fontWeight: "bold",
    color: palette["secondary"].base,
    textAlign: "center",
  },
});
