/*
 * @Author: xuxiaowei
 * @Date: 2020-11-08 00:50:46
 * @LastEditTime: 2021-02-01 18:43:38
 * @LastEditors: xuwei
 * @Description:
 */
import {cleanData, WithHeadAndMethod} from './src/hoc';
// import {RelativedPicker, IndependentPicker} from './src/index';
import {IndependentPicker} from './src/independent';
import {RelativedPicker} from './src/index';

// export const CascadePicker = RelativedPicker;
// export const ParallelPicker = IndependentPicker;

export const ParallelPicker = WithHeadAndMethod(IndependentPicker);
export const CascadePicker = WithHeadAndMethod(RelativedPicker, cleanData);
