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
        thisButton.textContent = "Mở trang web";
        thisButton.classList.add('badEventButton'); // Thêm class để tùy chỉnh CSS

        const thisEvent = clickBadEvent(eventArgs);
        thisButton.addEventListener('click', thisEvent);
    } else if (eventId == 1) {
        thisButton.textContent = "Tải đáp án (cách 1, nên dùng)";
        thisButton.classList.add('goodEventButton'); // Thêm class để tùy chỉnh CSS

        const thisEvent = clickGoodEventType1(eventArgs);
        thisButton.addEventListener('click', thisEvent);
    } else if (eventId == 2) {
        thisButton.textContent = "Tải đáp án (cách 2, không nên dùng)";
        thisButton.classList.add('goodEventButton'); // Thêm class để tùy chỉnh CSS

        const thisEvent = clickGoodEventType2(eventArgs);
        thisButton.addEventListener('click', thisEvent);
    } else if (eventId == -1) {
        thisButton.textContent = "Không thể tải đáp án";
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
    thisQuizLabel.id = "quizLabel";
    const thisQuizSpan = document.createElement('span');
    thisQuizSpan.id = "quizSpan";
    thisQuizSpan.textContent = name;
    thisQuizLabel.appendChild(thisQuizSpan);

    const thisInfoLabel = document.createElement('p');
    thisInfoLabel.id = "infoLabel";
    const thisInfoSpan = document.createElement('span');
    thisInfoSpan.id = "infoSpan";
    thisInfoSpan.textContent = info;
    thisInfoLabel.appendChild(thisInfoSpan);

    // thisLabel.appendChild(document.createTextNode('Bài thi: '));
    thisCell.appendChild(thisQuizLabel);
    thisCell.appendChild(thisInfoLabel);

    eventJson.forEach(function (event) {
        thisCell.appendChild(createQuizButton(event.id, event.args));
    });
    
    return thisCell;
}
