import req from '../request'

const api = {
  requestIfAdd (deviceId) {
    return new Promise((resolve, reject) => {
      req
        .call('device/' + deviceId)
        .then(res => {
          console.log('raw', res)
          resolve(res.data)
        })
    })
  }
}

export default api
