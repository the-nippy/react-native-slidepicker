import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  LayoutChangeEvent,
  Pressable,
} from 'react-native';

type IMaskSlidePickerType = SlidePickerType & {
  ref?: React.RefObject<any>;
};

export function withMask(
  WrappedComponent: React.ComponentType<IMaskSlidePickerType>,
) {
  return class Mask extends Component<IMaskSlidePickerType> {
    animationDuration: number;

    aniTransValue = new Animated.Value(0);
    pickerHeight = 0;
    SCREEN_HEIGHT = Dimensions.get('window').height;
    state = {mount: false};
    wrappedCompRef: React.RefObject<any>;

    constructor(props: any) {
      super(props);
      this.animationDuration = this.props.animationDuration || 200;
      this.wrappedCompRef = React.createRef();
    }

    componentDidUpdate(prevProps: Readonly<SlidePickerType>): void {
      if (!prevProps.visible && this.props.visible) {
        this.setState({mount: true});
      }
      if (prevProps.visible && !this.props.visible) {
        this.hide();
      }
    }

    show = () => {
      Animated.timing(this.aniTransValue, {
        toValue: -1 * this.pickerHeight,
        duration: this.animationDuration,
        useNativeDriver: true,
      }).start();
    };

    hide = () => {
      Animated.timing(this.aniTransValue, {
        toValue: 0,
        duration: this.animationDuration,
        useNativeDriver: true,
      }).start(() => {
        this.setState({mount: false});
      });
    };

    onContentLayout = ({nativeEvent}: LayoutChangeEvent) => {
      this.pickerHeight = nativeEvent.layout.height;
      this.show();
    };

    _getValues = () => {
      return this.wrappedCompRef?.current?._getValues();
    };

    render() {
      if (!this.state.mount) {
        return null;
      }

      const {onMaskClick} = this.props;

      return (
        <View style={styles.mask}>
          <Pressable
            style={{flex: 1}}
            onPress={() => onMaskClick && onMaskClick()}></Pressable>
          <Animated.View
            style={[
              {
                transform: [{translateY: this.aniTransValue}],
                top: this.SCREEN_HEIGHT,
              },
              styles.content,
            ]}
            onLayout={this.onContentLayout}>
            <WrappedComponent
              {...(this.props as SlidePickerType)}
              ref={this.wrappedCompRef}
            />
          </Animated.View>
        </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
