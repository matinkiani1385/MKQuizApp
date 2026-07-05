// حداکثر تعداد سوالات آزمون
const MAX_QUESTIONS = 50;

// سلکتور تعداد سوالات آزمون
const questionsNumberSelect = document.getElementById('questionsNumberSelect');

// دکمه شروع آزمون
const formButton = document.querySelector('.form__button');

/*
    طراحی آپشن‌های سلکتور تعداد سوالات
*/
for (let i = 0; i < MAX_QUESTIONS; i++) {
    const option = document.createElement('option');
    option.setAttribute('value', i + 1);
    option.innerText = i + 1;
    questionsNumberSelect.appendChild(option);
}
questionsNumberSelect.value = '5';

/*
    هنگامی که کاربر روی اینپوت‌های تایمر کلیک می‌کند
*/
const timerInputClick = (event) => {
    // اگراینپوت خالی باشد، به جای پلیس هولدر، مقدار صفر می‌نشیند
    if (event.currentTarget.value === '') {
        event.currentTarget.value = 0;
        timerInputChange(event);
    }
};

/*
    هنگامی که کاربر مقدار اینپوت‌های تایمر را تغییر می‌دهد
*/
const timerInputChange = (event) => {
    // جلوگیری از اینکه هر سه مقدار هم‌زمان صفر باشند
    let nullCounter = 0;
    nullCounter += (document.getElementById('hoursInput').value === '0') ? 1 : 0;
    nullCounter += (document.getElementById('minutesInput').value === '0') ? 1 : 0;
    nullCounter += (document.getElementById('secondsInput').value === '0') ? 1 : 0;
    if (nullCounter === 3) {
        event.currentTarget.setAttribute('min', '1');
        event.currentTarget.value = '1';
    } else if (nullCounter < 2) {
        document.getElementById('hoursInput').setAttribute('min', '0');
        document.getElementById('minutesInput').setAttribute('min', '0');
        document.getElementById('secondsInput').setAttribute('min', '0');
    }
};

/*
    ذخیره‌سازی اطلاعات وارد شده از سمت کاربر در لوکال استوریج
*/
const saveData = () => {
    // حذف موارد قبلی از لوکال استوریج
    localStorage.removeItem('data');
    localStorage.removeItem('difficulty');
    localStorage.removeItem('options');
    localStorage.removeItem('qNo');
    localStorage.removeItem('questionSource');
    localStorage.removeItem('questions');
    localStorage.removeItem('questionsNumber');
    localStorage.removeItem('score');
    localStorage.removeItem('selectedOption');
    localStorage.removeItem('duration');
    localStorage.removeItem('situation');
    localStorage.removeItem('timer');
    localStorage.removeItem('correctAnswers');
    localStorage.removeItem('category');

    // افزودن موارد جدید (تعداد سوالات، دسته‌بندی، میزان سختی، مدت آزمون و تایمری که زمان رو هر ثانیه ذخیره می‌کنه) به لوکال استوریج
    localStorage.setItem('questionsNumber', document.getElementById('questionsNumberSelect').value);
    localStorage.setItem('category', document.getElementById('categorySelect').value);
    localStorage.setItem('difficulty', document.getElementById('difficultySelect').value);
    localStorage.setItem('duration', `${document.getElementById('hoursInput').value.padStart(2, '0')}:${document.getElementById('minutesInput').value.padStart(2, '0')}:${document.getElementById('secondsInput').value.padStart(2, '0')}`);
    localStorage.setItem('timer', localStorage.getItem('duration'));
    localStorage.setItem('situation', 'first load');
};

/*
    هنگامی که کاربر روی دکمه شروع آزمون کلیک می‌کند
*/
formButton.addEventListener('click', (event) => {
    // اگر کاربر هنوز به اینپوت‌های تایمر مقداری نداده باشد (یا به عبارتی دیگر مدت آزمون را مشخص نکرده باشد) اخطار دریافت می‌کند
    if (document.getElementById('hoursInput').value && document.getElementById('minutesInput').value && document.getElementById('secondsInput').value) {
        // از پیش‌فرض دکمه که ارسال اطلاعات فرم است، جلوگیری می‌کنیم
        event.preventDefault();

        // اطلاعات وارد شده از سمت کاربر را ذخیره می‌کنیم
        saveData();

        // در ظاهر دکمه تغییراتی را اعمال می‌کنیم
        formButton.style.cursor = "default";
        formButton.style.filter="opacity(0.5)";
        formButton.children[1].textContent = "Proccesing...";

        // پس از گذشت 1.5 ثانیه کاربر را به صفحه لود سوالات هدایت می‌کنیم
        setTimeout(() => {
            window.location.replace('./loadpage/index.html');
        }, 1500);
    }
});