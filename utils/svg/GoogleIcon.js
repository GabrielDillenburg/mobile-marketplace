import * as React from 'react';
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg';

function SvgComponent({ width = 24, height = 24, ...props }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <Path fill="url(#prefix__pattern0)" d="M0 0h24v24H0z" />
      <Defs>
        <Pattern
          id="prefix__pattern0"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#prefix__image0" transform="scale(.01563)" />
        </Pattern>
        <Image
          id="prefix__image0"
          width={64}
          height={64}
          xlinkHref="data:image/png;base64,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"
        />
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
