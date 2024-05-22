import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { MakeLoginPageFactory } from "src/main/factories/pages/login/login-page-factory";
import { MakeGetOneStockPageFactory } from "src/main/factories/pages/stock/get-one-stock-page-factory";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={MakeLoginPageFactory} />
        <Stack.Screen name="Stock" component={MakeGetOneStockPageFactory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
