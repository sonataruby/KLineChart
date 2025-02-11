/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { isValid } from '../../utils/typeChecks'

import { InvalidateLevel } from '../constants'

export default class CrosshairStore {
  constructor (chartData) {
    this._chartData = chartData
    // 十字光标信息
    this._crosshair = {}
  }

  /**
     * 设置十字光标点信息
     * @param crosshair
     * @param notInvalidate
     */
  set (crosshair, notInvalidate) {
    const dataList = this._chartData.dataList()
    const cr = crosshair || {}
    let realDataIndex
    let dataIndex
    if (isValid(cr.x)) {
      realDataIndex = this._chartData.timeScaleStore().coordinateToDataIndex(cr.x)
      if (realDataIndex < 0) {
        dataIndex = 0
      } else if (realDataIndex > dataList.length - 1) {
        dataIndex = dataList.length - 1
      } else {
        dataIndex = realDataIndex
      }
    } else {
      realDataIndex = dataList.length - 1
      dataIndex = realDataIndex
    }
    const kLineData = dataList[dataIndex]
    const realX = this._chartData.timeScaleStore().dataIndexToCoordinate(realDataIndex)
    const prevCrosshair = { x: this._crosshair.x, y: this._crosshair.y, paneId: this._crosshair.paneId }
    this._crosshair = { ...cr, realX, kLineData, realDataIndex, dataIndex }
    if (cr.paneId && kLineData) {
      this._chartData.crosshairChange({
        realDataIndex,
        dataIndex,
        kLineData,
        x: cr.x,
        y: cr.y
      })
    }
    if (
      (prevCrosshair.x !== cr.x || prevCrosshair.y !== cr.y || prevCrosshair.paneId !== cr.paneId) && !notInvalidate
    ) {
      this._chartData.invalidate(InvalidateLevel.OVERLAY)
    }
  }

  /**
   * 重新计算十字光标
   * @param notInvalidate
   */
  recalculate (notInvalidate) {
    this.set(this._crosshair, notInvalidate)
  }

  /**
   * 获取crosshair信息
   * @returns
   */
  get () {
    return this._crosshair
  }
}
