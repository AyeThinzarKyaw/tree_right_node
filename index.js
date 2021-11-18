const http = require('http');
var fs = require('fs');
// const node = require('./node.js');
class Node {
    constructor(name,children,right){
        this.name = name;
        this.children=children;
        this.right=right;
    }
}
const server = http.createServer(function (request, response) {
    try {
        findRightNode('input.txt');
    } catch (e) {
        console.log('Error:', e.stack);
    }
})
async function findRightNode(fileName){
    try {
        var input = fs.readFileSync(fileName, 'utf8');
        var tree=input.split(/\r\n|\r|\n/);
        for (let i = 0; i < tree.length; i++) {
            tree[i]=JSON.parse(tree[i]);
        }
        var rootNode=new Node(null,[],null);
        for (let level = 0; level < tree.length; level++) {//tree[level]
            for (let node = 0; node < tree[level].length; node++) {//level[node]
                var currentNode = tree[level][node];
                if(currentNode[0]=="null"){//root node
                    rootNode.name=currentNode[1];
                    rootNode.children= findChildren(tree,level,rootNode.name,node);//tree[level+1]
                    rootNode.right=linkRightNode(tree,level,node);                   
                }
            }
        }
        printRightNode(rootNode,0);

        function findChildren(tree,currentLevel,nodeName,nodeIndex){
            if(currentLevel>=tree.length-1) return null;
            var childList = tree[currentLevel+1].filter(x=>x[0]===nodeName);
            var children = [];
            childList.forEach(child => {
                var childIndex=tree[currentLevel+1].findIndex(x => x[1] ===child[1] && x[0]===nodeName);
                var nodeChildren = findChildren(tree,currentLevel+1,child[1],childIndex);
                var childNodeToAdd = new Node(child[1],nodeChildren,linkRightNode(tree,currentLevel+1,childIndex));
                children.push(childNodeToAdd);
            });
            return children;
        }

        function linkRightNode(tree,currentLevel,nodeIndex){
            if(nodeIndex < tree[currentLevel].length-1){
                return tree[currentLevel][nodeIndex+1][1];
            }
            return null;
        }
        
        function printRightNode(node,level){
            if(level===0){
                console.log(node.right === null ? `Node ${node.name} - No right node` : `Node ${node.name} - Right node is ${node.right}`);
            }
            if (node.children!==null && node.children.length>0) {
                    node.children.forEach(child => {
                        console.log(child.right === null ? `Node ${child.name} - No right node` : `Node ${child.name} - Right node is ${child.right}`);
                    });
                    node.children.forEach(child => {
                        printRightNode(child,level+1);
                    });
                }
        }
    } catch (e) {
        console.log('Error:', e.stack);
    }
}
exports.findRightNode = findRightNode;

const port = 3000
const host = '127.0.0.1'
server.listen(port, host)
console.log(`Listening at http://${host}:${port}`)