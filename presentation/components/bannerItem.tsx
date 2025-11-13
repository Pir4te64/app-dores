import { useState } from 'react';
import { TouchableOpacity, Image, Dimensions } from 'react-native';

import { Banner } from '~/domain/entities/bannerEntity';
import { WebViewComponent } from '~/presentation/screens/webview';

const { width } = Dimensions.get('window');

export const BannerItem = ({ item }: { item: Banner }) => {
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const openUrl = () => setShowWebView(true);

  return (
    <TouchableOpacity
      className="overflow-hidden rounded-xl"
      onPress={openUrl}
      activeOpacity={0.8}>
      <Image
        source={{ uri: item.imagen }}
        style={{
          width: width - 32,
          height: 140,
          borderRadius: 12,
        }}
        resizeMode="cover"
      />
      <WebViewComponent
        url={item.link}
        visible={showWebView}
        onClose={() => setShowWebView(false)}
      />
    </TouchableOpacity>
  );
};
