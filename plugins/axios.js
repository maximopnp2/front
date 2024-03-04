import axios from 'axios'

export default axios.create({
  baseURL: 'http://localhost:3333/api/v1/',
  // baseURL: 'http://192.168.10.53:3333/api/v1/',
  headers: {
    'Access-Control-Allow-Origin': 'true',
    'Content-Type': 'application/json'
  }
})
//192.168.1.23