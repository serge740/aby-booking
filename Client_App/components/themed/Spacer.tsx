import { View } from 'react-native';
import type { ViewStyle } from 'react-native';

type SpacerProps = {
  /** Width of the spacer – defaults to `"100%"` */
  width?: ViewStyle['width'];
  /** Height of the spacer – defaults to `40` */
  height?: ViewStyle['height'];
};

/**
 * A simple spacer component that renders an empty `View` with the given
 * width and height. Useful for adding gaps between elements.
 */
const Spacer = ({ width = '100%', height = 40 }: SpacerProps) => {
  return <View style={{ width, height }} />;
};

export default Spacer;