<script setup>
import { ref, onMounted, computed, onBeforeUnmount, reactive, watch, nextTick } from 'vue'
import pomelo from "@/socket/pomelo.js";
import global from '@/utils/global';
import { useScroll } from '@vueuse/core'


import { useStore } from "vuex";
import { XIcon } from '@heroicons/vue/outline';
import { SourceMapGenerator } from 'source-map-js/lib/source-map-generator';
const store = useStore();

const scrollView = ref(null)
const { x, y, isScrolling, arrivedState, directions } = useScroll(scrollView)


const testtime = ref(null)
// const state = UseScrollReturn()


//soundState
const mergeTest = ref(null)
const soundState = ref(false)
const soundUrl = ref('/static/default.wav')
//btn condition
const dataBtnCondition = ref(false)

const loading = ref(false)
const enter_agent = ref('')
// const agentArray = ref([])
const agentArray = computed(() => store.getters["app/HjAgentArray"]);

// login userinfo
const User_Info = computed(() => store.getters["app/USER"]);


const enter_user = ref('')
// const userArray = ref([])
const userArray = computed(() => store.getters["app/HjUserArray"]);
//onlineMember
const onlineMember = ref(null)
const onlineMemberInterval = ref(null)
const countDownInterval = ref(null)
const singleDeskInterval = ref(null)
const showOnlineList = ref([])
//for road Data
const roadData = ref(null)
const roadState = ref(null)//road State

//setallinfo
const setInfoData = ref(null)
//getonlinebetdata
const onlineBetData = ref(null)
const onlineBetDataInterval = ref(null)
const totalData = ref(null)
const totalTableData = reactive([
    {
        gsyl_banker: '0',//gsyl
        gsyl_player: '0',//gsyl
        member_all: '0',//gsyl
        b_pair: '0',
        bjl_banker: '0', //bjl banker
        p_pair: '0',
        bjl_player: '0', //bjl player
        bjl_tie: '0',

    }
])

//betcompare user table array
const betCompareUserArray = computed(() => store.getters["app/BetCompareUserArray"]);


//getAllDesk
const select_value = ref('')
const options = computed(() => store.getters["app/GetAlllDesk"]);
const callgetSingleDeskState = ref(false) //call only when click select_value
const callgetOnlineBet = ref(false) //
const callgetOnlineMemberInfo = ref(false) //
const defaultOption = ref(['', '', ''])

//save localstorage
// const saveData = ref(false)
//const saveData = computed(() => store.getters["app/SaveData"]);

const saveData = computed({
    get: () => store.getters['app/SaveData'],
    set: (newValue) => store.commit('app/SAVEDATA', newValue)
});


//multiple getalldesk select
const mul_select = ref('')
// JSON.parse(localStorage.getItem('_per_options')) || 
const multiOption = reactive([
    {
        value: '10',
        label: '10%',
    },
    {
        value: '20',
        label: '20%',
    },
    {
        value: '30',
        label: '30%',
    },
    {
        value: '40',
        label: '40%',
    },
    {
        value: '50',
        label: '50%',
    },
    {
        value: '60',
        label: '60%',
    },
    {
        value: '70',
        label: '70%',
    },
    {
        value: '80',
        label: '80%',
    },
    {
        value: '90',
        label: '90%',
    },
    {
        value: '100',
        label: '100%',
    },
])
//agent
const select_agent = ref([])
const agentOption = reactive([])

//searchUser
const select_user = ref([])
const userSearchOption = reactive([])

const reqAgent = ref(null)
const reqUser = ref(null)

// const pagination = reactive({
//     pageSize: 10,
//     currentPage: 1,
//     total: 0,
// });
const pageSize = ref(10)
const currentPage = ref(1)
const total = ref(0)

const handleSizeChange = (val) => {
    pageSize.value = val
    handleCurrentChange(1);
}

const handleCurrentChange = (val) => {
    currentPage.value = val
    var size = pageSize.value
    onlineBetData.value = getOnlineBet()
}


//baccarat 
const statistic = ref({
    banker: 0,
    player: 0,
    tie: 0,
    bPair: 0,
    pPair: 0,
})

const zp = ref({
    lst: [],
    col: 0,
    row: 0,
})
const dl = ref(
    {
        lst: [],
        row: 0,
        col: 0,
        pr: 0,
        pc: 0,
        nc: 0,
        cl: false,
        clNum: 0,
        good: 0,
        ab: {
            row: -1,
            col: -1,
        },
        ap: {
            row: -1,
            col: -1
        },
        pointCol: 0,
        stat: {}
    },
)

//cowcow
const CowCowStatistic = ref({
    n0: 0,
    n1: 0,
    n2: 0,
    n3: 0,
    n4: 0,
    n5: 0,
})

const nnp = ref({
    lst: [],
    col: 0,
    row: 0,
})

const chair = ref({
    visible: false,
    data: []
})

const currChair = ref([{}, {}, {}, {}, {}, {}, {}])

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

function addAgent() {
    if (enter_agent.value == '' || enter_agent.value == undefined || enter_agent.value == null) return
    if (!agentArray.value?.includes(enter_agent.value)) {
        //agentArray.value.push(enter_agent.value)
        store.commit('app/ADD_HJAGENT_ARRAY', enter_agent.value)
    }
    enter_agent.value = ''
}
function addUser() {
    if (enter_user.value == '' || enter_user.value == undefined || enter_user.value == null) return
    if (!userArray.value?.includes(enter_user.value)) {
        store.commit('app/ADD_HJUSER_ARRAY', enter_user.value)
        // userArray.value.push(enter_user.value)
    }
    showOnlineUser()
    enter_user.value = ''

}

function removeAgent(data, index) {
    // agentArray.value = agentArray.value?.filter((item) => {
    //     return item !== data
    // })
    store.commit('app/HJAGENT_ARRAY_REMOVE', data)
    console.log(agentArray.value, "leeee");
}
function removeUser(data, index) {
    // userArray.value = userArray.value?.filter((item) => {
    //     return item !== data
    // })
    store.commit('app/HJUSER_ARRAY_REMOVE', data)
    showOnlineList.value = showOnlineList.value.filter((item) => {
        return item !== data
    })
    console.log(userArray.value, "userrrr");
}

function _roadDataModifedCowCow(data) {
    // let test_data = 'dlbd-001^lfli-101^hbll-000^lllb-011^cdlf-101^lchl-110^lgha-111^llil-010^jhch-000^icld-000^alhl-010^lijj-111^jjca-000^flil-010^jlfj-001^'
    let nn = data?.split("^")
    nn.pop()
    var splitData = [];
    var resultData = []
    for (let i = 0; i < nn?.length; i++) {
        splitData.push(nn[i].split("-")[0])
        resultData.push(nn[i].split("-")[1])
    }
    // addOne('abcd','111')
    // addOne('efhj','000')
    for (let index = 0; index < splitData.length; index++) {
        addOneCowCow(splitData[index], resultData[index])
    }
    // splitData.forEach((split, i) => {
    //     addOne(split)
    // })
    //console.log(splitData, "splitData length ************");
}
function textToNum(strGame) {
    // 游戏类型转换
    var msg = {
        a: '1',
        b: '2',
        c: '3',
        d: '4',
        e: '5',
        f: '6',
        g: '7',
        h: '8',
        i: '9',
        j: 'a',
        k: 'c',
        l: '0',
    }
    return msg[strGame]
}
function addOneCowCow(item, number) {
    let result = item;
    if (!result) {
        return;
    }
    let rs = result.split("");
    let md = number.split("")
    //console.log(rs,"rs from addOne");
    // if (rs.length !== 12) return;
    let ii = {
        n0: {
            v: textToNum(rs[0]),
            w: textToNum(rs[0]) == '0' ? '0' : 1,
        },
        n1: {
            v: textToNum(rs[1]),
            w: md[0] * 1,
        },
        n2: {
            v: textToNum(rs[2]),
            w: md[1] * 1
        },
        n3: {
            v: textToNum(rs[3]),
            w: md[2] * 1
        },
        // n4: {
        //     v: rs[8],
        //     w: rs[9] * 1,
        // },
        // n5: {
        //     v: rs[10],
        //     w: rs[11] * 1
        // },
    };

    if (ii.n1.w === 1) CowCowStatistic.value.n1++;
    if (ii.n2.w === 1) CowCowStatistic.value.n2++;
    if (ii.n3.w === 1) CowCowStatistic.value.n3++;
    // if (ii.n4.w === 1) CowCowStatistic.value.n4++;
    // if (ii.n5.w === 1) CowCowStatistic.value.n5++;
    nnp.value.lst[nnp.value.col] = ii;
    nnp.value.col++;
    if (nnp.value.col >= 19 - 1) {
        nnp.value.lst.shift();
        nnp.value.lst.push({ n0: { w: 1, v: 1 }, n1: {}, n2: {}, n3: {}, n4: {}, n5: {} });
        nnp.value.col--;
    }
}

//cowcow initData
const initDataCowCow = () => {
    nnp.value.col = 0;
    nnp.value.lst = [];
    let colsNumUnit = 31;
    for (let i = 0; i < colsNumUnit; i++) {
        nnp.value.lst.push({ n0: {}, n1: {}, n2: {}, n3: {}, n4: {}, n5: {} })
    }
    CowCowStatistic.value.n0 = 0;
    CowCowStatistic.value.n1 = 0;
    CowCowStatistic.value.n2 = 0;
    CowCowStatistic.value.n3 = 0;
    CowCowStatistic.value.n4 = 0;
    CowCowStatistic.value.n5 = 0;
}

const initData = () => {
    zp.value.col = zp.value.row = 0
    zp.value.lst = []
    let colsNumUnit = 32
    for (let i = 0; i < colsNumUnit; i++) {
        zp.value.lst.push([0, 0, 0, 0, 0, 0])
    }
    dl.value.col = dl.value.row = 0
    dl.value.lst = []
    dl.value.pr = dl.value.pc = dl.value.nc = 0
    dl.value.cl = false
    dl.value.clNum = 0
    dl.value.stat = {}
    dl.value.pointCol = 0
    for (let i = 0; i < colsNumUnit * 2; i++) {
        dl.value.lst.push([0, 0, 0, 0, 0, 0])
    }
    statistic.value.banker = 0
    statistic.value.player = 0
    statistic.value.tie = 0
    statistic.value.bPair = 0
    statistic.value.pPair = 0
}

function addOne(item) {
    //console.log(item, 'adding one item... ******');
    let result = item
    if (!result)//first letter of result H
    {
        return
    }

    let zpIdx = 0
    if (result == 'a') {
        zpIdx = 100
        statistic.value.banker++
    } else if (result == 'e') {
        zpIdx = 200
        statistic.value.player++
    } else if (result == 'i') {
        zpIdx = 300
        statistic.value.tie++
    }
    if (result == 'b') {
        zpIdx = 100
        zpIdx += 1
        statistic.value.banker++
        statistic.value.pPair++
    }
    if (result == 'c') {
        zpIdx = 100
        zpIdx += 10
        statistic.value.banker++
        statistic.value.bPair++
    }
    if (result == 'd') {
        zpIdx = 100
        zpIdx += 10
        zpIdx += 1
        statistic.value.banker++
        statistic.value.bPair++
        statistic.value.pPair++
    }

    if (result == 'f') {
        zpIdx = 200
        zpIdx += 1
        statistic.value.player++
        statistic.value.pPair++
    }
    if (result == 'g') {
        zpIdx = 200
        zpIdx += 10
        statistic.value.player++
        statistic.value.bPair++
    }
    if (result == 'h') {
        zpIdx = 200
        zpIdx += 1
        zpIdx += 10
        statistic.value.player++
        statistic.value.pPair++
        statistic.value.bPair++
    }
    if (result == 'j') {
        zpIdx = 300
        zpIdx += 10
        statistic.value.tie++
        statistic.value.pPair++
    }
    if (result == 'k') {
        zpIdx = 300
        zpIdx += 1
        statistic.value.tie++
        statistic.value.bPair++
    }
    if (result == 'l') {
        zpIdx = 300
        zpIdx += 10
        zpIdx += 1
        statistic.value.tie++
        statistic.value.bPair++
        statistic.value.pPair++
    }

    zp.value.lst[zp.value.col][zp.value.row] = zpIdx
    zp.value.lst, zp.value.col, zp.value.lst[zp.value.col]
    if (++zp.value.row >= 6) {
        zp.value.col++
        zp.value.row = 0
    }

    if (zp.value.col >= 20 - 2) {
        zp.value.lst.shift() //remove first element
        zp.value.lst.push([0, 0, 0, 0, 0, 0])//append to end of array
        zp.value.col--
    }
    let dlIdx = Math.floor(zpIdx / 100)
    addOneDl(dlIdx)
}




function addOneDragonTiger(item) {
    //console.log(item, 'adding one item... ******');
    let result = item
    if (!result)//first letter of result H
    {
        return
    }

    let zpIdx = 0
    if (result == 'a') { // dragon
        zpIdx = 100
        statistic.value.banker++
    } else if (result == 'c') { //tiger
        zpIdx = 200
        statistic.value.player++
    } else if (result == 'b') { //tie
        zpIdx = 300
        statistic.value.tie++
    }

    zp.value.lst[zp.value.col][zp.value.row] = zpIdx
    zp.value.lst, zp.value.col, zp.value.lst[zp.value.col]
    //  console.log("updating ....... addOne with the this.$set() method");
    if (++zp.value.row >= 6) {
        zp.value.col++
        zp.value.row = 0
        // console.log(zp.value, "this.zp.row >= 6 1229 ************ of zp list");
    }//

    if (zp.value.col >= 20 - 2) {
        zp.value.lst.shift() //remove first element
        zp.value.lst.push([0, 0, 0, 0, 0, 0])//append to end of array
        zp.value.col--
    }
    let dlIdx = Math.floor(zpIdx / 100)
    //  console.log("dlidx inside of addOne method ***** = " + dlIdx);
    addOneDl(dlIdx)
}




function addOneDl(dlIdx, ask = false) {
    let param = {}
    let pIdx = Math.floor(dl.value.lst[dl.value.pc][dl.value.pr] / 100)
    //console.log(pIdx + "  PIDX OF 1416:******************* ");
    if (dlIdx === 3) {
        if (dl.value.lst[dl.value.pc][dl.value.pr] % 10 < 9) { // tie adding untial less than 9
            dl.value.lst[dl.value.pc][dl.value.pr] += 1
            //console.log("dlIdx is 3 then logging :" + dl.value.lst);
        }
        // console.log(dl.value.lst, "dl lst log *********** 1420");
    } else {
        if (pIdx === dlIdx) {
            // console.log("inside of equal pidx and dlidx", pIdx, dlIdx);
            if (dl.value.row > 5 || dl.value.lst[dl.value.col][dl.value.row] > 0 || dl.value.cl) {
                //console.log(dl.value.row, dl.value.col + "in line 1442 of row greater than 5 ***********");
                dl.value.row--
                dl.value.col++
                dl.value.cl = true
                dl.value.clNum++
            }
            if (!ask) dl.value.stat[dl.value.pointCol]++; //console.log("if (!ask) dl.value.stat[dl.value.pointCol]++", dl.value.stat[dl.value.pointCol]);
        } else {
            dl.value.col = dl.value.nc
            dl.value.row = 0
            dl.value.cl = false
            dl.value.clNum = 0
            //console.log("not equal pidx and dlidx ***********  ", dl.value.col);
            if (!ask) {
                dl.value.pointCol = dl.value.nc
                dl.value.stat[dl.value.pointCol] = 1
                // console.log("not equal pidx and dlidx  if (!ask) { ***********  ", dl.value.pointCol);

            }

        }

        if (dl.value.col < 0) dl.value.col = 0; //console.log("if (dl.value.col < 0) *****");
        if (ask === true) {
            dl.value.lst[dl.value.col][dl.value.row] = dlIdx * -100

            // console.log(dlIdx * -100, "1466 dlIdx * -100 **** ask === true");
            if (dlIdx === 1) {
                dl.value.ab.row = dl.value.row
                dl.value.ab.col = dl.value.col
                //   console.log("dlIdx === 1 in line 1470 *********" + dl.value.row, dl.value.col);
            } else {
                dl.value.ap.row = dl.value.row
                dl.value.ap.col = dl.value.col
                // console.log("dlIdx != 1 in line 1474 *********" + dl.value.row, dl.value.col);
            }
        } else {
            dl.value.lst[dl.value.col][dl.value.row] = dlIdx * 100
            // console.log(dlIdx * 100, "1466 dlIdx * -100 **** ask === FALSE");
            dl.value.good = 0
            if (dl.value.cl) {
                // console.log("  if (dl.value.cl)  true *******");
                dl.value.good = 4
                if (dl.value.col >= 3) {
                    //   console.log(dl.value.col + " if (dl.value.col >= 3)  greater than 3 *************");
                    let clp = parseChangLong(dl.value.lst, dl.value.col, dl.value.row, 2)
                    if (clp.col >= 2 && clp.num > 3 && dl.value.lst[clp.col - 1][1] === 0) {
                        // console.log("if (clp.col >= 2 && clp.num > 3 && dl.value.lst[clp.col - 1][1] === 0) " + clp);
                        let cln = parseChangLong(dl.value.lst, clp.col - 2, 0, 0)
                        if (cln.num !== -1 && cln.num > 3) dl.value.good = 5; //console.log("if (cln.num !== -1 && cln.num > 3) *****" + cln);
                    }
                }
            } else if (dl.value.row >= 3) {
                //console.log(dl.value.row + " (dl.value.row >= 3) dl.value.row greater than 3 *************");

                dl.value.good = 4
                if (dl.value.col >= 2 && dl.value.lst[dl.value.col - 1][1] === 0) {
                    //console.log("if (dl.value.col >= 2 && dl.value.lst[dl.value.col - 1][1] === 0) ******" + dl);

                    let cl = parseChangLong(dl.value.lst, dl.value.col - 2, 0, 0)
                    if (cl.num !== -1 && cl.num > 3) dl.value.good = 5;// console.log("if (cl.num !== -1 && cl.num > 3)*******" + cl);
                }
            } else if (dl.value.row === 2) {
                //console.log(dl.value.row + "  if (dl.value.row === 2) dl.value.row equal to 2 *************");
                if (dl.value.col >= 3) {
                    //console.log(dl.value.col + "dl.value.col GREATER than 3 *************");
                    if (dl.value.lst[dl.value.col - 1][2] === 0
                        && dl.value.lst[dl.value.col - 1][1] > 0
                        && dl.value.lst[dl.value.col - 2][3] === 0
                        && dl.value.lst[dl.value.col - 2][2] > 0
                        && dl.value.lst[dl.value.col - 3][2] === 0
                        && dl.value.lst[dl.value.col - 3][1] > 0) {
                        dl.value.good = 3
                    }
                }
            } else if (dl.value.row === 1) {
                //console.log(dl.value.row + " if (dl.value.row === 1)  dl.value.row equal to 1 *************");

                if (dl.value.col >= 3) {
                    // console.log(dl.value.col + "if (dl.value.col >= 3)  dl.value.col GREATER THAN to 3*************");

                    if (dl.value.lst[dl.value.col - 1][1] === 0
                        && dl.value.lst[dl.value.col - 2][1] > 0
                        && dl.value.lst[dl.value.col - 2][2] === 0
                        && dl.value.lst[dl.value.col - 3][1] === 0) {
                        dl.value.good = 2
                    }
                }
            } else if (dl.value.row === 0) {
                //console.log(dl.value.row + "if (dl.value.row === 0)  dl.value.row eqaul to zero *************");

                if (dl.value.col >= 3) {
                    // console.log(dl.value.col + " dl.value.col GREATER THAN to 3*************");

                    if (dl.value.lst[dl.value.col - 1][1] === 0
                        && dl.value.lst[dl.value.col - 2][1] === 0
                        && dl.value.lst[dl.value.col - 3][1] === 0) {
                        dl.value.good = 1
                    }
                }
            }
        }
        dl.value.pr = dl.value.row
        dl.value.pc = dl.value.col
        if (dl.value.row === 0) dl.value.nc++
        dl.value.row++
        //console.log("  if (dl.value.row === 0) ********" + dl.value.pr + dl.value.pc + dl.value.nc + dl.value.row);
    }


    if (dl.value.col >= 20 * 2 - 2 && !ask) {
        // console.log(" if (dl.value.col >= 20 * 2 - 2 && !ask)" + dl.value.col);
        dl.value.lst.shift()
        dl.value.lst.push([0, 0, 0, 0, 0, 0])
        dl.value.col--
        dl.value.pc--
        dl.value.nc--
    }
    // debugger
}

function parseChangLong(lst, col, row, cl) {
    let define = Math.floor(lst[col][row] / 100)
    if (define === 0) {
        return { num: -1, col: 0, row: 0 }
    }
    let num = 1
    let iCol = col
    let iRow = row
    if (cl === 0) {
        while (++iRow) {
            if (Math.floor(lst[iCol][iRow]) !== define) {
                iRow--
                break
            }
            num++
        }
        while (++iCol) {
            if (Math.floor(lst[iCol][iRow]) !== define) {
                iCol--
                break
            }
            num++
        }

    } else {

        if (cl === 2) {
            while (--iCol) {
                if (Math.floor(lst[iCol][iRow]) !== define) {
                    iCol++
                    break
                }
                num++
            }
        }
        while (--iRow >= 0) num++
        iRow++
    }

    return {
        num: num,
        col: iCol,
        row: iRow
    }
}

function setAllInfo() {
    const sendStr = {
        router: 'setAllInfo',
        JsonData: {}
    }
    pomelo.send(sendStr, res => {
        setInfoData.value = res.JsonData
        //console.log('resp of setAllInfo ', res)
    })
};

const handleChange = (val) => {
    //console.log(val, "leeeeeeeeeee")
    reqAgent.value = val
}
const handleplayerChange = (val) => {
    // console.log(val.length, "leeeeeeeeeeedddd")
    reqUser.value = val

    showOnlineUser()
}

const requestData = () => {
    dataBtnCondition.value = !dataBtnCondition.value
    console.log(agentOption.value, "agentotion dsfaslfa");
    if (dataBtnCondition.value) {
        clearInterval(onlineBetDataInterval.value)
        clearInterval(onlineMemberInterval.value)
        onlineBetDataInterval.value = null
        onlineMemberInterval.value = null
    } else {
        getOnlineBet()
        getOnlineMemberInfo()
        initData()
        initDataCowCow()

        requestOnlineMemberInfoFiveSec()
        requestOnlineBetFiveSec()
    }
    // getOnlineBet()
    // getOnlineMemberInfo()
    // initData()
    // initDataCowCow()

}

const greaterThan = (data) => {
    if (data != undefined || data != null) {
        if (data?.banker > data?.player) {
            return (data?.banker - data?.player).toFixed(2)
        } else {
            return (data?.player - data?.banker).toFixed(2)
        }
    } else {
        return 0
    }

}
const bjlgreaterThan = (data) => {
    if (data != undefined || data != null) {
        if (data?.banker > data?.player) {
            return (data?.banker - data?.player).toFixed(2)
        } else {
            return (data?.player - data?.banker).toFixed(2)
        }
    } else {
        return 0
    }
}
const lhgreaterThan = (data) => {
    if (data != undefined || data != null) {
        if (data?.dragon > data?.tiger) {
            return (data?.dragon - data?.tiger).toFixed(2)
        } else {
            return (data?.dragon - data?.tiger).toFixed(2)
        }
    } else {
        return 0
    }
}

//table row style
const tableRowStyle = ({ row, rowIndex }) => {
    //console.log(row);
    //   if(row.name == 'wer11')
    //   return 'background-color:green'
    if (userArray.value?.includes(row.name)) {
        //console.log("yes");


        return 'background-color:#caf7da'

        //console.log(select_user.value, "ert" + row.name,"lee" );
    }
    if (userArray.value?.includes(row.memberName)) {
        return 'background:#a5cef7'
    }
}


//created

// mul_select.value = JSON.parse(localStorage.getItem('_per_options')) == null ? [] : JSON.parse(localStorage.getItem('_per_options'))
// agentArray.value = JSON.parse(localStorage.getItem('agent')) == null ? [] : JSON.parse(localStorage.getItem('agent'))
// userArray.value =
//     JSON.parse(localStorage.getItem('user')) == null ? []
//         : JSON.parse(localStorage.getItem('user'))

// saveData.value = localStorage.getItem('save') == null ? false
//     : true


const checkboxChange = (val) => {
    console.log(val, "eeeeeeeeeee")
    store.commit('app/SAVEDATA', val)


    const sendStr = {
        router: 'SetSaveInfo',
        JsonData: {
            id: User_Info.value?.Id,
            username: User_Info.value?.name,
            isSave: saveData.value ? 1 : 0,
            jkData: JSON.stringify({ hjagent: agentArray.value, hjuser: userArray.value, betcompare_user: betCompareUserArray.value })
        }
    }

    console.log(sendStr, "sendStr hjsystem *********");

    pomelo.send(sendStr, res => {
        console.log(res, "ressssssssssssss")
    })

}

function showOnlineUser() {

    console.log(onlineMember.value, "onlineMember")
    console.log(select_user.value, "select_user")

    for (let index = 0; index < onlineMember.value?.length; index++) {
        const element = onlineMember.value[index];
        if (userArray.value?.includes(element)) {
            if (userArray.value?.length == 0) {
                showOnlineList.value = []
            }
            // console.log('yee', element, userArray.value);
            if (!showOnlineList.value?.includes(element)) {
                showOnlineList.value?.push(element)
                if (soundState.value) {        //sound state
                    playSound()
                } else {
                    pauseSound()
                }
            }
        } else {
            // showOnlineList.value = []
            //showOnlineList.value.pop(userArray.value)
            console.log("no");
        }

    }
}


function countDownTimer() {
    console.log(times, "leeeeeeeeeee");
    var times = roadState?.value?.time;
    countDownInterval.value = setInterval(function () {
        var day = 0,
            hour = 0,
            minute = 0,
            second = 0;//时间默认值
        if (times > 0) {
            day = Math.floor(times / (60 * 60 * 24));
            hour = Math.floor(times / (60 * 60)) - (day * 24);
            minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);

        }
        if (second <= 9) second = '0' + second;
        // data.remainTimeCN = second; //赋值给remainTimeCN显示
        testtime.value = second; //赋值给remainTimeCN显示
        times--;
    }, 1000);
    //console.log("timessssss",times);
    if (times <= 0) {
        clearInterval(countDownInterval.value);
    }
}

function checkEmptyRoadData(roadData) {
    if (roadData != null || roadData != undefined || roadData != ''
    ) {
        return false
    } else {
        return true
    }
}



function getSingleDeskInfo() {
    roadData.value = null
    initData()
    initDataCowCow()
    const sendStr = {
        router: 'getSingleDeskInfo',
        JsonData: {
            deskType: defaultOption.value[1],
            desk: defaultOption.value[2] == '全部' ? 'all' : defaultOption.value[2],
        }
    }
    pomelo.send(sendStr, res => {
        console.log('resp getSingleDeskInfo', res)
        if (Object.keys(res?.desk).length === 0) return

        if (res?.desk) {
            let desk_data = res?.desk
            roadState.value = desk_data // roadState of Game
            roadData.value = desk_data //road Data of game
            //countDownTimer()
            if (res?.desk?.rType === 'bjl') {
                _roadDataModifed(res?.desk?.road)

            } else if (res?.desk?.rType === 'nn') {
                _roadDataModifedCowCow(res?.desk?.road)

            } else {
                _roadDataModifedDT(res?.desk?.road)

            }

        } else {
            roadData.value = null
            roadState.value = null
        }

    })

}

function getSingleDeskState() {
    if(callgetSingleDeskState.value)
    {
        clearInterval(countDownInterval.value)
    const sendStr = {
        router: 'getSingleDeskState',
        JsonData: {
            desk: defaultOption.value[2],
        }
    }
    pomelo.send(sendStr, res => {
        console.log(res, "getSingleDeskState *******")
        if (res?.desk) {

            let desk_data = res?.desk
            roadState.value = desk_data
            //console.log(desk_data,"getSingleDeskState");
            if (Object.keys(desk_data).length === 0) return // empty obj return
            if (desk_data?.state != 1) {
                getSingleDeskInfo()
            }

            //roadData.value = res?.JsonData
            countDownTimer()
            // if (res?.desk?.rType === 'bjl') {
            //     _roadDataModifed(res?.desk?.road)
            // } else if (res?.desk?.rType === 'nn') {
            //     _roadDataModifedCowCow(res?.desk?.road)
            // } else {
            //     _roadDataModifedDT(res?.desk?.road)
            // }
        } else {
            roadState.value = null
            roadData.value = null

        }
    })
    }
    
}



function getOnlineBet() {
    //console.log(mul_select.value)
    // clearInterval(countDownInterval.value)
    
    if(callgetOnlineBet.value) {
        loading.value = true
     const sendStr = {
        router: 'getOnTimeBet',
        JsonData: {
            Id: 1,
            agent: JSON.stringify(agentArray.value),
            player: JSON.stringify(userArray.value),
            desk: defaultOption.value[2] == '全部' ? 'all' : defaultOption.value[2],
            deskType: defaultOption.value[1],
            zc: JSON.stringify(mul_select.value),
            pageSize: pageSize.value,
            currentPage: currentPage.value
        }
    }
    // console.log(sendStr, "sendStr *********")

    pomelo.send(sendStr, res => {
        console.log(res,"res *********")
        loading.value = false
        if (res?.detail) {
            totalData.value = res?.detail
            var data = res?.detail
        }
        var data = res.JsonData
        var betOrderInquireForm = { tableData: [], totalItemsNum: 0 }
        var tableData = betOrderInquireForm.tableData

        for (var i = 0; i < data.length; i++) {
            tableData[i] = {}
            tableData[i].bet_info = data[i].bet_info
            tableData[i].orderId = i + 1
            tableData[i].name = data[i].name
            tableData[i].upper_zc = data[i].upper_zc
            tableData[i].gsyl_banker = data[i]?.gsyl_banker?.toFixed(2)
            tableData[i].gsyl_player = data[i]?.gsyl_player?.toFixed(2)
            tableData[i].rType = data[i].rType
            tableData[i].gameType = global.transGameStr(data[i].rType)
            tableData[i].betTime = data[i].time
            tableData[i].tableNum = data[i].roomName
            tableData[i].cc = data[i].cc
            tableData[i].memberName = data[i].reference_name
            tableData[i].betOrderInfo = global.trasBetResult(data[i].rType, data[i].xzmx)
            tableData[i].betMoney = data[i].xz
            tableData[i].aBalance = data[i].ye
            tableData[i].ip = data[i].ip // 权限表
            tableData[i].terminal = data[i].terminal
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
        // if (res?.desk) {
        //     let desk_data = res?.desk[0]

        //     roadData.value = desk_data
        //     countDownTimer()
        //     if (res?.desk[0]?.rType === 'bjl') {
        //         _roadDataModifed(res?.desk[0]?.road)
        //     } else if (res?.desk[0]?.rType === 'nn') {
        //         _roadDataModifedCowCow(res?.desk[0]?.road)
        //     } else {
        //         _roadDataModifedDT(res?.desk[0]?.road)
        //     }

        // } else {
        //     roadData.value = null
        // }
        //  _roadDataModifed(res.JsonData[0].xzmx)
        betOrderInquireForm.totalItemsNum = res?.totalItem
        total.value = res.totalItem //pagination total

        onlineBetData.value = betOrderInquireForm
        //console.log('resp of onlineBetData ', betOrderInquireForm)
    })

}
}

//DragonTiger
function _roadDataModifedDT(data) {
    let nn = data?.split("^")
    if (nn?.length >= 32) {
        nextTick(() => {
            let box = document.getElementById('boxx')
            box.scrollLeft += 220

        })
    }
    nn?.pop()
    var splitData = [];
    for (let i = 0; i < nn?.length; i++) {
        splitData?.push(nn[i]?.substring("0")[0])
    }
    splitData?.forEach((split, i) => {
        addOneDragonTiger(split)
    })
    console.log(splitData, "splitData length ************");
}

function _roadDataModifed(data) {
    //console.log(data + 'data **********');
    let nn = data?.split("^")
    console.log(nn.length, "nnnn");

    if (nn?.length >= 32) {
        nextTick(() => {
            let box = document.getElementById('boxx')
            box.scrollLeft += 220

        })
    }

    // nn.pop();

    var splitData = [];
    for (let i = 0; i < nn?.length; i++) {
        splitData.push(nn[i].split("-")[0])
    }
    splitData.forEach((split, i) => {
        addOne(split)
    })
}

function getOnlineMemberInfo() {
    if(callgetOnlineMemberInfo.value){

 
    const sendStr = {
        router: 'getOnlineMemberInfo',
        JsonData: {
            Id: 1,
            arrName: [],
            terminal: '',
            pageSize: 10,
            currentPage: 1
        }
    }
    //console.log(sendStr,"onlineMember sendStr of getOnlineMemberInfo *****");
    pomelo.send(sendStr, res => {
        //console.log("res of getOnlineMemberInfo *******", res);
        onlineMember.value = res.JsonData
        let onlineData = res.JsonData
        for (let index = 0; index < onlineData.length; index++) {
            const element = onlineData[index];
            if (userArray.value?.length > 0) {
                if (userArray.value?.includes(element)) {
                    console.log('yee', element, userArray.value);
                    if (!showOnlineList.value?.includes(element)) {

                        showOnlineList.value?.push(element)

                    }
                } else {
                    // showOnlineList.value = []
                    //showOnlineList.value.pop(userArray.value)
                    console.log("no");
                }
            } else {
                showOnlineList.value = []
            }
        }
    })
 }
}


const gameTypeChange = (data) => {
    callgetSingleDeskState.value = true
    callgetOnlineBet.value = true
    callgetOnlineMemberInfo.value = true
    initData()
    initDataCowCow()
    let gameInfo = data.split(',')
    defaultOption.value = gameInfo
    console.log(gameInfo, "dffsvft4ew");
    getSingleDeskInfo()
    getOnlineMemberInfo()
    getOnlineBet()
    // requestgetSingleDeskStateFiveSec()
}
const mulgameTypeChange = (data) => {

    // console.log(mul_select.value, "multi data ****************");
}


onBeforeUnmount(() => {
    clearInterval(onlineBetDataInterval.value)
    clearInterval(onlineMemberInterval.value)
    clearInterval(countDownInterval.value)
    clearInterval(singleDeskInterval.value)
    onlineBetDataInterval.value = null
    onlineMemberInterval.value = null
    countDownInterval.value = null
    singleDeskInterval.value = null

})

function requestOnlineMemberInfoFiveSec() {
    onlineMemberInterval.value = setInterval(() => {
        getOnlineMemberInfo()
        //console.log("3 log second");
    }, 3000);
}

function requestOnlineBetFiveSec() {
    onlineBetDataInterval.value = setInterval(() => {
        // initData()
        // initDataCowCow()
        getOnlineBet()
        //console.log("3 log second");
    }, 3000);
}


function requestgetSingleDeskStateFiveSec() {
    // initData()
    // initDataCowCow()
    //console.log(select_value.value, "leaklffjalskdfjalf")
       
        singleDeskInterval.value = setInterval(() => {
            // initData()
            //  initDataCowCow()
            //console.log(select_value.value, "leaklffjalskdfjalf")

            getSingleDeskState()


            // console.log("3 log second");
        }, 3000);
  
}

const pauseSound = () => {
    let audio = new Audio(soundUrl.value);
    soundState.value = false;
    audio.pause();
}
const playSound = () => {
    let audio = new Audio(soundUrl.value);
    soundState.value = true;
    audio.play();
}

const onScroll = () => {
    console.log(x.value, y.value, isScrolling.value, directions.value, "scrollView");
}

// watch(
//     () =>  select_value.value,
//     () => {
//          if(select_value.value){
//             requestgetSingleDeskStateFiveSec()
//          }
//     },
//     // { immediate: true, deep: true }
// );

onMounted(() => {
    console.log(x.value, y.value, isScrolling.value, directions.value, "scrollView");


    //getOnlineMemberInfo()
    // getSingleDeskInfo()
    initData()
    initDataCowCow()
   //getOnlineBet()
    requestOnlineMemberInfoFiveSec()
    requestOnlineBetFiveSec()
     requestgetSingleDeskStateFiveSec()



})
</script>
<template>
    <section class="w-full  min-w-[1300px]   h-[calc(100vh_-_40px)] relative py-0   ">
        <!-- {{options}} -->
        <!-- <div class="w-full">
        <div class="py-1 px-2 bg-slate-600 text-sm text-white w-full  flex items-center">
           
            <div class="px-3 py-1 cursor-pointer bg-yellow-700 ">全台监控</div>
            <div class="px-3 py-1 cursor-pointer bg-green-700 ">单台监控</div>
            <div class="px-3 py-1 cursor-pointer bg-red-700 ">输赢查询</div>
            <div class="px-3 py-1 cursor-pointer bg-indigo-700 ">投注对比</div>
        </div>
      </div> -->
        <!-- <section class="py-1 w-full bg-black px-5 h-[50px]">
           <div class="flex items-center space-x-2">
            <p>保存选择</p>
            <div>
                <el-checkbox v-model="saveData" @change="checkboxChange" size="large" />
            </div>
           </div>
          </section> -->
        <section class="w-full flex pt-2 max-h-[180px] h-[180px]  ">

            <div v-if="roadState"
                class="h-full bg-neutral-800 text-center  w-[180px] min-w-[150px] flex flex-col justify-between items-center">

                <div>
                    <p class="text-white font-medium text-xl pt-2 ">{{ defaultOption[2] || '全部' }}</p>
                    <div v-if="roadState.state == '1'" class="text-[35px]">
                        {{ testtime }}

                    </div>
                    <div v-else class="text-[35px]">
                        00
                    </div>
                </div>

                <div class=" p-0 my-0">
                    <div class="text-white text-[15px] font-extrabold tracking-wide">
                        <div v-if="roadState.state == '0'">开局</div>
                        <div v-else-if="roadState.state == '1'" class="text-green-400">开始下注</div>
                        <div v-else-if="roadState.state == '2'" class="text-red-500">停止下注</div>
                        <div v-else-if="roadState.state == '3'">开牌中</div>
                        <div v-else-if="roadState.state == '4'">开奖</div>
                        <div v-else-if="roadState.state == '5'">派彩</div>
                        <div v-else-if="roadState.state == '-1'" class="text-gray-200">等待操作</div>
                    </div>
                    <div class="text-[13px] font-bold tracking-wide text-white text-left p-0 ">局口:{{ roadState.cc }}
                    </div>
                    <!-- <div class="text-[13px] font-bold tracking-wide text-white text-left p-0 ">限红:{{ roadState.xh }}
                    </div> -->
                </div>
            </div>
            <div v-else
                class="h-full bg-neutral-800 text-2xl w-[180px] min-w-[150px] flex flex-col justify-around items-center">
                <!-- <div class="flex items-center space-x-2 text-sm">
                    <p>保存选择</p>
                    <div>
                        <el-checkbox v-model="saveData" @change="checkboxChange" size="large" />
                    </div>
                </div> -->
                <!-- <div>
                    {{testtime}}
                </div> -->
                <!-- <p>开局</p> -->
            </div>

            <div v-if="roadData" class="scroll_main overflow-y-hidden  area__ relative ">
                <div ref="scrollView" @mousewheel="onScroll" v-if="roadData?.rType == 'bjl' || roadData?.rType == 'lh'"
                    id="boxx"
                    class="dl-section border-t border-slate-500  r-section text-white whitespace-nowrap scrollbar__   h-full overflow-y-hidden">
                    <div class="col c2   h-[168px]    text-center  " v-for="(col, iCol) in dl.lst" :key="iCol">
                        <div class="cell border-b border-slate-500 w-[26px] h-[26px]    text-center overflow-hidden "
                            v-for="(c, iRow) in col" :key="iRow">

                            <img v-if="c >= 100" :src="'/static/img/dl-' + c + '.png'" alt=""
                                class="h-[100%] w-full  align-center p-[2px] ">

                        </div>
                    </div>
                </div>
                <div v-if="roadData?.rType == 'nn'"
                    class="dl-section border-t border-slate-500  r-section text-white whitespace-nowrap scrollbar__   h-full overflow-y-hidden">
                    <div class="col c2  h-[168px] border-b border-slate-500    text-center  "
                        v-for="(item, idx) in nnp.lst" :key="idx">
                        <!-- {{item}} -->
                        <div class="cell_nn w-[30px] text-center overflow-hidden   ">
                            <div class="nn-b-d w-full h-full relative ">
                                <img v-if="item.n0.v !== '.'" :src="'/static/img/nn_b' + item.n0.v + '.png'" alt=""
                                    class="h-full w-full">
                                <img v-else src="/static/img/nn_n.png" alt="" class="h-full w-full">
                            </div>
                        </div>

                        <div class="cell_nn w-[30px] text-center overflow-hidden  ">
                            <div class="nn-b-d w-full h-full relative " v-if="item.n1.v !== undefined">
                                <img class="y h-full w-full" :class="{ 'active': item.n1.w === 1 }"
                                    v-if="item.n1.v !== '.'" :src="'/static/img/nn_' + item.n1.v + '.png'" alt="">
                                <img v-else src="/static/img/nn_n.png" alt="" class="h-full w-full">
                            </div>
                        </div>

                        <div class="cell_nn w-[30px] text-center overflow-hidden  ">
                            <div class="nn-b-d w-full h-full relative " v-if="item.n1.v !== undefined">
                                <img class="y w-full h-full " :class="{ 'active': item.n2.w === 1 }"
                                    v-if="item.n2.v !== '.'" :src="'/static/img/nn_' + item.n2.v + '.png'" alt="">
                                <img v-else src="/static/img/nn_n.png" alt="" class="w-full h-full">
                            </div>
                        </div>

                        <div class="cell_nn w-[30px] text-center overflow-hidden  ">
                            <div class="nn-b-d w-full h-full relative" v-if="item.n1.v !== undefined">
                                <img class="y w-full h-full" :class="{ 'active': item.n3.w === 1 }"
                                    v-if="item.n3.v !== '.'" :src="'/static/img/nn_' + item.n3.v + '.png'" alt="">
                                <img v-else src="/static/img/nn_n.png" alt="">
                            </div>
                        </div>
                        <!-- <div class="cell w-[45px] text-center overflow-hidden">
                            <div class="nn-b-d w-full h-full relative" v-if="item.n1.v !== undefined">
                                <img class="y w-full h-full" :class="{ 'active': item.n4.w === 1 }" v-if="item.n4.v !== '.'"
                                    :src="'/static/img/nn_' + item.n4.v + '.png'" alt="">
                                <img v-else src="/static/img/nn_n.png" alt="">
                            </div>
                        </div>
                        <div class="cell w-[45px] text-center overflow-hidden">
                            <div class="nn-b-d w-full h-full relative" v-if="item.n1.v !== undefined">
                                <img class="y w-full h-full" :class="{ 'active': item.n5.w === 1 }" v-if="item.n5.v !== '.'"
                                    :src="'/static/img/nn_' + item.n5.v + '.png'" alt="">
                                <img v-else src="/static/img/nn_n.png" alt="">
                            </div>
                        </div> -->

                    </div>
                </div>
            </div>
            <div v-else class="scroll_main overflow-y-hidden  area__ relative ">
                <div ref="scrollView" @mousewheel="onScroll"
                    class="dl-section border-t border-slate-500  r-section text-white whitespace-nowrap scrollbar__   h-full overflow-y-hidden">
                    <div class="col c2 h-[168px]    text-center  " v-for="(col, iCol) in dl.lst" :key="iCol">
                        <div class="cell border-b border-slate-500 w-[26px] h-[26px]   text-center overflow-hidden "
                            v-for="(c, iRow) in col" :key="iRow">

                            <img v-if="c >= 100" :src="'/static/img/dl-' + c + '.png'" alt=""
                                class="h-[100%] w-full p-1  align-center ">

                        </div>
                    </div>
                </div>
            </div>

            <!-- <div v-else class=" ">
            <div  class="h-[280px] bg-neutral-800 text-2xl w-[180px] flex flex-col justify-center items-center">
                <div  
                    class="py-3 px-1 text-center relative flex flex-col justify-center h-full   w-[150px] overflow-hidden    ">
                    <p class="text-white font-medium text-3xl ">开局</p>
                </div>
            </div>
            <div  class="scroll_main overflow-y-hidden bg-red-500  area__ relative ">
                <div 
                    class="dl-section  border-t border-slate-500  r-section text-white whitespace-nowrap scrollbar__   h-full overflow-y-hidden">
                    <div   class="col c2  h-[240px]    text-center  " v-for="(col, iCol) in dl.lst" :key="iCol">
                        <div class="cell border-b border-slate-500 w-[40px] h-10   text-center overflow-hidden "
                            v-for="(c, iRow) in col" :key="iRow">

                            <img v-if="c >= 100" :src="'/static/img/dl-' + c + '.png'" alt=""
                                class="h-[100%] w-full p-2  align-center ">

                        </div>
                    </div>
                </div>
            </div>
        </div> -->

            <div class="flex ">
                <div
                    class="w-[150px] h-full bg-slate-800 flex flex-col text-[18px] border-r border-dashed border-[#808083]">
                    <div class="border-b flex   flex-col items-center w-full  border-gray-500 h-[50px] cursor-pointer">
                        <div class="w-full text-center">
                            <!-- <p>台桌</p> -->
                            <!-- <el-select v-model="select_value" class="w-[100px] h-full " placeholder="台桌 选择">
                            <el-option v-for="item in options" :key="item.rType" :label="item.label"
                                :value="item.roomName + item.rType" />
                        </el-select> -->
                            <el-select v-model="select_value" @change="gameTypeChange" default-first-option
                                class="w-full h-full px-2 " placeholder="台桌 选择">
                                <el-option v-for="item in options" :key="item.rType"
                                    :label="transGameStr(item.rType) + item.roomName"
                                    :value="item.Id + ',' + item.rType + ',' + [item.roomName]">
                                    <span style="float:left" class="px-3">
                                        {{ transGameStr(item.rType) }}</span>
                                    <span style="
                                              float:right;
                                              color:var(--el-text-color-secondary);
                                              font-size:13px;
                                            ">{{ item.roomName }}</span>
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="  tracking-widest   text-center     max-h-[230px]  ">
                        屏蔽占成
                        <div class=" max-h-[200px] overflow-y-auto ">
                            <el-select v-model="mul_select" collapse-tags multiple filterable :reserve-keyword="false"
                                clearable default-first-option placeholder="屏蔽占成比例" class="max-h-[200px] px-2 w-full  "
                                @change="mulgameTypeChange">
                                <el-option v-for="item in multiOption" :key="item.label" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <!-- <div class="w-[50px] bg-red-800 flex flex-col text-[18px]"></div> -->
            </div>
            <section class="flex">
                <div
                    class="w-[200px] px-2 bg-slate-800 border-r border-dashed border-[#808083] flex h-full overflow-y-auto  flex-col text-[18px]">
                    <!-- <el-select v-model="select_agent" multiple filterable allow-create default-first-option clearable
                        :reserve-keyword="false" placeholder="代理关注区" @change="handleChange">
                        <el-option v-for="item in agentOption" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select> -->
                    <div class="flex items-center h-[35px]  ">
                        <div class="w-full h-full">
                            <el-input v-model.trim="enter_agent" placeholder="代理关注区" clearable>
                                <template #append>
                                    <el-button @click="addAgent()" type="primary">添加</el-button>
                                </template>
                            </el-input>
                        </div>
                    </div>
                    <div class="h-[230px]  mt-1  overflow-y-auto">
                        <div v-for="(data, index) in agentArray" :key="data" class="py-1 flex items-center w-full ">
                            <div class="w-[180px] px-1 bg-slate-500 overflow-hidden text-[15px] text-ellipsis">{{ data
                            }}
                            </div>
                            <div @click="removeAgent(data, index)" class="px-2 bg-slate-300 cursor-pointer ">
                                <XIcon class="h-full w-5 py-[3px] text-black "></XIcon>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="flex border-r border-dashed border-[#808083] ">
                <div class="w-[500px] px-2 bg-slate-800   flex flex-col text-[18px] overflow-y-auto">
                    <!-- <el-select v-model="select_user" @change="handleplayerChange" multiple filterable allow-create
                        clearable default-first-option :reserve-keyword="false" placeholder="会 员 关注区">
                        <el-option v-for="item in userSearchOption" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select> -->
                    <div class="flex items-center h-[35px] ">
                        <div class="w-full h-full">
                            <el-input v-model.trim="enter_user" placeholder="会 员 关注区" clearable>
                                <template #append>
                                    <el-button @click="addUser()" type="primary">添加</el-button>
                                </template>
                            </el-input>
                        </div>
                    </div>
                    <div class="h-[230px]  mt-1  overflow-y-auto">
                        <div class="py-1 flex flex-wrap items-center w-full  ">
                            <div v-for="(data, index) in userArray" :key="data"
                                class="max-w-[150px] mr-2 mb-2 flex items-center">
                                <div class="max-w-[130px] px-2 bg-slate-500 overflow-hidden text-[15px] text-ellipsis">
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
                </div>
            </section>
            <section
                class=" bg-slate-800 border-r border-dashed border-[#808083] px-2  w-[200px] min-w-[150px] relative h-full">
                <div class="flex items-center justify-center bg-slate-400 h-[35px] text-center w-full ">
                    关注上线提醒
                </div>
                <div class="h-[140px]   overflow-y-auto   ">
                    <div v-for="(mem, index) in showOnlineList" :key="index"
                        class="py-1 px-1 overflow-hidden text-ellipsis flex items-center w-full ">
                        {{ mem }}
                    </div>
                </div>

                <!-- <div class="w-full   flex py-3 justify-around items-center text-center  text-[18px]">


                    <div @click.prevent="soundState ? pauseSound() : playSound()" class=" cursor-pointer">
                        <img v-if="soundState" src="@/assets/sound.svg" alt="" class="w-10 h-10">
                        <img v-else src="@/assets/soundm.svg" alt="" class="w-10 h-10">
                    </div>
                    <el-button @click="requestData()" type="primary"> {{ dataBtnCondition ? '开始' : '停止' }}</el-button>
                </div> -->

            </section>
            <section class="bg-slate-800 h-full w-[150px] min-w-[150px]">
                <div class="flex flex-col justify-around h-full items-center">
                    <div class="flex items-center space-x-2 text-base">
                        <p>保存选择</p>
                        <div>
                            <el-checkbox v-model="saveData" @change="checkboxChange" size="large" />
                        </div>
                    </div>
                    <div>
                        <el-button style="padding:0px 40px" @click="requestData()"
                            :type="dataBtnCondition ? '' : 'danger'" size="large"> {{ dataBtnCondition ? '开始' : '停止'
                            }}</el-button>
                    </div>
                    <div @click.prevent="soundState ? pauseSound() : playSound()" class=" cursor-pointer">
                        <img v-if="soundState" src="@/assets/sound.svg" alt="" class="w-10 h-10">
                        <img v-else src="@/assets/soundm.svg" alt="" class="w-10 h-10">
                    </div>
                </div>
            </section>
        </section>

        <!-- table -->
        <section class="w-full tableHeight ">
            <div class=" w-full h-full   ">

                <el-table :data="onlineBetData?.tableData" v-loading="loading" border
                    :header-cell-style="{ textAlign: 'center', padding: 4 + 'px' }"
                    :cell-style="{ textAlign: 'center', padding: 4 + 'px' }" style="width: 100%" min-height="100%"
                    :header-row-style="{ background: 'red' }" :row-style="tableRowStyle" height="100%"
                    max-height="100%">
                    <el-table-column prop="memberName" label="顶级代理  " />
                    <el-table-column prop="upper_zc" label="顶级占成 " />
                    <el-table-column prop="name" label="会员号 " />
                    <el-table-column label="会 员 下 注 ">
                        <el-table-column class-name="text-red-500 " prop="bet_info" 
                        :label="defaultOption[1] == 'bjl' ? '庄' :  defaultOption[1] == 'lh' ? '龙' : '庄'"
                        >
                            <template #default="scope">
                                <div v-if="scope.row.rType == 'bjl'">
                                    {{ scope.row.bet_info.banker }}
                                </div>
                                <div v-if="scope.row.rType == 'lh'">
                                    {{ scope.row.bet_info.dragon }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="text-blue-500" prop="bet_info" 
                        :label="defaultOption[1] == 'bjl' ? '闲' :  defaultOption[1] == 'lh' ? '虎' : '闲'"
                         >
                            <template #default="scope">
                                <div v-if="scope.row.rType == 'bjl'">
                                    {{ scope.row.bet_info.player }}
                                </div>
                                <div v-if="scope.row.rType == 'lh'">
                                    {{ scope.row.bet_info.tiger }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="text-green-500" prop="bet_info" label="和">
                            <template #default="scope">
                                <div>
                                    {{ scope.row.bet_info.tie }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="text-red-500" prop="bet_info" label="庄对">
                            <template #default="scope">
                                <div>
                                    {{ scope.row.bet_info.b_pair }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="text-blue-500" prop="bet_info" label="闲对">
                            <template #default="scope">
                                <div>
                                    {{ scope.row.bet_info.p_pair }}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="公司利润">
                        <el-table-column class-name="text-red-500" prop="gsyl_banker" 
                        :label="defaultOption[1] == 'bjl' ? '庄' :  defaultOption[1] == 'lh' ? '龙' : '庄'"
                         />
                        <el-table-column class-name="text-blue-500" prop="gsyl_player" 
                        :label="defaultOption[1] == 'bjl' ? '闲' :  defaultOption[1] == 'lh' ? '虎' : '闲'"
                         />
                    </el-table-column>
                    <el-table-column prop="ip" label="投注IP">
                        <template #default="scope">
                            <div class=" whitespace-nowrap overflow-ellipsis overflow-hidden">
                                <!-- {{scope.row.ip}} -->
                                <el-tooltip class="box-item" effect="dark" :content="scope.row.ip"
                                    placement="top-start">
                                    {{ scope.row.ip }}
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="terminal" label="地区" />
                    <!-- <el-table-column prop="gameType" label="游戏 " /> -->
                    <el-table-column prop="aBalance" label="当前余额" />
                    <!-- <el-table-column prop="16" label="当前余额" />  -->
                </el-table>
            </div>
        </section>
        <!-- <div class="py-0  flex justify-end  overflow-x-hidden   ">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                v-model:current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100]" v-model:page-size="pageSize"
                :background="true" layout="prev,pager,next,sizes" popper-class="label-popper" :total="total"
                class="pagination-control" />
        </div> -->

        <section class="  w-full flex ">
            <table cellpadding="0" cellspacing="0 " border="0">
                <thead class="text-center text-[13px]   border-b border-[#13141a38] bg-slate-600">
                    <tr>
                        <th rowspan="" class="border-r  py-0 my-0    border-[#13141a38] font-medium">公司差额</th>
                        <th rowspan="" class="border-r border-[#13141a38] font-medium ">会员差额</th>
                    </tr>
                </thead>
                <tbody class="text-center bg-slate-800">
                    <tr>
                        <td class="border-r border-[#13141a38]    font-extrabold text-[22px] w-[150px] "
                            :class="greaterThan(totalData?.gsyl).toString().includes('-') ? 'text-blue-500' : 'text-red-500 '">
                            {{ greaterThan(totalData?.gsyl) || 0 }}

                        </td>
                       
                            <td class="border-r border-[#13141a38] font-extrabold text-[22px] w-[150px] ">
                                <span v-if="defaultOption[1] == 'bjl'" :class="bjlgreaterThan(totalData?.bjl).toString().includes('-') ? 'text-blue-500' : 'text-red-500 '">
                                    {{ bjlgreaterThan(totalData?.bjl) || 0 }}
                                </span>
                                <span v-else-if="defaultOption[1] == 'lh'" :class="lhgreaterThan(totalData?.bjl).toString().includes('-') ? 'text-blue-500' : 'text-red-500 '">
                                    {{ lhgreaterThan(totalData?.bjl) || 0 }}
                                </span>
                                <span v-else class="text-red-500">
                                    0
                                </span>
                            </td>
                    </tr>
                </tbody>
            </table>

            <table cellpadding="0" cellspacing="0 " border="0"
                class="w-full border-collapse border-spacing-0  table-auto   ">
                <thead class="text-center text-[13px]   border-b border-[#13141a38] bg-slate-600">

                    <tr class=" py-0 mx-0 my-0 h-1  ">

                        <!-- <th colspan="2" class="border-y border-r  border-[#13141a38] font-medium">差额</th> -->
                        <th colspan="10" class="font-medium  h-[10px]">下 注 统 计</th>
                    </tr>
                    <tr>


                        <th class="border-y border-[#13141a38] "></th>
                        <th class="border-y border-[#13141a38] "></th>
                        <th colspan="2" class="border-y border-r border-[#13141a38] font-medium ">公 司</th>
                        <th colspan="5" class="border-y border-r border-[#13141a38] font-medium">会 员</th>
                        <th rowspan="2" class="border-y border-[#13141a38] font-medium ">会员下注合计</th>

                    </tr>

                    <tr>
                        <!-- <th rowspan="1"  class="border-r  py-0 my-0    border-[#13141a38] font-medium">公司差额</th>
                        <th rowspan="1"  class="border-r border-[#13141a38] font-medium ">会员差额</th> -->
                        <th></th>
                        <th></th>
                        <th class="border-r border-[#13141a38] text-yellow-400">
                            <!-- 庄/龙 -->
                            <span v-if="defaultOption[1] == 'bjl'">庄</span>
                             <span v-else-if="defaultOption[1] == 'lh'">龙</span>
                             <span v-else>庄</span>
                        </th>
                        <th class="border-r border-[#13141a38] text-blue-400">
                            <!-- 闲/虎 -->

                            <span v-if="defaultOption[1] == 'bjl'">闲</span>
                             <span v-else-if="defaultOption[1] == 'lh'">虎</span> 
                             <span v-else>闲</span>
                        
                        </th>
                        <th class="border-r border-[#13141a38] text-yellow-400">
                             <!-- banker/dragon -->
                             <span v-if="defaultOption[1] == 'bjl'">庄</span>
                             <span v-else-if="defaultOption[1] == 'lh'">龙</span>
                             <span v-else>庄</span>
                            
                         </th>
                         <!-- player/tiger -->
                        <th class="border-r border-[#13141a38] text-blue-400">
                            
                            <span v-if="defaultOption[1] == 'bjl'">闲</span>
                             <span v-else-if="defaultOption[1] == 'lh'">虎</span> 
                             <span v-else>闲</span>
                        </th>
                        <th class="border-r border-[#13141a38] text-green-400">和</th>
                        <th class="border-r border-[#13141a38] text-yellow-400">庄对</th>
                        <th class="border-r border-[#13141a38] text-yellow-400">闲对</th>


                    </tr>
                    <!-- <tr>
                        <th>会员下注合计</th>
                    </tr> -->
                </thead>

                <tbody class="text-center bg-slate-800">

                    <tr class="">
                      
                        <td></td>
                        <td></td>

                        <td class="border-r border-[#13141a38] font-extrabold text-[20px] text-yellow-400 ">
                            {{ totalData?.gsyl?.banker.toFixed(2) || 0 }}
                           
                        </td>
                        <td class="border-r border-[#13141a38] font-extrabold text-[20px] text-blue-400 ">
                            {{ totalData?.gsyl?.player.toFixed(2) || 0 }}
                           
                        </td>
                        <td class="border-r border-[#13141a38] font-extrabold text-[20px]  text-yellow-400">
                            <span v-if="defaultOption[1] == 'bjl'">{{ totalData?.bjl?.banker.toFixed(2) || 0 }}</span>
                            <span v-else-if="defaultOption[1] == 'lh'">{{ totalData?.lh?.dragon.toFixed(2) || 0 }}</span>
                            <span v-else>0</span>
                            
                        </td>
                        <td class="border-r border-[#13141a38] font-extrabold text-[20px]  text-blue-400">
                            <span v-if="defaultOption[1] == 'bjl'">{{ totalData?.bjl?.player.toFixed(2) || 0 }}</span>
                            <span v-else-if="defaultOption[1] == 'lh'">{{ totalData?.lh?.tiger.toFixed(2) || 0 }}</span>
                            <span v-else>0</span>
                            
                        </td>

                        <td class="border-r border-[#13141a38] font-extrabold text-[20px] text-green-400">
                            <span v-if="defaultOption[1] == 'bjl'"> {{ totalData?.bjl?.tie.toFixed(2) || 0 }}</span>
                            <span v-else-if="defaultOption[1] == 'lh'">{{ totalData?.lh?.tie.toFixed(2) || 0 }}</span>
                            <span v-else>0</span>
                        </td>

                        <td class="border-r border-[#13141a38] font-extrabold text-[20px] text-yellow-400">
                            {{ totalData?.bjl?.b_pair.toFixed(2) || 0 }}
                        </td>
                        <td class="border-r border-[#13141a38] font-extrabold text-[20px] text-yellow-400">
                            {{ totalData?.bjl?.p_pair.toFixed(2) || 0 }}
                        </td>
                        <td class="border-r border-[#13141a38] font-extrabold text-[20px] ">
                            {{ totalData?.gsyl?.member_all.toFixed(2) || 0 }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    </section>
</template>

<style scoped>
.scroll_main {
    @apply w-[calc(100%_-_1280px)] min-w-[400px] max-w-[(100%_-_1280px)] overflow-x-hidden;

}

.r-section {
    overflow-y: hidden;
    position: relative;
    @apply w-full;
    min-width: 100%;

    will-change: transform;
    user-select: none;
    cursor: grabbing;
    overflow-x: auto;
    /* -ms-overflow-style: none; 
    scrollbar-width: none;   */

    /* width: calc((100vw - 198px)); */
}

.col {
    display: inline-block;
    letter-spacing: 0;
    vertical-align: top;
    border-right: 1px solid;
    @apply border-slate-500;
    /* height: 100%; */
    position: relative;
    text-align: center;
}

.cell_nn {
    border-bottom: 1px solid;
    @apply border-slate-500;
    height: calc(240px / 4);
    /* width: calc(320px / 4); */
}

.cell_nn:last-child {
    border-bottom: 1px solid transparent;
}

.y {
    background: #1268F9;
}

.nn-b-d .active {
    background: #E00B17;
}


.tableHeight {
    height: calc(100vh - 170px - 170px - 0px);
    min-height: calc(100vh - 170px - 170px - 0px);
}
</style>