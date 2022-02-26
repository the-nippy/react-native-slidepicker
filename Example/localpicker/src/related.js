import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import {SingleSlide} from './single';

export class RelativedPicker extends PureComponent {
  constructor(props) {
    super(props);
    // this.getDeafultValue();
    const defaultIndexArr = new Array(this.props.pickerDeep).fill(0);
    const [initList, resultArray] = this._transDataAndResult(defaultIndexArr);
    this.resultArray = resultArray;
    this.state = {
      resultIndexArray: defaultIndexArr, // 记录每轮处于第几个 Index
      lists: initList,
    };
  }

  componentDidMount() {
    this.props.setResult(this.resultArray);
  }

  getDeafultValue = () => {
    const {values, dataSource} = this.props;
    // while
  };

  /** ----------------------------------- Data ----------------------------------------- */
  // 嵌套数组转换成用于渲染显示的平级 List，获取实时选择结果
  _transDataAndResult = (resultIndexArray) => {
    const {dataSource, pickerDeep} = this.props;
    let i = 0,
      plainLists = new Array(pickerDeep).fill([]),
      templist = dataSource,
      resultArray = new Array(this.props.pickerDeep).fill({}); // 最终返回结果
    while (i < pickerDeep) {
      let wheelIndex = resultIndexArray[i];
      // resultArray[i] = templist[wheelIndex];
      const {list, ...data} = {...templist[wheelIndex]};
      resultArray[i] = data;

      plainLists[i] = templist;
      if (templist && templist[wheelIndex] && templist[wheelIndex].list) {
        templist = templist[wheelIndex].list;
      } else {
        break;
      }
      ++i;
    }
    return [plainLists, resultArray];
  };

  _onceChange = () =>
    this.props.onceChange && this.props.onceChange(this.resultArray);

  // 单轮设置后的回调，第几轮的数据在第几位
  _setData = (checkedIndex, inparIndex) => {
    const newIndexArray = this.state.resultIndexArray.slice();
    newIndexArray[inparIndex] = checkedIndex;
    // 选择之后，重置后面的选择轮的 index 为 0
    for (let i = this.props.pickerDeep - 1; i > inparIndex; i--) {
      newIndexArray[i] = 0;
    }
    const [newLists, resultArray] = this._transDataAndResult(newIndexArray);
    // 结果返回给父组件
    this.props.setResult(resultArray);
    this._onceChange();
    // 更新 List
    this.setState({
      resultIndexArray: newIndexArray,
      lists: newLists,
    });
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
            defaultIndex={this.state.resultIndexArray[index]}
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
