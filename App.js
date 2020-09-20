/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
// import LiveAudioStream from 'react-native-live-audio-stream';
// import { Buffer } from 'buffer';
// import AudioBuffer from 'audio-buffer'
// import detectPitch from 'detect-pitch'
// import AudioContext from 'audio-context';

import Recording from "react-native-recording";
import PitchFinder from 'pitchfinder'

const audioOptions = {
  sampleRate: 44100,  // default is 44100 
  channels: 1,        // 1 or 2, default 1
  bitsPerSample: 16,  // 8 or 16, default 16
};

const middleA = 440;
const semitone = 69;
const noteStrings = [
  "C",
  "C♯",
  "D",
  "D♯",
  "E",
  "F",
  "F♯",
  "G",
  "G♯",
  "A",
  "A♯",
  "B",
];

const App: () => React$Node = () => {
  let pitchfinder;
  const sampleRate = 22050;
  const bufferSize = 2048;
  const [note, setNote] = useState([]);

  const getNote = (frequency) => {
    const note = 12 * (Math.log(frequency / middleA) / Math.log(2));
    return Math.round(note) + semitone;
  }


  useEffect(() => {
    pitchfinder = PitchFinder.YIN({sampleRate});
    Recording.init({
      sampleRate,
      bufferSize,
    });
    const listener = Recording.addRecordingEventListener((data) => {
      const frequency = pitchfinder(data);
      if (frequency) {
        const note = getNote(frequency)
        setNote(noteStrings[note % 12])
      }
    });
  
  Recording.start();

  return () => listener.remove();
  }, [])



  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Pitch</Text>
              <Text style={styles.sectionTitle}>{note}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  note: {
    fontSize: 8
  },
  num: {
    flexGrow: 1
  },
  a: {
    flexGrow: 1,
  }
});

export default App;
