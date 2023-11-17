import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextStyle,
  Pressable,
  TouchableOpacity,
} from 'react-native';

interface IHeaderProps {
  titleText?: string;
  titleTextStyle?: TextStyle;
  cancelText?: string;
  cancelTextStyle?: TextStyle;
  onCancelClick?: () => void;
  confirmText?: string;
  confirmTextStyle?: TextStyle;
  HeaderComponent?: React.ReactNode;
  onConfirmClick?: () => void;
}

export default class Header extends PureComponent<IHeaderProps> {
  static defaultProps: IHeaderProps;

  constructor(props: any) {
    super(props);
  }

  render() {
    const {
      HeaderComponent,
      titleText,
      titleTextStyle,
      cancelText,
      cancelTextStyle,
      confirmText,
      confirmTextStyle,
      onCancelClick,
      onConfirmClick,
    } = this.props;

    if (HeaderComponent) return HeaderComponent;

    const cancelStyle = StyleSheet.flatten([
      styles.base_textStyle,
      cancelTextStyle,
    ]);

    const confirmStyle = StyleSheet.flatten([
      styles.base_textStyle,
      confirmTextStyle,
    ]);

    return (
      <View style={styles.defaultHeader}>
        <View style={styles.leftBox}>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.8}
            onPress={onCancelClick}>
            <Text style={cancelStyle}>{cancelText}</Text>
          </TouchableOpacity>
        </View>
        <Text style={titleTextStyle}>{titleText}</Text>
        <View style={styles.rightBox}>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.8}
            onPress={onConfirmClick}>
            <Text style={confirmStyle}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

Header.defaultProps = {
  cancelText: 'cancel',
  confirmText: 'OK',
};

const styles = StyleSheet.create({
  defaultHeader: {
    height: 50,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftBox: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
  btn: {
    padding: 12,
  },
  base_textStyle: {
    fontSize: 15,
    color: 'rgb(42, 123, 152)',
  },
});
