import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Text } from '../../../components/Text'
import { getCategoryIcon } from '../../../resources/assets/friendAssets'
import type { Category } from '../types'
import { useAccessibilityLabel } from '../../../hooks/useAccessibilityLabel'

interface CategoryTabsProps {
  selectedCategory: Category
  onSelectCategory: (category: Category) => void
  styles: ReturnType<typeof import('../CustomAvatarScreen.styles').createCustomAvatarStyles>
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  styles,
}) => {
  const getAccessibilityLabel = useAccessibilityLabel()
  const categories: { key: Category; translationKey: string }[] = [
    { key: 'body', translationKey: 'customizer_body' },
    { key: 'hair', translationKey: 'customizer_hair' },
    { key: 'eyes', translationKey: 'customizer_eyes' },
    { key: 'clothing', translationKey: 'customizer_clothes' },
    { key: 'devices', translationKey: 'customizer_personal_items' },
  ]

  return (
    <View style={styles.categoryContainer}>
      {categories.map((category) => {
        const isSelected = selectedCategory === category.key
        const categoryIcon = getCategoryIcon(category.key)

        return (
          <TouchableOpacity
            key={category.key}
            onPress={() => onSelectCategory(category.key)}
            style={[styles.categoryButton, isSelected && styles.categoryButtonSelected]}
            accessibilityLabel={getAccessibilityLabel('select_category_button') + `: ${category.translationKey}, ${isSelected ? 'selected' : 'tap to select'}`}
            accessibilityRole="button"
          >
            <View
              style={[
                styles.categoryIcon,
                isSelected && styles.categoryIconSelected,
                !isSelected && styles.categoryIconUnselected,
              ]}
            >
              {categoryIcon && (
                <Image
                  source={categoryIcon}
                  style={[
                    styles.categoryIconImage,
                    isSelected && styles.categoryIconImageSelected,
                  ]}
                  resizeMode="contain"
                />
              )}
            </View>
            <Text style={[styles.categoryLabel, isSelected && { fontWeight: 'bold' }]} enableTranslate={true}>
              {category.translationKey}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}


