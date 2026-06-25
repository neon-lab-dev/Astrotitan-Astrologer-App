
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import { Provider} from 'react-redux';
import { store } from './redux/store';
import ScreenWrapper from './components/layout/ScreenWrapper';
// import GlobalBottomSheet from './components/reusable/GlobalBottomSheet/GlobalBottomSheet';
// import GlobalModal from './components/reusable/GlobalModal/GlobalModal';
import GlobalModal from './components/reusable/GlobalModal/GlobalModal';
import GlobalBottomSheet from './components/reusable/GlobalBottomSheet/GlobalBottomSheet';
import { NavigationContainer } from '@react-navigation/native';
import { DevResetPanel } from './components/dev/DevResetPanel';
import { useEffect } from 'react';
import { loadAuth } from './utils/loadAuth';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  // const [appReady, setAppReady] = useState(false);
  useEffect(() => {
    async function prepareApp() {
      try {
        /* LOAD AUTH */
        await loadAuth();

      } catch (error) {
        console.log("APP INIT ERROR:", error);
      } finally {
        // setAppReady(true);
      }
    }

    prepareApp();
  }, []);
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={"#EDDEAD"} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
      
          <NavigationContainer>
            <ScreenWrapper>
              <RootNavigator />
            </ScreenWrapper>

            <GlobalBottomSheet />
            <GlobalModal />
            {/* <DevResetPanel /> */}
          </NavigationContainer>
   
      </GestureHandlerRootView>
    </Provider>
  );
}


export default App;
