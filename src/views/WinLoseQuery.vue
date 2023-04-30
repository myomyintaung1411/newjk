<template>
    <section class="w-full min-w-[1300px] whitespace-nowrap">
        <div class="w-full pt-2 bg-[#13151b] px-5">
            <div class="text-xl tracking-[3px] font-bold">
                <p>输赢查询</p>
            </div>
            <section class="flex items-center py-2 ">
                <div class="w-[350px] flex items-center space-x-3">
                    <span>时间</span>
                    <div class="w-[250px]  py-3">
                        <div class="demo-date-picker">
                            <div class="block w-full">

                                <el-date-picker v-model="Datevalue" type="daterange" start-placeholder="Start date"
                                    @change="datePicked($event)" end-placeholder="End date" :default-time="defaultTime"
                                    class="max-w-full" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-[300px] flex items-center space-x-3">
                    <span>台桌</span>
                    <div class="w-[200px]  py-3">
                        <el-select v-model="select_value" @change="gameTypeChange" class="w-[200px]"
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
                <div class="w-[300px] flex items-center space-x-3">
                    <span>局数</span>
                    <div class="w-[200px]  py-3">
                        <el-input-number v-model="numberOfBoard" :min="1" :max="100" @change="handleChange" />
                    </div>
                </div>
                <div class="w-[300px] flex items-center space-x-3">
                    <span>口数</span>
                    <div class="w-[200px]  py-3">
                        <el-input v-model="numberofWord" clearable placeholder="Please 口数" />
                    </div>
                </div>
                <div class=" flex items-center  space-x-5 cursor-pointer">
                    <div @click="reqTest()" class="w-20 py-2 bg-slate-600 text-center">
                        口数
                    </div>
                    <div class="w-20 py-2 bg-yellow-600 text-center">
                        口数
                    </div>
                </div>
            </section>
            <section class="flex items-center py-2">
                <div class="w-[350px] flex items-center space-x-3 ">
                    <span>合计</span>
                    <span>总押码量</span>
                    <div class="w-[200px]  py-3">
                        {{apiData?.xml_d}}
                        <!-- <el-input v-model="totalBetAmount" maxlength="10" clearable placeholder="Please 总押码量" /> -->
                    </div>
                </div>
                <div class="w-[300px] flex items-center space-x-3">
                    <span>洗码量</span>
                    <div class="w-[200px]  py-3">
                        {{apiData?.xml_d}}
                        <!-- <el-input v-model="amountLaundry" maxlength="10" clearable placeholder="Please 洗码量" /> -->
                    </div>
                </div>
                <div class="w-[300px] flex items-center space-x-3">
                    <span>洗码费</span>
                    <div class="w-[200px]  py-3">
                        {{apiData?.xml_d}}
                        <!-- <el-input v-model="Laundryfee" maxlength="10" clearable placeholder="Please 洗码费" /> -->
                    </div>
                </div>
                <!-- <div class="w-[300px] flex items-center space-x-3">
                    <span>客人输赢</span>
                    <div class="w-[200px]  py-3">
                        <el-select v-model="winlose" clearable placeholder="客人输赢">
                            <el-option v-for="item in Winoptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>
                </div> -->
                <div class="w-[300px] flex items-center space-x-3">
                    <span>公司利润</span>
                    <div class="w-[200px]  py-3">
                        <!-- <el-input v-model="profit" maxlength="10" clearable placeholder="Please 公司利润" /> -->
                        {{apiData?.xml_d}}
                    </div>
                </div>
            </section>

            <section class="py-3 w-full">
                <el-table :data="winLoseQuery?.tableData" border style="width: 100%">
                    <el-table-column prop="memberName" label="顶级代理" width="180" />
                    <el-table-column prop="upperzc" label="占成" />
                    <el-table-column prop="name" label="会员" />
                    <el-table-column prop="betMoney" sortable label="押码量" />
                    <el-table-column prop="winlose" label="输赢" width="100" :filters="[
                        { text: 'Win', value: 'Win' },
                        { text: 'Lose', value: 'Lose' },
                    ]" :filter-method="filterTag" filter-placement="bottom-end">
                        <template #default="scope">
                            <el-tag :type="scope.row.winlose.toString().includes('-')  ? 'danger' : 'success'" disable-transitions>
                                    {{ optionWin(scope.row.winlose)}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="winlose" sortable label="输赢" /> -->
                </el-table>
            </section>
        </div>

    </section>
</template>

<script setup>

import { ref, reactive, onMounted,computed } from 'vue'
import pomelo from "@/socket/pomelo.js";
import moment from 'moment'
import global from '@/utils/global';

import { useStore } from "vuex";

const store = useStore();
const Datevalue = ref('')
const numberOfBoard = ref(1)
const numberofWord = ref('31')
const totalBetAmount = ref('')
const amountLaundry = ref('')
const Laundryfee = ref('')
const winlose = ref('')
const Winoptions = [
    {
        value: 'Win',
        label: 'Win',
    },
    {
        value: 'Lose',
        label: 'Lose',
    },
]
const profit = ref('')

const defaultTime = ref([
    new Date(2021,10,10,0,0,0,0),
    new Date(),
])

const pagination = reactive({
    pageSize: 5,
    currentPage: 1,
    total: 0,
});



//getAllDesk
const select_value = ref('')
const options = computed(() => store.getters["app/GetAlllDesk"]);


const defaultOption = ref(['','',''])
const winLoseQuery = ref(null)
const apiData = ref(null)
const tableData = reactive([
    {
        id: '12987122',
        name: 'Tom',
        amount1: '234',
        amount2: '3.2',
        winlose: 'Win',
    },
    {
        id: '12987123',
        name: 'Tom',
        amount1: '165',
        amount2: '4.43',
        winlose: 'Win',
    },
    {
        id: '12987124',
        name: 'Tom',
        amount1: '324',
        amount2: '1.9',
        winlose: 'Win',
    },
    {
        id: '12987125',
        name: 'Tom',
        amount1: '621',
        amount2: '2.2',
        winlose: 'Lose',
    },
    {
        id: '12987126',
        name: 'Tom',
        amount1: '539',
        amount2: '4.1',
        winlose: 'Lose',
    },
])

const optionWin = (data) => {
   let status = data.toString().includes('-') ? 'Lose' : 'Win'
   return status
}

const filterTag = (value, row) => {
    console.log(value, row, "dddddddddddd");
    return row.winlose === value
}

const datePicked = ($event) => {
    defaultTime.value = $event
    console.log($event, "lllllllllllllllll");
}

const gameTypeChange = (data) => {
    let gameInfo = data.split(',')
    defaultOption.value = gameInfo
    console.log(gameInfo, "dffsvft4ew");
}

const handleChange = (value) => {
    numberOfBoard.value = value
    console.log(value)
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
        bjcs: '北京赛车'
    }
    return msg[strGame]
}



const reqTest = () => {
    getWinLoseRecord()
}

function getWinLoseRecord() {
    console.log(defaultTime.value, select_value.value, "ddddddddddd")
    const sendStr = {
        router: 'GetMemberTrade',
        JsonData: {
            Id: 1,
            opt_name: 'admin',
            roomId: defaultOption.value[0],
            rType: defaultOption.value[1],
            teskNum: defaultOption.value[2],
            jc: '',
            cc: '',
            pageSize: pagination.pageSize,
            currentPage: pagination.currentPage,
            //   startTime: defaultTime.value[0],
            startTime: moment(new Date(defaultTime.value[0])).startOf('day').format("YYYY-MM-DD HH:mm:ss"),
            endTime: moment(new Date(defaultTime.value[1])).endOf('day').format("YYYY-MM-DD HH:mm:ss"),
            //   endTime: defaultTime.value[1],
            isSettlement: 1 // 0未结算，1已结算 默认为1
        }
    }
    console.log(sendStr, "sendStr *********");
    pomelo.send(sendStr, res => {
        console.log('resp ', res)
        apiData.value = res
        var data = res.JsonData
        var betOrderInquireForm = { tableData: [], totalItemsNum: 0 }
        var tableData = betOrderInquireForm.tableData

        for (var i = 0; i < data.length; i++) {
            tableData[i] = {}
            tableData[i].orderId = i + 1
            tableData[i].name = data[i].name
            tableData[i].rType = data[i].rType
            tableData[i].gameType = global.transGameStr(data[i].rType)
            tableData[i].betTime = data[i].time
            tableData[i].tableNum = data[i].roomName
            tableData[i].upperzc = data[i].upper_zc
            tableData[i].cc = data[i].cc
            tableData[i].memberName = data[i].reference_name
            tableData[i].betOrderInfo = global.trasBetResult(data[i].rType, data[i].xzmx)
            tableData[i].betMoney = data[i].xz
            tableData[i].aBalance = data[i].ye
            tableData[i].ip = data[i].ip // 权限表
            tableData[i].terminal = data[i].terminal
             tableData[i].winlose = data[i].yl
            // let resultData = global.betInfoData(data[i].xzmx, tableData[i].rType)
            // tableData[i].niuniu = resultData[0]
            // tableData[i].niuniuBet = resultData[1]
            // tableData[i].showResult = tableData[i].niuniu.map((item, index) => {
            //     return item + ':' + tableData[i].niuniuBet[index]
            // })
            tableData[i].tablePara = global.getTablePara(
                data[i].rType,
                tableData[i].betOrderInfo
            )
        }    
        //  _roadDataModifed(res.JsonData[0].xzmx)
        betOrderInquireForm.totalItemsNum = res?.totalItem
        pagination.total = res.totalItem //pagination total
        
        winLoseQuery.value = betOrderInquireForm
        console.log('resp of onlineBetData ', betOrderInquireForm)
    })
}

onMounted(() => {

    getWinLoseRecord()
})
</script>


<style scoped>
.demo-date-picker {
    display: flex;
    width: 100%;
    padding: 0;
    flex-wrap: wrap;
}

.demo-date-picker .block {
    /* padding: 30px 0; */
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;
}

.demo-date-picker .block:last-child {
    border-right: none;
}
</style>