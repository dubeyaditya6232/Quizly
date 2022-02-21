/* import 'react-native-gesture-handler'; */
import { LogBox } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { AppearanceProvider, useColorScheme } from "react-native-appearance";
import MyStack from './navigation';
LogBox.ignoreLogs(['Setting a timer']);


export default function App() {
  const colorScheme = useColorScheme();
  
  return (
    <AppearanceProvider>
      <NavigationContainer theme={colorScheme==='dark'?DarkTheme:DefaultTheme}>
        <MyStack />
      </NavigationContainer>
    </AppearanceProvider>
  );
}

