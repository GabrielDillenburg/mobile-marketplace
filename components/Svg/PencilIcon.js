import React from 'react';
import Svg, { Path } from 'react-native-svg';
import rem from '../../utils/rem';

const PencilIcon = ({ size = rem(16) }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M12.2424 6.58589L6.27044 12.5589C5.95009 12.879 5.5488 13.1061 5.10944 13.2159L2.81844 13.7889C2.73456 13.81 2.64664 13.809 2.56326 13.786C2.47988 13.763 2.4039 13.7188 2.34274 13.6576C2.28157 13.5964 2.23732 13.5204 2.21431 13.4371C2.1913 13.3537 2.19031 13.2658 2.21144 13.1819L2.78444 10.8919C2.89436 10.4521 3.1218 10.0504 3.44244 9.72988L9.41344 3.75689L12.2424 6.58589ZM13.6574 2.34389C14.0324 2.71894 14.243 3.22756 14.243 3.75789C14.243 4.28821 14.0324 4.79683 13.6574 5.17189L12.9494 5.87788L10.1204 3.04989L10.8284 2.34389C11.0142 2.15808 11.2347 2.01069 11.4774 1.91013C11.7201 1.80957 11.9802 1.75781 12.2429 1.75781C12.5057 1.75781 12.7658 1.80957 13.0085 1.91013C13.2512 2.01069 13.4717 2.15808 13.6574 2.34389Z"
      fill="#434647"
    />
  </Svg>
);

export default PencilIcon;