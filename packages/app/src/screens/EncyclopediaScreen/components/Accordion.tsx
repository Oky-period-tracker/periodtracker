import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useToggle } from "../../../hooks/useToggle";
import { DisplayButton } from "../../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { useEncyclopedia } from "../EncyclopediaContext";
import { SubCategory, data } from "../../../data/data";

interface AccordionProps {
  selectedCategories: string[];
}

export const Accordion: React.FC<AccordionProps> = ({ selectedCategories }) => {
  const { categoryIds } = useEncyclopedia();

  const filteredCategoryIds =
    selectedCategories.length > 0 ? selectedCategories : categoryIds;

  return (
    <>
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

  const category = data.categories.byId[categoryId];

  const subCategories = React.useMemo(() => {
    return category.subCategories.reduce<SubCategory[]>(
      (acc, subcategoryId) => {
        if (subcategoryIds.includes(subcategoryId)) {
          acc.push(data.subCategories.byId[subcategoryId]);
        }
        return acc;
      },
      []
    );
  }, [category, subcategoryIds]);

  return (
    <>
      <TouchableOpacity style={styles.category} onPress={toggleExpanded}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <DisplayButton status={"basic"} style={styles.categoryEmoji}>
          <Text style={styles.emojiText}>{category.tags.primary.emoji}</Text>
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
            <Text>{subcategory.name}</Text>
          </TouchableOpacity>
        ))}
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
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  categoryEmoji: {
    width: 50,
    height: 50,
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
  emojiText: {
    fontSize: 24,
  },
});
