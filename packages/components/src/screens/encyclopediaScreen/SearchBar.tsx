import React from 'react'
import { Keyboard, ScrollView } from 'react-native'
import { Header } from '../../components/common/Header'
import { RoundedInput } from '../../components/common/RoundedInput'
import { IconButton } from '../../components/common/buttons/IconButton'
import styled from 'styled-components/native'
import { handleCategoriesFilter, handleSearchResult } from './searchFunctions'
import { EmojiSelector } from '../../components/common/EmojiSelector'
import { useSelector } from '../../hooks/useSelector'
import * as selectors from '../../redux/selectors'
import { translate } from '../../i18n'

export const SearchBar = ({
  setFilteredCategories,
  setActiveCategory,
  categories,
  subCategories,
  shownCategories,
  searching,
  setSearching,
  articles,
}) => {
  const [searchStr, setSearchStr] = React.useState('')
  const [emojiFilter, updateEmojiFilter] = React.useState([])
  const locale = useSelector(selectors.currentLocaleSelector)
  const emojiList = useSelector(selectors.allCategoryEmojis)

  return (
    <>
      <Header
        screenTitle="encyclopedia"
        showGoBackButton={true}
        onPressBackButton={
          searching &&
          (() => {
            setFilteredCategories(categories)
            updateEmojiFilter([])
            setSearching(false)
            setSearchStr('')
          })
        }
      />
      <Row style={{ alignItems: 'center', marginBottom: 10 }}>
        <RoundedInput
          inputProps={{
            blurOnSubmit: false,
            value: searchStr,
            placeholder: translate('type_to_search'),
            keyboardType: 'default',
            returnKeyType: 'search',
            onChangeText: (text) => {
              setSearchStr(text)
              setActiveCategory([])
              const filteredResults = handleSearchResult(
                text,
                categories,
                subCategories,
                articles,
                locale,
              )
              setFilteredCategories(filteredResults)
            },
            onFocus: () => {
              if (!searching) {
                setFilteredCategories([])
                setSearching(true)
              }
            },
            onSubmitEditing: () => {
              Keyboard.dismiss()
            },
          }}
        />
        {searching && searchStr.length > 0 && (
          <AbsoluteContainer>
            <IconButton
              onPress={() => {
                setFilteredCategories(categories)
                updateEmojiFilter([])
                setSearching(false)
                setSearchStr('')
              }}
              name="close"
              accessibilityLabel={translate('clear_search')}
            />
          </AbsoluteContainer>
        )}
      </Row>
      {searching && (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={{ height: 70, marginVertical: 5 }}
        >
          <ScrollRow>
            {emojiList.map((object, index) => {
              return (
                <EmojiSelector
                  key={index}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginHorizontal: 8,
                    marginBottom: 0,
                  }}
                  emoji={object.emoji}
                  title={object.tag}
                  emojiStyle={{ fontSize: 20 }}
                  textStyle={{ fontSize: 8 }}
                  color="#e3629b"
                  isActive={emojiFilter.indexOf(object.emoji) !== -1}
                  onPress={() => {
                    setFilteredCategories(
                      handleCategoriesFilter(
                        shownCategories,
                        emojiFilter.indexOf(object.emoji) === -1
                          ? [...emojiFilter, object.emoji]
                          : emojiFilter.filter((item) => item !== object.emoji),
                        searchStr,
                        subCategories,
                        articles,
                        locale,
                      ),
                    )
                    updateEmojiFilter(
                      emojiFilter.indexOf(object.emoji) === -1
                        ? [...emojiFilter, object.emoji]
                        : emojiFilter.filter((item) => item !== object.emoji),
                    )
                  }}
                />
              )
            })}
          </ScrollRow>
        </ScrollView>
      )}
    </>
  )
}

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 6;
  flex-wrap: wrap;
`

const AbsoluteContainer = styled.View`
  position: absolute;
  right: 10;
  top: 7.5;
  elevation: 50;
  z-index: 999;
`

const ScrollRow = styled.View`
  flex-direction: row;
  height: 100%;
  background-color: transparent;
  align-items: center;
  justify-content: center;
`
