# echartspie

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/react-ts-ett7sc)

### 数据传参

```
{
  data: [],
  radius: string | number | Array | Object
  legendOption = {},
  tooltipOption = {},
  seriesOption = {},
  autoPlay
  autoPlayOption // 自动轮播配置项，默认为3000 ms
  centerBlockOption
}
```

- data
  data 为数据源，格式如下

  ```
  [
    {
      name: '区域点位',
      value: 47,
    },
    {
      name: '饮用水源点位',
      value: 11,
    },
    {
      name: '风险监控点',
      value: 2,
    },
  ]
  ```

- radius

  - radius 可不传，默认为 50%，普通饼图；
  - radius 可传 Number 类型如 50，或 String 类型如 50%，控制普通饼图的大小；
  - radius 可传 Array<number|string>类型，为环形图。数组的第一项是内半径，第二项是外半径。每一项遵从上述 number string 的描述；
  - radius 可传 Object 类型，如{ 0: 50, 1: '80%' }，为双饼图。

- legendOption
  legendOption 为 legend 配置项,
  其中新增 content 属性可对 legend 内容进行自定义

  - content

    1. 例 1
       返回 string 格式, 此例中图例前的 icon 遵从原有 echarts 配置进行设置，如 icon: 'circle',

       ```
        content: (params) => {
          return `${params.name} ${params.value} ${params.percent?.toFixed(
            2
          )}%`;
        }
       ```

    2. 例 2
       返回 HTMLDOM 格式, 此例中图例前的 icon 需自行设置
       ```
        content: (params) => {
          return (
            <div style={{ fontSize: 12 }}>
              <!-- icon -->
              <div className='icon'></div>
              <div style={{ fontSize: 14 }}>{params.name}</div>
              <div>
                {params.value} {`${params.percent?.toFixed(2)}%`}
              </div>
            </div>
          );
        }
       ```

    - params
      params 是 content 需要的数据集。格式如下

      ```
      {
          // 数据名，类目名
          name: string,
          // 数据在传入的 data 数组中的 index
          dataIndex: number,
          // 传入的原始数据项
          data: Object,
          value: number|Array|Object,
          // 数据图形的颜色
          color: string,
          // 饼图，漏斗图的百分比
          percent: number
      }
      ```

- tooltipOption
  tooltipOption 为 tooltip 配置项,
  其中新增 content 属性可对 tooltip 内容进行自定义

  - content

    1. 例 1
       可返回 dom 格式的 string 类型，但需是原生 dom

       ```
       content: (params, ticket, callback) => {
         return `
             <div style="font-size: 14px; color: #595959">
               <div>${params.name}</div>
               <div>
               <span style="color: ${params.color};font-size: 24px; font-weight: 600;">${params.value}</span>  个
               </div>

             </div>
           `;
       }
       ```

    2. 例 2
       此例可返回 react 格式的 dom 结构，返回类型为 HTMLDOM

       ```
       content: (params, ticket, callback) => {
         return (
           <div style={{ fontSize: 14, color: '#595959' }}>
             <div>{params.name}</div>
             <div>
               <span
                 style={{
                   color: params.color,
                   fontSize: 24,
                   fontWeight: 600,
                 }}
               >
                 {params.value}
               </span>{' '}
               个
             </div>
           </div>
         );
       },
       ```

    - params
      第一个参数 params 是 content 需要的数据集。格式如下

      ```
      {
        componentType: 'series',
        // 系列类型
        seriesType: string,
        // 系列在传入的 option.series 中的 index
        seriesIndex: number,
        // 系列名称
        seriesName: string,
        // 数据名，类目名
        name: string,
        // 数据在传入的 data 数组中的 index
        dataIndex: number,
        // 传入的原始数据项
        data: Object,
        // 传入的数据值。在多数系列下它和 data 相同。在一些系列下是 data 中的分量（如 map、radar 中）
        value: number|Array|Object,
        // 坐标轴 encode 映射信息，
        // key 为坐标轴（如 'x' 'y' 'radius' 'angle' 等）
        // value 必然为数组，不会为 null/undefied，表示 dimension index 。
        // 其内容如：
        // {
        //     x: [2] // dimension index 为 2 的数据映射到 x 轴
        //     y: [0] // dimension index 为 0 的数据映射到 y 轴
        // }
        encode: Object,
        // 维度名列表
        dimensionNames: Array<String>,
        // 数据的维度 index，如 0 或 1 或 2 ...
        // 仅在雷达图中使用。
        dimensionIndex: number,
        // 数据图形的颜色
        color: string,
        // 饼图，漏斗图的百分比
        percent: number
      }
      ```

- centerBlockOption
  centerBlockOption 为圆环内置内容的设置项，可不传，不传则为圆环内置内容显示

  其格式如下：

  ```
  {
    margin: 5,
    padding: 5,
    border: '1px solid #000',
    radius: '40%',
    backgroundColor: '#DBDFF1',
    backgroundImage:
            'https://t7.baidu.com/it/u=2582370511,530426427&fm=193&f=GIF',
    content: (params) => {
      return (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {params.name}
        </div>
      );
    },
  }
  ```

  其中 content 可显示内容自定义，可返回 HTMLDOM 或者 string 类型。

  1. 例 1
     当 content 需跟随高亮变化时，可使用 HTMLDOM 返回

     ```
     content: (params) => {
      return (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {params.name}
        </div>
      );
     },
     ```

     - params
       params 是 content 需要的数据集。格式如下

       ```
       {
           // 数据名，类目名
           name: string,
           // 数据在传入的 data 数组中的 index
           dataIndex: number,
           // 传入的原始数据项
           data: Object,
           value: number|Array|Object,
           // 数据图形的颜色
           color: string,
           // 饼图，漏斗图的百分比
           percent: number
       }
       ```

  2. 例 2
     当 content 为固定显示内容时，可直接返回 string 类型

     ```
     content: (params) => {
       return 'ffffffffff';
     },
     ```

  radius 为 centerBlock 的区域大小

- autoPlay
  是否开启自动轮播，默认为 false

- autoPlayOption
  自动轮播的配置项
  {
  time: 3000,
  seriesIndex: 0,
  }
  time 为轮播速度，默认为 3000
  seriesIndex 为轮播数据 series，默认为 0。双饼图中可传 Array。
