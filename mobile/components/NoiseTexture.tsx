import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Rect, Pattern, Circle } from 'react-native-svg';

export default function NoiseTexture() {
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none" className="opacity-20">
            <Svg height="100%" width="100%">
                <Defs>
                    <Pattern id="noise" width="4" height="4" patternUnits="userSpaceOnUse">
                        <Rect x="0" y="0" width="1" height="1" fill="#333" />
                        <Rect x="2" y="2" width="1" height="1" fill="#333" />
                    </Pattern>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#noise)" />
            </Svg>
        </View>
    );
}
