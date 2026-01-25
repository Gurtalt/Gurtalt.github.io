const editor = document.getElementById("editor")

function New(){
    editor.value = "";
}

function Load(){
    
    const filename = prompt("File name?")
    let importedContent = localStorage.getItem(filename);
    editor.value = importedContent;
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
