<template>
    <section class="w-full min-w-[1300px] whitespace-nowrap ">
        <div class="w-full  bg-slate-800 px-5 mt-2 h-[160px] ">


            <section class="flex  h-full " :class="select_radio == 1 ? 'items-start' : ' items-center'">
                <section class="  flex flex-col h-full justify-center items-center space-y-2 pr-2">
                    <div @click="changeRadio(1)" class="w-[125px] text-sm  h-[40px] flex items-center justify-center rounded  text-center"
                         :class="(select_radio == 1) ? 'bg-blue-500 text-white' : 'text-black bg-white'"
                        >实时数据</div>

                        <div @click="changeRadio(2)" class="w-[125px] h-[40px] flex items-center justify-center text-sm text-center rounded"
                        :class="(select_radio == 2) ? 'bg-blue-500 text-white' : 'text-black bg-white'"
                        >历史数据</div>
                </section>
                <section v-if="select_radio == 2" class="min-w-[320px]  ">

                    <div  class="flex items-center w-full space-x-2 ">
                        <span class="text-sm w-[50px]">时间</span>
                        <div class="w-[250px]  pb-1 pl-2">
                            <div class="demo-date-picker">
                                <div class="block w-full">
                                    <el-date-picker v-model="Datevalue" type="daterange" start-placeholder="开始日期"
                                        @change="datePicked($event)" end-placeholder="结束日期" :default-time="defaultTime"
                                        class="max-w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div  class="w-full flex items-center space-x-2">
                        <span class="text-sm w-[50px]">台桌</span>
                        <div class="w-[250px]  py-1 pl-2">
                            <el-select v-model="select_value" @change="gameTypeChange" clearable class="w-full"
                                placeholder="台桌 选择">
                                <el-option v-for="item in options" :key="item.rType"
                                    :label="transGameStr(item.rType) + item.roomName"
                                    :value="item.Id + ',' + item.rType + ',' + [item.roomName]">
                                    <span style="float:left" class="px-3">{{ transGameStr(item.rType) }}</span>
                                    <span style="float:right;  color:var(--el-text-color-secondary);
                                font-size:13px;">{{ item.roomName }}</span>
                                </el-option>
                            </el-select>
                        </div>
                    </div>

                    <div  class="w-full flex items-center space-x-2">
                        <span class="text-sm w-[50px]"> 选择局数</span>
                        <div class="w-[250px] py-1 pl-2">
                            <el-select v-model="select_round" class="w-full" clearable placeholder="选择局数">
                                <el-option v-for="item in roundData" :key="item.label" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </section>

                <section class="w-[400px]  h-[130px] mt-4">
                    <div class="text-center text-sm h-[30px] bg-slate-400 flex items-center ">
                        <el-input v-model.trim="enter_user" placeholder="会 员 关注区" clearable>
                            <template #append>
                                <el-button @click="addUser()" type="primary">添加</el-button>
                            </template>
                        </el-input>
                    </div>
                    <div class="h-[100px] w-full bg-slate-600 overflow-y-auto">
                        <div class="py-1 flex flex-wrap items-center w-full px-1  ">
                            <div v-for="(data, index) in betCompareUserArray" :key="data"
                                class="max-w-[150px] mr-2 mb-2 flex items-center">
                                <div class="max-w-[130px] px-2 bg-slate-900 overflow-hidden text-[15px] text-ellipsis">
                                    {{ data
                                    }}
                                </div>
                                <div @click="removeUser(data, index)" class="px-1 bg-slate-300 cursor-pointer ">
                                    <XIcon class="h-full w-5 py-[3px] text-black "></XIcon>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>

                <!-- <section v-if="select_radio == 2" class="w-[250px] ml-3">
                    <div class="flex items-center space-x-2 w-full pl-1 py-1 ">
                        <span class="text-sm">代理占成</span>
                        <div class="py-1 rounded px-2 font-bold text-xl bg-white w-full text-black">
                            {{ 0 }}
                        </div>
                    </div>
                    <div class="flex items-center space-x-2 w-full pl-1 py-1 ">
                        <span class="text-sm">账号信息</span>
                        <div class="py-1 rounded px-2 font-bold text-xl bg-white w-full text-black">
                            {{ 0 }}
                        </div>
                    </div>
                    <div class="flex items-center space-x-3 w-full pl-3 py-1">
                        <span class="text-sm">总代理</span>
                        <div class="py-1 rounded px-2 font-bold text-xl bg-white w-full text-black">
                            {{ 0 }}
                        </div>
                    </div>
                </section>

                <section v-if="select_radio == 2" class="w-[300px] ml-3">
                    <div class="flex items-center space-x-3 w-full py-1">
                        <span class="text-sm tracking-widest">查询时间洗码</span>
                        <div class="py-1 rounded px-2 font-bold text-xl bg-white w-full  text-black">
                            {{ 0 }}
                        </div>
                    </div>
                    <div class="flex items-center space-x-3 w-full py-1">
                        <span class="text-sm tracking-widest">查询时间输赢</span>
                        <div class="py-1 rounded px-2 font-bold text-xl bg-white w-full  text-black">
                            {{ 0 }}
                        </div>
                    </div>
                    <div class="flex items-center space-x-3 w-full py-1">
                        <span class="text-sm tracking-widest">查询时间输赢</span>
                        <div class="py-1 rounded px-2 font-bold text-xl bg-white w-full  text-black">
                            {{ 0 }}
                        </div>
                    </div>
                </section> -->

                <section class="h-[130px] w-[150px] bg-slate-700  ml-3 flex flex-col justify-center py-2 items-center"
                :class="select_radio == 1 ? 'mt-[15px]' : 'mt-[12px]'"
                >
                    <el-button v-if="select_radio == 1" style="padding:0 40px" @click="requestData()" :type="dataBtnCondition ? '' : 'danger'"   > {{ dataBtnCondition ? '开始' : '停止' }}</el-button>
                    <div>
                        <el-button v-if="select_radio == 2" @click="reqData" type="primary" style="padding:0 25px">请求数据</el-button>
                    </div>
                </section>
            </section>
        </div>
        <section class="py-3 w-full tableHeight " v-if="betCompareData?.length > 0 && select_radio == 1">
            <el-table stripe :data="betCompareData" border style="width: 100%" height="100%" min-height="100%"
                :header-cell-style="{ textAlign: 'center', padding: 4 + 'px' }"
                :cell-style="{ textAlign: 'center', padding: 4 + 'px' }">
                <el-table-column prop="roomName" label="台号" fixed="left" />
                <el-table-column prop="cc" label="局数" fixed="left">
                    <template #default="scope">
                        <div>
                            {{ ccSplit(scope.row.cc, 0) }}

                        </div>

                    </template>
                </el-table-column>
                <el-table-column prop="cc" label="口数" fixed="left">
                    <template #default="scope">
                        <div>
                            {{ ccSplit(scope.row.cc, 1) }}

                        </div>

                    </template>
                </el-table-column>
                
                <template v-for="(data, index) in betCompareUserArray " :key="index">
                    <el-table-column :label="data + ''">
                        <el-table-column class-name="text-red-500 " :prop="data" label="庄/龙">
                            <template #default="scope">
                                <div v-if="scope.row.rType == 'bjl'">
                                    {{ scope.row[data]?.banker}}
                                </div>
                                <div v-if="scope.row.rType == 'lh'">
                                    {{( scope.row[data]?.dragon || 0)}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="text-blue-500" :prop="data" label="闲/虎">
                            <template #default="scope">
                                <div v-if="scope.row.rType == 'bjl'">
                                    {{( scope.row[data]?.player || 0)}}
                                </div>
                                <div v-if="scope.row.rType == 'lh'">
                                    {{( scope.row[data]?.tiger || 0)}}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </template>
            </el-table>
        </section>
        <!-- 2 -->
        <section class="py-3 w-full tableHeight " v-if="searchVsMultiplayerData?.length > 0 && select_radio == 2">
            <el-table stripe :data="searchVsMultiplayerData" border style="width: 100%" height="100%" min-height="100%"
                :header-cell-style="{ textAlign: 'center', padding: 4 + 'px' }"
                :cell-style="{ textAlign: 'center', padding: 4 + 'px' }"
                v-el-table-infinite-scroll="loadmoreData"
                >
                <el-table-column prop="roomName" label="台号" fixed="left" />
                <el-table-column prop="cc" label="局数" fixed="left">
                    <template #default="scope">
                        <div>
                            {{ ccSplit(scope.row.cc, 0) }}

                        </div>

                    </template>
                </el-table-column>
                <el-table-column prop="cc" label="口数" fixed="left">
                    <template #default="scope">
                        <div>
                            {{ ccSplit(scope.row.cc, 1) }}

                        </div>

                    </template>
                </el-table-column>
                
                <template v-for="(data, index) in betCompareUserArray " :key="index">
                    <el-table-column :label="data + ''">
                        <el-table-column class-name="text-red-500 " :prop="data" label="庄/龙">
                            <template #default="scope">
                                <div v-if="scope.row.rType == 'bjl'">
                                    {{ scope.row[data]?.banker || 0}}
                                </div>
                                <div v-if="scope.row.rType == 'lh'">
                                    {{( scope.row[data]?.dragon || 0)}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="text-blue-500" :prop="data" label="闲/虎">
                            <template #default="scope">
                                <div v-if="scope.row.rType == 'bjl'">
                                    {{( scope.row[data]?.player || 0)}}
                                </div>
                                <div v-if="scope.row.rType == 'lh'">
                                    {{( scope.row[data]?.tiger || 0)}}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </template>
            </el-table>
        </section>
    </section>
</template>


<script setup>
import { ref, reactive, onMounted, computed,onBeforeUnmount } from 'vue'
import pomelo from "@/socket/pomelo.js";
import moment from 'moment'
import global from '@/utils/global';
import { useStore } from "vuex";
import { ElMessage } from 'element-plus'
import { XIcon } from '@heroicons/vue/outline';

const store = useStore();

const Datevalue = ref('')
const numberOfBoard = ref(1)
const select_round = ref('')
const roundData = reactive([])
// const compareAcc = ref('')
// const addAcc = ref('')
const select_radio = ref(1)


//
const enter_user = ref('')

const userArray = ref([])
const betCompareUserArray = computed(() => store.getters["app/BetCompareUserArray"]);

const showArray = ref([])

const defaultTime = ref([
    new Date(),
    new Date(),
])

//SearchVsMultiPlayer
const searchVsMultiplayerData = ref(null)

const betCompareData = ref(null)
const betCompareInterval = ref(null)
//btn condition
const dataBtnCondition = ref(false)
//getAllDesk
const select_value = ref('')
const options = computed(() => store.getters["app/GetAlllDesk"]);


const defaultOption = ref(['', '', ''])

const pagination = reactive({
    pageSize: 5,
    currentPage: 1,
    total: 0,
});

const changeRadio = (val) => {
    select_radio.value = val
    console.log(val);
}

//add user

function addUser() {
    if (enter_user.value == '' || enter_user.value == undefined || enter_user.value == null) return
    if (betCompareUserArray.value?.includes(enter_user.value)) return
    const sendStr = {
        router: "checkUserExit",
        JsonData: {
            username: enter_user.value
        }
    }
    console.log(sendStr,"checkdddddddddddddddddd");
    pomelo.send(sendStr,res => {
        console.log(res,"res of checkUserExit");
        if(res?.msg == 'ok'){
            //userArray.value.push(enter_user.value)
            store.commit('app/ADD_BET_COMPARE_USERARRAY', enter_user.value)
            // store.commit()
            enter_user.value = ''
            VsMultiPlayer()
        }else{
            ElMessage({
            message: res?.msg,
            type: 'warning',
        })
        }
    })
    // if (!userArray.value?.includes(enter_user.value)) {
    //     userArray.value.push(enter_user.value)
    // }
     
    // enter_user.value = ''
}

 

function removeUser(data, index) {
    store.commit('app/BET_COMPARE_USERARRAY_REMOVE', data)
    if(betCompareUserArray.value?.length < 1){
        betCompareData.value = null //
        searchVsMultiplayerData.value = null // data to null
    }
    console.log(betCompareUserArray.value, "userrrr");
}

const datePicked = ($event) => {
    if ($event == null) {
        console.log($event, 'leeeeeeeeeeenulllll');
        defaultTime.value = [
            new Date(2021, 10, 10, 0, 0, 0, 0),
            new Date()
        ]
    } else {
        defaultTime.value = $event
    }
    console.log($event, "lllllllllllllllll");
}

const gameTypeChange = (data) => {
    let gameInfo = data.split(',')
    defaultOption.value = gameInfo
    console.log(gameInfo, "dffsvft4ew");
}

function transGameStr(strGame) {
    // 游戏类型转换
    var msg = {
        bjl: '百家乐',
        lh: '龙虎',
        nn: '牛牛',
        xjh: '炸金花',
        dx: '大小',
        tts: '推筒子',
        ssc: '时时彩',
        jsk3: '江苏快3',
        bjcs: '北京赛车',
        all: '全部'
    }
    return msg[strGame]
}


function ccSplit(data, index) {
    let num = data.split('-')
    if (index == 0) {
        return num[0]
    } else {
        return num[1]
    }
}
 //requst of SearchVsMultiPlayer
const reqData = () => {
    if (betCompareUserArray.value?.length < 1) {
        ElMessage({
            message: '请输入用户名',
            type: 'warning',
        })
        return
    }
   // VsMultiPlayer()
   SearchVsMultiPlayer()
}

const handleplayerChange = (val) => {
    console.log(val, "leeeeeeeeeeedddd")
    VsMultiPlayer()
}
function transTime(times) {
    moment.suppressDeprecationWarnings = true;
    return moment(times).format('YYYY-MM-DD HH:mm:ss')
}
//to show in table
function loopUser() {
    let ele = ''
    for (let index = 0; index < betCompareUserArray.value?.length; index++) {
        let element = betCompareUserArray.value[index]
        ele = element
    }
    return ele
}


function VsMultiPlayer() {
    if(select_radio.value == 1){

    
    const sendStr = {
        router: 'VsMultiPlayer',
        JsonData: {
            Id: 1,
            players: betCompareUserArray.value,
            isSettlement: 1 // 0未结算，1已结算 默认为1
        }
    }
    pomelo.send(sendStr, res => {
        console.log('resp VsMultiPlayer ', res)
        var data = res?.JsonData
        betCompareData.value = data

    })
}
    // console.log(showArray.value,"array of showArray")
}

const loadmoreData = (val) => {
 console.log(val,"vallllllllllllllllof");
// SearchVsMultiPlayer()
}

function SearchVsMultiPlayer() {
      const sendStr = {
        router: 'SearchVsMultiPlayer',
        JsonData: {
          roomId: defaultOption.value[0] || '',
            rType: defaultOption.value[1] || '',
            deskNum: defaultOption.value[2] ,
            cc: select_round.value || '',
            players: betCompareUserArray.value,
            startTime: moment(new Date(defaultTime.value[0])).startOf('day').format("YYYY-MM-DD HH:mm:ss"),
            endTime: moment(new Date(defaultTime.value[1])).endOf('day').format("YYYY-MM-DD HH:mm:ss"),
            pageSize: pagination.pageSize,
                currentPage: pagination.currentPage
        }
      }
      console.log(sendStr,"sendStr of SearchVsMultiPlayer");
      pomelo.send(sendStr, res => {
        var data = res?.JsonData
        searchVsMultiplayerData.value = data
        console.log('response SearchVsMultiPlayer ', res)
      })
    }



function requestVsMultiPlayerThreeSec(){
    betCompareInterval.value = setInterval(() => {
        VsMultiPlayer()
    }, 3000);
}

const requestData = () => {
    dataBtnCondition.value = !dataBtnCondition.value
    // console.log(agentOption.value, "agentotion dsfaslfa");
    if (dataBtnCondition.value) {
        clearInterval(betCompareInterval.value)
        betCompareInterval.value = null
    } else {
        VsMultiPlayer()
         requestVsMultiPlayerThreeSec()
    }
}

function roundDataPush() {
    if (roundData.length == 0) {
        for (let index = 0; index < 101; index++) {
            if (index == 0) {
                roundData.push({ value: 'all', label: '全部' })
            } else {

                roundData.push({ value: index, label: index })
            }
        }
    }
}



onBeforeUnmount(() => {
    clearInterval(betCompareInterval.value)
    betCompareInterval.value = null
})

onMounted(() => {
    VsMultiPlayer()
    requestVsMultiPlayerThreeSec()
    roundDataPush()
})
</script>

<style scoped>
.tableHeight{
    height: calc(100vh - 215px);
    
    overflow-y: auto;
}
</style>