import React from "react";
import { LayoutChangeEvent, LayoutRectangle } from "react-native";

export const useLayout = (): [
  layout: LayoutRectangle | undefined,
  onLayout: (event: LayoutChangeEvent) => void
] => {
  const [layout, setLayout] = React.useState<LayoutRectangle>();

  const onLayout = (event: LayoutChangeEvent) => {
    setLayout(event.nativeEvent.layout);
  };

  return [layout, onLayout];
};
