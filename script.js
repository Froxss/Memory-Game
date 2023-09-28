document.addEventListener("DOMContentLoaded", function () {
  // Eşleştirilecek emoji listesi
  const emojiListesi = [
    "🙈",
    "🙉",
    "🙊",
    "🤡",
    "💩",
    "💋",
    "🙀",
    "🤖",
    "🙈",
    "🙉",
    "🙊",
    "🤡",
    "💩",
    "💋",
    "🙀",
    "🤖",
  ];

  // Karıştırma fonksiyonu
  function karistir(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
    }
  }

  // Yeniden başlatma düğmesi
  const restartButton = document.getElementById("shuffle");
  // Oyun tahtası
  const mainContainer = document.querySelector(".main-container");
  // Kartların listesi
  const divArray = Array.from(mainContainer.querySelectorAll(".memory-card"));

  // Emoji listesini karıştır ve oyunu başlat
  karistir(emojiListesi);
  start();

  // Yeniden başlatma düğmesine tıklanınca
  restartButton.addEventListener("click", function () {
    // Emoji listesini yeniden karıştır ve oyunu başlat
    karistir(emojiListesi);
    start();
  });

  // Oyunu başlatma işlevi
  function start() {
    divArray.forEach((div, index) => {
      // Kartların içeriğini emoji'lerle doldur
      div.querySelector(".front-face").textContent = emojiListesi[index];
      // Kartı tıklanabilir hale getir
      div.classList.remove("flip", "match");
      div.style.cursor = "pointer";
    });
    // Kartları ters çevir (arka yüz göster)
    setTimeout(() => {
      divArray.forEach((div) => {
        div.classList.add("flip");
      });
    }, 300);
  }

  let matchControl = false;

  // Kartların eşleşme kontrolü
  function match() {
    // Tüm kartları seç
    const divs = document.querySelectorAll(".memory-card");
    let divText1 = null;
    let divText2 = null;
    let firstClick = true;

    divs.forEach(function (div) {
      div.addEventListener("click", function () {
        // İlk tıklama veya eşleşen kartlar tıklanamaz hale geldiyse işlem yapma
        if (!firstClick || div.classList.contains("match")) return;

        // Kartı aç (flip animasyonu)
        div.classList.remove("flip");

        if (!divText1) {
          divText1 = div.querySelector(".front-face").textContent;
        } else {
          divText2 = div.querySelector(".front-face").textContent;
          firstClick = false;

          if (divText1 === divText2) {
            console.log("Eşleşme Başarılı");
            // Eşleşme durumunda kartları işaretle
            div.classList.add("match");

            // Kartı ölçeklendirme animasyonunu başlat
            div.style.transform = "scale(1.1)";
            setTimeout(() => {
              div.style.transform = "scale(1)";
            }, 500);

            divs.forEach((otherDiv) => {
              if (
                otherDiv.querySelector(".front-face").textContent === divText1
              ) {
                otherDiv.classList.add("match");

                // Diğer eşleşen kartları da ölçeklendirme animasyonu ile tamamla
                otherDiv.style.transform = "scale(1.1)";
                setTimeout(() => {
                  otherDiv.style.transform = "scale(1)";
                }, 500);
              }
            });
          } else {
            console.log("Eşleşme Başarısız");
            // Eşleşmeyen kartları kapat (arka yüzü göster)
            setTimeout(() => {
              divs.forEach((otherDiv) => {
                if (!otherDiv.classList.contains("match")) {
                  otherDiv.classList.add("flip");
                }
              });
            }, 500);
          }

          // İkinci kart tıklama sonrası işlemi sıfırla
          divText1 = null;
          divText2 = null;
          firstClick = true;
        }
      });
    });
  }

  // Oyunu başlat
  match();
});
