var ws = require("nodejs-websocket")
let id=0
var server = ws.createServer(function (conn){
  id++
  conn.name = "p"+id
  conn.on("text",function(str){
    let msg = {}
    if(str.slice(0,9)=='nickName|'){
      conn.name=str.split('|')[1]
      conn.avatar=str.split('|')[3]
      msg.name = conn.name
      msg.avatar = conn.avatar
      msg.msg = "online"
      BroadcastChannel(server,JSON.stringify(msg))
      return
    }
    msg.name = conn.name
    msg.avatar = conn.avatar
    msg.msg = str
    BroadcastChannel(server,JSON.stringify(msg))

  })
  conn.on('connect',function(){
    conn.name = "name"
    conn.avatar = "avatar"

  })
  conn.on("close",function(code,reason){
    console.log("connection closed")
  })
}).listen(8081,()=>console.log('socket server listening on:8081'))

function BroadcastChannel(server, msg){
  server.connections.forEach(function(conn){
    console.log(msg);    
    conn.sendText(msg)
  })
}