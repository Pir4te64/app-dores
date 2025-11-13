import { ChevronUp, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

interface AccordionItemProps {
  title: string;
  content: React.ReactNode;
}

export const AccordionItem = ({ title, content }: AccordionItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="mb-2 overflow-hidden rounded-lg border border-gray-300">
      <TouchableOpacity
        className="flex flex-row items-center justify-between bg-gray-200 p-4"
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}>
        <Text className="flex-1 text-lg font-semibold text-gray-800">{title}</Text>
        {expanded ? <ChevronUp size={20} color="#333" /> : <ChevronDown size={20} color="#333" />}
      </TouchableOpacity>
      {expanded && <View className="bg-white p-4">{content}</View>}
    </View>
  );
};
