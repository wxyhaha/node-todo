const homedir=require('os').homedir()
const home=process.env.HOME || homedir
const p=require('path')
const fs=require('fs')
const dbPath=p.join(home,'.todo')
const db=require('./db.js')

module.exports.add=async (title)=>{
  const list=await db.read()
  list.push({title,done:false})
  await db.write(list)
}