"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalSearchBox = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Icon_1 = require("./Icon");
const index_1 = require("../../assets/index");
const Text_1 = require("./Text");
const ThemedModal_1 = require("./ThemedModal");
const TextInput_1 = require("./TextInput");
const lodash_1 = __importDefault(require("lodash"));
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const i18n_1 = require("../../i18n");
const core_1 = require("@oky/core");
const ModalSearchBox = ({ lang = core_1.defaultLocale, // TODO: FIXME
hasError = false, containerStyle = null, itemStyle = null, height = 45, buttonStyle = null, location = null, isCountrySelector = true, searchInputPlaceholder = '', accessibilityLabel = '', filterCountry = null, onSelection = (val) => null, isValid, }) => {
    const [isVisible, setIsVisible] = react_1.default.useState(false);
    const filteredCountryCode = filterCountry ? filterCountry.code : null;
    const serializeLocation = ({ item, code }) => {
        return `${item}, ${code}`;
    };
    const deserializeLocation = (serializedLocation) => {
        const [item, code] = serializedLocation.split(', ');
        return { item, code };
    };
    const currentItem = location !== null ? serializeLocation(location) : null;
    const items = react_1.default.useMemo(() => {
        if (isCountrySelector) {
            return lodash_1.default.uniq(Object.entries(core_1.countries).map(([code, country]) => serializeLocation({ item: country[lang], code })));
        }
        // -------------- Provinces -----------------------
        if (filteredCountryCode) {
            const filteredProvinces = core_1.provinces.filter(({ code, uid }) => code === filteredCountryCode || uid === 0);
            return lodash_1.default.uniq(filteredProvinces.map((province) => serializeLocation({ item: province[lang], code: province.uid.toString() })));
        }
        return lodash_1.default.uniq(core_1.provinces.map((province) => serializeLocation({ item: province[lang], code: province.code })));
    }, [filteredCountryCode]);
    const selectThenGoBack = (item) => {
        onSelection(deserializeLocation(item));
        setIsVisible(false);
    };
    return (<>
      <FormControl style={Object.assign({ height }, containerStyle)}>
        <Row accessibilityLabel={accessibilityLabel} onPress={() => setIsVisible(true)} style={{ height, alignItems: 'center', justifyContent: 'center' }}>
          <SelectedItem style={[itemStyle, { color: '#28b9cb' }]}>
            {location ? location.item : (0, i18n_1.translate)(isCountrySelector ? 'country' : 'province')}
          </SelectedItem>
        </Row>
        {isValid && !hasError && (<Icon_1.Icon source={index_1.assets.static.icons.tick} style={{ position: 'absolute', right: 8, bottom: 10 }}/>)}
        {hasError && (<Icon_1.Icon source={index_1.assets.static.icons.closeLine} style={{ position: 'absolute', right: 8, bottom: 10 }}/>)}
      </FormControl>
      <ThemedModal_1.ThemedModal {...{ isVisible, setIsVisible, animationIn: 'slideInUp', animationOut: 'slideOutDown' }}>
        <CardPicker>
          <SearchList items={items} value={currentItem} onPress={selectThenGoBack} searchInputPlaceholder={searchInputPlaceholder} resultNotFoundErrorMessage={`No result found. Check your spelling, or find the nearest larger city.`} // @TODO: translation
    />
        </CardPicker>
      </ThemedModal_1.ThemedModal>
    </>);
};
exports.ModalSearchBox = ModalSearchBox;
const SearchList = ({ items, onPress, value, searchInputPlaceholder, resultNotFoundErrorMessage, }) => {
    const [searchText, setSearchText] = react_1.default.useState('');
    const itemsFound = react_1.default.useMemo(() => {
        const normalizedSearchText = searchText.toLowerCase();
        const matchPartialResult = (item) => {
            const normalizedItem = item.toLowerCase();
            return (normalizedItem.startsWith(normalizedSearchText) ||
                normalizedSearchText.startsWith(normalizedItem));
        };
        return items.filter(matchPartialResult);
    }, [items, searchText]);
    const onPressRef = react_1.default.useRef(onPress);
    react_1.default.useLayoutEffect(() => {
        onPressRef.current = onPress;
    });
    const renderItem = react_1.default.useCallback(({ item }) => {
        const isSelected = Array.isArray(value) ? value.includes(item) : item === value;
        const text = item.split(', ')[0];
        return (<ItemButton onPress={() => onPressRef.current(item)} isSelected={isSelected}>
          <FlatListText isSelected={isSelected}>{text}</FlatListText>
        </ItemButton>);
    }, [value]);
    const renderItemNotFound = () => {
        return <ResultNotFoundText>{resultNotFoundErrorMessage}</ResultNotFoundText>;
    };
    return (<Container>
      <TextInput_1.TextInput onChange={setSearchText} label={searchInputPlaceholder} value={searchText}/>
      <react_native_gesture_handler_1.FlatList data={itemsFound} keyExtractor={(nothing, index) => index.toString()} renderItem={renderItem} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'} ListEmptyComponent={renderItemNotFound} numColumns={1}/>
    </Container>);
};
const FormControl = native_1.default.View `
  width: 100%;
  background-color: #efefef;
`;
const Row = native_1.default.TouchableOpacity `
  width: 100%;
  flex-direction: column;
`;
const FlatListText = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  justify-content: center;
  font-family: Roboto-Regular;
  text-align: center;
  text-transform: capitalize;
  font-size: 14;
  color: ${(props) => (props.isSelected ? '#fff' : '#000')};
`;
const SelectedItem = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  justify-content: center;
  font-family: Roboto-Regular;
  text-align: center;
  font-size: 15;
`;
const ResultNotFoundText = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  justify-content: center;
  font-family: Roboto-Regular;
  text-align: center;
  font-size: 15;
  color: grey;
`;
const CardPicker = native_1.default.View `
  width: 95%;
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: center;
  padding-top: 15px;
  padding-horizontal: 15px;
`;
const Container = native_1.default.View `
  width: 100%;
  height: 350px;
`;
const ItemButton = native_1.default.TouchableOpacity `
  height: 50px;
  width: 90%;
  align-self: center;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 10px;
  background-color: ${(props) => (props.isSelected ? props.theme.mediumGreen : '#fff')};
  border-radius: 5px;
  elevation: 5;
`;
//# sourceMappingURL=ModalSearchBox.jsx.map