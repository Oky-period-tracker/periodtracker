import * as React from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { data } from "../EncyclopediaScreen/data";
import { Screen } from "../../components/Screen";

function ArticlesScreen({ navigation, route }) {
  const subcategoryId = route.params.subcategoryId;
  const subcategory = data.subCategories.byId[subcategoryId];
  const articles = subcategory.articles.map(
    (articleId) => data.articles.byId[articleId]
  );

  React.useLayoutEffect(() => {
    if (subcategory) {
      navigation.setOptions({ title: subcategory.name });
    }
  }, [navigation, subcategory]);

  return (
    <Screen>
      <ScrollView style={styles.scrollView}>
        {articles.map((article) => {
          return (
            <View style={styles.card}>
              <Text style={styles.title}>{article.title}</Text>
              <Text style={styles.subCategory}>{article.subCategory}</Text>
              <Text>{article.content}</Text>
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

export default ArticlesScreen;

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    minHeight: 120,
    margin: 4,
    borderRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 24,
  },
  subCategory: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 24,
  },
});
