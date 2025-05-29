document.addEventListener('DOMContentLoaded', () => {
    // --- Плавное появление секций при скролле (Intersection Observer) ---
    const sections = document.querySelectorAll('.animated-section, .fade-in-up, .delay-1, .delay-2, .delay-3');
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // 15% элемента должно быть видно для срабатывания
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Остановить наблюдение после появления
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Летающие сердечки на фоне ---
    const heartContainer = document.querySelector('.heart-container');

    function createHeart() {
        const heart = document.createElement('span');
        heart.classList.add('heart');
        heart.innerHTML = '❤️'; // Можешь использовать другие символы: '💖', '✨', '🌸'
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 5 + 5 + 's'; // От 5 до 10 секунд
        heart.style.opacity = Math.random() * 0.5 + 0.3; // Разная прозрачность
        heart.style.transform = `scale(${Math.random() * 0.8 + 0.4})`; // Разный размер

        heartContainer.appendChild(heart);

        // Удаляем сердечко после завершения анимации, чтобы не перегружать DOM
        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }

    // Генерируем сердечки каждые 300мс
    setInterval(createHeart, 300);


    // --- Загадки дня ---
    const riddles = [
        {
            riddle: "Что всегда приходит, но никогда не приходит?",
            answer: "Завтра"
        },
        {
            riddle: "Что можно держать, но нельзя увидеть?",
            answer: "Обещание"
        },
        {
            riddle: "Я говорю без рта и слышу без ушей. У меня нет тела, но я оживаю с ветром. Что я?",
            answer: "Эхо"
        },
        {
            riddle: "Чем больше из неё берешь, тем больше она становится. Что это?",
            answer: "Яма"
        },
        {
            riddle: "Что это: постоянно увеличивается и никогда не уменьшается?",
            answer: "Возраст"
        },
        {
            riddle: "Я всегда голоден, меня всегда надо кормить, но если меня напоить, я умру. Что я?",
            answer: "Огонь"
        }
    ];

    let currentRiddleIndex = 0;
    const riddleText = document.getElementById('riddle-text');
    const riddleAnswer = document.getElementById('riddle-answer');
    const showAnswerBtn = document.getElementById('show-answer-btn');
    const nextRiddleBtn = document.getElementById('next-riddle-btn');

    function displayRiddle() {
        riddleText.textContent = riddles[currentRiddleIndex].riddle;
        riddleAnswer.textContent = riddles[currentRiddleIndex].answer;
        riddleAnswer.classList.add('hidden'); // Скрываем ответ
        showAnswerBtn.textContent = 'Показать ответ'; // Обновляем текст кнопки
    }

    showAnswerBtn.addEventListener('click', () => {
        if (riddleAnswer.classList.contains('hidden')) {
            riddleAnswer.classList.remove('hidden');
            showAnswerBtn.textContent = 'Скрыть ответ';
        } else {
            riddleAnswer.classList.add('hidden');
            showAnswerBtn.textContent = 'Показать ответ';
        }
    });

    nextRiddleBtn.addEventListener('click', () => {
        currentRiddleIndex = (currentRiddleIndex + 1) % riddles.length; // Переход к следующей, по кругу
        displayRiddle();
    });

    displayRiddle(); // Показываем первую загадку при загрузке


    // --- Мини-игра: Поймай Сердечко! ---
    const startGameBtn = document.getElementById('start-game-btn');
    const scoreDisplay = document.getElementById('score');
    const heartSpawnArea = document.getElementById('heart-spawn-area');

    let score = 0;
    let gameInterval; // Таймер для окончания игры
    let spawnInterval; // Таймер для появления сердечек
    let gameActive = false; // Флаг, активна ли игра

    function spawnHeart() {
        if (!gameActive) return; // Если игра не активна, не создаем сердечки

        const heart = document.createElement('span');
        heart.classList.add('game-heart');
        heart.innerHTML = '❤️';
        // Позиционируем сердечко случайно в пределах области
        heart.style.left = Math.random() * (heartSpawnArea.offsetWidth - 50) + 'px';
        heart.style.top = Math.random() * (heartSpawnArea.offsetHeight - 50) + 'px';

        heart.addEventListener('click', () => {
            if (gameActive) { // Убеждаемся, что игра активна при клике
                score++;
                scoreDisplay.textContent = score;
                heart.remove(); // Удаляем пойманное сердце
            }
        });

        heartSpawnArea.appendChild(heart);

        // Автоматическое удаление сердца через короткое время, если его не поймали
        setTimeout(() => {
            if (heart.parentNode === heartSpawnArea) { // Проверяем, не было ли оно уже удалено
                heart.remove();
            }
        }, 1200); // Сердце исчезает через 1.2 секунды
    }

    function startGame() {
        if (gameActive) return; // Не начинать игру, если она уже активна

        score = 0;
        scoreDisplay.textContent = score;
        heartSpawnArea.innerHTML = ''; // Очищаем поле от старых сердечек
        gameActive = true; // Устанавливаем флаг активности игры
        startGameBtn.textContent = 'Игра идет!';
        startGameBtn.disabled = true; // Отключаем кнопку старта, пока игра идет

        spawnInterval = setInterval(spawnHeart, 500); // Появление нового сердца каждые 0.5 секунды
        gameInterval = setTimeout(endGame, 20000); // Игра длится 20 секунд (20000 миллисекунд)
    }

    function endGame() {
        gameActive = false; // Снимаем флаг активности
        clearInterval(spawnInterval); // Останавливаем появление сердечек
        clearTimeout(gameInterval); // Останавливаем таймер игры
        startGameBtn.textContent = 'Начать игру снова'; // Возвращаем текст на кнопке
        startGameBtn.disabled = false; // Включаем кнопку
        alert(`Игра окончена! Твой счёт: ${score} сердечек! Ты умничка, Виолетта!`); // Добавляем имя Виолетта в конце
    }

    startGameBtn.addEventListener('click', startGame);
});
