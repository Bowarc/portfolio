const MILLI = 1;
const SECOND = MILLI * 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;


//Finish this
function sleep(sleepDuration){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* Do nothing */ }
}

function timeSince(date) {
    function generate_output(n, time){
        sentense = "Updated " + n + " " + time;
        if (n > 1){
            sentense +=  "s";
        }
        sentense += " ago"
        return sentense
    }

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;
    if (interval > 1) {
        return generate_output(Math.floor(interval), "year")
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return generate_output(Math.floor(interval), "month")
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return generate_output(Math.floor(interval), "day")
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return generate_output(Math.floor(interval), "hour")
    }
    interval = seconds / 60;
    if (interval > 1) {
        return generate_output(Math.floor(interval), "minute")
    }    
    return generate_output(Math.floor(seconds), "second")  
}


function getModifiedDate() {
    let status = -1;
    fetch("https://api.github.com/repos/bowarc/Vupa/commits?")
    .then((response) => {
        status = response.status;
        return response.json();
    })
    .then((commits) => {
        if (last_commit_date_check_status == 200){
            return commits[0]['commit']['committer']['date'];
        }else{
            console.log("If you see a 203 message, don't worry it's probably me being temp banned when testing things with github's api")
            return -1
        }            
    });
    return -1
}

function showTime(){
    // https://codepen.io/afarrar/pen/JRaEjP
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    // var session = "AM";
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    var time = h + ":" + m + ":" + s;
    document.getElementById("MyClockDisplay").innerText = time;
    document.getElementById("MyClockDisplay").textContent = time;
    
    setTimeout(showTime, 1000);    
}

getModifiedDate();
showLastUpdateTime();