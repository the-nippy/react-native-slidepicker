/*
 * @Author: xuxiaowei
 * @Date: 2020-11-04 12:24:42
 * @LastEditTime: 2021-02-05 15:32:42
 * @LastEditors: xuwei
 * @Description:
 */
import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import {SingleSlide} from './single';

// TODO （ done -> onceChange -> _dismantleBebindData 消减执行次数)
// onceChange 实验性功能
export class RelativedPicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lists: this._initState(),
    };
  }
  /** ----------------------------------- Data ----------------------------------------- */
  _initState = () => {
    const lists = new Array(this.props.pickerDeep).fill([]);
    lists[0] = this.props.dataSource;
    return lists;
  };

  _dismantleBebindData = (array, index, inparIndex) => {
    const {pickerDeep} = this.props;
    if (pickerDeep === inparIndex) {
      this._onceChange();
      return;
    }
    const lists = this.state.lists.slice();
    const curObj = array[index];
    curObj && this._setParResult(inparIndex, curObj);
    if (array && array.length > 0) {
      lists[inparIndex] = array;
      this.setState({lists}, () => {
        inparIndex++;
        this._dismantleBebindData(curObj.list || [], 0, inparIndex);
      });
    } else {
      for (let i = inparIndex; i < pickerDeep; i++) {
        lists[i] = [];
        this._setParResult(i, {});
      }
      this.setState({lists});
      this._onceChange();
    }
  };

  _onceChange = () =>
    this.props.onceChange && this.props.onceChange(this.resultArray);

  _setParResult = (index, obj) => {
    const {list, ...item} = obj;
    this.props.setResult(index, item);
  };

  _setData = (checkedIndex, inparindex) => {
    this._dismantleBebindData(
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
            done={this._setData}
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
