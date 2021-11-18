const http = require('http');
var fs = require('fs');
const node = require('./node.js')

const server = http.createServer(function (request, response) {
    try {
        findRightNode('input.txt');        
    } catch (e) {
        console.log('Error:', e.stack);
    }
})
async function findRightNode(fileName) {
    try {
        var input = fs.readFileSync(fileName, 'utf8');
        var tree=input.split(/\r\n|\r|\n/);
        for (let i = 0; i < tree.length; i++) {
            tree[i]=JSON.parse(tree[i]);
        }
        tree.forEach(level => {
            for (let i = 0; i < level.length; i++) {
                const node = level[i];
                const right = level[i + 1];
                console.log(level[i][0] == "null" || i == level.length - 1 ? `Node ${level[i][1]} - No right node` : `Node ${level[i][1]} - Right node is ${level[i + 1][1]}`)
            }
        });
    } catch (e) {
        console.log('Error:', e.stack);
    }
}
exports.findRightNode = findRightNode;

const port = 3003
const host = '127.0.0.1'
server.listen(port, host)
console.log(`Listening at http://${host}:${port}`)