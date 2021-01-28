/*
 * @Author: xuwei
 * @Date: 2020-11-06 21:51:46
 * @LastEditTime: 2021-01-27 18:32:37
 * @LastEditors: xuwei
 * @Description:
 */
import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, PanResponder, Animated} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

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

    inparindex: 0,
  };

  transValue = new Animated.Value(0);
  constructor(props) {
    super(props);
    this.state = {checkedIndex: 0};
    this.transValue = new Animated.Value(0);
  }

  componentDidMount() {
    const {list, itemHeight} = this.props;
    this.maxOffset = 0;
    this.listLength = list.length;
    console.info('this.listLength', this.props.list.length);
    this.minOffset = (1 - this.listLength) * itemHeight;
  }

  /** ----------------------------------- Gesture ----------------------------------------- */

  //滑动中
  _onPanGestureEvent = ({nativeEvent}) => {
    const {itemHeight} = this.props;
    if (
      nativeEvent.translationY > itemHeight * this.state.checkedIndex ||
      nativeEvent.translationY <
        -itemHeight * (this.props.list.length - this.state.checkedIndex - 1)
    ) {
      return;
    }
    this.transValue.setValue(nativeEvent.translationY);
  };

  _onHandlerStateChange = ({nativeEvent}) => {
    const {itemHeight, inparindex} = this.props;

    if (nativeEvent.oldState === State.BEGAN) {
      this.transValue.setOffset(this.transValue._value);
    } else if (nativeEvent.oldState === State.ACTIVE) {
      const gesdy = nativeEvent.translationY;
      const ABSDy = Math.abs(gesdy);
      const total = Math.floor(ABSDy / itemHeight);
      const leave = ABSDy - total * itemHeight;
      const count = leave < itemHeight / 2 ? total : total + 1;
      this.transValue.setValue(
        gesdy > 0 ? itemHeight * count : -itemHeight * count,
      );
      this.adjustSendData();
    }
  };

  adjustSendData = () => {
    this.transValue.flattenOffset();

    const {done, inparindex, itemHeight, list} = this.props;
    const transvalue = this.transValue._value;
    // const transvalue = gesdy;

    const count = transvalue / itemHeight;
    if (count > 0) {
      this.setAniAndDataback(0, 0);
      return;
    } else if (count < -list.length + 1) {
      this.setAniAndDataback((-list.length + 1) * itemHeight, list.length - 1);
      return;
    } else {
      const finalIndex = Math.abs(count);
      this.setState({checkedIndex: finalIndex});
      done(finalIndex, inparindex);
    }
  };

  // adjustSendData = (gesdy) => {
  //   const {done, inparindex, itemHeight, list} = this.props;
  //   const transvalue = gesdy;
  //   const count = transvalue / itemHeight;
  //   if (count > 0) {
  //     this.setAniAndDataback(0, 0);
  //   } else if (count < -this.props.list.length + 1) {
  //     this.setAniAndDataback((-list.length + 1) * itemHeight, list.length - 1);
  //   } else {
  //     const count = Math.round(Math.abs(gesdy) / itemHeight);
  //     const position = gesdy > 0 ? itemHeight * count : -itemHeight * count;
  //     // const finalIndex = Math.abs(count);
  //     // this.setState({checkedIndex: finalIndex});
  //     // done(finalIndex, inparindex);
  //     this.setAniAndDataback(position, Math.abs(count));
  //   }
  // };

  setAniAndDataback = (position, newIndex) => {
    const {done, inparindex} = this.props;
    this.transValue.setValue(position);
    this.setState({checkedIndex: newIndex});
    if (done) {
      done(newIndex, inparindex);
    }
  };

  resetTrans = () => {
    this.transValue.setValue(0);
    this.setState({checkedIndex: 0});
  };

  /** ----------------------------------- Render ----------------------------------------- */

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
        <PanGestureHandler
          onGestureEvent={this._onPanGestureEvent}
          onHandlerStateChange={this._onHandlerStateChange}>
          <View style={{flex: 1, backgroundColor: activeBgColor}}>
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
        </PanGestureHandler>
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
