import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

// Start NFC
NfcManager.start();

export default function HomeScreen() {
  useEffect(() => {
    NfcManager.isSupported()
      .then((supported) => {
        if (!supported) {
          Alert.alert('NFC not supported');
        }
      })
      .catch(() => Alert.alert('Error checking NFC support'));
  }, []);

  async function readTag() {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      const payload = tag?.ndefMessage?.[0]?.payload;
      if (payload) {
        const text = Ndef.text.decodePayload(Uint8Array.from(payload));
        Alert.alert('Tag Content', text);
      } else {
        Alert.alert('No NDEF data found');
      }
    } catch (err) {
      console.warn(err);
      Alert.alert('Failed to read tag');
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>NFC Demo</Text>
      <Button title="Scan NFC Tag" onPress={readTag} />
    </View>
  );
}
