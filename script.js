document.addEventListener("DOMContentLoaded", function () {
  const gameDuration = 45;
  let gameStarted = false;
  let timerInterval;
  let remainingTime = gameDuration;
  let matchedPairs = 0;
  let isGameOver = false; // Yeni eklenen kontrol

  const emojiListesi = [
    "🍆",
    "🥝",
    "🥥",
    "🍓",
    "💩",
    "🍑",
    "🍒",
    "🍌",
    "🍆",
    "🥝",
    "🥥",
    "🍓",
    "💩",
    "🍑",
    "🍒",
    "🍌",
  ];

  function karistir(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
    }
  }

  const restartButton = document.getElementById("shuffle");
  const startButton = document.getElementById("start");
  const mainContainer = document.querySelector(".main-container");
  const divArray = Array.from(mainContainer.querySelectorAll(".memory-card"));
  const timerDisplay = document.querySelector(".timer");
  const messageDisplay = document.querySelector(".message");

  karistir(emojiListesi);
  start();

  restartButton.style.display = "none";

  restartButton.addEventListener("click", function () {
    if (isGameOver) {
      // Eğer oyun bitmişse sadece restartButton tıklanabilir
      isGameOver = false;
      restartButton.style.pointerEvents = "auto";
      restartButton.style.opacity = 1;
      messageDisplay.textContent = "";
    }
    karistir(emojiListesi);
    start();
  });

  startButton.addEventListener("click", function () {
    if (!gameStarted) {
      gameStarted = true;
      startButton.style.display = "none";
      restartButton.style.display = "block";
      startTimer();
    }
  });

  function start() {
    divArray.forEach((div, index) => {
      div.querySelector(".front-face").textContent = emojiListesi[index];
      div.classList.remove("flip", "match");
      div.style.cursor = "pointer";
    });

    setTimeout(() => {
      divArray.forEach((div) => {
        div.classList.add("flip");
      });
    }, 300);
  }

  function match() {
    const divs = document.querySelectorAll(".memory-card");
    let divText1 = null;
    let divText2 = null;
    let firstClick = true;

    divs.forEach(function (div) {
      div.addEventListener("click", function () {
        if (!gameStarted || div.classList.contains("match") || isGameOver)
          return;

        div.classList.remove("flip");

        if (!divText1) {
          divText1 = div.querySelector(".front-face").textContent;
        } else {
          divText2 = div.querySelector(".front-face").textContent;
          firstClick = false;

          if (divText1 === divText2) {
            div.classList.add("match");

            div.style.transform = "scale(1.1)";
            setTimeout(() => {
              div.style.transform = "scale(1)";
            }, 500);

            divs.forEach((otherDiv) => {
              if (
                otherDiv.querySelector(".front-face").textContent === divText1
              ) {
                otherDiv.classList.add("match");

                otherDiv.style.transform = "scale(1.1)";
                setTimeout(() => {
                  otherDiv.style.transform = "scale(1)";
                }, 500);
              }
            });

            matchedPairs++;

            if (matchedPairs === divArray.length / 2) {
              clearInterval(timerInterval);
              messageDisplay.textContent = "Tebrikler! Oyunu Tamamladınız.";
              isGameOver = true; // Oyun bittiğinde tıklanabilirliği devre dışı bırak
              restartButton.style.pointerEvents = "none";
              restartButton.style.opacity = 0.5;
            }
          } else {
            setTimeout(() => {
              divs.forEach((otherDiv) => {
                if (!otherDiv.classList.contains("match")) {
                  otherDiv.classList.add("flip");
                }
              });
            }, 500);
          }

          divText1 = null;
          divText2 = null;
          firstClick = true;
        }
      });
    });
  }

  function startTimer() {
    timerInterval = setInterval(function () {
      remainingTime--;

      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;

      timerDisplay.textContent = `Kalan Süre: ${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;

      if (remainingTime === 0) {
        clearInterval(timerInterval);
        messageDisplay.textContent = "Game Over! Süre Doldu.";
        isGameOver = true; // Oyun süresi bittiğinde tıklanabilirliği devre dışı bırak
        divs.forEach((div) => {
          div.style.pointerEvents = "none";
        });
      }
    }, 1000);
  }

  match();
});
