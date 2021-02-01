/*
 * @Author: xuwei
 * @Date: 2021-02-01 10:29:16
 * @LastEditTime: 2021-02-01 18:11:10
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

export function cleanData(array) {
  return array.map((item) => {
    const {list, ...data} = item;
    return data;
  });
}

export function WithHeadAndMethod(WrapComponent, _cleanData) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.resultArray = [];
      this.headOptions = Object.assign(
        {},
        defaultOptions,
        this.props.headOptions,
      );
    }

    _setResult = (index, value) => {
      this.resultArray[index] = value;
    };
    _getTransResult = () =>
      _cleanData ? _cleanData(this.resultArray) : this.resultArray;

    confirm = () => {
      if (this.props.confirm) {
        this.props.confirm(this._getTransResult());
      } else {
        console.warn(`[RN slidepicker] should provide 'confirm' method`);
      }
    };

    onceChange = () =>
      this.props.onceChange && this.props.onceChange(this._getTransResult());

    cancel = () => this.props.cancel && this.props.cancel();

    // getResult = () => this._cleanData(this.resultArray);

    render() {
      const {customHead} = this.props;
      return (
        <GestureHandlerRootView>
          <View>
            <Head
              headOptions={this.headOptions || {}}
              cancel={this.cancel}
              confirm={this.confirm}
              customHead={customHead}
            />
            <WrapComponent
              setResult={this._setResult}
              {...this.props}
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

const Head = React.memo(({headOptions, customHead, confirm, cancel}) => {
  if (customHead) {
    return customHead;
  } else {
    return (
      <View
        style={[
          sts.btns,
          {
            borderTopLeftRadius: headOptions.borderTopRadius,
            borderTopRightRadius: headOptions.borderTopRadius,
            height: headOptions.headHeight,
            backgroundColor: headOptions.backgroundColor,
          },
        ]}>
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
