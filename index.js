const db=require('./db.js')
const inquirer = require('inquirer');

module.exports.add=async (title)=>{
  const list=await db.read()
  list.push({title,done:false})
  await db.write(list)
}

module.exports.clear=async ()=>{
  await db.write([])
}

function askForCreateTask(list){
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: "请输入任务名"
  }).then((answer4) => {
    list.push({
      title:answer4.title,
      done:false
    })
    db.write(list)
  });
}

function markAsDone (list,index){
  list[index].done=true
  db.write(list)
}

function markAsUnDone (list,index){
  list[index].done=false
  db.write(list)
}

function updateTitle (list,index){
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: "请输入新的任务名",
    default:list[index].title
  }).then((answer3) => {
    list[index].title=answer3.title
    db.write(list)
  });
}

function remove (list,index){
  list.splice(index,1)
  db.write(list)
}

function askForAction(list,index){
  const actions={markAsDone,markAsUnDone,updateTitle,remove}
  inquirer
    .prompt(
      {
        type: 'list',
        name: 'action',
        message: '请选择操作类型',
        choices: [
          {name:'退出',value:'quit'},
          {name:'已完成',value:'markAsDone'},
          {name:'未完成',value:'markAsUnDone'},
          {name:'修改任务名',value:'updateTitle'},
          {name:'删除任务',value:'remove'},
        ]
      }).then((answer2)=>{
        const action=actions[answer2.action]
        action && action(list,index)
  })
}

function printTasks(list){
  inquirer
    .prompt(
      {
        type: 'list',
        name: 'index',
        message: '请选择你要操作的任务',
        choices: [{name:'退出',value:'-1'},...list.map((task,index)=>{
          return {name:`${task.done ? '[x]' : '[ ]'} ${index + 1}-${task.title}`,value:index.toString()}
        }),{name: ' + 新增任务',value: '-2'},{name:' - 清空任务列表',value: '-3'}]
      }
    )
    .then((answer) => {
      const index=parseInt(answer.index)
      if(index>=0){
        askForAction(list,index)
      }else if(index===-2){
        askForCreateTask(list)
      }else if(index===-3){
        db.write([])
      }
    });
}

module.exports.showAll=async ()=>{
  const list=await db.read()
  printTasks(list)
}