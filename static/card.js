function elementFromHtml(html) {
    const template = document.createElement("template");

    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function create_card(repo) {
    const card = elementFromHtml(`
        <div class="project card">
            <a href="https://github.com/${repo.owner_name}/${repo.name}" class="card-link"><div class="card-bg"></div>
                <div class="card-title">
                    <img src="../resources/${repo.language.toLowerCase()}.png" class="icon">
                    ${capitalizeFirstLetter(repo.name.replace("_", " "))}
                </div>
                <div class="card-description">${repo.description}</div>
                <div class="card-date-box">
                Last update:
                <span class="card-date">
                ${repo.last_push_date}
                </span>
                </div>
            </a>
        </div> 
    `);
    return card;
}


async function generate_cards() {

    const hugolz_repo_list = await list_user_repo("hugolz");
    const bowarc_repo_list = await list_user_repo("Bowarc");

    if (hugolz_repo_list == -1 || bowarc_repo_list == -1) {
        console.log("fuck");
        return
    }

    let repo_list = bowarc_repo_list.concat(hugolz_repo_list);

    let ordered_repo_list = repo_list.sort((a, b) => {
        return new Date(b.last_push_date) - new Date(a.last_push_date);
        // return b.size - a.size;
    });

    console.log(ordered_repo_list);


    let repos = ordered_repo_list.filter((repo, index) => {
        // False to remove the element
        console.log(`${repo.owner_name} | ${repo.name}`);
        if (repo.fork) {
            console.log("Skipped, fork");
            return false;
        }
        if (repo.description == null) {
            console.log("Skipped, null")
            return false;
        }
        if (repo.name.toLowerCase() == repo.owner_name.toLowerCase()) {
            console.log("Skipped, profile repo");
            return false;
        }
        if (repo.name.includes(".nvim")) {
            console.log("Skipped, config files");
            return false;
        }

        // for (let index2 in ordered_repo_list) {
        //     let repo2 = ordered_repo_list[index2];
        //     if (repo.name === repo2.name && index !== index2) {
        //         return false;
        //     }
        // }
        return true;
    });

    const nb_of_repos = 7;

    for (let i = 0; i < nb_of_repos; i++) {
        let card = create_card(repos[i]);

        let project_list = document.getElementById("project_list");
        project_list.appendChild(card);
    }
}

generate_cards()