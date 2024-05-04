import * as React from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { data } from "../EncyclopediaScreen/data";

function ArticlesScreen({ navigation, route }) {
  const subcategoryId = route.params.subcategoryId;
  const subcategory = data.subCategories.byId[subcategoryId];
  const articles = subcategory.articles.map(
    (articleId) => data.articles.byId[articleId]
  );

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "red",
        padding: 12,
      }}
    >
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
    </View>
  );
}

export default ArticlesScreen;

const styles = StyleSheet.create({
  scrollView: {
    width: "90%",
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
