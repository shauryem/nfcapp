// utils/nfc.ts
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { Alert } from 'react-native';

export async function initNfc() {
  try {
    await NfcManager.start();
    const supported = await NfcManager.isSupported();
    if (!supported) {
      Alert.alert('NFC not supported on this device');
    }
  } catch (e) {
    console.warn(e);
    Alert.alert('Error initializing NFC');
  }
}

export async function writeNfcTag(data: string) {
  try {
    // Prompt the system NFC dialog
    await NfcManager.requestTechnology(NfcTech.Ndef, {
      alertMessage: 'Hold your device near the NFC tag to write',
    });

    // Encode the text record and write
    const bytes = Ndef.encodeMessage([Ndef.textRecord(data)]);
    if (bytes) {
      await NfcManager.writeNdefMessage(bytes);
      Alert.alert('Success', 'Habit ID written to NFC tag!');
    }
  } catch (e) {
    console.warn(e);
    Alert.alert('Failed to write NFC tag');
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}
