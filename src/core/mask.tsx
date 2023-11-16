import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';

export function withMask(
  WrappedComponent: React.ComponentType<SlidePickerType>,
) {
  return class Mask extends Component<SlidePickerType> {
    animationDuration: number;

    aniTransValue = new Animated.Value(0);
    pickerHeight = 0;
    SCREEN_HEIGHT = Dimensions.get('window').height;
    state = {mount: false};

    constructor(props: any) {
      super(props);
      this.animationDuration = this.props.animationDuration || 200;
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

    render() {
      if (!this.state.mount) {
        return null;
      }

      return (
        <View style={styles.mask}>
          <Animated.View
            style={[
              {
                transform: [{translateY: this.aniTransValue}],
                top: this.SCREEN_HEIGHT,
              },
              styles.content,
            ]}
            onLayout={this.onContentLayout}>
            <WrappedComponent {...(this.props as SlidePickerType)} />
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
