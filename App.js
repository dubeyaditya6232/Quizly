/* import 'react-native-gesture-handler'; */
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MyStack from './navigation';
LogBox.ignoreLogs(['Setting a timer']);

export default function App() {

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

