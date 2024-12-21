const openFormsButton = chrome.i18n.getMessage('openFormsButton');
const loadAnswerButton = chrome.i18n.getMessage('loadAnswerButton');
const loadAnswerBETAButton = chrome.i18n.getMessage('loadAnswerBETAButton');
const disabledButton = chrome.i18n.getMessage('disabledButton');


function changeNotification(notification, color) {
    let checkUrlSpan = document.getElementById('checkUrlSpan');

    checkUrlSpan.textContent = notification;
    checkUrlSpan.style.color = color;

}

function createQuizButton(eventId, eventArgs) {
    // console.log("Event inside: ", eventId, eventArgs);
    const thisButton = document.createElement('button');
    thisButton.classList.add('quizButton'); // Thêm class để tùy chỉnh CSS

    if (eventId == 0) {
        thisButton.textContent = openFormsButton;
        thisButton.classList.add('badEventButton'); // Thêm class để tùy chỉnh CSS

        const thisEvent = clickBadEvent(eventArgs);
        thisButton.addEventListener('click', thisEvent);
    } else if (eventId == 1) {
        thisButton.textContent = loadAnswerButton;
        thisButton.classList.add('goodEventButton'); // Thêm class để tùy chỉnh CSS

        const thisEvent = clickGoodEventType1(eventArgs);
        thisButton.addEventListener('click', thisEvent);
    } else if (eventId == 2) {
        thisButton.textContent = loadAnswerBETAButton;        
        thisButton.classList.add('goodEventButton'); // Thêm class để tùy chỉnh CSS

        const thisEvent = clickGoodEventType2(eventArgs);
        thisButton.addEventListener('click', thisEvent);
    } else if (eventId == -1) {
        thisButton.textContent = disabledButton;
        thisButton.disabled = true;
        thisButton.classList.add('disabledButton'); // Thêm class để tùy chỉnh CSS
    }

    return thisButton;
}

function createQuizCell(name, info, id, eventJson) {
    const thisCell = document.createElement('div');
    thisCell.classList.add('cell');
    thisCell.id = id;

    const thisQuizLabel = document.createElement('p');
    thisQuizLabel.classList.add("quizLabel");
    const thisQuizSpan = document.createElement('span');
    thisQuizSpan.classList.add("quizSpan");
    thisQuizSpan.textContent = name;
    thisQuizLabel.appendChild(thisQuizSpan);

    const thisInfoLabel = document.createElement('p');
    thisInfoLabel.classList.add("infoLabel");
    const thisInfoSpan = document.createElement('span');
    thisInfoSpan.classList.add("infoSpan");
    thisInfoSpan.textContent = info;
    thisInfoLabel.appendChild(thisInfoSpan);

    thisCell.appendChild(thisQuizLabel);
    thisCell.appendChild(thisInfoLabel);

    eventJson.forEach(function (event) {
        thisCell.appendChild(createQuizButton(event.id, event.args));
    });
    
    return thisCell;
}

function createNoticeCell(noticeLine) {
    const thisNoticeLabel = document.createElement('p');
    const thisNoticeSpan = document.createElement('span');
    thisNoticeSpan.textContent = noticeLine;
    thisNoticeLabel.appendChild(thisNoticeSpan);

    return thisNoticeLabel;
}