


function create_card(repo) {
    const card = elementFromHtml(`
        <div class="project card">
            <a href="https://github.com/${repo.owner_name}/${repo.name}" class="card-link"><div class="card-bg"></div>
                <div class="card-title">
                    <img src="./resources/${repo.language.toLowerCase()}.webp" alt="${repo.language} icon" class="icon">
                    ${capitalizeFirstLetter(repo.name.replace("_", " "))}
                </div>
                <div class="card-description">${repo.description}</div>
                <div class="card-date-box">
                Last update:
                <span class="card-date">
                ${repo.last_update.toLocaleDateString("fr-FR")} ${repo.last_update.getHours()}h${repo.last_update.getMinutes()}
                </span>
                </div>
            </a>
        </div> 
    `);
    return card;
}


async function generate_cards(nbr_of_cards, required_repos) {

    const hugolz_repo_list = await list_user_repo("hugolz");
    const bowarc_repo_list = await list_user_repo("Bowarc");

    if (hugolz_repo_list == -1 || bowarc_repo_list == -1) {
        return;
    }

    let repo_list = bowarc_repo_list.concat(hugolz_repo_list);

    repo_list = repo_list.filter((repo, index) => {
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

        return true;
    });

    repo_list = repo_list.sort((a, b) => {
        // console.log(`Compairing ${a.last_update} and ${b.last_update}`);
        return b.last_update - a.last_update;
        // return b.size - a.size;
    });


    let index = 0;
    while (index < repo_list.length){
        let repo = repo_list[index];

        if (required_repos.includes(repo.name.toLowerCase())) {
            // console.log(`shortcutting default sort with ${repo.name}`);
            let card = create_card(repo);
            let project_list = document.getElementById("project_list");
            project_list.appendChild(card);

            repo_list.splice(index, 1);

            nbr_of_cards--;
        }else{
            // console.log(`${repo.name} not in the required list`)
            index++;
        }        
    }

    for (let i = 0; i < nbr_of_cards; i++) {
        let repo = repo_list[i];
        if (repo == null) {
            break
        }
        let card = create_card(repo);

        let project_list = document.getElementById("project_list");
        project_list.appendChild(card);
    }
}

generate_cards(5, ["chess_game", "lumin", "cdn", "crates", "binput_sim"]);