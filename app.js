const editor = document.getElementById("editor");
const fileSelectorContainer = document.getElementById("fileSelector");
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


function New(){
    editor.value = "";
}


function OpenSettings(){
    const settings = JSON.parse(localStorage.getItem("editorSettings")) ?? defaultSettings;
    const additionalKeysToggle = document.getElementById("additionalKeysToggle"); 
    const keySoundToggle = document.getElementById("keySoundToggle");
    const editKeysToggle = document.getElementById("editKeysToggle");

    additionalKeysToggle.checked = settings.additionalKeysEnabled;
    keySoundToggle.checked = settings.keySoundEnabled;
    editKeysToggle.checked = settings.editKeysEnabled;
    document.getElementById("settingsPanel").style.display = "block";
}
function CloseSettings(){
    ApplySettings({
        additionalKeysEnabled: document.getElementById("additionalKeysToggle").checked,
        keySoundEnabled: document.getElementById("keySoundToggle").checked,
        editKeysEnabled: document.getElementById("editKeysToggle").checked
    });
    document.getElementById("settingsPanel").style.display = "none";
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

function OpenFileLoader(saveOrLoad){
    const keys = []
    fileSelectorContainer.addEventListener("click",CloseFileLoader);
    fileSelectorWrapper.addEventListener("click",(e) => {e.stopPropagation();});
    selector.addEventListener('change', function ChangeInput(event) {
        fileInput.value = event.target.value;
    })
    selector.innerHTML = "";
    fileSelectorContainer.style.display = "block";
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

    switch (saveOrLoad){
                    case "save": selectorButton.innerText = "SAVE"; selectorButton.onclick = Save; break;

                    case "load": selectorButton.innerText = "LOAD"; selectorButton.onclick = Load; break;

                    case "export": selectorButton.innerText = "EXPORT"; selectorButton.onclick = Export; break;
                        
                }
    
    
}

function CloseFileLoader(){
    fileSelectorContainer.style.display = "none";
    lastFileName = selector.value;
    
    fileSelectorContainer.removeEventListener("click",CloseFileLoader);
    selector.removeEventListener("click",(e) => {e.stopPropagation();});
}



function Load(){
    let importedContent = localStorage.getItem("text_"+fileInput.value);
    if (importedContent){
        const fileData = JSON.parse(importedContent);
        editor.value = fileData.content;
        editor.selectionStart = fileData.cursorPosition;
        editor.selectionEnd = fileData.cursorPosition;
    }
    CloseFileLoader();
}

function Save(){
    const fileData = {
        name: fileInput.value,
        content: editor.value,
        cursorPosition: editor.selectionStart
    }

    localStorage.setItem("text_"+fileInput.value,JSON.stringify(fileData));
    CloseFileLoader();
}

function Export(){
    const file = localStorage.getItem("text_"+fileInput.value);
    if (!file){
        alert("File not found!");
        return;
    }
    const fileData = JSON.parse(file);
    const subject = encodeURIComponent(fileData.name);
    let email = subject+" <"+prompt("Enter desired recipiants Email:")+">";
    const body = encodeURIComponent(file.content);
    window.location.href =`mailto:${email}?subject=${subject}&body=${body}`;
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
