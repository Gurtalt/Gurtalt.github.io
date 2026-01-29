const editor = document.getElementById("editor")
const fileSelector = document.getElementById("fileSelector")
const selector = document.getElementById("selector");

function New(){
    editor.value = "";
}

function OpenFileLoader(){
    const keys = []
    fileSelector.addEventListener("click",CloseFileLoader);
    selector.addEventListener("click",(e) => {e.stopPropagation();});
    selector.innerHTML = "";
    fileSelector.style.display = "flex";
    for(let i=0; i < localStorage.length;i++){
        keys.push(localStorage.key(i));
        const fileOption = document.createElement("option");
        fileOption.value = localStorage.key(i);
        fileOption.innerText = localStorage.key(i)
        selector.appendChild(fileOption);
    }
    
}

function CloseFileLoader(){
    fileSelector.style.display = "none"
    fileSelector.removeEventListener("click");
    selector.removeEventListener("click",(e) => {e.stopPropagation();});
}



function Load(){
    let importedContent = localStorage.getItem(selector.value);
    editor.value = importedContent;
    fileSelector.style.display = "none";
}

function Save(){
   
    const filename = prompt("File name?")
    localStorage.setItem(filename,editor.value)
}

function Export(){
    const subject = encodeURIComponent(prompt("Enter file name/ subject line:"));
    let email = subject+" <"+prompt("Enter desired recipiants Email:")+">";
    const body = encodeURIComponent(editor.value);
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
