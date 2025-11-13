import { View, Text, ScrollView, SafeAreaView } from 'react-native';

import privacyData from '~/assets/privacy.json';
import { AccordionItem } from '~/presentation/components/accordion';

interface Subsection {
  title: string;
  content: string[];
}

interface Section {
  title: string;
  content?: string | string[];
  subsections?: Subsection[];
}

interface PrivacyData {
  title: string;
  sections: Section[];
  footer?: {
    content: string;
    lastUpdate: string;
  };
}

export function Privacy() {
  const typedPrivacyData = privacyData as PrivacyData;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="mb-5">
          <Text className="text-center text-xl font-bold text-gray-800">
            {typedPrivacyData.title}
          </Text>
        </View>

        {typedPrivacyData.sections.map((section, index) => (
          <AccordionItem
            key={index}
            title={section.title}
            content={
              <View>
                {typeof section.content === 'string' ? (
                  <Text className="mb-2 text-sm leading-5 text-gray-600">{section.content}</Text>
                ) : section.content ? (
                  section.content.map((item, itemIndex) => (
                    <Text key={itemIndex} className="mb-2 text-sm leading-5 text-gray-600">
                      • {item}
                    </Text>
                  ))
                ) : null}

                {section.subsections?.map((subsection, subIndex) => (
                  <View key={subIndex} className="mt-3">
                    <Text className="mb-1 text-base font-semibold text-gray-700">
                      {subsection.title}
                    </Text>
                    {subsection.content.map((item, contentIndex) => (
                      <Text key={contentIndex} className="mb-2 text-sm leading-5 text-gray-600">
                        • {item}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            }
          />
        ))}

        {typedPrivacyData.footer && (
          <View className="mt-6 border-t border-gray-200 pt-4">
            <Text className="mb-3 text-sm leading-5 text-gray-600">
              {typedPrivacyData.footer.content}
            </Text>
            <Text className="text-xs italic text-gray-500">
              {typedPrivacyData.footer.lastUpdate}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
