const editor = document.getElementById("editor");
const fileSelectorMenu = document.getElementById("fileSelectorMenu");
const menuElement = document.getElementById("menu");
const selector = document.getElementById("selector");
const fileSelectorWrapper = document.getElementById("selectorBox");
const selectorButton = document.getElementById("selectorButton");
const fileInput = document.getElementById("selectorInput");
const pageNumberButton = document.getElementById("pageNumber");
const pageNumberMenuButton = document.getElementById("pageNumberMenu");
let lastFileName = "";
let returningUser = false;
const defaultSettings = {
    editKeysEnabled: true,
    additionalKeysEnabled: true,
    keySoundEnabled: true
}
let sounds = []
const poolSize = 4;
let index = 0;
let settingsMenuOpen = false;
let fileMenuOpen = false;

let currentPages = [];
let pageNumber = 0;

function New(){
    currentPages = [];
    editor.value = "";
    pageNumber = 0;

    pageNumberButton.innerText = pageNumber + 1;
    pageNumberMenuButton.innerText = pageNumber + 1;
}


function OpenMenu(menu){
    if(settingsMenuOpen){
        CloseMenu({type: 'settingsMenu', action: 'openSettings'});
    }
    else if (fileMenuOpen){
        CloseMenu({type: 'fileSelectorMenu', action: 'close'});
    }
    menuElement.style.display = "block";
    if (menu.type == "settingsMenu"){
        settingsMenuOpen = true;
        OpenSettings();
    }
    else if (menu.type == "fileSelectorMenu"){
        fileMenuOpen = true;
        OpenFileLoader(menu.action);
    }
    menuElement.addEventListener("click", CloseMenu, { once: true });
    menuElement.querySelector("#settingsMenu").addEventListener("click",(e) => {e.stopPropagation();});
    menuElement.querySelector("#fileSelectorMenu").addEventListener("click",(e) => {e.stopPropagation();});
}


function CloseMenu(){
    menuElement.style.display = "none";
    if(settingsMenuOpen){
        settingsMenuOpen = false;
        ApplySettings({
            additionalKeysEnabled: document.getElementById("additionalKeysToggle").checked,
            keySoundEnabled: document.getElementById("keySoundToggle").checked,
            editKeysEnabled: document.getElementById("editKeysToggle").checked
        });
        document.getElementById("settingsMenu").style.display = "none";
    }

    else if (fileMenuOpen){
        fileMenuOpen = false;
        fileSelectorMenu.style.display = "none";
        lastFileName = selector.value;
    }
}          


function OpenSettings(){
    const settings = JSON.parse(localStorage.getItem("editorSettings")) ?? defaultSettings;
    const additionalKeysToggle = document.getElementById("additionalKeysToggle"); 
    const keySoundToggle = document.getElementById("keySoundToggle");
    const editKeysToggle = document.getElementById("editKeysToggle");

    additionalKeysToggle.checked = settings.additionalKeysEnabled;
    keySoundToggle.checked = settings.keySoundEnabled;
    editKeysToggle.checked = settings.editKeysEnabled;
    document.getElementById("settingsMenu").style.display = "flex";
}


function ApplySettings(settings){
    if(settings.additionalKeysEnabled){
        document.getElementById("customKeyBar").style.display = "block";
}
    else {
        document.getElementById("customKeyBar").style.display = "none";
    }

    if(settings.editKeysEnabled){
        document.getElementById("buttonBar").style.display = "flex";
        document.getElementById("arrowBar").style.display = "flex";

    }
    else {
        document.getElementById("buttonBar").style.display = "none";
        document.getElementById("arrowBar").style.display = "none";
    }

    if (settings.keySoundEnabled){
        sounds = [];
        console.log("Key sound enabled, initializing sound pool...");
        for (let i = 0; i < poolSize; i++){
            sounds.push(new Audio("media/keyPress.mp3"));
            sounds[i].preload = "auto";
        }
    }
    else {
        console.log("Key sound disabled, clearing sound pool...");
        sounds = [];
    }

    localStorage.setItem("editorSettings",JSON.stringify(settings));
}


function OpenFileLoader(action){
    const keys = []
    selector.innerHTML = "";
    fileSelectorMenu.style.display = "flex";
    for(let i=0; i < localStorage.length;i++){
        if (localStorage.key(i).startsWith("text_")){
                    keys.push(localStorage.key(i));
                    const fileOption = document.createElement("option");
                    fileOption.value = localStorage.key(i).substring(5); // Remove "text_" prefix
                    fileOption.innerText = localStorage.key(i).substring(5); // Remove "text_" prefix
                    selector.appendChild(fileOption);
                }
    }

    selector.value = lastFileName;

    switch (action){
                    case "save": selectorButton.innerText = "SAVE"; selectorButton.onclick = Save; break;

                    case "load": selectorButton.innerText = "LOAD"; selectorButton.onclick = Load; break;

                    case "export": selectorButton.innerText = "EXPORT"; selectorButton.onclick = Export; break;
                        
                }
    
    
}


function Load(){
    let importedContent = localStorage.getItem("text_"+fileInput.value);
    if (importedContent){
        const fileData = JSON.parse(importedContent);
        editor.value = fileData.content[0];
        editor.selectionStart = fileData.cursorPosition;
        editor.selectionEnd = fileData.cursorPosition;
        currentPages = fileData.content;
        pageNumber = 0;
        pageNumberButton.innerText = pageNumber + 1;
        pageNumberMenuButton.innerText = pageNumber + 1;
    }
    CloseMenu({type: 'fileSelectorMenu', action: 'close'});
}


function Save(){
    currentPages.splice(pageNumber,1,editor.value);
    const fileData = {
        name: fileInput.value,
        content: currentPages,
        cursorPosition: editor.selectionStart
    }

    localStorage.setItem("text_"+fileInput.value,JSON.stringify(fileData));
    CloseMenu({type: 'fileSelectorMenu', action: 'close'});
}


function Export(){
    const file = localStorage.getItem("text_"+fileInput.value);
    if (!file){
        alert("File not found!");
        return;
    }
    const fileData = JSON.parse(file);
    const subject = encodeURIComponent(fileData.name);
    const email = prompt("Enter desired recipiants Email:");
    const body = encodeURIComponent(fileData.content.join("\n---PAGE BREAK---\n"));
    window.location.href =`mailto:${email}?subject=${subject}&body=${body}`;
    CloseMenu({type: 'fileSelectorMenu', action: 'close'});
}


function SpawnKey(leftBracket,rightBracket){
    editor.focus()

    let selectionStart = editor.selectionStart;
    let selectionEnd = editor.selectionEnd;

    if (selectionStart != selectionEnd){
        editor.setRangeText(leftBracket+editor.value.slice(selectionStart,selectionEnd)+rightBracket,selectionStart,selectionEnd,'end');
    }

    else {
        editor.setRangeText(leftBracket+rightBracket,selectionStart,selectionEnd,'end')

        editor.selectionStart = editor.selectionEnd = selectionStart + leftBracket.length;
    }
}


function PlayKeySound(){
    if (sounds.length == 0) return; // No sounds available, likely because key sound is disabled
    
    sounds[index].currentTime = 0;  
    sounds[index].play();
    index = (index + 1) % sounds.length; // Move to the next sound in the pool
}


function MovePage(direction){
    const currentText = editor.value;
    editor.selectionStart = 0;
    editor.selectionEnd = 0;

    if (direction == "next"){

        currentPages.splice(pageNumber,1,currentText);
        pageNumber++;
        if (pageNumber >= currentPages.length){
            pageNumber = 0;
        }
        editor.value = currentPages[pageNumber];
        pageNumberButton.innerText = pageNumber + 1;
        pageNumberMenuButton.innerText = pageNumber + 1;
    }
    else if (direction == "previous"){
        currentPages.splice(pageNumber,1,currentText);
        pageNumber--;
        if (pageNumber < 0){
            pageNumber = currentPages.length - 1;
        }
        editor.value = currentPages[pageNumber];
        pageNumberButton.innerText = pageNumber + 1;
        pageNumberMenuButton.innerText = pageNumber + 1;
    }
}

function CreateNewPage(){
    const currentText = editor.value;
    currentPages.splice(pageNumber,1,currentText);
    currentPages.push("");
    pageNumber = currentPages.length - 1;
    editor.value = "";
    pageNumberButton.innerText = pageNumber + 1;
    pageNumberMenuButton.innerText = pageNumber + 1;
}

selector.addEventListener('change', function ChangeInput(event) {
        fileInput.value = event.target.value;
    });

document.addEventListener("keydown",(e) => {
    if (e.key.length == 1 && !e.repeat){
        PlayKeySound();
    }
})

ApplySettings(JSON.parse(localStorage.getItem("editorSettings")) ?? defaultSettings);
