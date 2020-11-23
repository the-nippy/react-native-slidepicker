/*
 * @Author: xuwei
 * @Date: 2020-11-18 09:23:11
 * @LastEditTime: 2020-11-23 10:24:19
 * @LastEditors: xuwei
 * @Description:
 */
import React, {Component, PureComponent} from 'react';
import {TouchableOpacity, Text, View, StyleSheet, Image} from 'react-native';
import {AbsoContain, ModalContain} from './pickercontain';
import {CascadePicker, ParallelPicker} from 'react-native-slidepicker';

const specData = require('./testfiles/spec.json');
const oneData = require('./testfiles/one.json');
// const oneData = require('./testfiles/onepara.json');

const twoData = require('./testfiles/two.json');
const threeData = require('./testfiles/three.json');
const ICON_DOG = require('./testfiles/dog.png');

export default class PickerDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {showType: ''};
  }

  close = () => this.setState({showType: ''});

  showData = (arr) => {
    this.setState({showType: ''});
    console.info('arr', arr);
  };

  setOnePickerRef = (ref) => (this.oneRef = ref);

  showOneData = () => {
    const data = this.oneRef.getResult();
    console.info('data', data);
    this.setState({showType: ''});
  };

  render() {
    return (
      <View style={styles.page}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.setState({showType: 'spec'})}>
          <Text style={{fontSize: 20}}>Show Spec Picker</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {marginTop: 20}]}
          onPress={() => this.setState({showType: 'one'})}>
          <Text style={{fontSize: 20}}>Show one wheel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {marginTop: 20}]}
          onPress={() => this.setState({showType: 'three'})}>
          <Text style={{fontSize: 20}}>Show three wheel</Text>
        </TouchableOpacity>

        {/* color size */}
        {this.state.showType === 'spec' && (
          <AbsoContain>
            <ParallelPicker
              dataSource={specData}
              confirm={this.showData}
              cancel={this.close}
              pickerStyle={{
                itemHeight: 50,
                visibleNum: 3,
                activeBgColor: '#f5f5f5',
                normalBgColor: '#fdfdfd',
              }}
            />
          </AbsoContain>
        )}

        {this.state.showType === 'one' && (
          <AbsoContain>
            <CascadePicker
              ref={this.setOnePickerRef}
              dataSource={oneData}
              confirm={this.showData}
              cancel={this.close}
              pickerDeep={1}
              pickerStyle={{
                visibleNum: 3,
                activeFontColor: '#F52D3A',
                itemHeight: 50,
                activeFontSize: 20,
              }}
              customHead={
                <View
                  style={{
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Image source={ICON_DOG} style={{width: 36, height: 36}} />
                  <Text style={{fontSize: 18}}>Choose Animals</Text>
                  <TouchableOpacity onPress={this.showOneData}>
                    <Text>Done</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </AbsoContain>
        )}

        {this.state.showType === 'three' && (
          <AbsoContain>
            <CascadePicker
              dataSource={threeData}
              confirm={this.showData}
              cancel={this.close}
              pickerDeep={3}
              pickerStyle={{
                activeFontColor: '#0aa',
                activeBgColor: '#eee',
                normalBgColor: '#555',
              }}
            />
          </AbsoContain>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
});
