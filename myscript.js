/*#################################################################################*/
/*                      BUMCOLOR JS DOSYASI (MEHMET YAZICI)
/*#################################################################################*/

/*#################################################################################*/
/*                      GLOBAL DEĞİŞKEN TANIMLAMALARI
/*#################################################################################*/

var div1 = $("#section1");
var div2 = $( "#section2" );
var div3 = $( "#section3" );
div2.hide();
div3.hide();
var value;
var pick; // sorulan renk
var score = 0;
var color = ''; // seçilen karenin rengi
var again = false; // oyun tekrarı
var choice; // feedback string

/*##########################################################################################################*/
/*              İLK EKRAN ZORLUK SEÇİM BUTONLARI AKSİYONLARI (SENARYO)
      1. KISIM : SWITCH YAPISI -- KARE SAYISINI BELİRLER
      2. KISIM : SADECE SECTION2 GORUNUR OLUR VE OYUN EKRANINA GEÇİŞ OLUR
      3. KISIM : ZAMAN, SKOR BİLGİLERİ İLE BİRLİKTE OYUN TAHTASI FONKSİYONU ÇALIŞTIRILIR.
      4. KISIM : SETINTERVAL İLE SURENIN SONUNDA SECTION2 HIDE OLUR VE ANA EKRANA SKOR İLE DÖNÜŞ YAPILIR */
/*##########################################################################################################*/

$( "button" ).click( function() {
  
  // 1
  switch ( $( "button" ).index( this ) ) {
    case 0 :
      value = 9;
      break;
    case 1 :
      value = 16;
      break;
    case 2 :
      value = 25;
      break;
  }

  // 2
  div1.hide();
  div3.hide();
  div2.show();
  
  // 3
  var timeleft = 60;
  document.getElementById("timer").innerHTML = timeleft;
  printChoice("Let's start, pick the right color!")
  score=0;

  // Oyunun tekrar oynanması durumunu kontrol eder ve önceki appendleri sıfırlar.
  if(again == true){
    $(".drawing").empty();
    $("#color").empty();
  }  
  appendSquare();

  // 4
  var game_time = setInterval(function(){
    if(timeleft <= 0){
      clearInterval(game_time);
      div2.hide();
      div1.show();
      div3.show();
      $( "#score" ).html(score); 
    } else {
      document.getElementById("timer").innerHTML = timeleft;
    }
    timeleft -= 1;
    }, 1000);

  again=true;
});

/*##########################################################################################################*/
/*              OYUN TAHTASI EKLEME VE İSTENECEK RENGİ SEÇME FONKSİYONU
      1. KISIM : RANDOM RENK SEÇİMLERİ İLE TAHTA OLUŞTURUR VE AYRICA RENKLERİ DİZİYE EKLER
      2. KISIM : RENK DİZİSİNDEN 1 RENK RASTGELE SEÇER VE SAYFAYA EKLER
 */
/*##########################################################################################################*/

function appendSquare() {
  var unitSize; // birim karenin kenar uzunluğu
  if(value == 9) unitSize = 60;
  else if(value == 16) unitSize = 34;
  else if(value == 25) unitSize = 22;
  var unitsWide = value; // x ekseninde kare sayısı
  var unitsTall = value; // y ekseninde kare sayısı

  // karelerin ekleneceği div yapısının tanımlanması
  var drawing = $('<div class="drawing" id="drawing"></div>').css({
      overflow: 'hidden',
      width: unitSize * unitsWide
  });

  var colors = []; // tahtadaki renkleri tutar
  
  // 1
  for (var i = 0; i < unitsWide * unitsTall; i++) {
      var randomColor;
      randomColor = Math.random() * 0x1000000; // 0 < randomColor < 0x1000000
      randomColor = Math.floor(randomColor); // 0 < randomColor <= 0xFFFFFF
      randomColor = randomColor.toString(16); // hex representation randomColor
      //randomColor = ("000000" + randomColor).slice(-6); // leading zeros added
      randomColor = "#" + randomColor; // # added
      $('<span class="square" id="square"></span>').css({
          display: 'block',
          float: 'left',
          width: unitSize,
          height: unitSize,
          'background-color': randomColor
      }).appendTo(drawing);
      
      colors.push(randomColor);
  }

  drawing.appendTo($("#container"));

  // 2
  pick = colors[Math.floor(Math.random()*colors.length)]
  $('<span class="pick"></span>').css({
    display: 'inline-block',
    width: 60,
    height: 60,
    'background-color': pick
  }).appendTo($("#color"));

}

/*##########################################################################################################*/
/*               KARE ELEMENTLERİNE TIKLAMA AKSİYONLARI
      1. KISIM : IF -- DOĞRU SEÇİM SONUCUNDA MEVCUT TAHTAYI SIFIRLAR VE YENİSİNİ EKLER
      2. KISIM : ELSE -- YANLIŞ SEÇİM SONUCUNDA TIKLANAN KARE BEYAZ YAPILIR
 */
/*##########################################################################################################*/

$(document).on('click', '#square', function() {
  // tıklanan karenin rengini rgb(x,x,x) formunda saklar
  var x = $(this).css('backgroundColor'); 
  // rgb(x,x,x) formundaki renk değerini hex-string (#xxxx) formuna dönüştürür
  hexc(x);  
  if (color == pick) {
    score++;
    $(".drawing").empty();
    $("#color").empty();
    appendSquare();
    printChoice("That's true!");
    setTimeout(function(){ printChoice("Let's one more!"); }, 2000);
    
  } else{
    $(this).css("background", "white");
    printChoice("That's false!");
    setTimeout(function(){ printChoice("Let's try to this!"); }, 2000);
  }
})

function hexc(colorval) {
  var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  // parts gibidir ["rgb(91, 187, 62)", "91", "187", "62", index: 0, input: "rgb(91, 187, 62)", groups: undefined]
  delete(parts[0]);
  for (var i = 1; i <= 3; ++i) {
    parts[i] = parseInt(parts[i]).toString(16);
    if (parts[i].length == 1) parts[i] = '0' + parts[i];
  }
  color = '#' + parts.join('');
}

/*##########################################################################################################*/

/*##############################  SEÇİMLER HAKKINDA KULLANICIYA FEEDBACK VERME  ############################*/

function printChoice(text) {
  choice = text;
  $( "#choice" ).html(choice);
}

/*##########################################################################################################*/
