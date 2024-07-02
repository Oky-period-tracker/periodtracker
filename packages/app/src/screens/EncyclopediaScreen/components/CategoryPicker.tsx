import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { EmojiBadge } from "../../../components/EmojiBadge";
import { useEncyclopedia } from "../EncyclopediaContext";
import { useSelector } from "react-redux";
import { allCategoriesSelector } from "../../../redux/selectors";

export const CategoryPicker = () => {
  const allCategories = useSelector(allCategoriesSelector);
  const { selectedCategoryIds, setSelectedCategoryIds } = useEncyclopedia();

  const handlePress = (categoryId: string) => {
    setSelectedCategoryIds((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  return (
    <ScrollView
      horizontal
      style={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
    >
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
            size={"large"}
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
