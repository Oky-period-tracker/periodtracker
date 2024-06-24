import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { EmojiBadge } from "../../../components/EmojiBadge";
import { useEncyclopedia } from "../EncyclopediaContext";
import { data } from "../../../data/data";

interface HorizontalScrollProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const { categoryIds } = useEncyclopedia();

  const categories = categoryIds.map((categoryId) => {
    const category = data.categories.byId[categoryId];
    return {
      emoji: category.tags.primary.emoji,
      text: category.tags.primary.name,
      id: categoryId,
    };
  });

  const handlePress = (categoryId: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.contentContainer}
    >
      {categories.map((category) => (
        <EmojiBadge
          key={category.id}
          emoji={category.emoji}
          text={category.text}
          onPress={() => handlePress(category.id)}
          size="large"
          status={selectedCategories.includes(category.id) ? "danger" : "basic"}
          style={styles.emojiBadge}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 4,
    marginVertical: 8,
  },
  emojiBadge: {
    marginHorizontal: 8,
  },
});
