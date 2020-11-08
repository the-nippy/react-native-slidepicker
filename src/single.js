/*
 * @Author: xuwei
 * @Date: 2020-11-06 21:51:46
 * @LastEditTime: 2020-11-08 00:32:19
 * @LastEditors: xuwei
 * @Description:
 */
import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, PanResponder, Animated} from 'react-native';

export class SingleSlide extends PureComponent {
  static defaultProps = {
    itemHeight: 40, // per item height
    visibleNum: 5, // visible lins
    // maskLines: 2, //

    activeBgColor: '#ccc',
    // activeBgColor: '#EEE8AA',
    activeFontSize: 18,
    activeFontColor: '#a00',

    normalBgColor: '#fff',
    normalBgOpacity: 0.4,
    normalFontSize: 16,
    normalFontColor: '#333',

    inparindex:0 
  };

  transValue = new Animated.Value(0);
  constructor(props) {
    super(props);
    this.state = {checkedIndex: 0};
    this.IOffSet =
      (Math.floor(this.props.visibleNum / 2) - 1) * this.props.itemHeight;
    this.transValue = new Animated.Value(0);

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => this.props.list.length > 1,
      onPanResponderGrant: () =>
        this.transValue.setOffset(this.transValue._value),
      onPanResponderMove: Animated.event([null, {dy: this.transValue}]),
      onPanResponderRelease: this.panRelease,
    });
  }

  panRelease = ({nativeEvent}, gestureState) => {
    const {itemHeight} = this.props;
    const gesdy = gestureState.dy;
    const ABSDy = Math.abs(gesdy);
    const total = Math.floor(ABSDy / itemHeight);
    const leave = ABSDy - total * itemHeight;
    const count = leave < itemHeight / 2 ? total : total + 1;
    this.transValue.setValue(
      gesdy > 0 ? itemHeight * count : -itemHeight * count,
    );
    this.transValue.flattenOffset();
    this.sendBackData();
  };

  sendBackData = () => {
    const {done,inparindex,itemHeight} = this.props;
    const transvalue = this.transValue._value;
    const count = transvalue / itemHeight;
    // console.info('count', count);
    if (count > 0) {
      this.transValue.setValue(0);
      this.props.done(0);
      this.setState({checkedIndex: 0});
      return;
    }
    if (count < -this.props.list.length + 1) {
      this.transValue.setValue((-this.props.list.length + 1) * itemHeight);
      // console.info('done', this.props.list.length - 1);
      this.props.done(this.props.list.length - 1);
      this.setState({checkedIndex: this.props.list.length - 1});
      return;
    }
    const finalIndex = Math.abs(count);
    this.setState({checkedIndex: finalIndex});
    this.props.done(finalIndex);
  };

  resetTrans = () => {
    this.transValue.setValue(0);
    this.setState({checkedIndex: 0});
  };

  renderItem = (item, index, offsetIndex) => {
    const {
      itemHeight,
      activeFontSize,
      activeFontColor,
      normalFontSize,
      normalFontColor,
    } = this.props;
    const {checkedIndex} = this.state;

    const isChecked = checkedIndex + offsetIndex === index;

    return (
      <Text
        numberOfLines={1}
        style={[
          sts.text,
          {
            color: isChecked ? activeFontColor : normalFontColor,
            fontSize: isChecked ? activeFontSize : normalFontSize,
            height: itemHeight,
            lineHeight: itemHeight,
          },
        ]}
        key={index}>
        {item.name || ''}
      </Text>
    );
  };

  render() {
    const {
      list,
      itemHeight,
      visibleNum,
      activeBgColor,
      normalBgColor,
      normalBgOpacity,
    } = this.props;

    let half = Math.floor(visibleNum / 2);

    const fillArr = Array(half).fill('');
    const offsetIndex = half;

    let finalList = list.slice();
    finalList.unshift(...fillArr);
    finalList = finalList.concat(fillArr);

    const maskBg = {backgroundColor: normalBgColor, opacity: normalBgOpacity};

    return (
      <View style={[sts.contain, {height: itemHeight * visibleNum}]}>
        <View
          style={{flex: 1, backgroundColor: activeBgColor}}
          {...this._panResponder.panHandlers}>
          <Animated.View
            style={[sts.f1, {transform: [{translateY: this.transValue}]}]}>
            {finalList.map((item, index) =>
              this.renderItem(item, index, offsetIndex),
            )}
          </Animated.View>
          <View style={[sts.mask, maskBg, {height: itemHeight * half}]} />
          <View
            style={[sts.mask, maskBg, {bottom: 0, height: itemHeight * half}]}
          />
        </View>
      </View>
    );
  }
}

const sts = StyleSheet.create({
  text: {
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  mask: {
    position: 'absolute',
    // backgroundColor: '#fff',
    // opacity: 0.3,
    width: '100%',
  },
  contain: {
    flexDirection: 'row',
    flex: 1,
  },
  f1: {
    flex: 1,
  },
});
