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

  const { subcategoryIds } = useEncyclopedia();

  const category = useSelector((s) => categoryByIDSelector(s, categoryId));
  const subCategoriesById = useSelector(allSubCategoriesByIdSelector);

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

  // Add safety checks for category and subCategoriesById
  if (!category) {
    console.error(`Category not found for id: ${categoryId}`);
    return null;
  }

  return (
    <>
      <TouchableOpacity style={styles.category} onPress={toggleExpanded}>
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
            style={styles.subcategory}
            onPress={() =>
              navigation.navigate("Articles", {
                subcategoryId: subcategory.id,
              })
            }
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
        style={[styles.category, styles.videos]}
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
            style={styles.subcategory}
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
    height: 80,
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
    fontSize: 22,
    fontWeight: "bold",
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
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
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginVertical: 4,
    paddingHorizontal: 24,
  },
});
