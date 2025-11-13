import Constants from 'expo-constants';
import { Modal } from 'react-native';
import WebView from 'react-native-webview';

export function WebViewComponent({
  url,
  visible,
  onClose,
}: {
  url: string;
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <WebView
        source={{ uri: url }}
        onError={onClose}
        style={{ marginTop: Constants.statusBarHeight }}
      />
    </Modal>
  );
}
