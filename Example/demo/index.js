/*
 * @Author: xuwei
 * @Date: 2020-11-18 09:23:11
 * @LastEditTime: 2021-02-03 18:09:16
 * @LastEditors: xuwei
 * @Description:
 */
import React, {Component, PureComponent} from 'react';
import {TouchableOpacity, Text, View, StyleSheet, Image} from 'react-native';
import {ModalContain} from './pickercontain';

import {CascadePicker, ParallelPicker} from '../react-native-slidepicker/index';
// import {CascadePicker, ParallelPicker} from 'react-native-slidepicker';

const specData = require('./testfiles/spec.json');
const oneData = require('./testfiles/one.json');
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
        <ModalContain isModalShow={this.state.showType === 'spec'}>
          <ParallelPicker
            dataSource={specData}
            confirm={this.showData}
            cancel={this.close}
            defaultValueIndexes={[3, 2]}
            onceChange={(arr) => {
              // console.info('once', arr);
            }}
            // pickerDeep={1}
            pickerStyle={{
              itemHeight: 50,
              visibleNum: 3,
              // activeBgColor: '#a00',
              // activeBgOpacity: 0.5,
              activeFontSize: 25,
              activeFontColor: '#00F',

              // normalBgColor: '#a00',
              // normalBgOpacity: 1,
              // normalFontSize: 10,
              // normalFontColor: '#0a0',
            }}
          />
        </ModalContain>

        <ModalContain isModalShow={this.state.showType === 'one'}>
          <CascadePicker
            ref={this.setOnePickerRef}
            dataSource={oneData}
            confirm={this.showData}
            cancel={this.close}
            pickerDeep={1}
            pickerStyle={{
              visibleNum: 3,
              itemHeight: 60,
              activeFontColor: '#F52D3A',
              activeFontSize: 21,
            }}
            customHead={
              <View style={styles.head}>
                <Image source={ICON_DOG} style={{width: 36, height: 36}} />
                <Text style={{fontSize: 18}}>Choose Animals</Text>
                <TouchableOpacity onPress={this.showOneData}>
                  <Text>Done</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </ModalContain>

        <ModalContain isModalShow={this.state.showType === 'three'}>
          <CascadePicker
            dataSource={threeData}
            confirm={this.showData}
            cancel={this.close}
            onceChange={(arr) => {
              // console.info('once', arr);
            }}
            pickerDeep={2}
            pickerStyle={{
              itemHeight: 50,
              // visibleNum: 3,
              // activeBgColor: '#a00',
              // activeBgOpacity: 0.5,
              // activeFontSize: 25,
              // activeFontColor: '#00F',

              // normalBgColor: '#a00',
              // normalBgOpacity: 1,
              // normalFontSize: 10,
              // normalFontColor: '#0a0',
            }}
            headOptions={{
              cancelText: '取消',
              confirmText: '确认',
              headHeight: 40,
              borderTopRadius: 10,
              backgroundColor: '#444',
              confirmStyle: {fontSize: 20, color: '#fff', fontWeight: 'bold'},
              cancelStyle: {color: '#fff'},
            }}
          />
        </ModalContain>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
  head: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
});
