/*
 * @Author: xuwei
 * @Date: 2020-11-18 09:23:11
 * @LastEditTime: 2021-02-07 09:47:12
 * @LastEditors: xuwei
 * @Description:
 */
import React, {Component} from 'react';
import {TouchableOpacity, Text, View, StyleSheet, Image} from 'react-native';
import {ModalContain} from './pickercontain';

import {CascadePicker, ParallelPicker} from '../localpicker/index';
// import {CascadePicker, ParallelPicker} from 'react-native-slidepicker';

// const specData = require('./testfiles/spec.json');
const specData = require('./testfiles/spec_cn.json');

const oneData = require('./testfiles/one.json');
// const threeData = require('./testfiles/three.json');
const threeData = require('./testfiles/area.json');
const ICON_DOG = require('./testfiles/dog.png');

export default class PickerDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {showType: '', dataSpec: [], dataAnimal: [], dataArea: []};
  }

  close = () => this.setState({showType: ''});

  showData = (arr) => {
    this.setState({showType: ''});
    console.info('arr', arr);
  };

  setOnePickerRef = (ref) => (this.oneRef = ref);

  showOneData = () => {
    const data = this.oneRef.getResult();
    console.info('animaldata', data);
    this.setState({dataAnimal: data, showType: ''});
  };

  setSpec = (res) => {
    this.setState({dataSpec: res, showType: ''});
    console.info('result:', res);
  };
  setAnimal = (res) => {
    this.setState({dataAnimal: res, showType: ''});
    console.info('result:', res);
  };
  setArea = (res) => {
    this.setState({dataArea: res, showType: ''});
    console.info('result:', res);
  };

  render() {
    return (
      <View style={styles.page}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.setState({showType: 'spec'})}>
          {/* <Text style={{fontSize: 20}}>Demo1(ParallelPicker)</Text> */}
          <Text style={{fontSize: 20}}>1:规格选择</Text>
          <View style={{marginLeft: 10}}>
            {this.state.dataSpec.map(function (spec, i) {
              return <Text key={i}>{spec.name}</Text>;
            })}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {marginTop: 20}]}
          onPress={() => this.setState({showType: 'one'})}>
          <Text style={{fontSize: 20}}>2:单选</Text>
          <View style={{marginLeft: 10}}>
            {this.state.dataAnimal.map(function (animal, i) {
              return <Text key={i}>{animal.name}</Text>;
            })}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {marginTop: 20}]}
          onPress={() => this.setState({showType: 'three'})}>
          <Text style={{fontSize: 20}}>3:地区选择</Text>
          <View style={{marginLeft: 10}}>
            {this.state.dataArea.map(function (area, i) {
              return <Text key={i}>{area.name}</Text>;
            })}
          </View>
        </TouchableOpacity>

        {/* color size */}
        <ModalContain isModalShow={this.state.showType === 'spec'}>
          <ParallelPicker
            dataSource={specData}
            confirm={this.setSpec}
            cancel={this.close}
            values={this.state.dataSpec}
            // onceChange={(arr) => {
            //   console.info('once', arr);
            // }}
            // pickerDeep={1}
            // pickerStyle={
            //   {
            //     // itemHeight: 50,
            //     // visibleNum: 3,
            //     // // activeBgColor: '#a00',
            //     // // activeBgOpacity: 0.5,
            //     // activeFontSize: 25,
            //     // activeFontColor: '#00F',
            //     // normalBgColor: '#a00',
            //     // normalBgOpacity: 1,
            //     // normalFontSize: 10,
            //     // normalFontColor: '#0a0',
            //   }
            // }
          />
        </ModalContain>

        {/* Animal */}
        <ModalContain isModalShow={this.state.showType === 'one'}>
          <ParallelPicker
            ref={this.setOnePickerRef}
            dataSource={oneData}
            confirm={this.setAnimal}
            cancel={this.close}
            values={this.state.dataAnimal}
            pickerDeep={1}
            pickerStyle={{
              visibleNum: 3,
              itemHeight: 60,
              activeFontColor: '#F52D3A',
              activeFontSize: 21,
              normalFontColor: '#ccc',
            }}
            customHead={
              <View style={styles.head}>
                <Image source={ICON_DOG} style={{width: 36, height: 36}} />
                <Text style={{fontSize: 18}}>Choose Animals</Text>
                <TouchableOpacity onPress={this.showOneData}>
                  <Text style={{fontSize: 18, color: '#0aa'}}>完成</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </ModalContain>

        <ModalContain isModalShow={this.state.showType === 'three'}>
          <CascadePicker
            dataSource={threeData}
            confirm={this.setArea}
            cancel={this.close}
            values={this.state.dataArea}
            onceChange={(arr) => {
              console.info('once', arr);
            }}
            pickerDeep={3}
            pickerStyle={{
              itemHeight: 50,
              visibleNum: 5,
              activeBgColor: '#A00',
              activeBgOpacity: 0.5,
              activeFontSize: 19,
              activeFontColor: '#FFF',

              normalBgColor: '#999',
              normalBgOpacity: 1,
              normalFontSize: 13,
              normalFontColor: '#333',
            }}
            headOptions={{
              cancelText: '取消',
              confirmText: '确认',
              headHeight: 50,
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
    // zIndex: 10,
    flexDirection: 'row',
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
