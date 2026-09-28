import React from 'react';
import Svg, { Circle, G, Path } from 'react-native-svg';

// A monochrome (no-color) line-art cat doodle, drawn as white strokes
// so it sits quietly in the blue-violet hero background.
const CatDoodle = React.memo(function CatDoodle({
  size = 80,
  opacity = 0.15,
  rotate = '0deg',
  style,
  pointerEvents = 'none', // decorative — never block touches underneath
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      pointerEvents={pointerEvents}
      style={[style, { opacity, transform: [{ rotate }] }]}
    >
      <G stroke="#FFFFFF" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* ears */}
        <Path d="M29 43 L21 13 L47 32" />
        <Path d="M71 43 L79 13 L53 32" />
        {/* head */}
        <Circle cx={50} cy={57} r={26} />
        {/* eyes */}
        <Circle cx={41} cy={54} r={3.4} />
        <Circle cx={59} cy={54} r={3.4} />
        {/* nose */}
        <Path d="M46 65 L54 65 L50 70 Z" />
        {/* mouth */}
        <Path d="M50 70 Q50 74 44 73 M50 70 Q50 74 56 73" />
        {/* whiskers */}
        <Path d="M14 59 L36 56" />
        <Path d="M12 67 L36 63" />
        <Path d="M86 59 L64 56" />
        <Path d="M88 67 L64 63" />
      </G>
    </Svg>
  );
});

export default CatDoodle;