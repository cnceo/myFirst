/******************************************************************************
 * Author:      zsc
 * Created:     2016/10/26
 *****************************************************************************/

// var util = require("util");
var Enum = require("./Enum.js");

///////////////////////////////////////////////////////////////////////////////
/**
 * 创建二维数组
 */

function twoDimensionalArray(xMax, yMax, flag) {
    var arr = new Array()
    for (var i = 0; i < xMax; i++) {
        arr[i] = new Array();
        for (var j = 0; j < yMax; j++) {
            if (flag == null) {
                arr[i][j] = 0;
            } else {
                arr[i][j] = flag;
            }
        }
    }
    return arr;
}

/**
 * 创建一维数组
 * @param xMax
 * @return {Array}
 */
function oneDimensionalArray(xMax) {
    var arr = new Array();
    for (var i = 0; i < xMax; i++) {
        arr[i] = 0;
    }
    return arr;
}

/**
 * 数组复制
 * @param source
 * @return {Array}
 */
function copyArray(source) {
    var array = oneDimensionalArray(source.length);
    for (var i = 0; i < source.length; i++) {
        array[i] = source[i];
    }
    return array;
}

/**
 * 数组复制
 * @param source
 * @param spos
 * @param target
 * @param tpos
 * @return {*}
 */
function copyArrays(source, spos, target, tpos) {
    if (source.length != target.length) {
        return null;
    }
    for (var i = spos; i < source.length; i++) {
        target[i] = source[i];
    }
    return tpos;
}

/**
 * 胡牌
 * @param handCards
 * @return {*}
 */
function huPai(handCards) {

    var dui = isDui(handCards);

    //对对胡
    if (dui != null) {
        return dui;
    }
    //平胡
    if (isPinghu(handCards)) {
        return Enum.HuType.PING_HU;
        ;
    }
    return null;
}

/**
 * 计算平胡
 * @param handCards
 * @returns {boolean}
 */
function isPinghu(handCards) {
    var mjs = handCards.mjs;
    var typelen = handCards.mjs.length;
    for (var typeIndex = 0; typeIndex < typelen; typeIndex++) {
        for (var numIndex = 0; numIndex < 9; numIndex++) {
            if (mjs[typeIndex][numIndex] > 1) {
                //复制麻将,复制过程中会改变值,先复制再计算
                var mjCp = handCards.copyMjs();
                var typeMjs = mjCp[typeIndex];
                //去掉对子
                typeMjs[numIndex] -= 2;
                if (threeGroupAble(typeMjs, typeIndex) && threeGroupAble(mjCp[(typeIndex + 1) % typelen], (typeIndex + 1) % typelen) && threeGroupAble(mjCp[(typeIndex + 2) % typelen], (typeIndex + 2) % typelen) && threeGroupAble(mjCp[(typeIndex + 3) % typelen], (typeIndex + 3) % typelen)) {
                    // console.log("Hu Le ----------------");
                    return true;
                }
            }
        }
    }
    // console.log(" Mei U Hu Le ----------------");
    return false;
}

/**
 * 七对和大对子判断
 * @param handCards
 * @return {*}
 */
function isDui(handCards) {
    var gangCount = 0;
    var duiCount = 0;
    var newMj = handCards.mjs;
    for (var typeIndex = 0; typeIndex < newMj.length; typeIndex++) {
        if (typeIndex > 3) {
            break;
        }
        var tyMjs = newMj[typeIndex];
        for (var numIndex = 0; numIndex < tyMjs.length; numIndex++) {
            var count = tyMjs[numIndex];
            if (count == 4) {
                gangCount++;
                duiCount += 2;
            } else if (count == 3) {
                continue;
            } else if (count == 2) {
                duiCount++;
            } else if (count == 1) {
                return null;
            }
        }
    }
    if (gangCount == 1 && duiCount == 5) {
        return Enum.PaiType.LONG_QI_DUI;
    }
    if (duiCount == 7) {
        return Enum.PaiType.QI_DUI;
    }
    if (duiCount == 1 && gangCount == 0) {
        return Enum.PaiType.DA_DUI;
    }
    return null;
}


/**
 * 麻将是否满足3N条件
 * @param number
 */

function threeGroupAble(typeMjs, typeIndex) {
    // console.log('Come on !');
    // console.log(typeMjs);
    // console.log(type);
    var len = typeMjs.length;
    if(typeIndex == 3){
        len = 6;
    }
    for (var numIndex = 0; numIndex < len; numIndex++) {
        if (!threeGroupAbl(typeMjs, numIndex, typeIndex)) {
            return false;
        }
    }
    return true;

}


/**
 * 同种麻将是否满足3n(3顺和3刻)的组合,0是满足3n的
 * @param typeMjs
 * @param numIndex
 */
function threeGroupAbl(typeMjs, numIndex, typeIndex) {
    var count = typeMjs[numIndex];
    if (count == 1 ) {
        if (typeIndex == 3) {
            return false;
        }
        return removeShun(typeMjs, numIndex, typeIndex);
    } else if (count == 2 ) {
        if (typeIndex == 3) {
            return false;
        }
        return removeShun(typeMjs, numIndex, typeIndex) && removeShun(typeMjs, numIndex, typeIndex);
    } else if (count == 3) {
        if (typeIndex == 3) {
            return removeKe(typeMjs, numIndex, typeIndex);
        }
        var mjBackup = copyArray(typeMjs);
        var shunAble = true;
        if (shunAble = (removeShun(typeMjs, numIndex, typeIndex)) && removeShun(typeMjs, numIndex, typeIndex) && removeShun(typeMjs, numIndex, typeIndex)) {
            for (var i = numIndex + 1; i < 9; i++) {
                if (!threeGroupAbl(typeMjs, i, typeIndex)) {
                    shunAble = false;
                    break;
                }
            }
        }
        if (!shunAble) {
            //todo 需要复制数组 mjBackup
            copyArrays(mjBackup, 0, typeMjs, 0);
            return removeKe(typeMjs, numIndex, typeIndex);
        }

    } else if (count == 4) {
        if (typeIndex == 3) {
            return false;
        }
        var mjBackup = copyArray(typeMjs);
        if (!removeShun(typeMjs, numIndex, typeIndex) && !removeShun(typeMjs, numIndex, typeIndex) && !removeShun(typeMjs, numIndex, typeIndex) && !removeShun(typeMjs, numIndex, typeIndex)) {
            //todo 需要复制数组 mjBackup
            copyArrays(mjBackup, 0, typeMjs, 0);
            return removeKe(typeMjs, numIndex, typeIndex) && removeShun(typeMjs, numIndex, typeIndex);
        }
    }

    return true;

}
/**
 * 移除三顺
 * @param typeMjs
 * @param numIndex
 * @return {boolean}
 */
function removeShun(typeMjs, numIndex, typeIndex) {
    if (numIndex > 6 || typeMjs[numIndex] == 0 || typeMjs[numIndex + 1] == 0 || typeMjs[numIndex + 2] == 0) {
        return false;
    }

    typeMjs[numIndex]--;
    typeMjs[numIndex + 1]--;
    typeMjs[numIndex + 2]--;
    return true;
}
/**
 * 移除刻
 * @param typeMjs
 * @param numIndex
 */
function removeKe(typeMjs, numIndex, typeIndex) {
    if (typeMjs[numIndex] < 3) {
        return false;
    }
    typeMjs[numIndex] -= 3;
    return true;
}

/**
 * 计算胡的倍数
 * @param huType
 * @return {number}
 */
function calcHuMultiple(huType) {
    //todo
    var mutiple = 1;
    return mutiple;
}
exports.huPai = huPai;
exports.twoDimensionalArray = twoDimensionalArray;
exports.copyArray = copyArray;
exports.calcHuMultiple = calcHuMultiple;
exports.oneDimensionalArray = oneDimensionalArray;
exports.isPinghu = isPinghu;