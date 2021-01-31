/*
 * @Author: xuxiaowei
 * @Date: 2020-11-04 12:24:42
 * @LastEditTime: 2021-01-31 13:43:19
 * @LastEditors: xuwei
 * @Description:
 */
import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SingleSlide} from './single';
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
    this.result = [];

    this.state = {
      lists: this.initState(),
    };

    this.resultIndexs = [];
    this.resultArray = [];

    this.headOptions = Object.assign(
      {},
      defaultOptions,
      this.props.headOptions,
    );
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
    curObj && (this.resultArray[inparIndex] = curObj);
    if (array && array.length > 0) {
      lists[inparIndex] = array;
      this.setState({lists}, () => {
        inparIndex++;
        this.dismantleBebindData(curObj.list || [], 0, inparIndex);
      });
    } else {
      for (let i = inparIndex; i < pickerDeep; i++) {
        lists[i] = [];
        this.resultArray[i] = {};
      }
      this.setState({lists});
      onceChange && onceChange(this.resultArray);
    }
  };

  setData = (checkedIndex, inparindex) => {
    this.setResult(checkedIndex, inparindex);
    this.dismantleBebindData(
      this.state.lists[inparindex],
      checkedIndex,
      inparindex,
    );
  };

  setResult = (checkedIndex, inparindex) => {
    this.resultIndexs[inparindex] = checkedIndex;
    for (let i = inparindex + 1; i < this.props.pickerDeep; i++) {
      this.resultIndexs[i] = 0;
    }
  };

  /** ----------------------------------- Callback ----------------------------------------- */
  onceDataChange = () =>
    this.props.onceChange &&
    this.props.onceChange(this._cleanArray(this.resultArray));

  confirm = () =>
    this.props.confirm &&
    this.props.confirm(this._cleanArray(this.resultArray));

  cancel = () => this.props.cancel && this.props.cancel();

  getResult = () => this._cleanArray(this.resultArray);

  _cleanArray = () =>
    this.resultArray.map((item) => {
      const {list, ...data} = item;
      return data;
    });

  /** ----------------------------------- Render ----------------------------------------- */
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
        </View>
      </GestureHandlerRootView>
    );
  }
}

export class IndependentPicker extends PureComponent {
  static defaultProps = {
    dataSource: [], //data
    onceChange: (arr) => {}, // once change callback
    confirm: (arr) => {}, //confirm  send data back
    cancel: () => {},
  };

  constructor(props) {
    super(props);
    this.result = [];
    this.headOptions = Object.assign(
      {},
      defaultOptions,
      this.props.headOptions,
    );
    this.initData();
  }

  initData = () => {
    const {dataSource} = this.props;
    dataSource.forEach((element, index) => {
      this.result[index] = element[0];
    });
  };

  componentDidMount() {
    const {onceChange} = this.props;
    onceChange && onceChange(this.result);
  }

  done = (dataindex, parindex) => {
    const {dataSource, onceChange} = this.props;
    const list = dataSource[parindex];
    const data = list[dataindex];
    this.result[parindex] = data;
    // console.info('data', data);
    onceChange && onceChange(this.result);
  };

  confirm = () => this.props.confirm && this.props.confirm(this.result);
  cancel = () => this.props.cancel && this.props.cancel();
  getResult = () => this.result;

  render() {
    const {dataSource, pickerStyle, customHead} = this.props;
    return (
      <GestureHandlerRootView>
        <View>
          <Head
            headOptions={this.headOptions}
            cancel={this.cancel}
            confirm={this.confirm}
            customHead={customHead}
          />
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
        </View>
      </GestureHandlerRootView>
    );
  }
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
  rest: {flex: 1, backgroundColor: '#fff'},
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
  all: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
});
