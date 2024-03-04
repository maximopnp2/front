import Cookies from 'js-cookie'
import axios from '../plugins/axios'
import cookie from 'cookie'


export const state = () => ({
  auth: false,
  waiting_time:10,
  notifier_data:{
    show:false,
    text:'',
    color:'primary',
    timeout:3000
  },
  events: ['click', 'mousemove', 'mousedown', 'scroll', 'keypress'],
  running_events: ['click', 'mousemove', 'mousedown', 'scroll', 'keypress'],
  warningTimer: null,
  logoutTimer: null,
  warningZone: false,
})

export const mutations = {
      async automatic_login(state, res) {
        Cookies.set('token', res.token)
        Cookies.set('rol', res.rol) 
    
        if (res) {
            state.auth = true;
            state.token = Cookies.get('token');
        }
      },
      SET_AUTH(state, user ) { 
        state.auth = true;
        state.logoutTimer = user.session_time
        Cookies.set('token', user.token)
        Cookies.set('name', user.nombre)
        Cookies.set('lastname', user.apellido)
        Cookies.set('user_id', user.id)
        this.$router.push('/home')
      },
      async SET_AUTH_AUTOMATIC(state, res) {
        state.auth = true;
        this.$router.push('/home')
      },
      async SET_LOGOUT(state) {  
        state.auth = false;
        Cookies.remove('token') 
        Cookies.remove('name') 
        Cookies.remove('lastname') 
        Cookies.remove('user_id')
        this.$router.push('/login')
        state.events.forEach(function (event) {
          window.removeEventListener(event, null)
        })
        clearTimeout(state.logoutTimer)
      },
      SET_NOTIFIER(state, payload) { 
        state.notifier_data = payload
      },
      /* AUTO-LOGOUT */
      SET_LOGOUT_TIMER(state) {
        state.logoutTimer = setTimeout(()=>{
            this.dispatch('SET_LOGOUT')
        }, (parseInt(state.waiting_time)*60000))
      },
      SET_RUNNING_FUNCS(state, payload){
        state.running_events = payload
      },
      RESET_TIMER(state) {
        clearTimeout(state.logoutTimer)
      },
}
export const actions = {
   async nuxtServerInit ({ commit , state , }, { req }  ) { 
    if (req.headers) {     
        if (req.headers.cookie) {         
            let { token } = cookie.parse(req.headers.cookie);
            await axios
            .get("/automatic_login", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                let data = res.data
                data['token'] = token
                this.commit('automatic_login', data );
                
            }).catch(err => {            
                console.log('LOGIN_AUTOMICO_EEROR:', err)   
            })
        }
    }
  },
  SET_LOGOUT({ commit, state }){
    state.running_events.forEach(function (event) {
      window.removeEventListener(event.name, event.fn)
    })
    commit('RESET_TIMER')
    commit('SET_LOGOUT')
  },
  INITIAL_SET_AUTH({ commit, state }){
    const running = state.events.map((event) => {
      let fn = ()=> {
        commit('RESET_TIMER')
        commit('SET_LOGOUT_TIMER') 
      }
      window.addEventListener(event, fn)
      return {name:event, fn}
    })
    commit('SET_RUNNING_FUNCS', running)
    commit('SET_LOGOUT_TIMER') 
  }
}
