import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TextStyle,
} from 'react-native';

type TWheelProps = {
  checkRange: number;
  itemHeight: number;
  wheelItems: TWheelItemProps[];
  checkedTextStyle: TextStyle;
  normalTextStyle: TextStyle;
  rowLocationMark: number;
  setCheckMark: (rowLocationMark: number, checkedIndex: number) => void;
  contentBackgroundColor: string;
  itemDividerColor: string;
};

type TWheelState = {
  checkedIndex: number;
};

type TEventHandler = NativeSyntheticEvent<NativeScrollEvent>;

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

const WheelItem = React.memo<{
  item: TWheelItemProps;
  itemHeight: number;
  isChecked: boolean;
  checkedTextStyle: TextStyle;
  normalTextStyle: TextStyle;
}>(({item, itemHeight, isChecked, checkedTextStyle, normalTextStyle}) => {
  const customTextStyle = isChecked
    ? StyleSheet.flatten([styles.base_checkedTextStyle, checkedTextStyle])
    : StyleSheet.flatten([styles.base_normalTextStyle, normalTextStyle]);

  return (
    <TouchableOpacity style={[styles.item, {height: itemHeight}]}>
      <Text style={customTextStyle} numberOfLines={1}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
});

class Wheel extends Component<TWheelProps, TWheelState> {
  static defaultProps: TWheelProps;
  listRef: React.RefObject<FlatList>;
  scrollTimer: ReturnType<typeof setTimeout> | null;
  cachedContainerStyle: {paddingTop: number; paddingBottom: number};
  cachedFakeItems: React.ReactNode[];

  state = {
    checkedIndex: 0,
  };

  constructor(props: TWheelProps) {
    super(props);
    this.listRef = React.createRef();
    this.scrollTimer = null;
    this.cachedContainerStyle = {paddingTop: 0, paddingBottom: 0};
    this.cachedFakeItems = [];
    this.updateCachedRenderData();
  }

  updateCachedRenderData() {
    const {checkRange, itemHeight, contentBackgroundColor, itemDividerColor} =
      this.props;
    const fillCount = (checkRange - 1) / 2;
    const fillPadding = fillCount * itemHeight;
    this.cachedContainerStyle = {
      paddingTop: fillPadding,
      paddingBottom: fillPadding,
    };
    this.cachedFakeItems = new Array(checkRange).fill(1).map((_, i) => (
      <View
        style={[
          styles.fakeItem,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            height: itemHeight,
            backgroundColor: contentBackgroundColor,
            borderTopColor: i === 0 ? 'rgba(0,0,0,.05)' : itemDividerColor,
          },
        ]}
        key={i}
      />
    ));
  }

  componentDidUpdate(prevProps: Readonly<TWheelProps>): void {
    const {checkRange, itemHeight, contentBackgroundColor, itemDividerColor} =
      this.props;
    if (
      prevProps.checkRange !== checkRange ||
      prevProps.itemHeight !== itemHeight ||
      prevProps.contentBackgroundColor !== contentBackgroundColor ||
      prevProps.itemDividerColor !== itemDividerColor
    ) {
      this.updateCachedRenderData();
    }
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
    if (this.state.checkedIndex === adjustCheckedIndex) {
      return;
    }
    this.listRef?.current?.scrollToIndex({
      index: adjustCheckedIndex,
      animated: true,
      viewPosition: 0.5,
    });
    this.setState({checkedIndex: adjustCheckedIndex});
    setCheckMark(rowLocationMark, adjustCheckedIndex);
  };

  renderItem = ({item, index}: {item: TWheelItemProps; index: number}) => {
    const {checkedIndex} = this.state;
    const {itemHeight, checkedTextStyle, normalTextStyle} = this.props;

    return (
      <WheelItem
        item={item}
        itemHeight={itemHeight}
        isChecked={index === checkedIndex}
        checkedTextStyle={checkedTextStyle}
        normalTextStyle={normalTextStyle}
      />
    );
  };

  render() {
    const {checkRange, itemHeight, wheelItems} = this.props;

    return (
      <View style={{flex: 1, height: itemHeight * checkRange}}>
        <View style={styles.base}>{this.cachedFakeItems}</View>
        <View style={styles.maskList}>
          <FlatList
            contentContainerStyle={this.cachedContainerStyle}
            ref={this.listRef}
            data={wheelItems}
            renderItem={this.renderItem}
            onMomentumScrollEnd={this.adjustScroll}
            pinchGestureEnabled={false}
            keyExtractor={data => data.value.toString()}
            showsVerticalScrollIndicator={false}
            getItemLayout={(_data, index) => ({
              length: itemHeight,
              offset: itemHeight * (index + (checkRange - 1) / 2),
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
  itemDividerColor: 'rgba(0,0,0,.05)',
};

export default Wheel;
