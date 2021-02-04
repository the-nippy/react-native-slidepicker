/*
 * @Author: xuwei
 * @Date: 2020-11-06 21:51:46
 * @LastEditTime: 2021-02-04 10:55:17
 * @LastEditors: xuwei
 * @Description:
 */
import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

export class SingleSlide extends PureComponent {
  static defaultProps = {
    itemHeight: 40,
    visibleNum: 5, // visible lins
    activeBgColor: '#fff',
    activeBgOpacity: 1,
    activeFontSize: 18,
    activeFontColor: '#F00',
    normalBgColor: '#fff',
    normalBgOpacity: 0.4,
    normalFontSize: 16,
    normalFontColor: '#333',
    inparindex: 0,
  };

  constructor(props) {
    super(props);
    this.state = {checkedIndex: this._deIndex};
    this.init();
  }

  init = () => {
    const {defaultIndex, itemHeight, list} = this.props;
    if (defaultIndex) {
      if (defaultIndex < 0 || defaultIndex > list.length - 1) {
        console.warn(
          '[slidepicker]defaultValueIndexes are out of range, default to 0',
        );
        this._deIndex = 0;
      } else {
        this._deIndex = defaultIndex;
      }
    } else {
      this._deIndex = 0;
    }
    this.transValue = new Animated.Value(-this._deIndex * itemHeight || 0);
  };

  componentDidMount() {
    const {inparindex} = this.props;
    this.props.done(this._deIndex, inparindex);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.list !== this.props.list) {
      this.transValue.setValue(0);
      this.dataBack(0);
    }
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
    const {itemHeight} = this.props;
    if (nativeEvent.oldState === State.BEGAN) {
      this.transValue.setOffset(this.transValue._value);
    } else if (nativeEvent.oldState === State.ACTIVE) {
      const gesdy = nativeEvent.translationY;
      const ABSDy = Math.abs(gesdy);
      const count = Math.round(ABSDy / itemHeight);
      this.transValue.setValue(
        gesdy > 0 ? itemHeight * count : -itemHeight * count,
      );
      this.transValue.flattenOffset();
      this.adjustAniValue();
    }
  };

  adjustAniValue = () => {
    const {itemHeight, list} = this.props;
    const transvalue = this.transValue._value;
    const count = transvalue / itemHeight;
    if (count > 0) {
      this.setAniAndDataback(0, 0);
    } else if (count < -list.length + 1) {
      this.setAniAndDataback((-list.length + 1) * itemHeight, list.length - 1);
    } else {
      const finalIndex = Math.abs(count);
      this.dataBack(finalIndex);
    }
  };

  setAniAndDataback = (position, newIndex) => {
    this.transValue.setValue(position);
    this.dataBack(newIndex);
  };

  dataBack = (newIndex) => {
    const {done, inparindex} = this.props;
    if (newIndex !== this.state.checkedIndex && done) {
      done(newIndex, inparindex);
    }
    this.setState({checkedIndex: newIndex});
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
    const itemStyle = {
      color: isChecked ? activeFontColor : normalFontColor,
      fontSize: isChecked ? activeFontSize : normalFontSize,
      height: itemHeight,
      lineHeight: itemHeight,
    };
    return (
      <Text numberOfLines={1} style={[sts.text, itemStyle]} key={index}>
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
      activeBgOpacity,
    } = this.props;

    let half = Math.floor(visibleNum / 2);
    const fillArr = Array(half).fill('');
    const offsetIndex = half;
    let finalList = list.slice();
    finalList.unshift(...fillArr);
    finalList = finalList.concat(fillArr);

    const maskBg = {
      backgroundColor: normalBgColor,
      opacity: normalBgOpacity,
      width: '100%',
      height: itemHeight * half,
    };
    return (
      <View style={[sts.contain, {height: itemHeight * visibleNum}]}>
        <PanGestureHandler
          onGestureEvent={this._onPanGestureEvent}
          onHandlerStateChange={this._onHandlerStateChange}>
          <View style={{flex: 1}}>
            <Animated.View
              style={[sts.f1, {transform: [{translateY: this.transValue}]}]}>
              {finalList.map((item, index) =>
                this.renderItem(item, index, offsetIndex),
              )}
            </Animated.View>
            <View style={maskBg} />
            <View
              style={{
                height: itemHeight,
                width: '100%',
                backgroundColor: activeBgColor,
                opacity: activeBgOpacity,
              }}
            />
            <View style={maskBg} />
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
  contain: {
    flexDirection: 'row',
    flex: 1,
  },
  f1: {
    position: 'absolute',
    width: '100%',
    zIndex: 10,
    flex: 1,
  },
});
