import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useToggle } from "../../../hooks/useToggle";
import { DisplayButton } from "../../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { useEncyclopedia } from "../EncyclopediaContext";
import { useSelector } from "../../../redux/useSelector";
import { Text } from "../../../components/Text";
import {
  allSubCategoriesByIdSelector,
  categoryByIDSelector,
} from "../../../redux/selectors";
import { VideoPlayerModal } from "./VideoPlayer";
import { SubCategory } from "../../../core/types";
import { globalStyles } from "../../../config/theme";
import { currentUserSelector } from "../../../redux/selectors";
import { useAuth } from "../../../contexts/AuthContext";
import { analytics } from "../../../services/firebase";

export const Accordion = () => {
  const { filteredCategoryIds } = useEncyclopedia();

  return (
    <>
      <AccordionVideosItem />
      {filteredCategoryIds.map((categoryId) => (
        <AccordionItem key={categoryId} categoryId={categoryId} />
      ))}
    </>
  );
};

const AccordionItem = ({ categoryId }: { categoryId: string }) => {
  //eslint-disable-next-line
  const navigation = useNavigation() as any; // @TODO: Fixme
  const [expanded, toggleExpanded] = useToggle();
  const user = useSelector(currentUserSelector);
  const { isLoggedIn } = useAuth();

  const hasAccess = user && isLoggedIn;

  const { subcategoryIds } = useEncyclopedia();

  const onCategoryPress = () => {
    toggleExpanded();

    if (expanded) {
      return;
    }

    if (hasAccess) {
      analytics?.().logEvent("categoryPressedLoggedIn", {
        EncyclopediaCategoryName: category.name,
        user: user.id,
      });
    } else {
      analytics?.().logEvent("categoryPressedLoggedOut", {
        EncyclopediaCategoryName: category.name,
      });
    }
  };

  const category = useSelector((s) => categoryByIDSelector(s, categoryId));
  const subCategoriesById = useSelector(allSubCategoriesByIdSelector);

  const onSubCategoryPress = (
    subcategoryId: string,
    subcategoryName: string
  ) => {
    return () => {
      navigation.navigate("Articles", { subcategoryId });

      if (hasAccess) {
        analytics?.().logEvent("subCategoryPressedLoggedIn", {
          EncyclopediaSubcategoryName: subcategoryName,
          user: user.id,
        });
      } else {
        analytics?.().logEvent("subCategoryPressedLoggedOut", {
          EncyclopediaSubcategoryName: subcategoryName,
        });
      }
    };
  };

  const subCategories = React.useMemo(() => {
    return category?.subCategories?.reduce<SubCategory[]>(
      (acc, subcategoryId) => {
        if (subcategoryIds.includes(subcategoryId)) {
          const subCategory = subCategoriesById[subcategoryId];
          if (subCategory) {
            acc.push(subCategory);
          }
        }
        return acc;
      },
      []
    );
  }, [category, subcategoryIds]);

  if (!category) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.category, globalStyles.shadow]}
        onPress={onCategoryPress}
      >
        <Text
          status={expanded ? "danger" : "secondary"}
          style={styles.categoryName}
          enableTranslate={false}
        >
          {category.name}
        </Text>
        <DisplayButton
          status={expanded ? "danger" : "basic"}
          style={styles.categoryEmoji}
        >
          {!!category.tags?.primary?.emoji && (
            <Text enableTranslate={false}>{category.tags.primary.emoji}</Text>
          )}
        </DisplayButton>
      </TouchableOpacity>
      {expanded &&
        subCategories.map((subcategory) => (
          <TouchableOpacity
            key={subcategory.id}
            style={[styles.subcategory, globalStyles.shadow]}
            onPress={onSubCategoryPress(subcategory.id, subcategory.name)}
          >
            <Text enableTranslate={false}>{subcategory.name}</Text>
          </TouchableOpacity>
        ))}
    </>
  );
};

const AccordionVideosItem = () => {
  const { videos, selectedCategoryIds, setSelectedVideoId } = useEncyclopedia();

  const [expanded, toggleExpanded] = useToggle();

  const videosCategoryNotSelected =
    selectedCategoryIds.length > 0 && !selectedCategoryIds.includes("videos");

  if (videosCategoryNotSelected || !videos.length) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.category, styles.videos, globalStyles.shadow]}
        onPress={toggleExpanded}
      >
        <Text
          status={expanded ? "danger" : "secondary"}
          style={styles.videosTitle}
        >
          {"videos"}
        </Text>
        <DisplayButton
          status={expanded ? "danger" : "basic"}
          style={styles.categoryEmoji}
        >
          <Text enableTranslate={false}>{"🎥"}</Text>
        </DisplayButton>
      </TouchableOpacity>
      {expanded &&
        videos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={[styles.subcategory, globalStyles.shadow]}
            onPress={() => {
              setSelectedVideoId(video.id);
            }}
          >
            <Text enableTranslate={false}>{video.title}</Text>
          </TouchableOpacity>
        ))}
      <VideoPlayerModal />
    </>
  );
};

const styles = StyleSheet.create({
  accordionContainer: {
    width: "100%",
    height: "100%",
  },
  category: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    minHeight: 80,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginVertical: 4,
    paddingHorizontal: 24,
  },
  videos: {
    height: 120,
    backgroundColor: "#ffe6e3",
  },
  videosTitle: {
    fontSize: 26,
    fontWeight: "bold",
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  categoryEmoji: {
    width: 40,
    height: 40,
  },
  subcategory: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "flex-end",
    width: "90%",
    minHeight: 60,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginVertical: 4,
    paddingHorizontal: 24,
  },
});
