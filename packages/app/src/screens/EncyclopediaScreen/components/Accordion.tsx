import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useToggle } from "../../../hooks/useToggle";
import { DisplayButton } from "../../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { useEncyclopedia } from "../EncyclopediaContext";
import { SubCategory } from "../../../data/data";
import { useSelector } from "../../../redux/useSelector";
import {
  allSubCategoriesByIdSelector,
  categoryByIDSelector,
} from "../../../redux/selectors";

export const Accordion = () => {
  const { filteredCategoryIds } = useEncyclopedia();

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

  const category = useSelector((s) => categoryByIDSelector(s, categoryId));
  const subCategoriesById = useSelector(allSubCategoriesByIdSelector);

  const subCategories = React.useMemo(() => {
    return category.subCategories.reduce<SubCategory[]>(
      (acc, subcategoryId) => {
        if (subcategoryIds.includes(subcategoryId)) {
          acc.push(subCategoriesById[subcategoryId]);
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
          <Text>{category.tags.primary.emoji}</Text>
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
