import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useToggle } from "../../../hooks/useToggle";
import { data } from "../data";
import { UntouchableButton } from "../../../components/Button";
import { useNavigation } from "@react-navigation/native";

function Accordion() {
  return (
    <ScrollView style={styles.accordionContainer}>
      {data.categories.allIds.map((categoryId) => (
        <AccordionItem key={categoryId} categoryId={categoryId} />
      ))}
    </ScrollView>
  );
}

export default Accordion;

const AccordionItem = ({ categoryId }: { categoryId: string }) => {
  const navigation = useNavigation() as any; // @TODO: Fixme
  const [expanded, toggleExpanded] = useToggle();

  const category = data.categories.byId[categoryId];
  const subcategories = category.subCategories.map(
    (subcategoryId) => data.subCategories.byId[subcategoryId]
  );

  return (
    <>
      <TouchableOpacity style={styles.category} onPress={toggleExpanded}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <UntouchableButton
          status={"basic"}
          style={styles.categoryEmoji}
        ></UntouchableButton>
      </TouchableOpacity>
      {expanded
        ? subcategories.map((subcategory) => (
            <TouchableOpacity
              style={styles.subcategory}
              onPress={() =>
                navigation.navigate("ArticlesScreen", {
                  title: subcategory.name,
                  subcategoryId: subcategory.id,
                })
              }
            >
              <Text>{subcategory.name}</Text>
            </TouchableOpacity>
          ))
        : null}
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
