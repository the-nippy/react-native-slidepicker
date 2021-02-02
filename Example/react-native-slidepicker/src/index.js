/*
 * @Author: xuxiaowei
 * @Date: 2020-11-04 12:24:42
 * @LastEditTime: 2021-02-02 10:38:47
 * @LastEditors: xuwei
 * @Description:
 */
import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import {SingleSlide} from './single';

export class RelativedPicker extends PureComponent {
  static defaultProps = {
    dataSource: [], //data
    pickerDeep: 3,
    onceChange: (arr) => {}, // once change callback
    confirm: (arr) => {}, //confirm  send data back
    cancel: () => {},
    customHead: null,
    pickerStyle: {},
    headOptions: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      lists: this.initState(),
    };
  }

  /** ----------------------------------- Data ----------------------------------------- */

  initState = () => {
    const lists = new Array(this.props.pickerDeep).fill([]);
    lists[0] = this.props.dataSource;
    return lists;
  };

  dismantleBebindData = (array, index, inparIndex) => {
    const {pickerDeep, onceChange} = this.props;
    const lists = this.state.lists.slice();
    const curObj = array[index];
    curObj && this.props.setResult(inparIndex, curObj);
    if (array && array.length > 0) {
      lists[inparIndex] = array;
      this.setState({lists}, () => {
        inparIndex++;
        this.dismantleBebindData(curObj.list || [], 0, inparIndex);
      });
    } else {
      for (let i = inparIndex; i < pickerDeep; i++) {
        lists[i] = [];
        this.props.setResult(i, {});
      }
      this.setState({lists});
      onceChange && onceChange(this.resultArray);
    }
  };

  setData = (checkedIndex, inparindex) => {
    this.dismantleBebindData(
      this.state.lists[inparindex],
      checkedIndex,
      inparindex,
    );
  };

  /** ----------------------------------- Render ----------------------------------------- */
  render() {
    return (
      <View style={sts.all}>
        {this.state.lists.map((list, index) => (
          <SingleSlide
            key={index}
            list={list}
            done={this.setData}
            inparindex={index}
            {...this.props.pickerStyle}
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
