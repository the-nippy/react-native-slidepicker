import React, {Component, PropsWithChildren} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Pressable,
} from 'react-native';
import SlidePicker from '../src';

import CASCADE_POSITION from './test_data/cascade_position.json';
import PARALLEL_TIME from './test_data/parallel_time.json';
import PARALLEL_SKU from './test_data/parallel_sku.json';
import ICON_DOG from './dog.png';

type IExampleState = {
  skuData: IPickerValueProps[];
  positionData: IPickerValueProps[];
  timeData: IPickerValueProps[];
  demoType: string;
};

export default class Demo extends Component<PropsWithChildren, IExampleState> {
  skuRef: React.RefObject<any>;

  constructor(props: any) {
    super(props);
    this.state = {
      demoType: '',
      timeData: [],
      skuData: [],
      positionData: [],
    };
    this.skuRef = React.createRef();
  }

  render() {
    const {positionData, skuData, timeData} = this.state;

    return (
      <View style={styles.page}>
        <View style={styles.block}>
          <Text style={styles.title}>Cascade</Text>
          <TouchableOpacity
            style={styles.item}
            onPress={() => this.setState({demoType: 'cascade_position'})}>
            <Text style={styles.name}>position</Text>
            <Text style={styles.values}>
              {[...positionData]
                .reverse()
                .map(ele => ele.label)
                .join(',')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.block, {marginTop: 60}]}>
          <Text style={styles.title}>Parallel</Text>

          <TouchableOpacity
            style={styles.item}
            onPress={() => this.setState({demoType: 'parallel_time'})}>
            <Text style={styles.name}>Time</Text>
            <Text style={styles.values}>
              {timeData.map(ele => ele.label).join(',')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => this.setState({demoType: 'parallel_sku'})}>
            <Text style={styles.name}>SKU</Text>
            <Text style={styles.values}>
              {skuData.map(ele => ele.label).join(',')}
            </Text>
          </TouchableOpacity>
        </View>

        <SlidePicker.Cascade
          visible={this.state.demoType === 'cascade_position'}
          data={CASCADE_POSITION}
          values={this.state.positionData}
          wheels={4}
          checkRange={5}
          itemDividerColor={'#ddd'}
          checkedTextStyle={{fontSize: 15}}
          itemHeight={44}
          animationDuration={300}
          titleText={'Position'}
          cancelTextStyle={styles.cancelTextStyle}
          onMaskClick={() => this.setState({demoType: ''})}
          onCancelClick={() => this.setState({demoType: ''})}
          onConfirmClick={res => {
            console.info('[res]', res);
            this.setState({positionData: res, demoType: ''});
          }}
        />

        <SlidePicker.Parallel
          visible={this.state.demoType === 'parallel_time'}
          data={PARALLEL_TIME}
          values={this.state.timeData}
          wheels={2}
          checkedTextStyle={styles.checkedStyle}
          normalTextStyle={{fontSize: 14}}
          onCancelClick={() => this.setState({demoType: ''})}
          onConfirmClick={res => {
            console.info('[res]', res);
            this.setState({timeData: res, demoType: ''});
          }}
        />

        <SlidePicker.Parallel
          ref={this.skuRef}
          visible={this.state.demoType === 'parallel_sku'}
          data={PARALLEL_SKU}
          values={this.state.skuData}
          wheels={3}
          checkedTextStyle={styles.checkedStyle}
          onMaskClick={() => this.setState({demoType: ''})}
          HeaderComponent={
            <View style={styles.header}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={ICON_DOG} style={{width: 34, height: 34}} />
                <Text style={{marginLeft: 10}}>What you want?</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  const res = this.skuRef?.current?._getValues();
                  console.info('res', res);
                  this.setState({skuData: res, demoType: ''});
                }}>
                <Text style={{fontWeight: '700'}}>Done</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 120,
    alignItems: 'center',
  },
  block: {
    width: '80%',
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    color: '#222',
  },
  name: {
    fontSize: 16,
    color: '#444',
  },
  values: {
    color: '#000',
    fontWeight: '700',
  },
  item: {
    marginTop: 16,
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkedStyle: {
    color: '#a00',
  },
  cancelTextStyle: {
    color: '#a00',
  },
  header: {
    backgroundColor: '#fff',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
});
