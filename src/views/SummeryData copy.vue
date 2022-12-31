<script setup>
import { ref, onMounted, computed, onBeforeUnmount, reactive } from 'vue'
import pomelo from "@/socket/pomelo.js";
import global from '@/utils/global';
import moment from 'moment'
import { useStore } from "vuex";
const store = useStore();

const pagination = reactive({
    pageSize: 10,
    currentPage: 1,
    total: 0,
});

const loading = ref(true)


//summeryData
const summeryData = ref(null)
const summerDataInterval = ref(null)
const sumData = ref(null)
const topTotal = ref(null)
//btn condition
const dataBtnCondition = ref(false)

const defaultTime = ref([
    new Date(2021, 10, 10, 0, 0, 0, 0),
    new Date(),
])


const Datevalue = ref('')
const accountNum = ref('')
//getAllDesk
const select_value = ref('')
const options = computed(() => store.getters["app/GetAlllDesk"])

const defaultOption = ref(['', '', ''])

//
const lhOrBaccarat = ref('')

const select_round = ref('')
const roundData = reactive([])

const block_ratio = ref('')
const blockData = reactive([
    {
        value: '111',
        label: '111'
    },
    {
        value: '222',
        label: '222'
    }
])
//
const select_dd = ref('')
const ddData = reactive([
   
])

const mul_select = ref('')
const multiOption = reactive([
    {
        value: '10%',
        label: '10%',
    },
    {
        value: '20%',
        label: '20%',
    },
    {
        value: '30%',
        label: '30%',
    },
    {
        value: '40%',
        label: '40%',
    },
    {
        value: '50%',
        label: '50%',
    },
    {
        value: '60%',
        label: '60%',
    },
    {
        value: '70%',
        label: '70%',
    },
    {
        value: '80%',
        label: '80%',
    },
    {
        value: '90%',
        label: '90%',
    },
    {
        value: '100%',
        label: '100%',
    },
])

const tableData = reactive([
    {
        1: '12987122',
        2: 'Tom',
        3: '234',
        4: '3.2',
        5: 10,
        6: 10,
        7: 10,
        8: 10,
        9: 10,
        10: 10,
    },
])

const showTestColumn = ref(false)
//select type
const select_type = ref(1)
//radio
const select_radio = ref(1)

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
const gameTypeChange = (data) => {
    let gameInfo = data.split(',')
    defaultOption.value = gameInfo
    // lhOrBaccarat.value = gameInfo[2]
    console.log(gameInfo, "dffsvft4ew");
}

const selectChange = (val) => {
    console.log(val, 'radio &&&');
}

const disable_ddData = computed(()=>{
    if(!select_round.value){
        select_dd.value = ''
        return true
    }else{
        return false
    }
})

//show table two
function showtableTwo() {
    if (select_type.value == 2 && (select_value.value || select_round.value)) {
        // console.log("ddd yes");
        return true
    } else {
        //console.log("false");
        return false
    }
}
//show table three
function showtableThree() {
    if (select_type.value == 2 && (select_value.value && select_round.value)) {
        // console.log("ddd yes");
        return true
    } else {
        //console.log("false");
        return false
    }
}
//show table four
function showtableFour() {
    if (select_type.value == 2 && (select_value.value && select_round.value && select_dd.value && accountNum.value)) {
        // console.log("ddd yes");
        return true
    } else {
        //console.log("false");
        return false
    }
}

function transTime(times) {
    moment.suppressDeprecationWarnings = true;
    return moment(times).format('YYYY-MM-DD HH:mm:ss')
}
function currentRow(row) {
    console.log(row, "lesersdf")
}



// function getSummaries(param) {
//     const { columns, data } = param;
//     const sums = [];
//     columns.forEach((column, index) => {
//         if (column.label === '台号') {
//             sums[index] = '合计';//可更改合计行的名称 The name of the total row can be changed
//             return;
//         }
//         const values = data.map(item => {
//             item[column.property].banker
//         }
//         );

//         if (column.property === 'bet_info') {
            
//             sums[index] = values.reduce((prev, curr) => {
//                 let value = Number(curr);
//                 if (!isNaN(value)) {
//                     return prev + curr;
//                 } else {
                   
//                     return prev  ;
//                 }
//             }, 0);
//             sums[index];

//         }
//     });
//     return sums
// }

 function getSummaries(param) {
        const { columns, data } = param;
       /*   console.log(1234)
        console.log(param)   */ 
        const sums = [];

        columns.forEach((column, index) => {
        if (column.label === '台号') {
            sums[index] = '合计';//可更改合计行的名称 The name of the total row can be changed
            return;
        }

        const values = data.map(item => {
            return Number(item[column.property])//property为表头的prop值 property is the prop value of the header
        });
        if (column.property === 'bet_info') {
         switch(column.label) {
            case "庄/龙":
            sums[index] = sumData.value?.banker
            break;
            case "闲/虎":
            sums[index] = sumData.value?.player
            break;
            case "庄对":
            sums[index] = sumData.value?.b_pair
            break;
            case "和":
            sums[index] = sumData.value?.tie
            break;
            case "闲对":
            sums[index] = sumData.value?.p_pair
            break;
            default:
            break;
          }
        } else if (column.property === 'betMoney') {
            sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                    return prev + curr;
                } else {
                    return prev;
                }
            }, 0);
            sums[index];

        }

        });
   

        return sums;
      }


function getTotalInfo() {
    const sendStr = {
        router: 'getTotalInfo',
        JsonData: {
            // deskNum: '16',
            // roomId: '1',
            // rType: 'bjl',
            deskNum: select_type.value == 1 ? 'all' : defaultOption.value[2] || 'all',
            roomId: select_type.value == 1 ? '' : defaultOption.value[0] || '',
            rType: select_type.value == 1 ? '' : defaultOption.value[1] || '',
            jc: select_type.value == 1 ? '' : select_dd.value,
            cc: select_type.value == 1 ? '' :  select_round.value || '',
            zc: JSON.stringify(mul_select.value),
            account: select_type.value == 1 ? '' : accountNum.value || '',
            startTime: moment(new Date(defaultTime.value[0])).startOf('day').format("YYYY-MM-DD HH:mm:ss"),
            endTime: moment(new Date(defaultTime.value[1])).endOf('day').format("YYYY-MM-DD HH:mm:ss"),
            isSettlement: 1 // only 1
        }
    }
    console.log(sendStr, "sendingData of getTotalInfo");
    pomelo.send(sendStr, res => {
        loading.value = false
        console.log('resp of getTotalInfo', res)
        sumData.value = res?.summary
        topTotal.value = res?.top_total
        var data = res.JsonData
        var betOrderInquireForm = { tableData: [], totalItemsNum: 0 }
        var tableData = betOrderInquireForm.tableData

        for (var i = 0; i < data?.length; i++) {
            tableData[i] = {}
            tableData[i].bet_info = data[i].bet_info
            // console.log(typeof tableData[i].bet_info.banker);
            tableData[i].orderId = i + 1
            tableData[i].name = data[i].name
            tableData[i].userName = data[i].userName

            tableData[i].rType = data[i].rType
            tableData[i].gameType = global.transGameStr(data[i].rType)
            // tableData[i].betTime = data[i].time
            tableData[i].tableNum = data[i].roomName
            tableData[i].upperzc = data[i].upper_zc
            tableData[i].stime = transTime(data[i].stime)
            tableData[i].betTime = transTime(data[i].betTime)
            tableData[i].kj = data[i].kj
            tableData[i].cc = data[i].cc
            tableData[i].memberName = data[i].reference_name
            tableData[i].betOrderInfo = global.trasBetResult(data[i].rType, data[i].xzmx)
            tableData[i].betMoney = data[i].xz
            tableData[i].betMoney = data[i].xz
            tableData[i].xmf = data[i].xmf
            tableData[i].ip = data[i].ip // 权限表
            tableData[i].terminal = data[i].terminal
            tableData[i].winlose = (data[i].yl).toFixed(2)
            tableData[i].table_diff = data[i].table_diff
            tableData[i].company_diff = data[i].company_diff
            tableData[i].table_winlose = (data[i].table_winlose).toFixed(2)
            tableData[i].company_winlose = (data[i].company_winlose).toFixed(2)

            let resultData = global.betInfoData(data[i].xzmx, tableData[i].rType)
            tableData[i].niuniu = resultData[0]
            tableData[i].niuniuBet = resultData[1]
            tableData[i].showResult = tableData[i].niuniu.map((item, index) => {
                return item + ':' + tableData[i].niuniuBet[index]
            })
            tableData[i].tablePara = global.getTablePara(
                data[i].rType,
                tableData[i].betOrderInfo
            )
        }
        betOrderInquireForm.totalItemsNum = res?.totalItem
        pagination.total = res?.totalItem //pagination total
        summeryData.value = betOrderInquireForm
    })
}



 function ccSplit(data,index) {
   let num = data.split('-')
   if(index == 0){
    return num[0]
   }else{
    return num[1]
   }
}

function reqData() {
    getTotalInfo()
    // dataBtnCondition.value = !dataBtnCondition.value
    // if (dataBtnCondition.value) {
    //     clearInterval(summerDataInterval.value)
    //     summerDataInterval.value = null
    // } else {
    //     getTotalInfo()
    //     requestsummerDataFiveSec()
    // }
}

function requestsummerDataFiveSec() {
    summerDataInterval.value = setInterval(() => {
        getTotalInfo()
        console.log("3 log second");
    }, 3000);
    // }
}

onBeforeUnmount(() => {
    clearInterval(summerDataInterval.value)
    summerDataInterval.value = null
})

function roundDataPush() {
    if (roundData.length == 0) {
        for (let index = 0; index < 101; index++) {
            if (index == 0) {
                roundData.push({ value: 'all', label: 'all' })
            } else {

                roundData.push({ value: index, label: index })
            }
        }
    }
}
function ddDataPush() {
    if (ddData.length == 0) {
        for (let index = 0; index < 40; index++) {
            if (index == 0) {
                ddData.push({ value: 'all', label: 'all' })
            } else {

                ddData.push({ value: index, label: index })
            }
        }
    }
}

onMounted(() => {
    roundDataPush()
    ddDataPush()
    getTotalInfo()
    //requestsummerDataFiveSec()
})
</script>

<template>
    <section class="w-full min-w-[1300px]">
        <div class="flex items-center px-3 justify-between py-2 bg-slate-800 mt-2">
            <div class="">
                输赢汇总
            </div>
            <div class="btn flex cursor-pointer ">
                <!-- <div class="px-3 bg-blue-500">btn1</div>
                <div class="px-3 bg-red-500">btn2</div>
                <div class="px-3 bg-green-500">btn3</div>
                <div class="px-3 bg-yellow-500">btn4</div> -->
                <div @click="reqData()" class="px-5 py-2 bg-indigo-600 whitespace-nowrap">请求数据</div>
                <!-- <div @click="reqData(1)" class="px-5 py-2 bg-red-600 whitespace-nowrap">停止stop</div> -->
            </div>

        </div>
        <section class="w-full bg-slate-800 px-3 h-[230px] max-h-[230px] ">
            <!-- 1 -->

            <div class="flex items-center">
                <div class="w-[350px] flex items-center space-x-3">
                    <span>时间</span>
                    <div class="w-[260px]    py-3 ">
                        <div class="demo-date-picker ">
                            <div class="block w-full">

                                <el-date-picker v-model="Datevalue" type="daterange" start-placeholder="Start date"
                                    @change="datePicked($event)" end-placeholder="End date" :default-time="defaultTime"
                                    class="max-w-full" />
                            </div>
                        </div>
                    </div>
                </div>


                <div class="w-[350px] flex items-center space-x-3">
                    <span>选择类型</span>
                    <div class="w-[200px]">
                        <div class="w-[250px]  py-3 ">
                            <el-radio-group @change="selectChange" v-model="select_type">
                                <el-radio-button :label="1" border>all</el-radio-button>
                                <el-radio-button :label="2" border>only</el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>
                </div>


            </div>

            <!-- 2 -->
            <div class="flex items-center w-full  ">
                <div class="w-[350px]  flex items-center space-x-3 whitespace-nowrap">
                    <span>屏蔽占股比例</span>
                    <div class="w-[200px]   max-h-[50px] z-10  ">
                        <el-select v-model="mul_select" multiple filterable :reserve-keyword="false" clearable
                            default-first-option collapse-tags placeholder="屏蔽占成比例"
                            class="max-h-[100px] overflow-y-auto">
                            <el-option v-for="item in multiOption" :key="item.label" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div v-if="select_type == 2" class="w-[300px] flex items-center space-x-3">
                    <span>台桌 选择</span>
                    <div class="w-[200px]  py-3">
                        <el-select v-model="select_value" @change="gameTypeChange" clearable class="w-[200px]"
                            placeholder="台桌 选择">
                            <el-option v-for="item in options" :key="item.rType"
                                :label="transGameStr(item.rType) + item.roomName"
                                :value="item.roomId + ',' + item.rType + ',' + [item.roomName]">
                                <span style="float:left" class="px-3">{{ transGameStr(item.rType) }}</span>
                                <span style="float:right;color:var(--el-text-color-secondary);
                                font-size:13px;">{{ item.roomName }}</span>
                            </el-option>
                        </el-select>
                    </div>
                </div>



                <div class="flex items-center space-x-3 w-[300px]">
                    <span>投注金额</span>
                    <div class="py-1 rounded px-2 font-bold text-xl bg-white w-[185px] text-black">
                        {{topTotal?.xz.toFixed(2) || 0}}
                    </div>
                </div>
                <div class="flex items-center space-x-3 w-[300px]">
                    <span>客户输赢</span>
                    <div class="py-1 px-1 font-bold text-xl rounded bg-white w-[200px] text-black">
                        {{topTotal?.user_winlose.toFixed(2) || 0}}
                    </div>
                </div>
            </div>
            <!-- 3 -->
            <div class="flex items-center w-full relative ">
                <div class="w-[350px] text-white  flex items-center space-x-3">
                    <span>选择类型</span>
                    <div class="w-[233px] flex justify-end  py-3  ">
                        <el-radio-group v-model="select_radio">
                            <el-radio-button :label="1" border>会员</el-radio-button>
                            <el-radio-button :label="2" border>台桌</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>

                <div v-if="select_type == 2" class="w-[300px] flex items-center space-x-3">
                    <span> 选择局数</span>

                    <div class="w-[200px]  py-3">
                        <el-select v-model="select_round" class="w-[200px]" clearable placeholder="选择局数">
                            <el-option v-for="item in roundData" :key="item.label" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <!-- {{roundData}} -->
                </div>

                <div class="flex items-center space-x-3 w-[300px]">
                    <span>洗码额</span>
                    <div class="py-1 px-5 font-bold text-xl rounded bg-white w-[200px] text-black">
                        {{topTotal?.xml.toFixed(2) || 0}}
                    </div>
                </div>
                <div class="flex items-center space-x-3 w-[300px] ">
                    <span>代理利润</span>
                    <div class="py-1 px-1 font-bold text-xl rounded bg-white w-[200px] text-black">
                        {{topTotal?.agent_winlose.toFixed(2) || 0}}
                    </div>
                </div>

                <!-- <div class="flex items-center justify-end flex-shrink-0  absolute right-0 cursor-pointer w-[200px] ">
                    <div @click="reqData(0)" class="px-5 py-2 bg-indigo-600 whitespace-nowrap">停止start</div>
                    <div @click="reqData(1)" class="px-5 py-2 bg-red-600 whitespace-nowrap">停止stop</div>
                </div> -->

            </div>
            <!-- 4 -->
            <div class="flex">
                <div class="w-[350px] flex  items-center space-x-3">
                    <span>账号输入</span>
                    <div class="w-[230px]   py-3">
                        <el-input v-model="accountNum" clearable placeholder="账号输入" />
                    </div>
                </div>

                <div v-if="select_type == 2" class="w-[300px] flex items-center space-x-3">
                    <span>选择口数</span>
                    <div class="w-[200px]  py-3">
                        <el-select v-model="select_dd" :disabled="disable_ddData" class="w-[200px]" clearable placeholder="选择口数">
                            <el-option v-for="item in ddData" :key="item.label" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="flex items-center space-x-3 w-[300px]  ">
                    <span>洗码费</span>
                    <div class="py-1 px-5 font-bold text-xl rounded bg-white w-[200px] text-black">
                        {{topTotal?.xmf.toFixed(2) || 0}}
                    </div>
                </div>
                <div class="flex items-center space-x-3 w-[300px] ">
                    <span>公司利润</span>
                    <div class="py-1 px-1 font-bold text-xl rounded bg-white w-[200px] text-black">
                        {{topTotal?.company_winlose.toFixed(2) || 0}}
                    </div>
                </div>
            </div>
        </section>
        <section v-if="select_radio == 1" class="w-full py-3 relative">
            <el-table :data="summeryData?.tableData" show-summary 
             :summary-method="getSummaries"
            v-loading="loading"
                border :header-cell-style="{ textAlign: 'center' }" style="width: 100%">

                <el-table-column v-if="select_type != 1 && !showtableThree() && !showtableFour()" prop="stime" label="日期" width="160" align="center" />
                <el-table-column prop="tableNum" label="台号" align="center" />


                <!-- <el-table-column v-if="select_type != 1" prop="userName" label="局数 aa" /> -->


                <el-table-column v-if="select_type != 1" prop="cc" label="局数" align="center" >
                    <template #default="scope">
                            <div>
                               {{ ccSplit(scope.row.cc,0)}}
                                
                            </div>
                            
                        </template>
                </el-table-column>
                <!--  -->
                <el-table-column v-if="(select_type == 2 && !showtableTwo()) || showtableFour()" prop="cc" label="口数" align="center">
                    <template #default="scope">
                            <div>
                               {{ ccSplit(scope.row.cc,1)}}
                                
                            </div>
                            
                        </template>
                </el-table-column>

                <el-table-column v-if="showtableThree() || showtableFour()" prop="userName" label="会员" align="center"></el-table-column>



                <el-table-column v-if="select_type == 2 && !showtableTwo()" prop="betTime" width="160" label="开奖时间"
                    align="center" />
                <el-table-column v-if="select_type == 2 && !showtableTwo()" prop="kj" label="开奖结果"
                    align="center" />


                <el-table-column   label="会 员 下 注">
                    <el-table-column class-name="text-red-500 " prop="bet_info"  label="庄/龙" align="center">
                        <template #default="scope">
                            <div v-if="scope.row.rType == 'bjl'">
                                {{ scope.row.bet_info.banker || 0}}
                            </div>
                            <div v-if="scope.row.rType == 'lh'">
                                {{ scope.row.bet_info.dragon || 0 }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="text-blue-500" prop="bet_info"  label="闲/虎" align="center">
                        <template #default="scope">
                            <div v-if="scope.row.rType == 'bjl'">
                                {{ scope.row.bet_info.player || 0 }}
                            </div>
                            <div v-if="scope.row.rType == 'lh'">
                                {{ scope.row.bet_info.tiger || 0}}
                            </div>
                        </template>
                    </el-table-column>

                    <!-- <el-table-column
                        v-if="defaultOption[1] == 'lh' || defaultOption[1] == '' || defaultOption[1] == 'all'"
                        class-name="text-blue-500" prop="bet_info" label="龙d">
                        <template #default="scope">
                            <div>
                                {{ scope.row.bet_info.dragon }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="defaultOption[1] == 'lh' || defaultOption[1] == '' || defaultOption[1] == 'all'"
                        class-name="text-blue-500" prop="bet_info" label="老虎t">
                        <template #default="scope">
                            <div>
                                {{ scope.row.bet_info.tiger }}
                            </div>
                        </template>
                    </el-table-column> -->

                    <el-table-column class-name="text-red-500" prop="bet_info"  label="庄对" align="center">
                        <template #default="scope">
                            <div>
                                {{ scope.row.bet_info.b_pair || 0 }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="text-green-500" prop="bet_info"  label="和" align="center">
                        <template #default="scope">
                            <div>
                                {{ scope.row.bet_info.tie || 0}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="text-blue-500" prop="bet_info"  label="闲对" align="center">
                        <template #default="scope">
                            <div>
                                {{ scope.row.bet_info.p_pair || 0 }}
                            </div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <!-- if select type is all -->
                <el-table-column v-if="select_type == 1" label="统         计" align="center">
                    <el-table-column prop="betMoney" label="总投注" align="center" />

                    <!-- <el-table-column prop="table_diff" label="台面差额" align="center" /> -->
                    <el-table-column prop="table_diff" label="台面差额" align="center">

                        <template #default="scope">
                            <div :class="scope.row.table_diff < 0 ? 'text-blue-500' : 'text-red-500'">
                                {{ Math.abs(scope.row.table_diff) }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="company_diff" label="公司差额" align="center">

                        <template #default="scope">
                            <div :class="scope.row.company_diff < 0 ? 'text-blue-500' : 'text-red-500'">
                                {{ Math.abs(scope.row.company_diff) }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="table_winlose" label="台桌输赢" align="center" />
                    <el-table-column prop="xmf" label="洗码费" align="center" />
                    <el-table-column prop="winlose" label="会员输赢" align="center" />
                    <el-table-column prop="company_winlose" label="公司利润" align="center" />
                    <!-- <el-table-column prop="userName" label="开奖次数" align="center" /> -->
                </el-table-column>

                <!-- if select table is two -->

                <el-table-column v-if="showtableTwo()" label="统         计" align="center">
                    <el-table-column prop="betMoney" label="总投注" align="center" />
                    <el-table-column prop="table_diff" label="台面差额" align="center">

                        <template #default="scope">
                            <div :class="scope.row.table_diff < 0 ? 'text-blue-500' : 'text-red-500'">
                                {{ Math.abs(scope.row.table_diff) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="company_diff" label="公司差额" align="center">

                        <template #default="scope">
                            <div :class="scope.row.company_diff < 0 ? 'text-blue-500' : 'text-red-500'">
                                {{ Math.abs(scope.row.company_diff) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="table_winlose" label="台桌输赢" align="center" />
                    <el-table-column prop="xmf" label="洗码费" align="center" />
                    <el-table-column prop="winlose" label="会员输赢" align="center" />
                    <el-table-column prop="company_winlose" label="公司利润" align="center" />
                    <!-- <el-table-column prop="betMoney" label="开奖次数" align="center" /> -->
                </el-table-column>

                <el-table-column v-if="select_type == 2 && !showtableTwo()" label="统    计   结   果" align="center">

                    <el-table-column prop="betMoney" label="总投注" align="center" />
                    <el-table-column prop="table_diff" label="台面差额" align="center">

                        <template #default="scope">
                            <div :class="scope.row.table_diff < 0 ? 'text-blue-500' : 'text-red-500'">
                                {{ Math.abs(scope.row.table_diff) }}</div>
                        </template>
                    </el-table-column>

                </el-table-column>

                <el-table-column v-if="select_type == 2 && !showtableTwo()" prop="company_diff" label="公司差额"
                    align="center">

                    <template #default="scope">
                        <div :class="scope.row.company_diff < 0 ? 'text-blue-500' : 'text-red-500'">
                            {{ Math.abs(scope.row.company_diff) }}</div>
                    </template>
                </el-table-column>

                <el-table-column v-if="select_type == 2 && !showtableTwo()" prop="table_winlose" label="台桌输赢"
                    align="center" />
                <el-table-column v-if="select_type == 2 && !showtableTwo()" prop="xmf" label="洗码费 " align="center" />
                <el-table-column v-if="select_type == 2 && !showtableTwo()" prop="company_winlose" label="公司利润"
                    align="center" />
                <!-- <el-table-column prop="4" label="口数" />
            <el-table-column prop="5" label="开奖时间" />
            <el-table-column prop="6" label="开奖结果" />
            <el-table-column prop="7" label="日期" />
            <el-table-column prop="8" label="日期" />
            <el-table-column prop="9" label="日期" />
            <el-table-column prop="10" label="日期" />
            <el-table-column prop="11" label="日期" />
            <el-table-column prop="12" label="日期" />
            <el-table-column prop="13" label="日期" />
            <el-table-column prop="14" label="日期" />
            <el-table-column prop="15" label="日期" />
            <el-table-column prop="16" label="日期" /> -->


            </el-table>

        </section>

        <section v-else class="w-full py-3 relative">
            <el-table :data="tableData" border :header-cell-style="{ textAlign: 'center' }"
                :cell-style="{ textAlign: 'center' }" style="width: 100%">
                <el-table-column prop="1" label="序号" align="center" />
                <el-table-column prop="2" label="会员号" align="center" />
                <el-table-column prop="3" label="累计输赢" align="center" />
                <el-table-column prop="4" label="总投注额" align="center" />
                <el-table-column prop="5" label="洗码额" align="center" />
                <el-table-column prop="6" label="洗码费" align="center" />
                <el-table-column prop="7" label="公司利润" align="center" />
                <el-table-column label="明          细" align="center">
                    <el-table-column prop="8" label="30" align="center" />
                    <el-table-column prop="9" label="31" align="center" />
                    <el-table-column prop="10" label="32" align="center" />
                </el-table-column>
            </el-table>
        </section>
    </section>
</template>

<style scoped>

</style>