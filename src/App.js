/* eslint-disable no-shadow */
import {CometChat} from '@cometchat-pro/react-native-chat';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Alert, TextInput, View, Button} from 'react-native';
import {AUTH_KEY} from './config/common';

const App = () => {
  const [sessionID, setSessionID] = useState('agiq-rbdm-frto');
  const [userID, setUserID] = useState('SUPERHERO2');
  const [loading, setLoading] = useState('Join');
  const [user, setUser] = useState(null);

  const onJoinClick = () => {
    if (loading) {
      return;
    }
    if (!userID || !sessionID) {
      Alert.alert('All inputs are required.');
    }
    setLoading(true);
    CometChat.login(userID, AUTH_KEY)
      .then(loggedInUser => {
        setTimeout(() => {
          setLoading(false);
          setUser(loggedInUser);
        }, 500);
      })
      .catch(err => {
        if (err.code === 'ERR_UID_NOT_FOUND') {
          const newUser = new CometChat.User(userID);
          newUser.setName(userID);
          CometChat.createUser(newUser, AUTH_KEY).then(() => {
            onJoinClick();
          });
        } else {
          setLoading(false);
          Alert.alert(err.message);
        }
      });
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      CometChat.logout()
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }, 500);
  }, []);

  if (user) {
    const callListener = new CometChat.OngoingCallListener({
      onUserJoined: user => {
        console.log('-0 user joined:', user);
      },
      onUserLeft: user => {
        console.log('-0 user left:', user);
      },
      onUserListUpdated: userList => {
        console.log('-0 user list:', userList);
      },
      onCallEnded: call => {
        console.log('-0 Call ended:', call);
        CometChat.logout().then(() => {
          setUser(null);
        });
      },
      onError: error => {
        console.log('-0 Call Error: ', error);
      },
      onAudioModesUpdated: audioModes => {
        console.log('-0 audio modes:', audioModes);
      },
      onYouJoined: (ev) => {
        console.log("-0 onYouJoined", ev);

      },
      onYouLeft: (ev) => {
        console.log("-0 onYouLeft", ev);

      }
      
    });

    let callController = CometChat.CallController.getInstance();
    const callSettings = new CometChat.CallSettingsBuilder()
      .setSessionID(sessionID)
      .setCallEventListener(callListener)
      // .enableDefaultLayout(false)
      // .showEndCallButton(false)
      // .showPauseVideoButton(false)
      // .showMuteAudioButton(false)
      // .showSwitchCameraButton(false)
      // .showAudioModeButton(false)
      .setIsAudioOnlyCall(true)
      // .setMode(CometChat.CALL_MODE.DEFAULT)
      // .startWithAudioMuted(true)
      // .startWithVideoMuted(true)
      // .setDefaultAudioMode("HEADPHONES")
      // .showSwitchToVideoCallButton(true)
      // .showSwitchToVideoCallButton(true)
      // .setAvatarMode("FULLSCREEN")
      .showRecordingButton(true)
      .build();
      // setTimeout(() => {
      // }, 10000);
    return (
      <View style={styles.callingContainer}>
        <CometChat.CallingComponent callsettings={callSettings} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={sessionID}
        onChangeText={setSessionID}
        placeholder="Session ID"
        style={styles.input}
      />
      <TextInput
        value={userID}
        onChangeText={setUserID}
        placeholder="User ID"
        style={styles.input}
      />
      <Button testID='join-btn' title={loading ? 'Loading...' : 'Join'} onPress={onJoinClick} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '30%',
    paddingHorizontal: 10,
  },
  callingContainer: {
    flex: 1,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 15,
  },
});

export default App;
