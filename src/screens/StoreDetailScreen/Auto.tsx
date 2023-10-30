import Autocomplete from 'react-native-autocomplete-input';
import React, { useEffect, useState } from 'react';
import { SWAPI, Movies, Movie, filterMovies } from '../../../swapi';

import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView
} from 'react-native';

function StarWarsMoveFinder(): React.ReactElement {
  const [allMovies, setAllMovies] = useState<Movies>([]);
  const [query, setQuery] = useState('');
  const isLoading = !allMovies.length;
  const queriedMovies = React.useMemo(
    () => filterMovies(allMovies, query),
    [allMovies, query]
  );

  const suggestions: Movies = React.useMemo(
    () =>
      queriedMovies.length === 1 && queriedMovies[0].compareTitle(query)
        ? [] // Close suggestion list in case movie title matches query
        : queriedMovies,
    [queriedMovies, query]
  );

  const placeholder = isLoading
    ? 'Loading data...'
    : 'Enter Star Wars film title';

  useEffect(() => {
    (async function fetchMovies() {
      setAllMovies(await SWAPI.getAllMovies());
    })();
  }, []);

  return (
   
      <View style={styles.autocompleteContainer}>
        <Autocomplete
          editable={!isLoading}
          autoCorrect={false}
          data={suggestions}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          flatListProps={{
            keyboardShouldPersistTaps: 'always',
            keyExtractor: (movie: Movie) => movie.episodeId,
            renderItem: ({ item }) => (
              <TouchableOpacity onPress={() => setQuery(item.title)}>
                <Text >{item.title}</Text>
              </TouchableOpacity>
            ),
          }}
        />
      </View>

     
    
  );
}

const styles = StyleSheet.create({
  
  autocompleteContainer: {
    // Hack required to make the autocomplete
    // work on Andrdoid
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 99,
    padding: 5,
  },
});

export default StarWarsMoveFinder;
