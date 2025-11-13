import { View, Text, ScrollView, SafeAreaView } from 'react-native';

import termsData from '~/assets/terms.json';
import { AccordionItem } from '~/presentation/components/accordion';

export function Terms() {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="mb-5">
          <Text className="text-center text-xl font-bold text-gray-800">{termsData.title}</Text>
        </View>

        {termsData.sections.map((section, index) => (
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
      </ScrollView>
    </SafeAreaView>
  );
}
