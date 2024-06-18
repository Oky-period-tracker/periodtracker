import * as React from "react";
import { StyleSheet, ScrollView, TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Modal } from "../../../components/Modal";
import { Hr } from "../../../components/Hr";
import { Text } from "../../../components/Text";
import { WheelPicker } from "../../../components/WheelPicker";
import { helpCenterAttributes } from "../../../data/helpCenter";
import { Checkbox } from "../../../components/Checkbox";
import { countries, provinces } from "../../../data/data";
import { Vr } from "../../../components/Vr";

type HelpFiltersModalProps = {
  visible: boolean;
  toggleVisible: () => void;
  onConfirm: () => void;
};

type FilterSection = "region" | "subregion" | "attributes";

const tabs: { section: FilterSection; icon: string }[] = [
  { section: "region", icon: "map" },
  { section: "subregion", icon: "map-marker" },
  { section: "attributes", icon: "tags" },
];

export const HelpFiltersModal = ({
  visible,
  toggleVisible,
  onConfirm,
}: HelpFiltersModalProps) => {
  const [section, setSection] = React.useState<FilterSection>("attributes");

  // TODO: redux state
  const locale = "en";

  const [country, setCountry] = React.useState("");
  const [province, setProvince] = React.useState("");

  const countryOptions = React.useMemo(() => {
    return Object.entries(countries).map(([key, item]) => ({
      label: item[locale],
      value: key,
    }));
  }, [countries, locale]);

  const provinceOptions = React.useMemo(() => {
    const countryCode = country ? country : null;

    const filteredProvinces = provinces.filter(
      ({ code, uid }) => code === countryCode || uid === 0
    );

    return filteredProvinces.map((item) => ({
      label: item[locale],
      value: item.uid.toString(),
    }));
  }, [country, provinces, locale]);

  const provinceOption = React.useMemo(() => {
    return provinceOptions.find((item) => item.value === province);
  }, [provinceOptions, province]);

  const countryDisplay = countries?.[country]?.[locale] ?? "";
  const provinceDisplay = provinceOption?.label ?? "";

  const countryIndex = countryOptions.findIndex(
    (item) => item.label === countryDisplay
  );
  const provinceIndex = provinceOptions.findIndex(
    (item) => item.label === provinceDisplay
  );
  const [selectedCountryIndex, setSelectedCountryIndex] = React.useState(
    Math.max(countryIndex, 0)
  );
  const [selectedProvinceIndex, setSelectedProvinceIndex] = React.useState(
    Math.max(provinceIndex, 0)
  );

  const [selectedAttributes, setSelectedAttributes] = React.useState<number[]>(
    []
  );

  const clearFilters = () => {
    setCountry("");
    setProvince("");
    setSelectedAttributes([]);
    toggleVisible();
  };

  const hasFiltersApplied = Boolean(
    country || province || selectedAttributes.length
  );

  return (
    <Modal visible={visible} toggleVisible={toggleVisible} style={styles.modal}>
      <View style={styles.tabs}>
        {tabs.map((tab, i) => {
          const isSelected = tab.section === section;
          const isLast = i === tabs.length - 1;
          const onPress = () => {
            setSection(tab.section);
          };
          console.log("*** isLast", i, isLast);
          return (
            <React.Fragment key={tab.section}>
              <TouchableOpacity
                onPress={onPress}
                style={[styles.tab, isSelected && styles.selectedTab]}
              >
                <FontAwesome
                  size={24}
                  // @ts-expect-error TODO: create type for FA icon name
                  name={tab.icon}
                  color={isSelected ? "#000" : "#B7B6B6"}
                />
              </TouchableOpacity>
              {!isLast && <Vr />}
            </React.Fragment>
          );
        })}
      </View>

      {section === "region" && (
        <View style={styles.modalBody}>
          <Text>Country</Text>
          <WheelPicker
            selectedIndex={selectedCountryIndex}
            options={countryOptions}
            onChange={setSelectedCountryIndex}
            resetDeps={[visible]}
          />
        </View>
      )}

      {section === "subregion" && (
        <View style={styles.modalBody}>
          <Text>Province</Text>
          <WheelPicker
            selectedIndex={selectedProvinceIndex}
            options={provinceOptions}
            onChange={setSelectedProvinceIndex}
            resetDeps={[visible]}
          />
        </View>
      )}

      {section === "attributes" && (
        <ScrollView contentContainerStyle={styles.modalBody}>
          <Text>Attributes</Text>
          {helpCenterAttributes.map((attribute) => {
            const checked = selectedAttributes.includes(attribute.id);
            const onPress = () => {
              setSelectedAttributes((current) => {
                if (checked) {
                  return current.filter((item) => item !== attribute.id);
                }
                return [...current, attribute.id];
              });
            };

            return (
              <Checkbox
                key={`attribute-${attribute.id}`}
                label={`${attribute.emoji} ${attribute.name}`}
                onPress={onPress}
                checked={checked}
                size={"small"}
              />
            );
          })}
        </ScrollView>
      )}

      <Hr />
      <View style={styles.buttons}>
        <TouchableOpacity onPress={clearFilters} style={styles.confirm}>
          <Text style={styles.confirmText}>Clear all</Text>
        </TouchableOpacity>
        <Vr />
        <TouchableOpacity onPress={onConfirm} style={styles.confirm}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
  },
  modalBody: {
    paddingVertical: 24,
    paddingHorizontal: 48,
  },
  tabs: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tab: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    textAlign: "center",
  },
  selectedTab: {
    backgroundColor: "#f0f0f0",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confirm: {
    padding: 24,
    flex: 1,
  },
  confirmText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
