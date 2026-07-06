// تعداد گزینه‌ها
const NUMBER_OF_OPTIONS = 4;

/*
  آماده‌سازی سوالات آزمون از منبع ارسال شده
*/
let questions = [];
if (!JSON.parse(localStorage.getItem('questions'))) {
  const questionSource = JSON.parse(localStorage.getItem('questionSource'));
  for (const question of questionSource) {
    if ((question['category'] === localStorage.getItem('category') || localStorage.getItem('category') === 'Any Category') && (question['difficulty'] === localStorage.getItem('difficulty') || localStorage.getItem('difficulty') === 'Any Difficulty')) {
      questions.push(question);
    }
    if (questions.length === Number(localStorage.getItem('questionsNumber'))) {
      break;
    }
  }
} else {
  questions = JSON.parse(localStorage.getItem('questions'));
}

/*
  اگر تعداد سوالات صفر باشد، باید به کاربر پیغام مناسب نمایش داده شود
*/
if (questions.length === 0) {
  alert('No questions available.');
  window.location.replace('../index.html');
}

/*
  اگر در تعداد سوالات کاستی وجود دارد، کاربر باید از آن مطلع گردد
*/
if (questions.length < localStorage.getItem('questionsNumber') && questions.length > 0 && localStorage.getItem('situation') != 'result') {
  if (!confirm(`You want ${localStorage.getItem('questionsNumber')} questions, but only ${questions.length} are available. Do you want to continue?`)) {
    window.location.replace('../index.html');
  } else {
    localStorage.setItem('questionsNumber', questions.length);
  }
}


// سوالات آماده شده در صورت لزوم باید ذخیره گردد
if (!JSON.parse(localStorage.getItem('questions'))) {
  localStorage.setItem('questions', JSON.stringify(questions));
}

// وضعیت باید به "هدایت به کارنامه و نتیجه" تغییر یابد
localStorage.setItem('situation', 'result');

/*
  نمایش مقادیر تایمر به کاربر
*/
document.getElementById('hoursShow').innerText = localStorage.getItem('timer').substring(0, 2);
document.getElementById('minutesShow').innerText = localStorage.getItem('timer').substring(3, 5);
document.getElementById('secondsShow').innerText = localStorage.getItem('timer').substring(6, 8);

/*
  آپدیت کردن مقادیر تایمر
*/
const updateTimer = () => {
  if (localStorage.getItem('timer').substring(6, 8) > 0) {
    // کم کردن مقدار 1 از ثانیه‌شمار تایمر
    document.getElementById('secondsShow').innerText = String(Number(localStorage.getItem('timer').substring(6, 8)) - 1).padStart(2, '0');
    localStorage.setItem('timer', `${localStorage.getItem('timer').substring(0, 2).padStart(2, '0')}:${localStorage.getItem('timer').substring(3, 5).padStart(2, '0')}:${String(Number(localStorage.getItem('timer').substring(6, 8)) - 1).padStart(2, '0')}`);
  
  } else {
    // رساندن مقدار ثانیه‌شمار تایمر از 1 به 59
    document.getElementById('secondsShow').innerText = 59;
    localStorage.setItem('timer', `${localStorage.getItem('timer').substring(0, 2).padStart(2, '0')}:${localStorage.getItem('timer').substring(3, 5).padStart(2, '0')}:59`);

    if (localStorage.getItem('timer').substring(3, 5) > 0) {
      // کم کردن مقدار 1 از دقیقه‌شمار تایمر
      document.getElementById('minutesShow').innerText = String(Number(localStorage.getItem('timer').substring(3, 5)) - 1).padStart(2, '0');
      localStorage.setItem('timer', `${localStorage.getItem('timer').substring(0, 2).padStart(2, '0')}:${String(Number(localStorage.getItem('timer').substring(3, 5)) - 1).padStart(2, '0')}:${localStorage.getItem('timer').substring(6, 8).padStart(2, '0')}`);
    
    } else {
      // رساندن مقدار دقیقه‌شمار تایمر از 1 به 59
      document.getElementById('minutesShow').innerText = 59;
      localStorage.setItem('timer', `${localStorage.getItem('timer').substring(0, 2).padStart(2, '0')}:59:${localStorage.getItem('timer').substring(6, 8).padStart(2, '0')}`);

      if (localStorage.getItem('timer').substring(0, 2) > 0) {
        // کم کردن مقدار 1 از ساعت‌شمار تایمر
        document.getElementById('hoursShow').innerText = String(Number(localStorage.getItem('timer').substring(0, 2)) - 1).padStart(2, '0');
        localStorage.setItem('timer', `${String(Number(localStorage.getItem('timer').substring(0, 2)) - 1).padStart(2, '0')}:${localStorage.getItem('timer').substring(3, 5).padStart(2, '0')}:${localStorage.getItem('timer').substring(6, 8).padStart(2, '0')}`);
      
      } else {
        // اتمام آزمون (مقدار 00:00:00 برای تایمر)
        localStorage.setItem('timer', '00:00:00');
        document.getElementById('secondsShow').innerText = '00';
        document.getElementById('minutesShow').innerText = '00';
        window.location.replace('../loadpage/index.html');
      }
    }
  }
};

// آپدیت کردن تایمر پس از رفرش صفحه (تا تایمر با رفرش قفل نکند)
updateTimer();

// هر ثانیه یک‌بار باید تایمر آپدیت شود
const timer = setInterval(updateTimer, 1000);

// شمار سوال
let qNo = Number(localStorage.getItem('qNo')) || 1;

// صورت سوال
let question = questions[qNo - 1]['question'];

// پاسخ صحیح
let correctAnswer = questions[qNo - 1]['correct_answer'];

// اطلاعاتی که قرار است در صفحه پاسخنامه به کاربر نمایش داده شود
let data = JSON.parse(localStorage.getItem('data'));

/*
  گزینه‌های سوال
*/
let options;
if (localStorage.getItem('options') != 'null') {
  // گزینه‌ها قبلاً مرتب شده‌اند و با رفرش صفحه نباید ترتیب آنها به هم بخورد
  options = JSON.parse(localStorage.getItem('options'));
} else {
  // گزینه‌ها باید از لوکال استوریج خوانده شده و ترتیب تصادفی برای آنها درنظر گرفته شود
  options = questions[qNo - 1]['incorrect_answers'];
  options.push(correctAnswer);
  options.sort(() => Math.random() - 0.5);
  localStorage.setItem('options', JSON.stringify(options));
}

/*
  هاور برای دکمه سوال بعد
*/
const nextButtonMouseEnter = () => {
  event.currentTarget.style.filter = 'brightness(0.95)';
}
const nextButtonMouseLeave = () => {
  event.currentTarget.style.filter = 'brightness(1)';
}

/*
  فعال کردن دکمه سوال بعد
*/
const enableNextButton = (button) => {
  button.classList.add('enabled-button');
  button.addEventListener('mouseenter', nextButtonMouseEnter);
  button.addEventListener('mouseleave', nextButtonMouseLeave);
  button.addEventListener('click', nextButtonClicked);
  button.style.filter = 'opacity(1)';
};

/*
  غیرفعال کردن دکمه سوال بعد
*/
const disableNextButton = (button) => {
  button.classList.remove('enabled-button');
  button.removeEventListener('click', nextButtonClicked);
  button.removeEventListener('mouseenter', nextButtonMouseEnter);
  button.removeEventListener('mouseleave', nextButtonMouseLeave);
  button.style.filter = 'opacity(0.6)';
};

/*
  وقتی کاربر به روی دکمه سوال بعد کلیک می‌کند
*/
const nextButtonClicked = () => {
  // ابتدا باید فعال بودن دکمه بررسی شود
  if (document.querySelector('.container__button').classList.contains('enabled-button')) {
    if (qNo === questions.length) {
      // سوال آخر است و آزمون باید به پایان برسد
      window.location.replace('../loadpage/index.html');
    } else {
      // کاربر باید به سوال بعد برود
      qNo++;
      question = questions[qNo - 1]['question'];
      options = questions[qNo - 1]['incorrect_answers'];
      correctAnswer = questions[qNo - 1]['correct_answer'];
      options.push(correctAnswer);
      options.sort(() => Math.random() - 0.5);
      localStorage.setItem('options', JSON.stringify(options));
      localStorage.setItem('qNo', qNo);
      localStorage.setItem('selectedOption', 'null');
      disableNextButton(document.querySelector('.container__button'));
      updatePage();
    }
  }
};

/*
  هاور برای گزینه‌ها
*/
const optionMouseEnter = (event) => {
  event.currentTarget.style.backgroundColor = 'rgb(252, 252, 252)';
};
const optionMouseLeave = (event) => {
  event.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)';
};

/*
  کلیک شدن گزینه‌ی آی‌ام
*/
const optionClicked = (i) => {
  // بررسی فعال بودن گزینه
  if (document.getElementsByClassName('options')[i].parentElement.getAttribute('class') === 'enabled-options') {
    if (options[i] === correctAnswer) {
      document.getElementsByClassName('options')[i].parentElement.style.backgroundColor = 'rgba(100, 255, 100, 0.5)';
      document.getElementsByClassName('options')[i].parentElement.style.boxShadow = '0 0 6px rgba(0, 255, 0, 0.8)';
      for (let j = 0; j < 4; j++) {
        document.getElementsByClassName('options')[j].parentElement.setAttribute('class', 'disabled-options');
      }
      localStorage.setItem('score', Number(localStorage.getItem('score')) + Number(100 / questions.length));
      document.getElementById('scoreShow').innerText = `Score:  ${Math.round(localStorage.getItem('score')) || 0}%`;
      localStorage.setItem('correctAnswers', Number(localStorage.getItem('correctAnswers')) + 1);
    } else {
      document.getElementsByClassName('options')[i].parentElement.style.backgroundColor = 'rgba(255, 100, 100, 0.5)';
      document.getElementsByClassName('options')[i].parentElement.style.boxShadow = '0 0 6px rgba(255, 0, 0, 0.8)';
      for (let j = 0; j < 4; j++) {
        document.getElementsByClassName('options')[j].parentElement.setAttribute('class', 'disabled-options');
      }
    }
    for (let j = 0; j < 4; j++) {
      document.getElementsByClassName('options')[j].parentElement.removeEventListener('mouseenter', optionMouseEnter);
      document.getElementsByClassName('options')[j].parentElement.removeEventListener('mouseleave', optionMouseLeave);
    }
    enableNextButton(document.querySelector('.container__button'));
    localStorage.setItem('selectedOption', i);
    thisData = {
      'question': question,
      'userAnswer': options[localStorage.getItem('selectedOption')],
      'correctAnswer': correctAnswer
    };
    data[qNo - 1] = thisData;
    localStorage.setItem('data', JSON.stringify(data));
  }
}

// آپدیت شدن صفحه
const updatePage = () => {
  document.getElementById('qNoShow').innerText = `Question No.${qNo} of ${questions.length}`;
  document.getElementById('questionShow').innerHTML = `<span>${qNo}/${questions.length}. </span>&nbsp${question}`;
  for (let i = 0; i < NUMBER_OF_OPTIONS; i++) {
    document.getElementsByClassName('options')[i].innerText = options[i];
  }

  for (let j = 0; j < 4; j++) {
    document.getElementsByClassName('options')[j].parentElement.setAttribute('class', 'enabled-options');
    document.getElementsByClassName('options')[j].parentElement.style.backgroundColor = 'rgb(255, 255, 255)';
    document.getElementsByClassName('options')[j].parentElement.style.boxShadow = 'none';
    document.getElementsByClassName('options')[j].parentElement.addEventListener('mouseenter', optionMouseEnter);
    document.getElementsByClassName('options')[j].parentElement.addEventListener('mouseleave', optionMouseLeave);
  }
  document.getElementById('scoreShow').innerText = `Score:  ${Math.round(localStorage.getItem('score')) || 0}%`;
  if (qNo === questions.length) {
    document.querySelector('.container__button').children[1].innerText = 'Finish';
  }

  if (localStorage.getItem('selectedOption') != 'null') {
    optionClicked(Number(localStorage.getItem('selectedOption')));
    if (options[Number(localStorage.getItem('selectedOption'))] === correctAnswer) {
      localStorage.setItem('score', Number(localStorage.getItem('score')) - Number(100 / questions.length));
      document.getElementById('scoreShow').innerText = `Score:  ${Math.round(localStorage.getItem('score')) || 0}%`;
      localStorage.setItem('correctAnswers', Number(localStorage.getItem('correctAnswers')) - 1);
    }
  }
}

updatePage();

for (let i = 0; i < NUMBER_OF_OPTIONS; i++) {
  document.getElementsByClassName('options')[i].parentElement.addEventListener('click', (event) => {
    optionClicked(i);
  });
}
