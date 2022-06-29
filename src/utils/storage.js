/*
封装本地存储操作模块
*/

/*
存储数据
*/
export const setItem = (key, value) => {
  if (typeof value === 'object') {
    // 将数组，对象类型的数据转为JSON格式字符串存储到本地
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}
/*
获取数据
*/
export const getItem = key => {
  const data = localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

/*
删除数据
*/
export const removeItem = key => {
  window.localStorage.removeItem(key)
}
