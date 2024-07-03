import * as React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Article, data } from "../../data/data";
import { Screen } from "../../components/Screen";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { useEncyclopedia } from "../EncyclopediaScreen/EncyclopediaContext";
import { SearchBar } from "../../components/SearchBar";

const ArticlesScreen: ScreenComponent<"Articles"> = ({ navigation, route }) => {
  const { query, setQuery, articleIds } = useEncyclopedia();

  const subcategoryId = route.params.subcategoryId;
  const subcategory = data.subCategories.byId[subcategoryId];

  const articles = React.useMemo(() => {
    return subcategory.articles.reduce<Article[]>((acc, articleId) => {
      if (articleIds.includes(articleId)) {
        acc.push(data.articles.byId[articleId]);
      }
      return acc;
    }, []);
  }, [subcategory, articleIds, data.articles]);

  React.useLayoutEffect(() => {
    // Set Screen title
    if (subcategory) {
      navigation.setOptions({ title: subcategory.name });
    }
  }, [navigation, subcategory]);

  return (
    <Screen>
      <SearchBar query={query} setQuery={setQuery} />

      <ScrollView style={styles.scrollView}>
        {articles.map((article) => {
          return (
            <View style={styles.card} key={article.id}>
              <Text style={styles.title}>{article.title}</Text>
              <Text style={styles.subCategory}>{subcategory.name}</Text>
              <Text>{article.content}</Text>
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
};

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
