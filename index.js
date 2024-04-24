import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {
    databaseURL: "https://bokodevtracker-default-rtdb.firebaseio.com/"
}
let userIp = ""
const app = initializeApp(appSettings)
const database = getDatabase(app)
const entriesInDB = ref(database, "entries")

const inputEl = document.getElementById('main-txt')
const publishEl = document.getElementById('publish-btn')
const toEl = document.getElementById('to')
const fromEl = document.getElementById('from')
const ticketItem = document.getElementById("tickets")
const d = new Date().toLocaleString()
let entryList = []

class Entry {
    constructor(owner, message, likes, to, likedBy){
    this.owner = fromEl.value
    this.likes = 0
    this.message = message
    this.to = to
    this.likedBy = likedBy
    }
}

publishEl.addEventListener('click', function(){
    newEntry()
    console.log(entryList)
}
)

onValue(entriesInDB, function(snapshot){
    if (snapshot.exists()){
        entryList = Object.entries(snapshot.val())
        let entryListID = Object.keys(snapshot.val())
        let entryListValues = Object.values(snapshot.val())
        clearEntries()
        renderEntries(entryList)
    }
    else{
        ticketItem.innerHTML = "<br>...Looks like theres nothing here"
    }
        
    
})

function newEntry(){
    let owner = fromEl.value
    let message = inputEl.value
    let to = toEl.value
    let likedBy = ""
    let entry = new Entry(owner, message, 0, to, likedBy)
    push(entriesInDB, entry)
}
function clearEntries(){
    ticketItem.innerHTML=""
}
function renderEntries(entries){
    
    for (let i = 0; i < entries.length; i++){
        let entryID = entries[i][0]
        let entryValue = entries[i][1]
        let newEl = document.createElement("p")
        let newClearBtnEl = document.createElement("button")
        let newIcon = document.createElement("img")
        let likes = document.createElement("h4")
        newEl.innerHTML = `<b>From: ${entryValue.owner}</b>
        <br><i>${d}</i><br><br>${entryValue.message}
        <br><br><b>To: ${entryValue.to}</b><br>`
        newClearBtnEl.innerHTML = "Remove"
        newIcon.src = "/assets/heart.png"
        newEl.append(newClearBtnEl)
        newEl.append(newIcon)
        likes.innerHTML = `${entryValue.likes}`
        newEl.append(likes)
        newClearBtnEl.addEventListener('click', function(){
            let exactItemLocaton = ref(database, `entries/${entryID}`)
            remove(exactItemLocaton)
        })
        newIcon.addEventListener('click', function(){
            entryValue.likes += 1
            console.log(entryValue.likes)
            clearEntries()
            renderEntries(entries)
            set(ref(database, `entries/${entryID}`), {
                message: entryValue.message,
                likes: entryValue.likes,
                owner: entryValue.owner,
                to: entryValue.to
            });
        })
        ticketItem.append(newEl)
        /*renderString += `<p class = 'entry'><b>From: ${entries[i][1].owner}</b>
        <br><i>${d}</i><br><br>${entries[i][1].message}
        <br><br><b>To: ${entries[i][1].to}</b><span style="float:right;">
        ${entries[i][1].likes}</span></p>`*/
    }
    //ticketItem.innerHTML = renderString
}