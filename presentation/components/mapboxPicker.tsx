import React from 'react';
import { Modal, View, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import WebView from 'react-native-webview';
import { X } from 'lucide-react-native';

interface MapboxPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (coords: { latitude: number; longitude: number }) => void;
  initialCoords?: { latitude: number; longitude: number };
}

export const MapboxPicker = ({ visible, onClose, onSelect, initialCoords }: MapboxPickerProps) => {
  const token = (process.env as any).EXPO_PUBLIC_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN';

  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
      <style>
        html, body { height: 100%; margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; margin: 0; padding: 0; }
        .marker { width: 30px; height: 30px; border-radius: 15px; background: #DA2919; border: 2px solid white; }
        #warning { position: absolute; top: 8px; left: 8px; right: 8px; z-index: 9999; background: rgba(255, 230, 0, 0.95); color: #000; padding: 8px 12px; border-radius: 6px; font-family: system-ui, sans-serif; font-size: 14px; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <div id="warning" style="display:none">Configura EXPO_PUBLIC_MAPBOX_TOKEN para ver el mapa.</div>
      <script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
      <script>
        (function(){
          mapboxgl.accessToken = '${token}';
          try {
            if (!mapboxgl.accessToken || mapboxgl.accessToken === 'YOUR_MAPBOX_TOKEN') {
              document.getElementById('warning').style.display = 'block';
            }
          } catch(e){}
          var center = [${initialCoords?.longitude ?? -55.795168}, ${initialCoords?.latitude ?? -27.467631}];
          var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: center,
            zoom: 14
          });

          var marker = new mapboxgl.Marker({ color: '#DA2919' }).setLngLat(center).addTo(map);

          map.on('click', function(e){
            var lngLat = e.lngLat;
            marker.setLngLat(lngLat);
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: lngLat.lat, longitude: lngLat.lng }));
            }
          });

          map.addControl(new mapboxgl.NavigationControl());
          map.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }));

          map.on('load', function(){
            try {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ mapLoaded: true }));
              }
            } catch {}
          });

          map.on('error', function(e){
            try {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ mapboxError: e && e.error && e.error.message ? e.error.message : 'Unknown Mapbox error' }));
              }
            } catch {}
          });
        })();
      </script>
    </body>
  </html>`;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.latitude && data.longitude) {
        onSelect({ latitude: data.latitude, longitude: data.longitude });
      }
    } catch {}
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-between p-3 border-b border-gray-200">
          <Text className="text-lg font-bold">Seleccionar dirección en Mapbox</Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <X color="black" size={20} />
          </TouchableOpacity>
        </View>
        <WebView
          source={{ html }}
          onMessage={handleMessage}
          style={{ flex: 1 }}
          originWhitelist={["*"]}
          mixedContentMode="always"
        />
      </SafeAreaView>
    </Modal>
  );
};