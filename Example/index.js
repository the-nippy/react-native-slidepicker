/*
 * @Author: xuwei
 * @Date: 2020-11-11 12:25:58
 * @LastEditTime: 2020-11-18 09:27:12
 * @LastEditors: xuwei
 * @Description:
 */
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import PickerDemo from './demo/index';

AppRegistry.registerComponent(appName, () => PickerDemo);
