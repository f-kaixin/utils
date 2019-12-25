let util = require('util'); 
let fs = require('fs'); 

/**
 * 截取json字符串里自己需要的数据并导出到json文件
 * @method
 * @param {Array/Object} sourceData 待处理的源数据
 * @param {String} targetName 待处理的字段名
 * @param {String} outputName 输出的字段名
 * @param {String} outputFile 输出的文件
 */
const toJson = (sourceData, targetName, outputName, outputFile) => {
    let validStr = sourceData.substr(sourceData.indexOf(`${targetName}`));
    for (let index in validStr) {
        if (validStr[index] === '(' || validStr[index] === '[') {
            validStr = validStr.substr(index);
            break;
        }
    }
    // console.log(validStr)
    let count = {
        '(': 0,
        '[': 0,
    }
    for (let index in validStr) {
        // index居然是string类型数字
        switch(validStr[index]) {
            case '(':
                count['(']++;
                break;
            case '[':
                count['[']++;
                break;
            case ')':
                count['(']--;
                break;
            case ']':
                count['[']--;
                break;
            default:
                break;
            }
            if (index && count['('] === 0 && count['['] === 0) {
            validStr = (validStr.slice(0, parseInt(index) + 1));
            break;
        }
    }
    let obj = {};
    obj[outputName] = JSON.parse(validStr);
    validStr = JSON.stringify(obj, "", "\t");
    fs.writeFile(outputFile, validStr, function(err){
        if(err){
            console.error(err);
        }
    })
}

module.exports = toJson;