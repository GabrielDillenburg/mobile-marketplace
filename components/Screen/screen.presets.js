import color from '../../constants/Colors';

/**
 * All screen keyboard offsets.
 */
export const offsets = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 32,
};

/**
 * All the variations of screens.
 */
export const presets = {
  /**
   * No scrolling. Suitable for full-screen carousels and components
   * which have built-in scrolling like FlatList.
   */
  fixed: {
    outer: {
      backgroundColor: color.white,
      flex: 1,
      height: '100%',
    },
    inner: {
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      height: '100%',
      width: '100%',
    },
  },

  /**
   * Scrolls. Suitable for forms or other things requiring a keyboard.
   *
   * Pick this one if you don't know which one you want yet.
   */
  scroll: {
    outer: {
      backgroundColor: color.white,
      flex: 1,
      height: '100%',
    },
    inner: { justifyContent: 'flex-start', alignItems: 'stretch' },
  },
};

/**
 * Is this preset a non-scrolling one?
 *
 * @param preset The preset to check
 */
export function isNonScrolling(preset) {
  // any of these things will make you scroll
  return !preset || !presets[preset] || preset === 'fixed';
}
