/*
 * @Author: xuxiaowei
 * @Date: 2020-11-08 00:50:46
 * @LastEditTime: 2021-02-03 15:15:54
 * @LastEditors: xuwei
 * @Description:
 */
import {WithHeadAndMethod} from './src/hoc';
import {IndependentPicker} from './src/independent';
import {RelativedPicker} from './src/related';

export const ParallelPicker = WithHeadAndMethod(IndependentPicker);
export const CascadePicker = WithHeadAndMethod(RelativedPicker);
