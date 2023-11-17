import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatListComponent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TextStyle,
} from 'react-native';

type TWheelProps = {
  checkRange: number;
  itemHeight: number;
  wheelItems: IWheelItemProps[];
  checkedTextStyle: TextStyle;
  normalTextStyle: TextStyle;
  rowLocationMark: number; //
  setCheckMark: (rowLocationMark: number, checkedIndex: number) => void;
  contentBackgroundColor: string;
  itemDividerColor: string;
};

type TWheelState = {
  checkedIndex: number;
};

type TEventHandler = NativeSyntheticEvent<NativeScrollEvent>;

class Wheel extends Component<TWheelProps, TWheelState> {
  static defaultProps: TWheelProps;
  listRef: React.RefObject<FlatListComponent<any, any>>;
  scrollTimer: ReturnType<typeof setTimeout> | null;

  state = {
    checkedIndex: 0,
  };

  constructor(props: any) {
    super(props);
    this.listRef = React.createRef();
    this.scrollTimer = null;
  }

  componentWillUnmount(): void {
    this.scrollTimer && clearTimeout(this.scrollTimer);
  }

  manualSetChecked = (index: number, animated: boolean) => {
    const {wheelItems} = this.props;
    this.setState({checkedIndex: index}, () => {
      if (!wheelItems || wheelItems.length === 0) {
        return;
      }
      this.scrollTimer = setTimeout(() => {
        this.listRef?.current?.scrollToIndex({
          index: index,
          animated,
          viewPosition: 0.5,
        });
      }, 100);
    });
  };

  adjustScroll = (event: TEventHandler) => {
    const {y} = event.nativeEvent.contentOffset;
    const {setCheckMark, rowLocationMark, itemHeight} = this.props;
    const adjustCheckedIndex = Math.round(y / itemHeight);
    this.listRef?.current?.scrollToIndex({
      index: adjustCheckedIndex,
      animated: true,
      viewPosition: 0.5,
    });
    if (this.state.checkedIndex === adjustCheckedIndex) {
      return;
    }
    this.setState({checkedIndex: adjustCheckedIndex});
    setCheckMark(rowLocationMark, adjustCheckedIndex);
  };

  renderItem = (itemData: {item: IWheelItemProps; index: number}) => {
    const {checkedIndex} = this.state;
    const {itemHeight, checkedTextStyle, normalTextStyle} = this.props;

    const {item, index} = itemData;

    const customTextStyle =
      index === checkedIndex
        ? StyleSheet.flatten([styles.base_checkedTextStyle, checkedTextStyle])
        : StyleSheet.flatten([styles.base_normalTextStyle, normalTextStyle]);

    return (
      <TouchableOpacity style={[styles.item, {height: itemHeight}]}>
        <Text style={customTextStyle} numberOfLines={1}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      checkRange,
      itemHeight,
      wheelItems,
      contentBackgroundColor,
      itemDividerColor,
    } = this.props;

    const fillCount = (checkRange - 1) / 2;
    const fillPadding = fillCount * itemHeight;
    const containerStyle = {
      paddingTop: fillPadding,
      paddingBottom: fillPadding,
    };

    return (
      <View style={{flex: 1, height: itemHeight * checkRange}}>
        <View style={styles.base}>
          {new Array(checkRange).fill(1).map((ele, i) => (
            <View
              style={[
                styles.fakeItem,
                {
                  height: itemHeight,
                  backgroundColor: contentBackgroundColor,
                  borderTopColor:
                    i === 0 ? 'rgba(0,0,0,0.05)' : itemDividerColor,
                },
              ]}
              key={i}
            />
          ))}
        </View>
        <View style={styles.maskList}>
          <FlatList
            contentContainerStyle={containerStyle}
            ref={this.listRef}
            data={wheelItems}
            renderItem={this.renderItem}
            onMomentumScrollEnd={this.adjustScroll}
            pinchGestureEnabled={false}
            keyExtractor={data => data.value.toString()}
            showsVerticalScrollIndicator={false}
            getItemLayout={(data, index) => ({
              length: itemHeight,
              offset: itemHeight * (index + fillCount),
              index,
            })}
          />
        </View>
      </View>
    );
  }
}

Wheel.defaultProps = {
  itemHeight: 60,
  checkRange: 5,
  wheelItems: [],
  checkedTextStyle: {},
  normalTextStyle: {},
  rowLocationMark: 0,
  setCheckMark: () => {},
  contentBackgroundColor: '#f8f8f8',
  itemDividerColor: 'rgba(0,0,0,0.05)',
};

export default Wheel;

const styles = StyleSheet.create({
  base: {
    height: '100%',
    overflow: 'hidden',
    zIndex: 1,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fakeItem: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
  },
  maskList: {
    position: 'absolute',
    width: '100%',
    // backgroundColor: '#00a',
    top: 0,
    bottom: 0,
    zIndex: 99,
  },

  base_checkedTextStyle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#006',
  },
  base_normalTextStyle: {
    fontWeight: '400',
    fontSize: 14,
  },
});
