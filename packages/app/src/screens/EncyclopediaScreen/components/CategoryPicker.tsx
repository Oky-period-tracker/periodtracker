import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { EmojiBadge } from "../../../components/EmojiBadge";
import { useEncyclopedia } from "../EncyclopediaContext";
import { useSelector } from "react-redux";
import { allCategoriesSelector } from "../../../redux/selectors";

export const CategoryPicker = () => {
  const allCategories = useSelector(allCategoriesSelector);
  const { selectedCategoryIds, setSelectedCategoryIds, videos } =
    useEncyclopedia();

  const handlePress = (categoryId: string) => {
    setSelectedCategoryIds((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const onVideosPress = () => {
    handlePress("videos");
  };
  const videosStatus = selectedCategoryIds.includes("videos")
    ? "danger"
    : "basic";

  return (
    <ScrollView
      horizontal
      style={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
    >
      {videos.length > 0 && (
        <EmojiBadge
          emoji={"🎥"}
          text={"videos_tag"}
          onPress={onVideosPress}
          status={videosStatus}
          enableTranslate={true}
        />
      )}

      {allCategories.map((category) => {
        const onPress = () => handlePress(category.id);
        const status = selectedCategoryIds.includes(category.id)
          ? "danger"
          : "basic";

        return (
          <EmojiBadge
            key={category.id}
            emoji={category.tags.primary.emoji}
            text={category.tags.primary.name}
            onPress={onPress}
            status={status}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    marginVertical: 8,
  },
});
