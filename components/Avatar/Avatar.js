import React from 'react';
import { Image, View } from 'react-native';
import PropTypes from 'prop-types';
import Svg, { Path, Mask, Circle, G } from 'react-native-svg';

import rem from '../../utils/rem';
import Colors from '../../constants/Colors';
/**
 * @file DSM component returning user avatar, with default image (empty state).
 */

const Avatar = (props) => {
  const { source, style = {}, size } = props;

  const avatarStyle = [
    {
      backgroundColor: Colors.white,
      borderRadius: rem(size),
      height: rem(size),
      width: rem(size),
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    style,
  ];

  if (source?.length) {
    return <Image source={{ uri: source }} style={avatarStyle} />;
  }

  return (
    <View style={avatarStyle}>
      <Svg
        width={rem(size * 0.72)}
        height={rem(size * 0.72)}
        viewBox="0 0 47 47"
        fill="none"
        style={{ marginTop: rem(16) }}
      >
        <Path
          d="M23.5 23.5C29.8538 23.5 35 18.3538 35 12C35 5.64625 29.8538 0.5 23.5 0.5C17.1462 0.5 12 5.64625 12 12C12 18.3538 17.1462 23.5 23.5 23.5ZM23.5 29.25C15.8237 29.25 0.5 33.1025 0.5 40.75V46.5H46.5V40.75C46.5 33.1025 31.1763 29.25 23.5 29.25Z"
          fill="#545859"
        />
      </Svg>
    </View>
  );
};

Avatar.propTypes = {
  source: PropTypes.node,
  style: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
  size: PropTypes.number.isRequired,
};

Avatar.defaultProps = { source: null, style: {} };

export default Avatar;
