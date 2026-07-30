import { fetchData} from "./api.js";

async function getProjects() {
    return await fetchData('https://api.github.com/users/Gurtalt/repos');
}

async function displayProjects(projects) {
    const projectList = document.getElementById('projects');
    projectList.innerHTML = '';

    projects.forEach(project => {
        const card = document.createElement("div");

        card.className = "project-card";

        card.innerHTML = `
            <h2>${project.name}</h2>
            <p>Language: ${project.language}</p>
            <a href="${project.html_url}" target="_blank">View on GitHub</a>
            <a href="${project.homepage || 'https://gurtalt.github.io/'+project.name}" target="_blank">View Live</a>
        `;

        projectList.appendChild(card);
    });

    console.log(JSON.stringify(projects, null, 2));
}

document.addEventListener('DOMContentLoaded', () => {
    getProjects()
        .then(projects => displayProjects(projects))
        .catch(error => console.error('Error displaying projects:', error));
});