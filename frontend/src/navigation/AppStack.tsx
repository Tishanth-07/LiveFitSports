import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import MatchesScreen from "../screens/MatchesScreen";
import MatchDetailsScreen from "../screens/MatchDetailsScreen";
import FavoritesScreen from "../screens/FavoritesScreen";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Matches" component={MatchesScreen} />
      <Stack.Screen name="MatchDetails" component={MatchDetailsScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
    </Stack.Navigator>
  );
}
