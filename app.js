const editor = document.getElementById("editor");
const fileSelectorMenu = document.getElementById("fileSelectorMenu");
const menuElement = document.getElementById("menu");
const selector = document.getElementById("selector");
const fileSelectorWrapper = document.getElementById("selectorBox");
const selectorButton = document.getElementById("selectorButton");
const fileInput = document.getElementById("selectorInput");
let lastFileName = "";
let returningUser = false;
const defaultSettings = {
    editKeysEnabled: true,
    additionalKeysEnabled: true,
    keySoundEnabled: true
}
let sounds = []
const poolSize = 4;
let settingsMenuOpen = false;
let fileMenuOpen = false;


function New(){
    editor.value = "";
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

    }
    else {
        document.getElementById("buttonBar").style.display = "none";
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

selector.addEventListener('change', function ChangeInput(event) {
        fileInput.value = event.target.value;
    });

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
        editor.value = fileData.content;
        editor.selectionStart = fileData.cursorPosition;
        editor.selectionEnd = fileData.cursorPosition;
    }
    CloseMenu({type: 'fileSelectorMenu', action: 'close'});
}

function Save(){
    const fileData = {
        name: fileInput.value,
        content: editor.value,
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
    const body = encodeURIComponent(fileData.content);
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


let index = 0;
function PlayKeySound(){
    if (sounds.length == 0) return; // No sounds available, likely because key sound is disabled
    
    sounds[index].currentTime = 0;  
    sounds[index].play();
    index = (index + 1) % sounds.length; // Move to the next sound in the pool
}

document.addEventListener("keydown",(e) => {
    if (e.key.length == 1 && !e.repeat){
        PlayKeySound();
    }
})
ApplySettings(JSON.parse(localStorage.getItem("editorSettings")) ?? defaultSettings);
