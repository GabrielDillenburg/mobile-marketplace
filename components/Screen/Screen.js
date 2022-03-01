import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isNonScrolling, offsets, presets } from './screen.presets';

const isIos = Platform.OS === 'ios';

function ScreenWithoutScrolling(props) {
  const {
    style: _style,
    backgroundColor,
    unsafe,
    keyboardOffset,
    statusBar,
    children,
  } = props;

  const insets = useSafeAreaInsets();
  const preset = presets.fixed;
  const style = _style || {};
  const backgroundStyle = backgroundColor ? { backgroundColor } : {};
  const insetStyle = { paddingTop: unsafe ? 0 : insets.top };

  return (
    <KeyboardAvoidingView
      style={[preset.outer, backgroundStyle]}
      behavior={isIos ? 'padding' : undefined}
      keyboardVerticalOffset={offsets[keyboardOffset || 'none']}
    >
      <StatusBar barStyle={statusBar || 'light-content'} />
      <View style={[preset.inner, style, insetStyle]}>{children}</View>
    </KeyboardAvoidingView>
  );
}

function ScreenWithScrolling(props) {
  const {
    style: _style,
    backgroundColor,
    unsafe,
    keyboardOffset,
    statusBar,
    children,
    keyboardShouldPersistTaps,
    hideScroll = false,
  } = props;

  const insets = useSafeAreaInsets();
  const preset = presets.scroll;
  const style = _style || {};
  const backgroundStyle = backgroundColor ? { backgroundColor } : {};
  const insetStyle = { paddingTop: unsafe ? 0 : insets.top };

  return (
    <KeyboardAvoidingView
      style={[preset.outer, backgroundStyle]}
      behavior={isIos ? 'padding' : undefined}
      keyboardVerticalOffset={offsets[keyboardOffset || 'none']}
    >
      <StatusBar barStyle={statusBar || 'light-content'} />
      <View style={[preset.outer, backgroundStyle, insetStyle]}>
        <ScrollView
          showsVerticalScrollIndicator={!hideScroll}
          style={[preset.outer, backgroundStyle]}
          contentContainerStyle={[preset.inner, style]}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps || 'handled'}
        >
          {children}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

/**
 * The starting component on every screen in the app.
 *
 * @param {object} props The screen props
 * @param {JSX.Element} [props.children] React.ReactNode
 * @param {import('react-native').ViewStyle} [props.style] StyleProp<ViewStyle>
 * @param {keyof typeof presets} [props.preset] ScreenPresets
 * @param {string} [props.backgroundColor] string
 * @param {"light-content" | "dark-content"} [props.statusBar] "light-content" | "dark-content"
 * @param {boolean} [props.unsafe=false] boolean
 * @param {boolean} [props.hideScroll=false] boolean
 * @param {keyof typeof offsets} [props.keyboardOffset] KeyboardOffsets
 * @param {"handled" | "always" | "never"} [props.keyboardShouldPersistTaps] "handled" | "always" | "never"
 */
export function Screen(props) {
  const { preset } = props;

  if (isNonScrolling(preset)) {
    return <ScreenWithoutScrolling {...props} />;
  }

  return <ScreenWithScrolling {...props} />;
}
