/*
 * @Author: xuwei
 * @Date: 2021-02-01 10:29:16
 * @LastEditTime: 2021-02-03 18:14:50
 * @LastEditors: xuwei
 * @Description:
 */

import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const defaultOptions = {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  headHeight: 50,
  backgroundColor: '#fff',
  confirmStyle: {},
  cancelStyle: {},
  borderTopRadius: 0,
};

export function WithHeadAndMethod(WrapComponent) {
  return class extends Component {
    static defaultProps = {
      dataSource: [],
      pickerDeep: 3,
      onceChange: null,
      confirm: null,
      cancel: null,
      customHead: null,
      pickerStyle: {},
    };
    constructor(props) {
      super(props);
      this.resultArray = [];
      this.headOptions = {...defaultOptions, ...this.props.headOptions};
    }

    _setResult = (index, value) => {
      this.resultArray[index] = value;
    };

    getResult = () => this.resultArray; // ref
    confirm = () => {
      if (this.props.confirm) {
        this.props.confirm(this.resultArray);
      } else {
        console.warn(`[slidepicker] should provide 'confirm' method`);
      }
    };
    cancel = () => {
      if (this.props.cancel) {
        this.props.cancel();
      } else {
        console.warn(`[slidepicker] should provide 'cancel' method`);
      }
    };
    onceChange = () =>
      this.props.onceChange && this.props.onceChange(this.resultArray);

    render() {
      const {customHead} = this.props;
      return (
        <GestureHandlerRootView>
          <View>
            <Head
              headOptions={this.headOptions}
              cancel={this.cancel}
              confirm={this.confirm}
              customHead={customHead}
            />
            <WrapComponent
              {...this.props}
              setResult={this._setResult}
              confirm={this.confirm}
              cancel={this.cancel}
              onceChange={this.onceChange}
            />
          </View>
        </GestureHandlerRootView>
      );
    }
  };
}

/** ----------------------------------- Head Component ----------------------------------------- */

const Head = React.memo(({headOptions, customHead, confirm, cancel}) => {
  if (customHead) {
    return customHead;
  } else {
    const headerapstyle = {
      borderTopLeftRadius: headOptions.borderTopRadius,
      borderTopRightRadius: headOptions.borderTopRadius,
      height: headOptions.headHeight,
      backgroundColor: headOptions.backgroundColor,
    };
    return (
      <View style={[sts.btns, headerapstyle]}>
        <TouchableOpacity
          style={[sts.btn, {height: headOptions.headHeight}]}
          onPress={cancel}>
          <Text style={[sts.btn_text, headOptions.cancelStyle]}>
            {headOptions.cancelText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[sts.btn, {height: headOptions.headHeight}]}
          onPress={confirm}>
          <Text style={[sts.btn_text, headOptions.confirmStyle]}>
            {headOptions.confirmText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
});

const sts = StyleSheet.create({
  btns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  btn: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  btn_text: {fontSize: 18, color: '#4169E1'},
});
