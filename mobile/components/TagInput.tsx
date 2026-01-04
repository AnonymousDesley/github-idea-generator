import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react-native';

interface TagInputProps {
    label: string;
    placeholder?: string;
    tags: string[];
    onChange: (tags: string[]) => void;
    suggestions?: string[];
}

export default function TagInput({ label, placeholder, tags, onChange, suggestions = [] }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredSuggestions = suggestions.filter(s =>
        s.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(s)
    );

    const addTag = (tag: string) => {
        const newTag = tag.trim();
        if (newTag && !tags.includes(newTag)) {
            onChange([...tags, newTag]);
            setInputValue('');
        }
    };

    const removeTag = (indexToRemove: number) => {
        onChange(tags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <View className="space-y-2 z-10 mb-4">
            <View className="flex-row justify-between items-center">
                <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                    {label}
                </Text>
                {suggestions.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setShowSuggestions(!showSuggestions)}
                        className="flex-row items-center gap-1"
                    >
                        <Text className="text-[10px] text-zinc-600 font-mono">
                            {showSuggestions ? 'HIDE OPTIONS' : 'SHOW OPTIONS'}
                        </Text>
                        {showSuggestions ? <ChevronUp size={12} color="#52525b" /> : <ChevronDown size={12} color="#52525b" />}
                    </TouchableOpacity>
                )}
            </View>

            <View className="flex-row flex-wrap gap-2 border border-zinc-800 bg-black/30 p-3 rounded-xl">
                {tags.map((tag, index) => (
                    <View key={index} className="flex-row items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg">
                        <Text className="text-white text-xs font-mono">{tag}</Text>
                        <TouchableOpacity onPress={() => removeTag(index)}>
                            <X size={10} color="#f87171" />
                        </TouchableOpacity>
                    </View>
                ))}

                <TextInput
                    value={inputValue}
                    onChangeText={(text) => {
                        setInputValue(text);
                        if (text.length > 0) setShowSuggestions(true);
                    }}
                    onSubmitEditing={() => addTag(inputValue)}
                    placeholder={tags.length === 0 ? placeholder : 'Add more...'}
                    placeholderTextColor="#3f3f46"
                    className="flex-1 text-white font-mono text-sm min-w-[80px] py-1"
                />
            </View>

            {/* Suggestions Overlay */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <View className="bg-zinc-900 border border-zinc-800 mt-2 max-h-48 rounded-xl shadow-2xl overflow-hidden">
                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                        <View className="p-2 flex-row flex-wrap gap-2">
                            {filteredSuggestions.map((suggestion) => (
                                <TouchableOpacity
                                    key={suggestion}
                                    onPress={() => addTag(suggestion)}
                                    className="bg-black border border-zinc-800 px-3 py-2 rounded-lg flex-row items-center gap-2 active:bg-zinc-800"
                                >
                                    <Text className="text-zinc-400 font-mono text-xs">{suggestion}</Text>
                                    <Plus size={10} color="#6366f1" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
    );
}
