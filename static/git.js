const MILLI = 1;
const SECOND = MILLI * 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;


class Repository {
    name;
    owner_name;
    description;
    created_date;
    last_push_date;
    language;
    public;
    fork;
    size
    constructor(data) {
        this.name = data["name"];
        this.owner_name = data["owner"]["login"];
        this.description = data["description"];
        this.created_date = data["created_at"];
        this.last_push_date = data["pushed_at"];
        this.language = data["language"];
        this.public = !data["private"];
        this.fork = data["fork"];
        this.size = data["size"];
    }
}


function sleep(sleepDuration) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) {
        /* Do nothing */
    }
}

function timeSince(date) {
    function generate_output(n, time) {
        sentense = "Updated " + n + " " + time;
        if (n > 1) {
            sentense += "s";
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


async function list_user_repo(user) {
    const response = await fetch(`https://api.github.com/users/${user}/repos`);

    if (!response.ok) {
        console.log(`Could not fetch repo list for user ${user}, unknown reason`);
        return -1;
    }

    const raw_repo_list = await response.json();

    const repo_list = raw_repo_list.map((data) => {
        let r = new Repository(data);
        return r;
    });

    return repo_list;
}

async function repo_last_modified_date(user, repo) {

    const response = await fetch(`https://api.github.com/repos/${user}/${repo}/commits?`);
    if (!response.ok) {
        console.log(`Could not fetch last update from ${user}/${repo}, unknown reason`);
        // I don't like how trow works
        return -1;
    }

    if (response.status != 200) {
        console.log(`Could not fetch last update from ${user}/${repo}, status code: ${response.status}`);
        return -1;
    }


    const commit_list = await response.json();

    if (commit_list.length == 0) {
        console.log(`The commit list for ${user}/${repo} is empty`);
        return -1;
    }

    const most_recent_commit = commit_list[0];

    const date = most_recent_commit['commit']['committer']['date'];

    return date;
}

function showTime() {
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

async function main() {

    const last_update_date = await repo_last_modified_date("bowarc", "Vupa");

    console.log(last_update_date);

    console.log("user time");
    let repos = await list_user_repo("bowarc");

    if (repos == -1) {
        console.log("Problem");
        return
    }

    repos = repos.sort((a, b) => {
        return new Date(b.last_push_date) - new Date(a.last_push_date);
    });

    for (repo of repos) {
        console.log(repo.name)
    }
}

// main();