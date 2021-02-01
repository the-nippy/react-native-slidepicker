/*
 * @Author: xuwei
 * @Date: 2021-02-01 18:17:39
 * @LastEditTime: 2021-02-01 18:25:06
 * @LastEditors: xuwei
 * @Description:
 */

import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SingleSlide} from './single';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
export class IndependentPicker extends PureComponent {
  // static defaultProps = {
  //   dataSource: [], //data
  //   onceChange: (arr) => {}, // once change callback
  //   confirm: (arr) => {}, //confirm  send data back
  //   cancel: () => {},
  // };

  constructor(props) {
    super(props);
    this.initData();
  }

  initData = () => {
    const {dataSource} = this.props;
    dataSource.forEach((element, index) => {
      this.props.setResult(index, element[0]);
    });
  };

  done = (dataindex, parindex) => {
    const {dataSource, onceChange} = this.props;
    const list = dataSource[parindex];
    this.props.setResult(parindex, list[dataindex]);
    onceChange && onceChange();
  };

  render() {
    const {dataSource, pickerStyle} = this.props;
    return (
      <View style={sts.all}>
        {dataSource.map((list, index) => (
          <SingleSlide
            list={list}
            key={index}
            inparindex={index}
            done={this.done}
            {...pickerStyle}
          />
        ))}
      </View>
    );
  }
}
const sts = StyleSheet.create({
  all: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
});
