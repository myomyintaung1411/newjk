<template>
    <section class="w-full min-w-[1300px] whitespace-nowrap">
        <div class="w-full  bg-slate-800 px-5 mt-2 h-[160px] ">
            <!-- <div class=" flex justify-between tracking-[3px]">
                <p class="text-xl  font-bold">投注对比</p>
            </div> -->

            <section class="flex items-center">
                <section class="min-w-[320px]">
                    <div class="flex items-center w-full space-x-2 ">
                        <span class="text-sm w-[50px]">时间</span>
                        <div class="w-[250px]  pb-1">
                            <div class="demo-date-picker">
                                <div class="block w-full">
                                    <el-date-picker v-model="Datevalue" type="daterange" start-placeholder="开始日期"
                                        @change="datePicked($event)" end-placeholder="结束日期" :default-time="defaultTime"
                                        class="max-w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-full flex items-center space-x-2">
                        <span class="text-sm w-[50px]">台桌</span>
                        <div class="w-[250px]  py-1">
                            <el-select v-model="select_value" @change="gameTypeChange" clearable class="w-[250px]"
                                placeholder="台桌 选择">
                                <el-option v-for="item in options" :key="item.rType"
                                    :label="transGameStr(item.rType) + item.roomName"
                                    :value="item.Id + ',' + item.rType + ',' + [item.roomName]">
                                    <span style="float:left" class="px-3">{{ transGameStr(item.rType) }}</span>
                                    <span style="float:right;color:var(--el-text-color-secondary);
                                font-size:13px;">{{ item.roomName }}</span>
                                </el-option>
                            </el-select>
                        </div>
                    </div>

                    <div class="w-full flex items-center space-x-2">
                        <span class="text-sm w-[50px]"> 选择局数</span>
                        <div class="w-[250px] py-1">
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
                            <div v-for="(data, index) in userArray" :key="data"
                                class="max-w-[150px] mr-2 mb-2 flex items-center">
                                <div class="max-w-[130px] px-2 bg-slate-900 overflow-hidden text-[15px] text-ellipsis">
                                    {{ data
                                    }}
                                </div>
                                <div @click="removeUser(data, index)" class="px-1 bg-slate-300 cursor-pointer ">
                                    <XIcon class="h-full w-5 py-[3px] text-black "></XIcon>
                                </div>
                            </div>
                            <!--  -->
                        </div>
                    </div>
                    <!-- <div class="w-[340px] flex items-center space-x-3   ">
                    <span> 添加账号</span>
                    <div class="max-h-[100px] overflow-y-auto z-10">
                        <el-select v-model="select_user" @change="handleplayerChange" multiple filterable allow-create
                            clearable default-first-option fit-input-width :reserve-keyword="false"
                            placeholder="会 员 关注区">
                            <el-option v-for="item in userSearchOption" :key="item.value" :label="item.label"
                                :value="item.value" class=" overflow-y-auto" />
                        </el-select>
                    </div>
                </div> -->
                </section>
                <section class="w-[250px] ml-3">
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

                <section class="w-[300px] ml-3">
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
                </section>

                <section class="h-[130px] w-[150px] bg-slate-700  ml-3 flex flex-col justify-between py-2 items-center">
                    <el-button style="padding:0 40px" @click="requestData()" :type="dataBtnCondition ? '' : 'danger'"   > {{ dataBtnCondition ? '开始' : '停止' }}</el-button>
                    <div>
                        <el-button @click="reqData" type="primary" style="padding:0 25px">请求数据</el-button>
                    </div>
                </section>
            </section>
        </div>
        <section class="py-3 w-full " v-if="betCompareData?.length > 0">
            <el-table stripe :data="betCompareData" border style="width: 100%"
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
                
                <template v-for="(data, index) in userArray " :key="index">
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
            <!-- {{userArray}} -->
        </section>
    </section>
</template>


<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
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

//searchUser
// const userArray = ref([])
const userSearchOption = reactive([])

//
const enter_user = ref('')

const userArray = ref([])
const betCompareUserArray = computed(() => store.getters["app/BetCompareUserArray"]);

const showArray = ref([])

const defaultTime = ref([
    new Date(2021, 10, 10, 0, 0, 0, 0),
    new Date(),
])

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
// function checkUserExit() {
//     const sendStr = {
//         router: "checkUserExit",
//         JonsData: {
//             username: "tset1"
//         }
//     }
// }

function addUser() {
    if (enter_user.value == '' || enter_user.value == undefined || enter_user.value == null) return
    if (userArray.value?.includes(enter_user.value)) return
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
            userArray.value.push(enter_user.value)
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
    userArray.value = userArray.value?.filter((item) => {
        return item !== data
    })
    if(userArray.value?.length < 1){
        betCompareData.value = null
    }
    // showOnlineList.value = showOnlineList.value.filter((item) => {
    //     return item !== data
    // })
    console.log(userArray.value, "userrrr");
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

const reqData = () => {
    if (userArray.value?.length < 1) {
        ElMessage({
            message: '请输入用户名',
            type: 'warning',
        })
        return
    }
    VsMultiPlayer()
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
    for (let index = 0; index < userArray.value?.length; index++) {
        let element = userArray.value[index]
        ele = element
    }
    return ele
}


function VsMultiPlayer() {
    const sendStr = {
        router: 'VsMultiPlayer',
        JsonData: {
            Id: 1,
            roomId: defaultOption.value[0] || '',
            rType: defaultOption.value[1] || '',
            deskNum: defaultOption.value[2] || 'all' ,
            // jc: 'all',
            cc: select_round.value || '',
            players: userArray.value,
            //players: select_user.value,
            startTime: moment(new Date(defaultTime.value[0])).startOf('day').format("YYYY-MM-DD HH:mm:ss"),
            endTime: moment(new Date(defaultTime.value[1])).endOf('day').format("YYYY-MM-DD HH:mm:ss"),
            isSettlement: 1 // 0未结算，1已结算 默认为1
        }
    }
    // loopUser()
    console.log(sendStr, "sendStr ******");
    pomelo.send(sendStr, res => {
        console.log('resp VsMultiPlayer ', res)
        var data = res?.JsonData
        // var betOrderInquireForm = { tableData: [], totalItemsNum: 0 }
        // var tableData = betOrderInquireForm.tableData
    //    let search_user = loopUser()
    //     console.log(search_user, "leeeeee");
        // for (var i = 0; i < data?.length; i++) {
        //     tableData[i] = {}
        //     // for (let index = 0; index < userArray.value?.length; index++) {
        //     //     // const element = userArray.value[index];
                
        //     //     tableData[i][search_user] = data[i][search_user]
        //     // }
           
        //     tableData[i].bet_info = data[i].bet_info
        //     console.log(data[i][search_user]);
        //     // if(!showArray.value?.includes(data[i].search_user)){
        //     //     showArray.value.push(data[i].search_user)
        //     // }
        //     // console.log(typeof tableData[i].bet_info.banker);
        //     tableData[i].orderId = i + 1
        //     tableData[i].name = data[i].name
        //     tableData[i].userName = data[i].userName

        //     tableData[i].rType = data[i].rType
        //     tableData[i].gameType = global.transGameStr(data[i].rType)
        //     // tableData[i].betTime = data[i].time
        //     tableData[i].tableNum = data[i].roomName
        //     tableData[i].upperzc = data[i].upper_zc
        //     tableData[i].stime = transTime(data[i].stime)
        //     tableData[i].betTime = transTime(data[i].betTime)
        //     tableData[i].kj = data[i].kj
        //     tableData[i].cc = data[i].cc
        //     tableData[i].memberName = data[i].reference_name
        //     tableData[i].betOrderInfo = global.trasBetResult(data[i].rType, data[i].xzmx)
        //     tableData[i].betMoney = data[i].xz
        //     tableData[i].betMoney = data[i].xz
        //     tableData[i].xmf = data[i].xmf
        //     tableData[i].ip = data[i].ip // 权限表
        //     tableData[i].terminal = data[i].terminal
        //     // tableData[i].winlose = (data[i].yl).toFixed(2)
        //     tableData[i].table_diff = data[i].table_diff
        //     tableData[i].company_diff = data[i].company_diff
        // }
        // console.log(betOrderInquireForm?.tableData,"tableDAta &&&&&&&&");

        // betOrderInquireForm.totalItemsNum = res?.totalItem
        // pagination.total = res?.totalItem //pagination total
        betCompareData.value = data

    })
    // console.log(showArray.value,"array of showArray")
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

onMounted(() => {
    VsMultiPlayer()
    requestVsMultiPlayerThreeSec()
    roundDataPush()
})
</script>