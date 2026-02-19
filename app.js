const editor = document.getElementById("editor");
const fileSelectorContainer = document.getElementById("fileSelector");
const selector = document.getElementById("selector");
const fileSelectorWrapper = document.getElementById("selectorBox");
const selectorButton = document.getElementById("selectorButton");
const fileInput = document.getElementById("selectorInput");
let lastFileName = "";

function New(){
    editor.value = "";
}

function OpenFileLoader(saveOrLoad){
    const keys = []
    fileSelectorContainer.addEventListener("click",CloseFileLoader);
    fileSelectorWrapper.addEventListener("click",(e) => {e.stopPropagation();});
    selector.addEventListener('change', function ChangeInput(event) {
        fileInput.value = event.target.value;
    })
    selector.innerHTML = "";
    fileSelectorContainer.style.display = "flex";
    for(let i=0; i < localStorage.length;i++){
                            keys.push(localStorage.key(i));
                            const fileOption = document.createElement("option");
                            fileOption.value = localStorage.key(i);
                            fileOption.innerText = localStorage.key(i)
                            selector.appendChild(fileOption);
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
    
    fileSelectorContainer.removeEventListener("click");
    selector.removeEventListener("click",(e) => {e.stopPropagation();});
}



function Load(){
    let importedContent = localStorage.getItem(fileInput.value);
    editor.value = importedContent;
    CloseFileLoader();
}

function Save(){
    localStorage.setItem(fileInput.value,editor.value);
    CloseFileLoader();
}

function Export(){
    const subject = encodeURIComponent(fileInput.value);
    let email = subject+" <"+prompt("Enter desired recipiants Email:")+">";
    const body = encodeURIComponent(localStorage.getItem(fileInput.value));
    window.location.href =`mailto:${email}?subject=${subject}&body=${body}`;
}

function SpawnKey(leftBracket,rightBracket){
    const editor = document.getElementById('editor');
    editor.focus()

    selectionStart = editor.selectionStart;
    selectionEnd = editor.selectionEnd;

    if (selectionStart != selectionEnd){
        editor.setRangeText(leftBracket+editor.value.slice(selectionStart,selectionEnd)+rightBracket,selectionStart,selectionEnd,'end');
    }

    else {
        editor.setRangeText(leftBracket+rightBracket,selectionStart,selectionEnd,'end')

        editor.selectionStart = editor.selectionEnd = selectionStart + leftBracket.length;
    }
}

sounds = []
poolSize = 7;

for (let i = 0; i < poolSize; i++){
    const audio = new Audio("keyPress.mp3");
    sounds.push(audio);
}  

let index = 0;



document.addEventListener("keydown",(e) => {
    if (e.key.length == 1 && !e.repeat){
        PlayKeySound();
    }
})

function PlayKeySound(){
    sounds[index].currentTime = 0;  
    sounds[index].play();
    index = (index + 1) % poolSize;
}