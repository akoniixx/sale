import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { colors } from '../../assets/colors/colors';
import icons from '../../assets/icons';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

export type SuggestionListType = {
  id: string;
  title: string;
};
interface Props {
  onSearch: (value: string | undefined | null) => void;
  getSuggestions: (value: string) => Promise<SuggestionListType[]>;
  placeholder?: string;
  emptyText?: string;
}
export default function AutoCompleteSearch({
  onSearch,
  getSuggestions,
  placeholder = 'ค้นหา',
  emptyText = 'ไม่พบที่ค้นหา',
}: Props) {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const [loading, setLoading] = React.useState<boolean>(false);
  const [suggestionList, setSuggestionList] = React.useState<
    SuggestionListType[]
  >([]);
  const refController = React.useRef<any>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery !== null) {
        try {
          setLoading(true);
          const suggestions = await getSuggestions(searchQuery);
          setSuggestionList(suggestions);
          setLoading(false);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSuggestions();
  }, [searchQuery, getSuggestions]);
  return (
    <View>
      <View
        style={{
          borderWidth: 1,
          borderColor: isFocused ? colors.primary : colors.border1,
          borderRadius: 6,
        }}>
        <AutocompleteDropdown
          controller={controller => (refController.current = controller)}
          loading={loading}
          onFocus={() => {
            setIsFocused(true);
          }}
          useFilter={false}
          inputContainerStyle={{ backgroundColor: 'transparent' }}
          showChevron={false}
          clearOnFocus={false}
          closeOnBlur={true}
          closeOnSubmit={true}
          ClearIconComponent={
            <Image
              source={icons.close}
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
              }}
            />
          }
          debounce={500}
          onSelectItem={v => {
            onSearch(v?.title);
            setSearchQuery(v?.title || '');
          }}
          onChangeText={value => {
            setSearchQuery(value);
          }}
          suggestionsListMaxHeight={Dimensions.get('window').height * 0.3}
          dataSet={suggestionList}
          suggestionsListTextStyle={{ borderBottomWidth: 0 }}
          onBlur={() => {
            setIsFocused(false);
          }}
          onClear={() => {
            setSearchQuery('');
          }}
          emptyResultText={emptyText}
          LeftComponent={
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 8,
              }}>
              <Image
                source={icons.iconSearchGrey}
                style={{
                  width: 24,
                  height: 24,
                }}
                resizeMode="contain"
              />
            </View>
          }
          ItemSeparatorComponent={<View style={{ height: 0 }} />}
          textInputProps={{
            placeholder: placeholder,
            returnKeyType: 'search',
            style: { borderRadius: 8 },
            // onChangeText: value => {
            //   setSearchQuery(value);
            //   refController.current?.setInputText(value);
            // },
            // value: searchQuery,
          }}
          rightButtonsContainerStyle={{ backgroundColor: 'transparent' }}
        />
      </View>
    </View>
  );
}
