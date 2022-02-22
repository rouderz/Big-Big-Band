const fs = require('fs');
const path = require('path');
const readStream = fs.createReadStream(path.join(__dirname, '../Big-Big-Band') + '/band.txt', 'utf8');
var data = ''
readStream.on('data', function(chunk) {
    data += chunk;
}).on('end', function() {
    const inputs = data.split('\n').filter(txt => txt != "")

    const parsedData = inputs.reduce((data, line, idx)=> {
        if (Number.isInteger(Number(line)) && Number(line) !== 0){
            const newGroup = [
                ...data.groups,
                []
            ]
            return {
                groups: newGroup,
                actualGroup: newGroup.length - 1
            }
        }
        if (/^\$[\d,.]+/.test(line)){
            const textAmount = line.substring(1)
            const amount = parseFloat(textAmount.replace(',','.'))
            const updatedGroups = data.groups
            updatedGroups[data.actualGroup].push(amount)

            return {
                ...data,
                groups: updatedGroups,
            }
        }
        return data
    }, {groups: [], actualGroup: 0})

    const minimumAmountByGroup = parsedData.groups.map(group => {
        const averageAmount = parseFloat((
            group.reduce((acc,amnt) => acc + amnt) / group.length
        ).toFixed(2))

        const expectedAmount = group.reduce((acc, actualAmount) => {
            const memberDiff = actualAmount - averageAmount
            if (memberDiff < 0){
                return Math.abs(memberDiff) + acc
            }
            return acc
        }, 0)
        return parseFloat(expectedAmount.toFixed(2))
    })

    console.log(minimumAmountByGroup)
});
//
// const data = `
// 3
// $10,00
// $20,00
// $30,00
// 4
// $15,00
// $15,01
// $3,00
// $3,01
// 4
// $15,00
// $14,99
// $3,00
// $2,99
// 4
// $999,10
// $999,10
// $999,00
// $999,10
// 3
// $100,01
// $99,99
// $99,99
// 0
// `

