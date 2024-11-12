const lengthSlider = document.querySelector(".pass-length input");
const options = document.querySelectorAll(".option input");
const copyIcon = document.querySelector(".input-box span");
const passwordInput = document.querySelector(".input-box input");
const passIndicator = document.querySelector(".pass-indicator");
const generateBtn = document.querySelector(".generate-btn");

const characters = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!$%&|[](){}:;.,*+-#@<>~"
}

const generatePassword = () => {
    let staticPassword = "",
        randomPassword = "",
        excludeDuplicate = false,
        passLength = lengthSlider.value;

    options.forEach(option => {
        if (option.checked) {
            if (option.id !== "exc-duplicate" && option.id !== "spaces") {
                staticPassword += characters[option.id];
            } else if (option.id === "spaces") {
                staticPassword += `  ${staticPassword}  `;
            } else {
                excludeDuplicate = true;
            }
        }
    });

    for (let i = 0; i < passLength; i++) {
        let randomChar = staticPassword[Math.floor(Math.random() * staticPassword.length)];
        if (excludeDuplicate) {
            !randomPassword.includes(randomChar) || randomChar == " " ? randomPassword += randomChar : i--;
        } else {
            randomPassword += randomChar;
        }
    }
    passwordInput.value = randomPassword;

}

const updatePassIndicator = () => {
    passIndicator.id = lengthSlider.value <= 8 ? "weak" : lengthSlider.value <= 16 ? "medium" : "strong";
    document.body.id = lengthSlider.value <= 8 ? "weak" : lengthSlider.value <= 16 ? "medium" : "strong";
    document.getElementById('append-history').classList.remove('weak','medium','strong')
    document.getElementById('append-history').classList.add(lengthSlider.value <= 8 ? "weak" : lengthSlider.value <= 16 ? "medium" : "strong");
}

const updateSlider = () => {
    document.querySelector(".pass-length span").innerText = lengthSlider.value;
    generatePassword();
    updatePassIndicator();
}
updateSlider();

var passwordObj = []
const copyPassword = () => {
    let date = new Date();
    let currentTime = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    navigator.clipboard.writeText(passwordInput.value);
    copyIcon.innerText = "check";
    copyIcon.style.color = "#4285f4";
    setTimeout(() => {
        copyIcon.innerText = "copy_all";
        copyIcon.style.color = "#707070";
    }, 1500);
    passwordObj = JSON.parse(localStorage.getItem('passwordHistory')) || []
    if (passwordObj[passwordObj.length - 1]?.date !== currentTime || passwordObj[passwordObj.length - 1]?.pass !== passwordInput.value) {
        localStorage.setItem('passwordHistory', JSON.stringify([...passwordObj, { date: currentTime, pass: passwordInput.value }]))
        renderHistory()
    }
}

function onHistoryCopy(pass,element) {
    navigator.clipboard.writeText(pass);
    element.innerText = "check";
    element.style.color = "#4285f4";
    setTimeout(() => {
        element.innerText = "copy_all";
        element.style.color = "#000000";
    }, 1500);
}


function renderHistory() {

    document.getElementById('append-history').innerHTML =JSON.parse(localStorage.getItem('passwordHistory'))?.map((_, i) => {
       return `<li class="border px-2 py-1 my-2 rounded-sm">
              <p class="text-slate-600 text-[.79rem] text-right cursor-context-menu" onmousedown='return false;' onselectstart='return false;'>${_.date}</p>
            <div class="flex justify-between items-center">
              <p class="break-words w-5/6">${_.pass}</p>
              <button onclick="onHistoryCopy('${_.pass}',this)" class="material-symbols-rounded cursor-pointer">copy_all</button>
            </div>
          </li>`
    }).join('')

}
renderHistory()


copyIcon.addEventListener("click", copyPassword);
lengthSlider.addEventListener("input", updateSlider);
generateBtn.addEventListener("click", generatePassword);