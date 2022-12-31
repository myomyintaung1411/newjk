import Global from '@/utils/global.js'
import AES from '@/utils/aes'
import $ws from '../../socket/ws2'
import {login} from '@/network/allApi'
import NoticeMsg from "@/utils/alert";
export default {

  state: () => ({
   //hjsystem table
   hjuserArray:[],
   hjagentArray:[],
   //save data
   saveData:false,
    //betcompare table of userArray
    betCompareUserArray:[],
    tableBetData:null,
    user: {},
    bjldetail:null,
    login: false,
    // token: sessionStorage.getItem('t') || '',
    // userId: sessionStorage.getItem('u_i') || '',
    token: '',
    userId: '',
    gameEn: {
      key: "@hKe9@A1lKe9$Tz1kE@8HnG7",
      iv: '1234567890123456'
    },
    allTableInfo:null,
    bjlData:null,
    dragonTigerData:null,
    cowcowData:null,
    getalldesk:null,

  }),

  getters: {
    //save Data
    SaveData:state => state.saveData,
    //hjsystem table
     HjUserArray:state => state.hjuserArray,
     HjAgentArray:state => state.hjagentArray,
    //
    BetCompareUserArray:state => state.betCompareUserArray,

    USERID: state => state.userId,
    LToken: state => state.token,
    USER: state => state.user,
    Game_En: state => state.gameEn,
    BJL_Detail:state => state.bjldetail,
    Table_BetData:state => state.tableBetData,
    //this is for all tables of bet data
    All_Table_Info:state => state.allTableInfo,

    BjlData:state => state.bjlData,
    DragonTigerData:state => state.dragonTigerData,
    CowCowData :state => state.cowcowData,
    GetAlllDesk:state => state.getalldesk
  },

  mutations: {
    SAVEDATA(state,payload){
     state.saveData = payload
    },
    BET_COMPARE_USERARRAY(state,payload){
      state.betCompareUserArray = payload
    },
    ADD_BET_COMPARE_USERARRAY(state,payload){
     state.betCompareUserArray?.push(payload)
    },

    BET_COMPARE_USERARRAY_REMOVE(state,payload){
      state.betCompareUserArray = state.betCompareUserArray?.filter((item) => {
        return item !== payload
    })
    },

    HJUSER_ARRAY(state,payload){
      state.hjuserArray = payload
    },
    ADD_HJUSER_ARRAY(state,payload){
      state.hjuserArray?.push(payload)
    },

    HJUSER_ARRAY_REMOVE(state,payload){
      state.hjuserArray = state.hjuserArray?.filter((item) => {
        return item !== payload
    })
    },

    HJAGENT_ARRAY(state,payload){
      state.hjagentArray = payload
    },
   ADD_HJAGENT_ARRAY(state,payload){
      state.hjagentArray?.push(payload)
    },
    HJAGENT_ARRAY_REMOVE(state,payload){
      state.hjagentArray = state.hjagentArray?.filter((item) => {
        return item !== payload
    })
    },

    

    ALL_TABLE_INFO(state,payload) {
      console.log("payload of all tables of bet data" , payload);
      state.allTableInfo = payload
    },
    BJL_DATA(state,payload) {
      state.bjlData = payload
    },
    DRAGON_TIGER_DATA(state,payload) {
      state.dragonTigerData = payload
    },
    COWCOW_DATA(state,payload) {
      state.cowcowData = payload
    },

    TABLE_BETDATA(state,payload) {
      state.tableBetData = payload
    },
    IS_LOGIN(state, payload) {
      state.login = payload
    },
    BjlDetail(state, payload) {
      console.log(payload,"BjlDetail");
      state.bjldetail = payload
    },
    /* User */
    SET_USERINFO(state, payload) {
      state.user = payload
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    GET_ALL_DESK(state,payload){
      state.getalldesk = payload
    }
  },

  actions: {
    login({ commit }, sendStr) {
      console.log(sendStr.JsonData.name + "sendstr *****");
      // const { username, password } = sendStr
      return new Promise((resolve, reject) => {
        const en = Global.gameEn
        login({ data: AES.encrypt(JSON.stringify(sendStr), en) }).then(response => {
          var body = response.data
          var msg = JSON.parse(AES.decrypt(body, en))
           console.log('login response ', msg)
          if (msg.router === 'LoginErr') {
            // Message.info(msg.reason)
            NoticeMsg.Message(msg.reason,'warning')
            console.error(msg.reason);
            reject()
          }
          if (msg.JsonData.enable === 0) {
            NoticeMsg.Message('亲, 您的帐户被锁定, 请联系上级','warning')
            // Message.info('亲, 您的帐户被锁定, 请联系上级!')
            console.error('亲, 您的帐户被锁定, 请联系上级!');
            reject()
          }
          if (msg.JsonData.level === 3) {
            NoticeMsg.Message('账号或密码错误!','error')
            console.error('账号或密码错误!');
            // Message.info('账号或密码错误!')
            reject()
          }
          commit('SET_TOKEN', msg.JsonData.token)
          commit('SET_USERINFO', msg.JsonData)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  },
  namespaced: true
}
