import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {APP_ID, REGION} from './src/config/common';

AppRegistry.registerComponent(appName, () => App);

const appSetting = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(REGION)
  .autoEstablishSocketConnection(true)
  .build();
CometChat.init(APP_ID, appSetting).then(
  () => {
    console.log('Initialization completed successfully');
  },
  error => {
    console.log('Initialization failed with error:', error);
  },
);
