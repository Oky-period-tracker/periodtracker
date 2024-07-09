import React from "react";
import { useSearch } from "../../hooks/useSearch";
import { useSelector } from "../../redux/useSelector";
import { allArticlesSelector, allVideosSelector } from "../../redux/selectors";
import { Article } from "../../core/types";
import { VideoData } from "../../types";

export type EncyclopediaContext = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  categoryIds: string[];
  subcategoryIds: string[];
  articleIds: string[];
  selectedCategoryIds: string[];
  setSelectedCategoryIds: React.Dispatch<React.SetStateAction<string[]>>;
  filteredCategoryIds: string[];
  videos: VideoData[];
  selectedVideoId: string | undefined;
  setSelectedVideoId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const defaultValue: EncyclopediaContext = {
  query: "",
  setQuery: () => {},
  categoryIds: [],
  subcategoryIds: [],
  articleIds: [],
  selectedCategoryIds: [],
  setSelectedCategoryIds: () => {},
  filteredCategoryIds: [],
  videos: [],
  selectedVideoId: undefined,
  setSelectedVideoId: () => {},
};

const EncyclopediaContext =
  React.createContext<EncyclopediaContext>(defaultValue);

export const EncyclopediaProvider = ({ children }: React.PropsWithChildren) => {
  const articles = useSelector(allArticlesSelector);
  const allVideos = useSelector(allVideosSelector);

  const { query, setQuery, results } = useSearch<Article>({
    options: articles,
    keys: searchKeys,
  });

  const { results: videos } = useSearch<VideoData>({
    externalQuery: query,
    options: allVideos,
    keys: videoSearchKeys,
  });

  const { categoryIds, subcategoryIds, articleIds } = React.useMemo(() => {
    return getFilteredIds(results);
  }, [results]);

  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<
    string[]
  >([]);

  const [selectedVideoId, setSelectedVideoId] = React.useState<string>();

  const filteredCategoryIds =
    selectedCategoryIds.length === 0
      ? categoryIds
      : categoryIds.filter((item) => selectedCategoryIds.includes(item));

  return (
    <EncyclopediaContext.Provider
      value={{
        query,
        setQuery,
        selectedCategoryIds,
        setSelectedCategoryIds,
        filteredCategoryIds,
        categoryIds,
        subcategoryIds,
        articleIds,
        videos,
        selectedVideoId,
        setSelectedVideoId,
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

const videoSearchKeys = [
  "title" as const, //
  "assetName" as const,
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
