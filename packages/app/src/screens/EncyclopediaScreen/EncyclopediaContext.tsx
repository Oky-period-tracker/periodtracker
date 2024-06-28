import React from "react";
import { useSearch } from "../../hooks/useSearch";
import { useSelector } from "../../redux/useSelector";
import { allArticlesSelector } from "../../redux/selectors";
import { Article } from "../../core/types";

export type EncyclopediaContext = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  categoryIds: string[];
  subcategoryIds: string[];
  articleIds: string[];
};

const defaultValue: EncyclopediaContext = {
  query: "",
  setQuery: () => {
    //
  },
  categoryIds: [],
  subcategoryIds: [],
  articleIds: [],
};

const EncyclopediaContext =
  React.createContext<EncyclopediaContext>(defaultValue);

export const EncyclopediaProvider = ({ children }: React.PropsWithChildren) => {
  const articles = useSelector(allArticlesSelector);

  const { query, setQuery, results } = useSearch<Article>({
    options: articles,
    keys: searchKeys,
  });

  const { categoryIds, subcategoryIds, articleIds } = React.useMemo(() => {
    return getFilteredIds(results);
  }, [results]);

  // TODO: Clear query state when navigate out of Encyclopedia stack
  // TODO: Search through videos too, add search terms /keywords to video meta data

  return (
    <EncyclopediaContext.Provider
      value={{
        query,
        setQuery,
        categoryIds,
        subcategoryIds,
        articleIds,
      }}
    >
      {children}
    </EncyclopediaContext.Provider>
  );
};

export const useEncyclopedia = () => {
  return React.useContext(EncyclopediaContext);
};

const searchKeys = [
  "title" as const,
  "content" as const,
  "category" as const,
  "subCategory" as const,
];

const getFilteredIds = (filteredArticles: Article[]) => {
  const articleIds = filteredArticles.map((article) => article.id);
  const categoryIds = Array.from(
    new Set(filteredArticles.map((article) => article.categoryId))
  );
  const subcategoryIds = Array.from(
    new Set(filteredArticles.map((article) => article.subCategoryId))
  );

  return { categoryIds, subcategoryIds, articleIds };
};
