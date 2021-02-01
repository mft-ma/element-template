/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  /* var valid_map = []
  axios({
    url: 'http://localhost:7001/queryAllName',
    method: 'get'
  }).then(res => {
    console.log(res.data)
    valid_map = res.data
    console.log(valid_map)
  })*/
  const valid_map = ['admin', 'account']
  return valid_map.indexOf(str.trim()) >= 0
}
