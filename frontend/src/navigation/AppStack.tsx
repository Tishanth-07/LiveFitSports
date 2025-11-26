import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import MatchesScreen from "../screens/MatchesScreen";
import MatchDetailsScreen from "../screens/MatchDetailsScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import WorkoutsScreen from "../screens/WorkoutsScreen";
import WorkoutDetailsScreen from "../screens/WorkoutDetailsScreen";
import HealthTipsScreen from "../screens/HealthTipsScreen";
import HealthTipDetailsScreen from "../screens/HealthTipDetailsScreen";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Matches" component={MatchesScreen} />
      <Stack.Screen name="MatchDetails" component={MatchDetailsScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Workouts" component={WorkoutsScreen} />
      <Stack.Screen name="HealthTips" component={HealthTipsScreen} />
      <Stack.Screen name="HealthTipDetails" component={HealthTipDetailsScreen} />
      <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} />
    </Stack.Navigator>
  );
}
