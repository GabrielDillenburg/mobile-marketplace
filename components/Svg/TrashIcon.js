import React from 'react';
import Svg, { Path } from 'react-native-svg';
import rem from '../../utils/rem';

const TrashIcon = ({ size = rem(24) }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#545859"/>
    </Svg>
);

export default TrashIcon;
