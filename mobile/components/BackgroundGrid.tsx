import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, Rect, Pattern, Line } from 'react-native-svg';

export default function BackgroundGrid() {
    const { width, height } = Dimensions.get('window');

    return (
        <View style={styles.container} pointerEvents="none">
            <Svg height="100%" width="100%">
                <Defs>
                    <Pattern
                        id="grid"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                    >
                        <Rect x="0" y="0" width="40" height="40" fill="transparent" stroke="#333" strokeOpacity="0.5" strokeWidth="1" />
                    </Pattern>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />
            </Svg>

            {/* Vignette / Mask for depth */}
            <View style={styles.mask} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0, // Rendered first, so it's behind content. -10 might hide it on some Android versions.
        backgroundColor: '#050505',
    },
    mask: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
});
