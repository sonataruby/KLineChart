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

export default {
  name: 'AO',
  calcParams: [5, 34],
  shouldCheckParamCount: true,
  plots: [{
    key: 'ao',
    title: 'AO: ',
    type: 'bar',
    baseValue: 0,
    color: (data, options) => {
      const { prev, current } = data
      const preAo = (prev.technicalIndicatorData || {}).ao
      const ao = (current.technicalIndicatorData || {}).ao
      if (ao > preAo) {
        return options.bar.upColor
      } else {
        return options.bar.downColor
      }
    },
    isStroke: (data) => {
      const { prev, current } = data
      const preAo = (prev.technicalIndicatorData || {}).ao
      const ao = (current.technicalIndicatorData || {}).ao
      return ao > preAo
    }
  }],
  calcTechnicalIndicator: (kLineDataList, { params }) => {
    const maxPeriod = Math.max(params[0], params[1])
    let shortSum = 0
    let longSum = 0
    let short = 0
    let long = 0
    return kLineDataList.map((kLineData, i) => {
      const ao = {}
      const middle = (kLineData.low + kLineData.high) / 2
      shortSum += middle
      longSum += middle
      if (i >= params[0] - 1) {
        short = shortSum / params[0]
        const agoKLineData = kLineDataList[i - (params[0] - 1)]
        shortSum -= ((agoKLineData.low + agoKLineData.high) / 2)
      }
      if (i >= params[1] - 1) {
        long = longSum / params[1]
        const agoKLineData = kLineDataList[i - (params[1] - 1)]
        longSum -= ((agoKLineData.low + agoKLineData.high) / 2)
      }
      if (i >= maxPeriod - 1) {
        ao.ao = short - long
      }
      return ao
    })
  }
}
