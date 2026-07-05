const createStats = () => {
    const container = document.querySelector('.container');

    container.innerHTML = "";

    const infos = [
        `Score: ${Math.round(localStorage.getItem('score') * 100) / 100}%`,
        `Total Questions: ${localStorage.getItem('questionsNumber')}`,
        `Correct Answers: ${localStorage.getItem('correctAnswers')}`,
        `Remaining Time: ${localStorage.getItem('timer').substring(0, 2)}:${localStorage.getItem('timer').substring(3, 5)}:${localStorage.getItem('timer').substring(6, 8)}`,
        `Total Time: ${localStorage.getItem('duration').substring(0, 2)}:${localStorage.getItem('duration').substring(3, 5)}:${localStorage.getItem('duration').substring(6, 8)}`
    ];

    infos.forEach(text => {
        const span = document.createElement("span");
        span.innerText = text;
        container.appendChild(span);
    });

    const buttonDiv = document.createElement("div");

    const replayBtn = document.createElement("button");
    replayBtn.className = "container__button";

    const replayImg = document.createElement("img");
    replayImg.src = "../pictures/replay-icon.svg";
    replayImg.alt = "replay-icon";

    const replayText = document.createElement("span");
    replayText.innerText = "Play Again";

    replayBtn.append(replayImg, replayText);

    const homeBtn = document.createElement("button");
    homeBtn.className = "container__button";

    const homeImg = document.createElement("img");
    homeImg.src = "../pictures/home-icon.svg";
    homeImg.alt = "play-icon";

    const homeText = document.createElement("span");
    homeText.innerText = "Home";

    homeBtn.append(homeImg, homeText);

    buttonDiv.append(replayBtn, homeBtn);

    container.appendChild(buttonDiv);

    replayBtn.addEventListener('click', (event) => {
        localStorage.setItem('qNo', 1);
        localStorage.setItem('score', 0);
        localStorage.setItem('timer', localStorage.getItem('duration'));
        localStorage.setItem('situation', 'load')
        window.location.replace('../loadpage/index.html');
    });

    homeBtn.addEventListener('click', (event) => {
        window.location.replace('../index.html');
    });
};

const questions = JSON.parse(localStorage.getItem('questions'));

const createQNA = (data) => {
    const container = document.querySelector('.container');

    container.innerHTML = "";

    const thead = document.createElement('thead');
    for (let i = 0; i < 4; i++) {
        thead.appendChild(document.createElement('th'));
    }
    thead.children[0].innerText = 'No.';
    thead.children[1].innerText = 'Questions';
    thead.children[2].innerText = 'Your Answers';
    thead.children[3].innerText = 'Correct Answers';

    const tbody = document.createElement('tbody');

    for (let i = 0; i < Number(localStorage.getItem('questionsNumber')); i++) {
        const tr = document.createElement("tr");

        const no = document.createElement("td");
        no.innerText = i + 1;

        const question = document.createElement("td");
        question.innerText = data[i]?.question ?? questions[i].question;

        const userAnswer = document.createElement("td");
        userAnswer.innerText = data[i]?.userAnswer ?? '---';

        const correctAnswer = document.createElement("td");
        correctAnswer.innerText = data[i]?.correctAnswer ?? questions[i].correct_answer;

        tr.append(
            no,
            question,
            userAnswer,
            correctAnswer
        );

        tbody.appendChild(tr);
    }

    const table = document.createElement('table');
    table.appendChild(thead);
    table.appendChild(tbody);

    const tempSection = document.createElement('section');
    tempSection.appendChild(table);

    container.appendChild(tempSection);
}

createStats();

const headerButtons = document.querySelector('.cnt-header').children;
let headerMode = 0;
const headerButtonsMouseEnter = (event) => {
    event.currentTarget.style.cursor = 'pointer';
    event.currentTarget.style.filter = 'brightness(0.95)';
};
const headerButtonsMouseLeave = (event) => {
    event.currentTarget.style.cursor = 'default';
    event.currentTarget.style.filter = 'brightness(1)';
}
headerButtons[1].addEventListener('mouseenter', headerButtonsMouseEnter);
headerButtons[1].addEventListener('mouseleave', headerButtonsMouseLeave);
headerButtons[1].addEventListener('click', (event) => {
    if (headerMode === 0) {
        headerMode = 1;
        event.currentTarget.style.backgroundColor = 'white';
        headerButtons[0].style.backgroundColor = 'rgb(242, 242, 242)';
        headerButtons[1].removeEventListener('mouseenter', headerButtonsMouseEnter);
        headerButtons[1].removeEventListener('mouseleave', headerButtonsMouseLeave);
        headerButtonsMouseLeave(event);
        headerButtons[0].addEventListener('mouseenter', headerButtonsMouseEnter);
        headerButtons[0].addEventListener('mouseleave', headerButtonsMouseLeave);

        createQNA(JSON.parse(localStorage.getItem('data')));
    }
});
headerButtons[0].addEventListener('click', (event) => {
    if (headerMode === 1) {
        headerMode = 0;
        event.currentTarget.style.backgroundColor = 'white';
        headerButtons[1].style.backgroundColor = 'rgb(242, 242, 242)';
        headerButtons[0].removeEventListener('mouseenter', headerButtonsMouseEnter);
        headerButtons[0].removeEventListener('mouseleave', headerButtonsMouseLeave);
        headerButtonsMouseLeave(event);
        headerButtons[1].addEventListener('mouseenter', headerButtonsMouseEnter);
        headerButtons[1].addEventListener('mouseleave', headerButtonsMouseLeave);

        createStats();
    }
});
