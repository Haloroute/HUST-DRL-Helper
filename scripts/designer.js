// function addNewQuiz(name, id, eventJson) {
//     const cellContainer = document.getElementById('cellContainer');

//     const thisCell = document.createElement('div');
//     thisCell.classList.add('cell');
//     thisCell.id = id;

//     const thisLabel = document.createElement('p');
//     thisLabel.id = "quizLabel";
//     const thisSpan = document.createElement('span');
//     thisSpan.id = "quizSpan";
//     thisSpan.textContent = name;

//     thisLabel.appendChild(document.createTextNode('Bài thi: '));
//     thisLabel.appendChild(thisSpan);

//     thisCell.appendChild(thisLabel);

//     eventJson.forEach(function (event) {
//         const thisButton = document.createElement('button');

//         if (event.id == 0) {
//             thisButton.textContent = "Mở trang web";
//             thisButton.style.background = '#d3d3d3';

//             const thisEvent = clickBadEvent(event.args);
//             thisButton.addEventListener('click', thisEvent);
//         } else if (event.id == 1) {
//             thisButton.textContent = "Tải đáp án (cách 1)";

//             const thisEvent = clickGoodEventType1(event.args);
//             thisButton.addEventListener('click', thisEvent);
//         } else if (event.id == 2) {
//             thisButton.textContent = "Tải đáp án (cách 2)";

//             const thisEvent = clickGoodEventType2(event.args);
//             thisButton.addEventListener('click', thisEvent);
//         } else if (event.id == -1) {
//             thisButton.textContent = "Không thể tải đáp án";
//             thisButton.disabled = true;
//             thisButton.style.background = '#d3d3d3';
//             thisButton.style.cursor = 'not-allowed';
//         }

//         thisCell.appendChild(thisButton);
//     });
    
//     cellContainer.appendChild(thisCell);
// }

function addNewQuiz(name, info, id, eventJson) {
    const cellContainer = document.getElementById('cellContainer');

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
        const thisButton = document.createElement('button');
        thisButton.classList.add('quizButton'); // Thêm class để tùy chỉnh CSS

        if (event.id == 0) {
            thisButton.textContent = "Mở trang web";
            thisButton.classList.add('badEventButton'); // Thêm class để tùy chỉnh CSS

            const thisEvent = clickBadEvent(event.args);
            thisButton.addEventListener('click', thisEvent);
        } else if (event.id == 1) {
            thisButton.textContent = "Tải đáp án (cách 1, nên dùng)";
            thisButton.classList.add('goodEventButton'); // Thêm class để tùy chỉnh CSS

            const thisEvent = clickGoodEventType1(event.args);
            thisButton.addEventListener('click', thisEvent);
        } else if (event.id == 2) {
            thisButton.textContent = "Tải đáp án (cách 2, không nên dùng)";
            thisButton.classList.add('goodEventButton'); // Thêm class để tùy chỉnh CSS

            const thisEvent = clickGoodEventType2(event.args);
            thisButton.addEventListener('click', thisEvent);
        } else if (event.id == -1) {
            thisButton.textContent = "Không thể tải đáp án";
            thisButton.disabled = true;
            thisButton.classList.add('disabledButton'); // Thêm class để tùy chỉnh CSS
        }

        thisCell.appendChild(thisButton);
    });
    
    cellContainer.appendChild(thisCell);
}
