const pageNames = {
  quran: "Kur'an-ı Kerim",
  dua: "Dualar",
  hadith: "Hadisler",
  names: "Esmaül Hüsna",
  tasbeeh: "Dijital Tesbih",
  qibla: "Kıble Bulucu"
};

const fallbackLocation = { latitude: 43.6532, longitude: -79.3832, label: "Toronto, Kanada" };
let quranSurahs = [];
let activeSurahRequest = 0;
const surahNamesTr = `Fatiha|Bakara|Âl-i İmrân|Nisâ|Mâide|En'âm|A'râf|Enfâl|Tevbe|Yûnus|Hûd|Yûsuf|Ra'd|İbrâhîm|Hicr|Nahl|İsrâ|Kehf|Meryem|Tâhâ|Enbiyâ|Hac|Mü'minûn|Nûr|Furkân|Şuarâ|Neml|Kasas|Ankebût|Rûm|Lokmân|Secde|Ahzâb|Sebe|Fâtır|Yâsîn|Sâffât|Sâd|Zümer|Mü'min|Fussilet|Şûrâ|Zuhruf|Duhân|Câsiye|Ahkâf|Muhammed|Fetih|Hucurât|Kâf|Zâriyât|Tûr|Necm|Kamer|Rahmân|Vâkıa|Hadîd|Mücâdele|Haşr|Mümtehine|Saff|Cuma|Münâfikûn|Tegâbün|Talâk|Tahrîm|Mülk|Kalem|Hâkka|Meâric|Nûh|Cin|Müzzemmil|Müddessir|Kıyâmet|İnsan|Mürselât|Nebe|Nâziât|Abese|Tekvîr|İnfitâr|Mutaffifîn|İnşikâk|Burûc|Târık|A'lâ|Gâşiye|Fecr|Beled|Şems|Leyl|Duhâ|İnşirâh|Tîn|Alak|Kadr|Beyyine|Zilzâl|Âdiyât|Kâria|Tekâsür|Asr|Hümeze|Fîl|Kureyş|Mâûn|Kevser|Kâfirûn|Nasr|Tebbet|İhlâs|Felak|Nâs`.split("|");
const quranReciters = [
  { edition: "ar.alafasy", name: "Mishary Rashid Alafasy" },
  { edition: "ar.abdulbasit", name: "Abdul Basit Abdus Samad" },
  { edition: "ar.husary", name: "Mahmoud Khalil Al-Husary" }
];
const quranCache = new Map();
let beautifulNames = [];
const namesCache = new Map();
let qiblaSensorCleanup = null;
let currentTimeFormat = "24";
let prayerSchedule = null;
let galleryIndex = 0;
let activeLocation = null;
let weatherRequestId = 0;
let selectedPlanDate = localDateKey(new Date());
let calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let plannedTasks = [];
let appLanguage = "tr";
const englishUi = [
  [".entry-kicker", "JERUSALEM • AL-AQSA MOSQUE"],
  ["#sanctuary-title", "Step through<br><em>the gate of peace.</em>"],
  [".entry-copy > p", "Begin a journey surrounded by spirituality."],
  [".entry-button", "Enter the sanctuary <span>↗</span>"],
  [".door-home strong", "The peace gate"], [".door-home small", "Calendar · Clock · Weather"],
  [".door-gallery strong", "A window to the world"], [".door-gallery small", "Architectural places"],
  [".door-prayers strong", "Prayer gate"], [".door-prayers small", "Prayer times"],
  [".door-devotion strong", "Worship gate"], [".door-devotion small", "Your spiritual journey"],
  [".main-nav a:nth-child(1)", "Home"], [".main-nav a:nth-child(2)", "Prayer Times"], [".main-nav a:nth-child(3)", "Explore"],
  [".header-button", "Today's Prayer Times <span>↗</span>"], [".eyebrow", "PEACE • REMEMBRANCE • SPIRITUALITY"],
  [".hero h1", "Peace for your heart,<br><em>blessings for your day.</em>"], [".hero-intro > p", "A digital space accompanying you on your journey of worship."],
  [".hero-actions .primary-button", "Prayer Times <span>→</span>"], [".hero-actions .text-button", "Explore <span>↓</span>"],
  ["#toggle-location-picker", "Choose another location"], ["#location-picker label[for=country-select]", "Country"],
  ["#location-picker label[for=city-search]", "City or district"], ["#city-search", "Tokyo, for example"],
  ["#search-location", "Search"], ["#location-help", "Choose a country, enter a city, then search."],
  [".location-attribution", "City search: Open-Meteo"], [".hero-verse p", "Surely in the remembrance of Allah do hearts find comfort."],
  [".hero-verse .quote-reference", "AR-RA'D • VERSE 28"],
  [".calendar-card .dashboard-eyebrow", "CALENDAR"], [".calendar-card h3", "Calendar"],
  [".planner-card .dashboard-eyebrow", "DAILY PLANNER"], [".planner-card h3", "Plan your day"],
  [".planner-form label[for=plan-time]", "Time"], [".planner-form label[for=plan-title]", "Your plan"],
  ["#time-format-label", "Time"],
  ["#plan-title", "Read a book, for example"], [".planner-entry-row button", "Add"],
  [".planner-note", "Your plans are saved on this device."], [".weather-card .dashboard-eyebrow", "YOUR LOCATION"],
  [".weather-card h3", "Weather"], ["#weather-location", "No location selected"],
  ["#weather-description", "Choose a location to see the weather."], ["#weather-location-action", "Choose / refresh location"],
  [".weather-attribution", "Weather data: Open-Meteo"],
  [".world-gallery-copy .section-kicker", "INSPIRATION AROUND THE WORLD"],
  ["#prayers .section-kicker", "DAILY WORSHIP"], ["#prayers h2", "Prayer times"],
  ["#prayers .section-heading p", "Remember your Lord throughout the day."], ["#prayers .small-label", "YOUR DAILY PLAN"],
  ["#prayers .prayer-intro h3", "Peace, in its proper time."], ["#prayers .prayer-intro p", "View prayer times for your location."],
  ["#prayer-status", "Location access is requested only when you tap the location button."],
  ["#features .section-kicker", "EXPLORE YOUR SPIRITUALITY"], ["#features h2", "Your journey of worship"],
  ["#features .section-heading p", "Make a little time each day for yourself and your spirituality."],
  [".feature-card:nth-child(1) .feature-number", "01 / QUR'AN"], [".feature-card:nth-child(1) strong", "The Holy Qur'an"], [".feature-card:nth-child(1) .feature-description", "Read verses and explore their translations."],
  [".feature-card:nth-child(2) .feature-number", "02 / SUPPLICATION"], [".feature-card:nth-child(2) strong", "Supplications"], [".feature-card:nth-child(2) .feature-description", "Daily supplications and their meanings."],
  [".feature-card:nth-child(3) .feature-number", "03 / HADITH"], [".feature-card:nth-child(3) strong", "Hadith"], [".feature-card:nth-child(3) .feature-description", "Teachings of our Prophet."],
  [".feature-card:nth-child(4) .feature-number", "04 / ASMA UL HUSNA"], [".feature-card:nth-child(4) strong", "99 Names of Allah"], [".feature-card:nth-child(4) .feature-description", "The names and their beautiful meanings."],
  [".feature-card:nth-child(5) .feature-number", "05 / DHIKR"], [".feature-card:nth-child(5) strong", "Digital Tasbih"], [".feature-card:nth-child(5) .feature-description", "Remember, count, and continue."],
  [".feature-card:nth-child(6) .feature-number", "06 / QIBLA"], [".feature-card:nth-child(6) strong", "Qibla Finder"], [".feature-card:nth-child(6) .feature-description", "Find the direction of the Qibla."],
  [".back-button", "← Back to home"], [".footer-logo", "☾ IMAN"],
  [".site-footer > p", "Remember every day, grow more beautiful every day."],
  [".site-footer > span", "© 2026 IMAN — Islamic Living"],
  [".founder-signature", "Born from an idea, growing in peace · Founder of IMAN"]
];
const originalUi = new Map();

function setAppLanguage(language) {
  appLanguage = language === "en" ? "en" : "tr";
  document.documentElement.lang = appLanguage;
  const locale = appLanguage === "en" ? "en-CA" : "tr-TR";
  for (const [selector, english] of englishUi) {
    const element = document.querySelector(selector);
    if (!element || !english) continue;
    if (!originalUi.has(selector)) originalUi.set(selector, element.innerHTML);
    if (appLanguage === "en") {
      if (element instanceof HTMLInputElement) element.placeholder = english;
      else element.innerHTML = english;
    } else if (element instanceof HTMLInputElement) {
      element.placeholder = selector === "#city-search" ? "Örn. Tokyo" : "Örn. Kitap okumak";
    } else {
      element.innerHTML = originalUi.get(selector);
    }
  }
  document.querySelectorAll(".calendar-weekdays").forEach(node => {
    node.innerHTML = appLanguage === "en"
      ? "<span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>"
      : "<span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Paz</span>";
  });
  const timeOptions = document.querySelectorAll("#time-format option");
  if (timeOptions.length === 2) {
    timeOptions[0].textContent = appLanguage === "en" ? "24 h" : "24 sa";
    timeOptions[1].textContent = appLanguage === "en" ? "12 h" : "12 sa";
  }
  const todayDate = document.getElementById("today-date");
  if (todayDate) todayDate.textContent = new Date().toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const monthLabel = document.getElementById("calendar-month");
  if (monthLabel) monthLabel.textContent = calendarMonth.toLocaleDateString(locale, { month: "long", year: "numeric" });
  document.getElementById("language-tr")?.setAttribute("aria-pressed", String(appLanguage === "tr"));
  document.getElementById("language-en")?.setAttribute("aria-pressed", String(appLanguage === "en"));
  document.querySelectorAll(".entry-language [data-language]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.language === appLanguage));
  });
  try { localStorage.setItem("iman-language", appLanguage); } catch (error) { console.warn("Dil tercihi saklanamadı:", error); }
}

let doorIsOpening = false;
const sanctuaryRooms = ["sanctuary-hall", "hero", "gallery", "prayers", "features", "content"];
const sanctuaryRoomTitles = {
  hall: ["İç Avlu", "Sanctuary Hall"], hero: ["Huzur ve günlük yaşam", "Peace and daily life"],
  gallery: ["Dünyadan mimari duraklar", "Architectural places around the world"],
  prayers: ["Namaz vakitleri", "Prayer times"], features: ["İbadet yolculuğu", "Your journey of worship"],
  quran: ["Kur'an-ı Kerim", "The Holy Qur'an"], dua: ["Dualar", "Supplications"],
  hadith: ["Hadisler", "Hadith"], names: ["Allah'ın 99 ismi", "The 99 Names of Allah"],
  tasbeeh: ["Dijital tesbih", "Digital Tasbih"], qibla: ["Kıble bulucu", "Qibla Finder"]
};

function enterSanctuary() {
  openSanctuaryDoor("hall");
}

function openSanctuaryDoor(roomId) {
  if (doorIsOpening || !sanctuaryRoomTitles[roomId]) return;
  doorIsOpening = true;
  const entry = document.getElementById("sanctuary-entry");
  if (entry) entry.hidden = true;
  document.querySelector(".site-header")?.removeAttribute("inert");
  document.getElementById("home")?.removeAttribute("inert");
  document.querySelector(".site-footer")?.removeAttribute("inert");

  const transition = document.getElementById("door-transition");
  const title = document.getElementById("door-transition-title");
  if (!transition) { revealSanctuaryRoom(roomId); doorIsOpening = false; return; }
  transition.dataset.room = roomId;
  if (title) title.textContent = sanctuaryRoomTitles[roomId][appLanguage === "en" ? 1 : 0];
  transition.hidden = false;
  transition.classList.remove("is-opening", "is-leaving");
  void transition.offsetWidth;
  transition.classList.add("is-opening");

  window.setTimeout(() => {
    revealSanctuaryRoom(roomId);
    transition.classList.add("is-leaving");
    window.setTimeout(() => {
      transition.hidden = true;
      transition.classList.remove("is-opening", "is-leaving");
      doorIsOpening = false;
    }, 620);
  }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 20 : 1500);
}

function revealSanctuaryRoom(roomId) {
  const footer = document.querySelector(".site-footer");
  if (footer) footer.hidden = roomId !== "sanctuary-hall";
  sanctuaryRooms.forEach(id => {
    const room = document.getElementById(id);
    if (room) room.hidden = true;
  });
  if (pageNames[roomId]) {
    showPage(roomId);
  } else {
    const selected = document.getElementById(roomId);
    if (!selected) return;
    selected.hidden = false;
    if (roomId === "hero") {
      const dashboard = document.getElementById("home-dashboard");
      if (dashboard) dashboard.hidden = false;
    }
    selected.classList.remove("room-arrival");
    void selected.offsetWidth;
    selected.classList.add("room-arrival");
    selected.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => selected.classList.remove("room-arrival"), 900);
    if (roomId === "sanctuary-hall") window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
const countryCodes = "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(" ");
const commonsPhoto = file => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1280`;
const commonsPage = file => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file).replaceAll('%20', '_')}`;
const travelSlides = [
  { title: "Sultan Ahmet Camii", location: "İstanbul, Türkiye", alt: "İstanbul'daki Sultan Ahmet Camii", author: "El Mehdi Imehda", license: "CC BY-SA 4.0", file: "Sultan_Ahmet_Mosque_in_Istanbul.jpg" },
  { title: "Tac Mahal", location: "Agra, Hindistan", alt: "Agra'daki Tac Mahal ve bahçeleri", author: "Asit Jain", license: "CC BY-SA 3.0", file: "Taj_Mahal_N-UP-A28-a.jpg" },
  { title: "Şeyh Zayed Büyük Camii", location: "Abu Dabi, Birleşik Arap Emirlikleri", alt: "Abu Dabi'deki Şeyh Zayed Büyük Camii", author: "Sifaat", license: "CC BY-SA 4.0", file: "The_Grand_Mosque-Abu_Dhabi.jpg" },
  { title: "Süleymaniye Camii", location: "İstanbul, Türkiye", alt: "İstanbul'da Süleymaniye Camii", author: "A.Savin / Wikipedia", license: "Free Art License", file: "Istanbul_asv2020-02_img49_Süleymaniye_Mosque.jpg" },
  { title: "Nasır el-Mülk Camii", location: "Şiraz, İran", alt: "Şiraz'daki Nasır el-Mülk Camii", author: "Mahdi Delparish", license: "CC BY-SA 4.0", file: "Nasir_al_mulk_Mosque.jpg" },
  { title: "Badşahi Camii", location: "Lahor, Pakistan", alt: "Lahor'daki Badşahi Camii", author: "Rutaba Niazi", license: "CC BY-SA 4.0", file: "Badshahi_masjid_Lahore.jpg" },
  { title: "Faysal Camii", location: "İslamabad, Pakistan", alt: "İslamabad'daki Faysal Camii", author: "Shami Hassan", license: "CC BY-SA 4.0", file: "Islamabad,Faisal_mosque.jpg" },
  { title: "Sultan Kabus Ulu Camii", location: "Maskat, Umman", alt: "Maskat'taki Sultan Kabus Ulu Camii", author: "Mostafa Meraji", license: "CC BY-SA 4.0", file: "Sultan_Qaboos_Grand_Mosque_(1).jpg" },
  { title: "Putra Camii", location: "Putrajaya, Malezya", alt: "Putrajaya'daki Putra Camii", author: "ToofanwikiCommon", license: "CC BY-SA 4.0", file: "Putra_Mosque_Putrajaya.jpg" },
  { title: "Kairouan Ulu Camii", location: "Kayrevan, Tunus", alt: "Tunus'taki Kairouan Ulu Camii", author: "Cimoi", license: "CC BY-SA 3.0", file: "Grande_mosquée_de_Kairouan.jpg" },
  { title: "Xi'an Ulu Camii", location: "Xi'an, Çin", alt: "Çin'in Xi'an kentindeki Ulu Cami", author: "Doron", license: "CC BY-SA 3.0", file: "Xi'anGreatMosque.jpg" },
  { title: "Kilwa Ulu Camii kalıntıları", location: "Kilwa Kisiwani, Tanzanya", alt: "Tanzanya'daki Kilwa Ulu Camii kalıntıları", author: "Claude McNab", license: "Kamu malı", file: "GreatMosque.jpg" },
  { title: "Cezayir'den bir cami", location: "Cezayir", alt: "Cezayir'de geleneksel cami mimarisi", author: "Karim.Mouffoki", license: "CC BY-SA 4.0", file: "Mosque_architecture.jpg" },
  { title: "Eski Sale Camii", location: "Sale, Fas", alt: "Fas'ın Sale kentindeki eski caminin kapısı", author: "Saralamphotographymorocco", license: "CC BY-SA 4.0", file: "Architecture_Doorway.jpg" },
  { title: "El-Aksa Camii", location: "Kudüs", alt: "Kudüs'teki El-Aksa Camii ve kutsal alanı", author: "Diego Delso, delso.photo", license: "CC BY-SA 3.0", file: "Al-Aqsa Mosque, Jerusalem1.jpg" },
  { title: "Mescid-i Haram", location: "Mekke, Suudi Arabistan", alt: "Mekke'de Kâbe ve Mescid-i Haram", author: "Saudipics.com / AishaAbdel", license: "CC BY-SA 4.0", file: "Edited_Great_Mosque_of_Mecca1_5-2019-ccsa4.0.jpg" },
  { title: "Mavi Cami", location: "İstanbul, Türkiye", alt: "İstanbul'da Mavi Cami'nin dış görünümü", author: "Enrico Segalla", license: "CC BY-SA 4.0", file: "Istanbul_-_The_Blue_Mosque.jpg" },
  { title: "Süleymaniye Camii ve İstanbul", location: "İstanbul, Türkiye", alt: "İstanbul silüetinde Süleymaniye Camii", author: "Hunanuk", license: "CC0", file: "SüleymaniyeMosqueIstanbul.jpg" },
  { title: "Faysal Camii manzarası", location: "İslamabad, Pakistan", alt: "İslamabad'daki Faysal Camii'nin görünümü", author: "GhulamAli Chishti", license: "CC BY-SA 4.0", file: "Faisal_Mosque_isb.jpg" },
  { title: "Hassan II Camii", location: "Kazablanka, Fas", alt: "Kazablanka'daki Hassan II Camii", author: "OussamaHamama", license: "CC BY-SA 4.0", file: "Framing_Heritage_-_Hassan_II_Mosque.jpg" }
].map(slide => ({ ...slide, image: commonsPhoto(slide.file), source: commonsPage(slide.file) }));
const nameMeaningsTr = `Rahmân | Rahîm | Hükümranlığın sahibi | Her türlü eksiklikten uzak | Esenlik ve güven veren | Güven veren | Gözetip koruyan | Mutlak güç sahibi | Dilediğini yaptıran | Büyüklükte eşi olmayan | Yaratan | Örneksiz var eden | Şekil veren | Çok bağışlayan | Her şeye galip gelen | Karşılıksız veren | Rızık veren | Hayır kapılarını açan | Her şeyi bilen | Daraltan | Genişleten | Alçaltan | Yükselten | Şeref ve itibar veren | Dilediğini alçaltan | Her şeyi işiten | Her şeyi gören | Hüküm veren | Mutlak adalet sahibi | Lütfu ince ve bol olan | Her şeyden haberdar | Yumuşak davranan | Yücelik sahibi | Çok bağışlayan | Az iyiliğe çok karşılık veren | Çok yüce | Büyüklük sahibi | Koruyup gözeten | Her canlının rızkını veren | Hesap gören | Ululuk sahibi | Cömert | Gözetleyip denetleyen | Dualara karşılık veren | Rahmeti ve ilmi geniş olan | Hikmet sahibi | Çok seven | Şanı yüce | Öldükten sonra dirilten | Her şeye şahit olan | Varlığı ve ilah oluşu gerçek olan | Kendisine güvenilip dayanılan | Gücü her şeye yeten | Kuvveti güçlü ve sürekli olan | Dost ve yardımcı | Övgüye layık | Her şeyi sayıp bilen | İlk defa yaratan | Yeniden yaratan | Hayat veren | Ölümü yaratan | Diri ve hayatı sonsuz olan | Her şeyi ayakta tutan | Hiçbir şeye muhtaç olmayan | Şanı yüce | Bir olan | Tek ve eşsiz olan | Her şeyin kendisine muhtaç olduğu | Gücü her şeye yeten | Dilediğini yapmaya gücü yeten | Öne alan | Geri bırakan | Başlangıcı olmayan | Sonu olmayan | Varlığı açık olan | Mahiyeti kavranamayan | Kâinatı yöneten | Her şeyden yüce | İyiliği ve ihsanı bol | Tövbeleri kabul eden | Suçları karşılıksız bırakmayan | Affı çok olan | Çok şefkatli | Mülkün gerçek sahibi | Celal ve ikram sahibi | Adaletle hükmeden | Bir araya getiren | Hiçbir şeye muhtaç olmayan | Dilediğini zengin eden | Dilediğini engelleyen | Zarar ve faydayı yaratan | Fayda veren | Nurlandıran | Doğru yola ileten | Örneksiz yaratan | Varlığı sürekli olan | Her şeyin sonunda döneceği zat | Doğru yolu gösteren | Çok sabırlı`.split(" | ");

const dailyDuas = [
  { ref: "Bakara 2:201", verses: [[2, 201]] },
  { ref: "Âl-i İmrân 3:8", verses: [[3, 8]] },
  { ref: "Tâhâ 20:25–28", verses: [[20, 25], [20, 26], [20, 27], [20, 28]] },
  { ref: "Enbiyâ 21:87", verses: [[21, 87]] },
  { ref: "İbrâhîm 14:40–41", verses: [[14, 40], [14, 41]] },
  { ref: "Bakara 2:286", verses: [[2, 286]] }
];

const hadithCollection = [
  { text: "Ameller niyetlere göredir. Herkese ancak niyet ettiğinin karşılığı vardır.", source: "Sahih al-Buhârî, 1; Sahih Müslim, 1907", url: "https://sunnah.com/bukhari:1" },
  { text: "Sizden biri, kendisi için istediğini kardeşi için de istemedikçe iman etmiş olmaz.", source: "Sahih al-Buhârî, 13; Sahih Müslim, 45", url: "https://sunnah.com/bukhari:13" },
  { text: "Kolaylaştırın, zorlaştırmayın; müjdeleyin, nefret ettirmeyin.", source: "Sahih al-Buhârî, 69; Sahih Müslim, 1734", url: "https://sunnah.com/bukhari:69" },
  { text: "Müslüman, diğer Müslümanların elinden ve dilinden emin olduğu kimsedir.", source: "Sahih al-Buhârî, 10; Sahih Müslim, 40", url: "https://sunnah.com/bukhari:10" },
  { text: "Güzel söz sadakadır.", source: "Sahih al-Buhârî, 2989; Sahih Müslim, 1009", url: "https://sunnah.com/bukhari:2989" },
  { text: "Allah’a ve ahiret gününe inanan ya hayır söylesin ya da sussun.", source: "Sahih al-Buhârî, 6018; Sahih Müslim, 47", url: "https://sunnah.com/bukhari:6018" }
];

function showPage(page) {
  const title = pageNames[page];
  const homeSections = document.querySelectorAll(".sanctuary-hall, .hero, #home-dashboard, .world-gallery, #prayers, #features, .quote-section");
  const content = document.getElementById("content");
  const pageContent = document.getElementById("page-content");
  if (!title || !content || !pageContent) return;
  qiblaSensorCleanup?.();
  qiblaSensorCleanup = null;
  stopQuranAudio();

  homeSections.forEach(section => { section.hidden = true; });
  content.classList.remove("hidden");
  content.hidden = false;
  content.dataset.theme = page;
  if (page === "quran") {
    renderQuranReader(pageContent);
  } else if (page === "dua") {
    renderDuaPage(pageContent);
  } else if (page === "hadith") {
    renderHadithPage(pageContent);
  } else if (page === "names") {
    renderNamesPage(pageContent);
  } else if (page === "tasbeeh") {
    renderTasbeehPage(pageContent);
  } else if (page === "qibla") {
    renderQiblaPage(pageContent);
  } else {
    pageContent.innerHTML = `
      <span class="section-kicker">İMAN • KEŞFET</span>
      <h2>${title}</h2>
      <p>Bu bölümün içeriğini bir sonraki geliştirme aşamasında ekleyeceğiz.</p>
    `;
  }
  content.classList.remove("room-arrival");
  void content.offsetWidth;
  content.classList.add("room-arrival");
  content.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderDuaPage(container) {
  container.innerHTML = `
    <span class="section-kicker">İMAN • GÜNLÜK DUALAR</span><h2>Dualar</h2>
    <p class="quran-intro">Kur'an'dan seçilmiş dualar ve Türkçe anlamları. Mealler Diyanet İşleri Başkanlığı edisyonundan yüklenir.</p>
    <div id="dua-list" class="devotion-list"><p class="quran-status">Ayetler yükleniyor…</p></div>
  `;
  loadDuas();
}

async function loadDuas() {
  const list = document.getElementById("dua-list");
  if (!list) return;
  list.replaceChildren();
  for (const dua of dailyDuas) {
    const card = document.createElement("article");
    card.className = "devotion-card";
    const reference = document.createElement("span");
    reference.className = "section-kicker";
    reference.textContent = dua.ref;
    const text = document.createElement("p");
    text.className = "quran-arabic";
    text.lang = "ar";
    text.dir = "rtl";
    text.textContent = "Ayet yükleniyor…";
    const meaning = document.createElement("p");
    meaning.className = "quran-translation";
    meaning.textContent = "Türkçe meal yükleniyor…";
    card.append(reference, text, meaning);
    list.append(card);
    try {
      const ayahGroups = await Promise.all(dua.verses.map(([surah, ayah]) =>
        fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/quran-uthmani,tr.diyanet`)
          .then(response => { if (!response.ok) throw new Error(`API yanıtı: ${response.status}`); return response.json(); })
      ));
      const arabicText = [];
      const turkishText = [];
      ayahGroups.forEach(result => {
        if (result.code !== 200 || !Array.isArray(result.data)) throw new Error("Ayet verisi okunamadı.");
        arabicText.push(...result.data[0].text ? [result.data[0].text] : []);
        turkishText.push(...result.data[1].text ? [result.data[1].text] : []);
      });
      text.textContent = arabicText.join(" ");
      meaning.textContent = turkishText.join(" ");
    } catch (error) {
      console.error("Dua ayeti yüklenemedi:", error);
      text.textContent = "Ayet metni şu anda yüklenemedi.";
      meaning.textContent = "İnternet bağlantını kontrol edip sayfayı yeniden aç.";
    }
  }
}

function renderHadithPage(container) {
  container.innerHTML = `
    <span class="section-kicker">İMAN • HADİSLER</span><h2>Hadisler</h2>
    <p class="quran-intro">Günlük hayata ışık tutan seçilmiş hadisler.</p>
    <p class="quran-status">Aşağıdaki Türkçe metinler anlam aktarımıdır; kaynak künyeleri her hadisin altında yer alır.</p>
    <div class="devotion-list">${hadithCollection.map((hadith, index) => `
      <article class="devotion-card"><span class="section-kicker">HADİS ${String(index + 1).padStart(2, "0")}</span>
      <p class="hadith-text">“${hadith.text}”</p>
      <a class="hadith-source" href="${hadith.url}" target="_blank" rel="noopener noreferrer">${hadith.source} ↗</a></article>
    `).join("")}</div>
  `;
}

async function renderNamesPage(container) {
  container.innerHTML = `
    <span class="section-kicker">İMAN • ESMÂÜ'L HÜSNÂ</span><h2>Allah'ın güzel isimleri</h2>
    <p class="quran-intro">Arapça yazılışları, okunuşları ve Türkçe anlamları. Anlamlar kısa açıklamalardır; isimlerin 99 ile sınırlı olduğu anlamına gelmez. <a class="hadith-source" href="https://www.diyanet.gov.tr/icerik/10027" target="_blank" rel="noopener noreferrer">Diyanet açıklaması ↗</a></p>
    <p class="quran-status">İsimler yükleniyor…</p><div id="names-grid" class="names-grid"></div>
  `;
  const status = container.querySelector(".quran-status");
  const grid = document.getElementById("names-grid");
  try {
    if (!beautifulNames.length) {
      const response = await fetch("https://api.aladhan.com/v1/asmaAlHusna", { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`API yanıtı: ${response.status}`);
      const result = await response.json();
      if (result.code !== 200 || !Array.isArray(result.data) || result.data.length !== 99) throw new Error("İsim listesi eksik.");
      beautifulNames = result.data;
    }
    if (!grid.isConnected) return;
    status.textContent = `99 isim • Türkçe anlamlar kısa açıklama niteliğindedir.`;
    const fragment = document.createDocumentFragment();
    beautifulNames.forEach((name, index) => {
      const card = document.createElement("article");
      card.className = "name-card";
      const number = document.createElement("span");
      number.className = "feature-number";
      number.textContent = String(name.number).padStart(2, "0");
      const arabic = document.createElement("span");
      arabic.className = "name-arabic";
      arabic.lang = "ar";
      arabic.dir = "rtl";
      arabic.textContent = name.name;
      const transliteration = document.createElement("strong");
      transliteration.textContent = name.transliteration;
      const meaning = document.createElement("span");
      meaning.className = "name-meaning";
      meaning.textContent = nameMeaningsTr[index] || "Güzel isim";
      card.append(number, arabic, transliteration, meaning);
      fragment.append(card);
    });
    grid.append(fragment);
  } catch (error) {
    console.error("Esma listesi yüklenemedi:", error);
    if (status) status.textContent = "İsimler yüklenemedi. İnternet bağlantını kontrol edip yeniden dene.";
  }
}

function renderTasbeehPage(container) {
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem("iman-tasbeeh") || "{}"); } catch (error) { console.warn("Tesbih kaydı okunamadı:", error); }
  const items = [
    { label: "Sübhanallah", arabic: "سُبْحَانَ اللَّهِ" },
    { label: "Elhamdülillah", arabic: "الْحَمْدُ لِلَّهِ" },
    { label: "Allahu ekber", arabic: "اللَّهُ أَكْبَرُ" },
    { label: "Estağfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ" },
    { label: "Salavat", arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ" }
  ];
  container.innerHTML = `
    <span class="section-kicker">İMAN • DİJİTAL TESBİH</span><h2>Zikrine devam et</h2>
    <p class="quran-intro">Zikri seç, hedefini belirle ve sayaca dokun. Sayacın bu cihazda saklanır.</p>
    <div class="tasbeeh-panel">
      <label for="dhikr-select">Zikir</label><select id="dhikr-select">
        ${items.map((item, i) => `<option value="${i}">${item.label}</option>`).join("")}
        <option value="name">Esmâü'l Hüsnâ ismi</option>
      </select>
      <div id="tasbeeh-name-wrap" class="hidden"><label for="tasbeeh-name">Allah'ın ismi</label><select id="tasbeeh-name"><option>İsimler yükleniyor…</option></select></div>
      <label for="tasbeeh-target">Hedef</label><select id="tasbeeh-target"><option value="33">33</option><option value="99">99</option><option value="100">100</option><option value="0">Hedefsiz</option></select>
      <div class="tasbeeh-counter"><span id="tasbeeh-arabic" class="name-arabic" lang="ar" dir="rtl"></span><strong id="tasbeeh-count">0</strong><span id="tasbeeh-progress">Hedef: 33</span>
        <button id="tasbeeh-count-button" class="tasbeeh-count-button" type="button" aria-label="Zikir sayacını artır">Zikret</button>
      </div>
      <div class="tasbeeh-actions"><button id="tasbeeh-reset" class="back-button" type="button">Sayacı sıfırla</button></div>
    </div>
  `;
  const dhikrSelect = document.getElementById("dhikr-select");
  const nameWrap = document.getElementById("tasbeeh-name-wrap");
  const nameSelect = document.getElementById("tasbeeh-name");
  const targetSelect = document.getElementById("tasbeeh-target");
  let state = { count: Number.isInteger(stored.count) ? stored.count : 0, target: [33, 99, 100, 0].includes(stored.target) ? stored.target : 33, dhikr: stored.dhikr || "0", nameNumber: stored.nameNumber || 1 };
  const phrase = () => dhikrSelect.value === "name" ? `يَا ${beautifulNames[state.nameNumber - 1]?.name || "اللَّهُ"}` : items[Number(dhikrSelect.value)]?.arabic || items[0].arabic;
  const refresh = () => {
    document.getElementById("tasbeeh-count").textContent = state.count;
    document.getElementById("tasbeeh-progress").textContent = state.target ? `Hedef: ${state.target}${state.count >= state.target ? " • Hedef tamamlandı" : ""}` : "Hedef yok";
    document.getElementById("tasbeeh-arabic").textContent = phrase();
    nameWrap.classList.toggle("hidden", dhikrSelect.value !== "name");
    try { localStorage.setItem("iman-tasbeeh", JSON.stringify(state)); } catch (error) { console.warn("Tesbih sayacı bu cihazda saklanamadı:", error); }
  };
  dhikrSelect.value = ["0", "1", "2", "3", "4", "name"].includes(state.dhikr) ? state.dhikr : "0";
  targetSelect.value = String(state.target);
  nameSelect.addEventListener("change", () => { state.nameNumber = Number(nameSelect.value); refresh(); });
  dhikrSelect.addEventListener("change", () => { state.dhikr = dhikrSelect.value; refresh(); });
  targetSelect.addEventListener("change", () => { state.target = Number(targetSelect.value); refresh(); });
  document.getElementById("tasbeeh-count-button").addEventListener("click", () => { state.count += 1; refresh(); });
  document.getElementById("tasbeeh-reset").addEventListener("click", () => { state.count = 0; refresh(); });
  refresh();
  loadTasbeehNames(nameSelect, state.nameNumber);
}

async function loadTasbeehNames(select, selectedNumber) {
  try {
    if (!beautifulNames.length) {
      const response = await fetch("https://api.aladhan.com/v1/asmaAlHusna");
      if (!response.ok) throw new Error("İsim listesi alınamadı.");
      const result = await response.json();
      if (result.code !== 200 || result.data.length !== 99) throw new Error("İsim listesi geçersiz.");
      beautifulNames = result.data;
    }
    if (!select.isConnected) return;
    select.replaceChildren(...beautifulNames.map(name => {
      const option = document.createElement("option"); option.value = name.number; option.textContent = `${name.number}. ${name.transliteration}`; return option;
    }));
    select.value = String(selectedNumber);
    select.dispatchEvent(new Event("change"));
  } catch (error) {
    console.error("Tesbih isimleri yüklenemedi:", error);
    if (select.isConnected) select.innerHTML = "<option value=\"1\">Ya Allah</option>";
  }
}

function renderQiblaPage(container) {
  container.innerHTML = `
    <span class="section-kicker">İMAN • KIBLE BULUCU</span><h2>Kıble yönü</h2>
    <p class="quran-intro">Bulunduğun konumdan Kâbe yönüne olan pusula açısını hesapla.</p>
    <div class="qibla-panel"><div class="qibla-compass" role="img" aria-label="Kıble pusulası"><div id="qibla-dial" class="qibla-dial"><span>N</span><span>E</span><span>S</span><span>W</span></div><div id="qibla-arrow" class="qibla-arrow" aria-hidden="true"></div></div>
      <strong id="qibla-bearing" class="qibla-bearing">—°</strong><p id="qibla-status" class="quran-status">Konumunu paylaşarak kıble yönünü hesaplayabilirsin.</p>
      <button id="qibla-locate" class="primary-button" type="button">Konumumu kullan</button>
      <button id="qibla-calibrate" class="back-button hidden" type="button">Pusulayı etkinleştir</button>
    </div>
    <p class="qibla-note">Pusula sensörü bulunmuyorsa ok, kuzeye göre hesaplanan yönü gösterir. Hassasiyet cihazın sensörlerine ve konum doğruluğuna bağlıdır.</p>
  `;
  document.getElementById("qibla-locate").addEventListener("click", locateForQibla);
}

function calculateQiblaBearing(latitude, longitude) {
  const toRadians = value => value * Math.PI / 180;
  const toDegrees = value => value * 180 / Math.PI;
  const kaabaLat = toRadians(21.4225);
  const kaabaLon = toRadians(39.8262);
  const lat = toRadians(latitude);
  const deltaLon = kaabaLon - toRadians(longitude);
  const y = Math.sin(deltaLon);
  const x = Math.cos(lat) * Math.tan(kaabaLat) - Math.sin(lat) * Math.cos(deltaLon);
  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

async function locateForQibla() {
  const status = document.getElementById("qibla-status");
  const bearingLabel = document.getElementById("qibla-bearing");
  if (!window.isSecureContext && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
    status.textContent = "Konum ve pusula için sayfayı HTTPS üzerinden aç (localhost geliştirme için uygundur).";
    return;
  }
  if (!navigator.geolocation) { status.textContent = "Bu tarayıcı konum bilgisini desteklemiyor."; return; }
  status.textContent = "Konum izni bekleniyor…";
  navigator.geolocation.getCurrentPosition(async position => {
    const bearing = calculateQiblaBearing(position.coords.latitude, position.coords.longitude);
    document.getElementById("qibla-arrow").style.transform = `translate(-50%, -50%) rotate(${bearing}deg)`;
    bearingLabel.textContent = `${Math.round(bearing)}°`;
    status.textContent = `Kıble, gerçek kuzeyden saat yönünde yaklaşık ${Math.round(bearing)}° yönünde.`;
    await enableQiblaCompass(bearing);
  }, error => {
    status.textContent = error.code === 1 ? "Konum izni verilmedi. Tarayıcı ayarlarından izin verip yeniden deneyebilirsin." : "Konum alınamadı. GPS veya ağ bağlantını kontrol edip tekrar dene.";
  }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
}

async function enableQiblaCompass(bearing) {
  const button = document.getElementById("qibla-calibrate");
  const arrow = document.getElementById("qibla-arrow");
  const dial = document.getElementById("qibla-dial");
  const status = document.getElementById("qibla-status");
  qiblaSensorCleanup?.();
  let sensorFound = false;
  let sensorTimer;

  const handleOrientation = (event, isAbsolute = false) => {
    let heading = null;
    if (typeof event.webkitCompassHeading === "number" && Number.isFinite(event.webkitCompassHeading)) {
      heading = event.webkitCompassHeading;
    } else if ((isAbsolute || event.absolute === true) && typeof event.alpha === "number" && Number.isFinite(event.alpha)) {
      const screenAngle = Number(window.screen?.orientation?.angle || 0);
      heading = (360 - event.alpha + screenAngle + 360) % 360;
    }
    // Relative alpha is not a compass bearing. Ignore it instead of pointing inaccurately.
    if (heading === null) return;
    sensorFound = true;
    arrow.style.transform = `translate(-50%, -50%) rotate(${bearing - heading}deg)`;
    dial.style.transform = `rotate(${-heading}deg)`;
    button.classList.add("hidden");
    status.textContent = `Pusula etkin. Kıble yönü ${Math.round(bearing)}°; telefon yönü sensörden izleniyor.`;
  };

  const absoluteHandler = event => handleOrientation(event, true);
  const orientationHandler = event => handleOrientation(event, false);
  const startListening = () => {
    window.addEventListener("deviceorientationabsolute", absoluteHandler, true);
    window.addEventListener("deviceorientation", orientationHandler, true);
    sensorTimer = window.setTimeout(() => {
      if (!sensorFound) status.textContent = "Kıble açısı hesaplandı; cihaz kuzey pusulası vermedi. Telefonu düz tutup metal eşyalardan uzaklaştırarak yeniden deneyebilirsin.";
    }, 5000);
    qiblaSensorCleanup = () => {
      window.removeEventListener("deviceorientationabsolute", absoluteHandler, true);
      window.removeEventListener("deviceorientation", orientationHandler, true);
      window.clearTimeout(sensorTimer);
    };
  };

  if (!("DeviceOrientationEvent" in window)) {
    status.textContent = `Kıble açısı ${Math.round(bearing)}°. Bu cihaz yön sensörü sunmuyor; pusula oku kuzeye göredir.`;
    return;
  }
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    button.classList.remove("hidden");
    button.onclick = async () => {
      try {
        const permission = await DeviceOrientationEvent.requestPermission(true);
        if (permission === "granted") {
          button.classList.add("hidden");
          status.textContent = "Pusula sensörü bekleniyor… Telefonu düz tut ve metal eşyalardan uzaklaş.";
          startListening();
        }
        else status.textContent = `Pusula izni verilmedi. Kıble açısı ${Math.round(bearing)}° olarak gösteriliyor.`;
      } catch (error) {
        console.error("Pusula izni alınamadı:", error);
        status.textContent = `Pusula izni alınamadı. Kıble açısı ${Math.round(bearing)}° olarak gösteriliyor.`;
      }
    };
  } else {
    startListening();
  }
}

function renderQuranReader(container) {
  container.innerHTML = `
    <span class="section-kicker">İMAN • KUR'AN-I KERİM</span>
    <h2>Kur'an-ı Kerim</h2>
    <p class="quran-intro">Sureyi ve okuyucuyu seç; dinlemek istediğin ayetin yanındaki düğmeye dokun.</p>
    <div class="quran-controls">
      <label for="reciter-select">Kur'an okuyucusu</label>
      <select id="reciter-select">${quranReciters.map(reciter => `<option value="${reciter.edition}">${reciter.name}</option>`).join("")}</select>
      <div class="surah-mode-switch" role="group" aria-label="Sure seçme yöntemi">
        <button id="surah-mode-search" type="button" aria-pressed="true">Sure ara</button>
        <button id="surah-mode-all" type="button" aria-pressed="false" disabled>Tüm sureler</button>
      </div>
      <div id="surah-search-view" class="surah-picker-view">
        <label for="surah-search">Sure ara veya seç</label>
        <input id="surah-search" type="search" placeholder="Sure adı veya numarası yaz…" autocomplete="off" role="combobox" aria-autocomplete="list" aria-controls="surah-results" aria-expanded="false" disabled>
        <div id="surah-results" class="surah-results" role="listbox" aria-label="Sure arama sonuçları" hidden></div>
      </div>
      <div id="surah-list-view" class="surah-picker-view" hidden>
        <p class="surah-list-hint">Sureyi seçmek için listeden dokun.</p>
        <div id="surah-all-list" class="surah-all-list" role="listbox" aria-label="114 surenin tamamı"></div>
      </div>
      <p id="surah-selection" class="surah-selection" aria-live="polite">Sure listesi yükleniyor…</p>
      <div id="quran-audio-holder" class="quran-audio-holder">
        <div id="quran-audio-dock" class="quran-audio-dock" hidden>
          <strong id="quran-audio-title"></strong>
          <audio id="quran-audio" controls preload="none" aria-label="Seçilen ayetin Kur'an tilaveti"></audio>
          <p id="quran-audio-status" class="quran-audio-status" role="status" aria-live="polite"></p>
        </div>
      </div>
    </div>
    <p id="quran-status" class="quran-status" role="status" aria-live="polite">Sure listesi yükleniyor…</p>
    <div id="quran-reading" class="quran-reading" aria-live="polite"></div>
  `;
  const reciterSelect = document.getElementById("reciter-select");
  try {
    const savedReciter = localStorage.getItem("iman-quran-reciter");
    if (quranReciters.some(reciter => reciter.edition === savedReciter)) reciterSelect.value = savedReciter;
  } catch (error) {
    console.warn("Okuyucu tercihi okunamadı:", error);
  }
  reciterSelect.addEventListener("change", () => {
    stopQuranAudio();
    try { localStorage.setItem("iman-quran-reciter", reciterSelect.value); }
    catch (error) { console.warn("Okuyucu tercihi saklanamadı:", error); }
    const audioStatus = document.getElementById("quran-audio-status");
    if (audioStatus) audioStatus.textContent = `${reciterSelect.selectedOptions[0]?.textContent || "Yeni okuyucu"} seçildi. Bir ayeti dinlemek için ayet düğmesine dokun.`;
  });
  const audio = document.getElementById("quran-audio");
  audio.addEventListener("error", () => {
    const audioStatus = document.getElementById("quran-audio-status");
    if (audioStatus) audioStatus.textContent = "Bu ayetin sesi yüklenemedi. İnternet bağlantını kontrol edip yeniden dene.";
  });
  audio.addEventListener("ended", () => {
    const audioStatus = document.getElementById("quran-audio-status");
    if (audioStatus) audioStatus.textContent = "Ayet tamamlandı.";
  });
  loadSurahList();
}

function stopQuranAudio() {
  const audio = document.getElementById("quran-audio");
  const dock = document.getElementById("quran-audio-dock");
  const holder = document.getElementById("quran-audio-holder");
  if (audio) {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }
  if (dock && holder) {
    dock.hidden = true;
    holder.append(dock);
  }
}

async function playQuranAyah(ayah, surahNumber, ayahNumber, verse) {
  const audio = document.getElementById("quran-audio");
  const dock = document.getElementById("quran-audio-dock");
  const holder = document.getElementById("quran-audio-holder");
  const title = document.getElementById("quran-audio-title");
  const status = document.getElementById("quran-audio-status");
  const reciterSelect = document.getElementById("reciter-select");
  const reciter = quranReciters.find(item => item.edition === reciterSelect?.value) || quranReciters[0];
  if (!audio || !dock || !title || !status || !verse) return;

  audio.pause();
  title.textContent = `${surahNumber}. sure, ${ayahNumber}. ayet • ${reciter.name}`;
  status.textContent = "Tilavet yükleniyor…";
  dock.hidden = false;
  verse.append(dock);
  audio.src = `https://cdn.islamic.network/quran/audio/128/${reciter.edition}/${ayah}.mp3`;
  audio.load();
  try {
    await audio.play();
    status.textContent = `${reciter.name} okuyor.`;
  } catch (error) {
    console.error("Ayet tilaveti başlatılamadı:", error);
    status.textContent = "Tilavet başlatılamadı. Ses düğmesine yeniden dokun veya bağlantını kontrol et.";
  }
}

async function loadSurahList() {
  const search = document.getElementById("surah-search");
  const resultsList = document.getElementById("surah-results");
  const allList = document.getElementById("surah-all-list");
  const allMode = document.getElementById("surah-mode-all");
  const selection = document.getElementById("surah-selection");
  const status = document.getElementById("quran-status");
  if (!search || !resultsList || !allList || !allMode || !selection || !status) return;

  try {
    const response = await fetch("https://api.alquran.cloud/v1/surah", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`API yanıtı: ${response.status}`);
    const result = await response.json();
    if (result.code !== 200 || !Array.isArray(result.data) || result.data.length !== 114) {
      throw new Error("Sure listesi eksik veya geçersiz.");
    }
    quranSurahs = result.data;
    search.disabled = false;
    allMode.disabled = false;
    search.placeholder = "Sure adı veya numarası yaz…";
    selection.textContent = "Sure adıyla (ör. Bakara) veya sure numarasıyla arayabilirsin.";
    renderAllSurahs();
    document.getElementById("surah-mode-search")?.addEventListener("click", () => setSurahMode("search"));
    allMode.addEventListener("click", () => setSurahMode("all"));
    search.addEventListener("input", () => renderSurahSearch(search.value));
    search.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        const firstResult = resultsList.querySelector("button[role=option]");
        if (firstResult) { event.preventDefault(); firstResult.click(); }
      } else if (event.key === "ArrowDown") {
        resultsList.querySelector("button[role=option]")?.focus();
      } else if (event.key === "Escape") {
        resultsList.hidden = true;
        search.setAttribute("aria-expanded", "false");
      }
    });
    status.textContent = "114 sure hazır.";
    await loadSurah(1);
  } catch (error) {
    console.error("Kur'an sure listesi yüklenemedi:", error);
    status.textContent = "Sureler yüklenemedi. İnternet bağlantını kontrol edip tekrar deneyebilirsin.";
  }
}

function setSurahMode(mode) {
  const searchMode = mode !== "all";
  const searchView = document.getElementById("surah-search-view");
  const allView = document.getElementById("surah-list-view");
  const searchButton = document.getElementById("surah-mode-search");
  const allButton = document.getElementById("surah-mode-all");
  if (!searchView || !allView) return;
  searchView.hidden = !searchMode;
  allView.hidden = searchMode;
  searchButton?.setAttribute("aria-pressed", String(searchMode));
  allButton?.setAttribute("aria-pressed", String(!searchMode));
  if (searchMode) document.getElementById("surah-search")?.focus();
}

function renderAllSurahs() {
  const list = document.getElementById("surah-all-list");
  if (!list) return;
  list.replaceChildren(...quranSurahs.map(surah => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "surah-result surah-all-item";
    button.setAttribute("role", "option");
    button.dataset.surahNumber = String(surah.number);
    const number = document.createElement("span");
    number.className = "surah-list-number";
    number.textContent = String(surah.number).padStart(3, "0");
    const name = document.createElement("span");
    name.className = "surah-list-name";
    name.textContent = surahNamesTr[surah.number - 1];
    const details = document.createElement("span");
    details.className = "surah-list-details";
    details.textContent = `${surah.englishName} · ${surah.name}`;
    button.append(number, name, details);
    button.addEventListener("click", () => loadSurah(surah.number));
    return button;
  }));
}

function normalizeSurahSearch(value) {
  return value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replaceAll("ı", "i").replaceAll("ş", "s").replaceAll("ç", "c").replaceAll("ğ", "g")
    .replaceAll("ü", "u").replaceAll("ö", "o").replace(/[’'`]/g, "").trim();
}

function renderSurahSearch(query) {
  const search = document.getElementById("surah-search");
  const results = document.getElementById("surah-results");
  if (!search || !results) return;
  const normalized = normalizeSurahSearch(query);
  results.replaceChildren();
  if (!normalized) {
    results.hidden = true;
    search.setAttribute("aria-expanded", "false");
    return;
  }
  const matches = quranSurahs.filter(surah => {
    const aliases = [surah.number, surah.englishName, surah.englishNameTranslation, surah.name, surahNamesTr[surah.number - 1]];
    return aliases.some(alias => normalizeSurahSearch(String(alias)).includes(normalized));
  }).slice(0, 12);
  if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "surah-no-results";
    empty.textContent = "Eşleşen sure bulunamadı. Başka bir ad veya numara dene.";
    results.append(empty);
  } else {
    matches.forEach(surah => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "surah-result";
      button.setAttribute("role", "option");
      button.textContent = `${surah.number}. ${surahNamesTr[surah.number - 1]} · ${surah.englishName} — ${surah.name}`;
      button.addEventListener("click", () => {
        search.value = `${surah.number}. ${surahNamesTr[surah.number - 1]}`;
        results.hidden = true;
        search.setAttribute("aria-expanded", "false");
        const selection = document.getElementById("surah-selection");
        if (selection) selection.textContent = `Seçilen sure: ${surah.number}. ${surahNamesTr[surah.number - 1]}`;
        loadSurah(surah.number);
      });
      results.append(button);
    });
  }
  results.hidden = false;
  search.setAttribute("aria-expanded", "true");
}

async function loadSurah(number) {
  const reading = document.getElementById("quran-reading");
  const status = document.getElementById("quran-status");
  if (!reading || !status || !Number.isInteger(number) || number < 1 || number > 114) return;
  stopQuranAudio();
  const selectedSurah = quranSurahs[number - 1];
  if (!selectedSurah) return;
  const search = document.getElementById("surah-search");
  if (search) search.value = `${number}. ${surahNamesTr[number - 1]}`;
  const selection = document.getElementById("surah-selection");
  if (selection) selection.textContent = `Seçilen sure: ${number}. ${surahNamesTr[number - 1]}`;
  document.querySelectorAll("#surah-all-list [data-surah-number]").forEach(button => {
    const isSelected = Number(button.dataset.surahNumber) === number;
    button.setAttribute("aria-selected", String(isSelected));
    button.classList.toggle("is-selected", isSelected);
  });
  const requestId = ++activeSurahRequest;
  reading.replaceChildren();
  status.textContent = `${selectedSurah.englishName} yükleniyor…`;

  try {
    let surah = quranCache.get(number);
    if (!surah) {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,tr.diyanet`, {
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error(`API yanıtı: ${response.status}`);
      const result = await response.json();
      if (result.code !== 200 || !Array.isArray(result.data) || result.data.length < 2) {
        throw new Error("Sure metni alınamadı.");
      }
      surah = { arabic: result.data[0], translation: result.data[1] };
      quranCache.set(number, surah);
    }
    if (requestId !== activeSurahRequest || !reading.isConnected) return;

    const title = document.createElement("div");
    title.className = "quran-surah-heading";
    const surahName = document.createElement("span");
    surahName.textContent = `${surah.arabic.number}. Sure • ${surah.arabic.englishName}`;
    const arabicName = document.createElement("strong");
    arabicName.lang = "ar";
    arabicName.dir = "rtl";
    arabicName.textContent = surah.arabic.name;
    title.append(surahName, arabicName);
    reading.append(title);

    surah.arabic.ayahs.forEach((ayah, index) => {
      const verse = document.createElement("article");
      verse.className = "quran-verse";
      const arabic = document.createElement("p");
      arabic.className = "quran-arabic";
      arabic.lang = "ar";
      arabic.dir = "rtl";
      arabic.textContent = `${ayah.text} ۞ ${ayah.numberInSurah}`;
      const translation = document.createElement("p");
      translation.className = "quran-translation";
      translation.textContent = surah.translation.ayahs[index]?.text || "Türkçe meal şu anda alınamadı.";
      const playButton = document.createElement("button");
      playButton.type = "button";
      playButton.className = "quran-play-button";
      playButton.textContent = "▶ Ayeti dinle";
      playButton.setAttribute("aria-label", `${number}. sure ${ayah.numberInSurah}. ayeti seçilen okuyucudan dinle`);
      playButton.addEventListener("click", () => playQuranAyah(ayah.number, number, ayah.numberInSurah, verse));
      verse.append(arabic, translation, playButton);
      reading.append(verse);
    });
    status.textContent = `${surah.arabic.ayahs.length} ayet gösteriliyor. Türkçe meal: Diyanet İşleri Başkanlığı.`;
  } catch (error) {
    if (requestId !== activeSurahRequest) return;
    console.error("Sure yüklenemedi:", error);
    status.textContent = "Sure metni yüklenemedi. Bağlantını kontrol edip sureyi yeniden seç.";
  }
}

function goHome() {
  qiblaSensorCleanup?.();
  qiblaSensorCleanup = null;
  document.getElementById("content")?.removeAttribute("data-theme");
  openSanctuaryDoor("hall");
}

function initializeGallery() {
  const image = document.getElementById("gallery-image");
  const title = document.getElementById("gallery-title");
  const locationLabel = document.getElementById("gallery-location");
  const counter = document.getElementById("gallery-count");
  const credit = document.getElementById("gallery-credit");
  if (!image || !title || !locationLabel || !counter || !credit) return;

  const gallery = image.closest(".world-gallery");
  let rotationPaused = false;
  const showSlide = index => {
    galleryIndex = (index + travelSlides.length) % travelSlides.length;
    const slide = travelSlides[galleryIndex];
    image.classList.remove("gallery-image-failed");
    image.src = slide.image;
    image.alt = slide.alt;
    title.textContent = slide.title;
    locationLabel.textContent = slide.location;
    counter.textContent = `${galleryIndex + 1} / ${travelSlides.length}`;
    const link = document.createElement("a");
    link.href = slide.source;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `Fotoğraf: ${slide.author} / Wikimedia Commons (${slide.license})`;
    credit.replaceChildren(link);
  };

  document.getElementById("gallery-prev")?.addEventListener("click", () => showSlide(galleryIndex - 1));
  document.getElementById("gallery-next")?.addEventListener("click", () => showSlide(galleryIndex + 1));
  image.addEventListener("error", () => image.classList.add("gallery-image-failed"));
  gallery?.addEventListener("pointerenter", () => { rotationPaused = true; });
  gallery?.addEventListener("pointerleave", () => {
    rotationPaused = Boolean(gallery.querySelector(":focus"));
  });
  gallery?.addEventListener("focusin", () => { rotationPaused = true; });
  gallery?.addEventListener("focusout", event => {
    if (!gallery.contains(event.relatedTarget)) rotationPaused = false;
  });
  showSlide(galleryIndex);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.setInterval(() => {
      if (!rotationPaused && !gallery?.hidden && document.visibilityState === "visible") {
        showSlide(galleryIndex + 1);
      }
    }, 4000);
  }
}

function updateDate() {
  const dateLabel = document.getElementById("today-date");
  if (!dateLabel) return;
  dateLabel.textContent = new Date().toLocaleDateString("tr-TR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
}

function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function initializeDashboard() {
  const grid = document.getElementById("calendar-grid");
  if (!grid) return;
  try {
    const storedTasks = JSON.parse(localStorage.getItem("iman-day-plans") || "[]");
    plannedTasks = Array.isArray(storedTasks) ? storedTasks.filter(task =>
      task && typeof task.id === "string" && typeof task.date === "string" &&
      typeof task.time === "string" && typeof task.text === "string" && task.text.length <= 80
    ) : [];
  } catch (error) {
    console.warn("Gün planları okunamadı:", error);
    plannedTasks = [];
  }

  renderCalendar();
  renderPlanList();
  updatePlannerDate();
  updateDashboardClock();
  window.setInterval(updateDashboardClock, 1000);
  window.setInterval(() => {
    if (activeLocation) loadWeather(activeLocation.latitude, activeLocation.longitude, activeLocation.label);
  }, 30 * 60 * 1000);
  document.getElementById("calendar-prev")?.addEventListener("click", () => changeCalendarMonth(-1));
  document.getElementById("calendar-next")?.addEventListener("click", () => changeCalendarMonth(1));
  document.getElementById("planner-form")?.addEventListener("submit", addPlannedTask);
  document.getElementById("weather-location-action")?.addEventListener("click", () => {
    if (activeLocation) {
      loadWeather(activeLocation.latitude, activeLocation.longitude, activeLocation.label);
      return;
    }
    const picker = document.getElementById("location-picker");
    if (picker?.hidden) document.getElementById("toggle-location-picker")?.click();
    document.getElementById("locate-user")?.scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById("country-select")?.focus({ preventScroll: true });
  });
}

function updateDashboardClock() {
  const clock = document.getElementById("live-clock");
  if (!clock) return;
  clock.textContent = new Date().toLocaleTimeString("tr-TR", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: currentTimeFormat === "12"
  });
}

function changeCalendarMonth(amount) {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + amount, 1);
  renderCalendar();
}

function renderCalendar() {
  const grid = document.getElementById("calendar-grid");
  const monthLabel = document.getElementById("calendar-month");
  if (!grid || !monthLabel) return;
  monthLabel.textContent = calendarMonth.toLocaleDateString(appLanguage === "en" ? "en-CA" : "tr-TR", { month: "long", year: "numeric" });
  grid.replaceChildren();
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let blank = 0; blank < offset; blank++) {
    const spacer = document.createElement("span");
    spacer.className = "calendar-day-spacer";
    spacer.setAttribute("aria-hidden", "true");
    grid.append(spacer);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const key = localDateKey(date);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "calendar-day";
    button.textContent = String(day);
    button.setAttribute("aria-pressed", String(key === selectedPlanDate));
    button.setAttribute("aria-label", date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }));
    if (key === localDateKey(new Date())) button.classList.add("is-today");
    if (plannedTasks.some(task => task.date === key)) button.classList.add("has-plan");
    button.addEventListener("click", () => {
      selectedPlanDate = key;
      renderCalendar();
      updatePlannerDate();
      renderPlanList();
    });
    grid.append(button);
  }
}

function updatePlannerDate() {
  const label = document.getElementById("planner-date-label");
  const selected = document.getElementById("calendar-selected");
  if (!label) return;
  const [year, month, day] = selectedPlanDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const readable = date.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  label.textContent = readable;
  if (selected) selected.textContent = `Seçilen gün: ${date.toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}`;
}

function savePlannedTasks() {
  try { localStorage.setItem("iman-day-plans", JSON.stringify(plannedTasks)); }
  catch (error) { console.warn("Gün planları saklanamadı:", error); }
}

function addPlannedTask(event) {
  event.preventDefault();
  const timeInput = document.getElementById("plan-time");
  const textInput = document.getElementById("plan-title");
  const text = textInput?.value.trim();
  if (!timeInput?.value || !text) return;
  plannedTasks.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, date: selectedPlanDate, time: timeInput.value, text, done: false });
  savePlannedTasks();
  renderPlanList();
  renderCalendar();
  event.currentTarget.reset();
  textInput.focus();
}

function renderPlanList() {
  const list = document.getElementById("plan-list");
  if (!list) return;
  list.replaceChildren();
  const tasks = plannedTasks.filter(task => task.date === selectedPlanDate).sort((a, b) => a.time.localeCompare(b.time));
  if (!tasks.length) {
    const empty = document.createElement("li");
    empty.className = "plan-empty";
    empty.textContent = "Bu gün için henüz plan eklenmedi.";
    list.append(empty);
    return;
  }
  tasks.forEach(task => {
    const item = document.createElement("li");
    item.className = "plan-item";
    if (task.done) item.classList.add("is-done");
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = Boolean(task.done);
    check.setAttribute("aria-label", `${task.text} planını tamamlandı olarak işaretle`);
    check.addEventListener("change", () => {
      task.done = check.checked;
      savePlannedTasks();
      renderPlanList();
    });
    const time = document.createElement("time");
    time.dateTime = task.time;
    time.textContent = formatTime(task.time);
    const text = document.createElement("span");
    text.textContent = task.text;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "plan-remove";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `${task.text} planını sil`);
    remove.addEventListener("click", () => {
      plannedTasks = plannedTasks.filter(entry => entry.id !== task.id);
      savePlannedTasks();
      renderPlanList();
      renderCalendar();
    });
    item.append(check, time, text, remove);
    list.append(item);
  });
}

const weatherDescriptions = {
  0: ["☀️", "Açık"], 1: ["🌤️", "Çoğunlukla açık"], 2: ["⛅", "Parçalı bulutlu"], 3: ["☁️", "Kapalı"],
  45: ["🌫️", "Sisli"], 48: ["🌫️", "Kırağılı sis"],
  51: ["🌦️", "Hafif çisenti"], 53: ["🌦️", "Çisenti"], 55: ["🌧️", "Yoğun çisenti"],
  56: ["🌧️", "Dondurucu çisenti"], 57: ["🌧️", "Yoğun dondurucu çisenti"],
  61: ["🌧️", "Hafif yağmur"], 63: ["🌧️", "Yağmurlu"], 65: ["🌧️", "Kuvvetli yağmur"],
  66: ["🌧️", "Dondurucu yağmur"], 67: ["🌧️", "Kuvvetli dondurucu yağmur"],
  71: ["🌨️", "Hafif kar"], 73: ["🌨️", "Karlı"], 75: ["❄️", "Yoğun kar"], 77: ["🌨️", "Kar tanecikleri"],
  80: ["🌦️", "Hafif sağanak"], 81: ["🌧️", "Sağanak yağış"], 82: ["⛈️", "Kuvvetli sağanak"],
  85: ["🌨️", "Kar sağanağı"], 86: ["❄️", "Kuvvetli kar sağanağı"],
  95: ["⛈️", "Gök gürültülü fırtına"], 96: ["⛈️", "Dolu ihtimalli fırtına"], 99: ["⛈️", "Kuvvetli dolulu fırtına"]
};

function setActiveLocation(latitude, longitude, label) {
  activeLocation = { latitude, longitude, label };
  loadPrayerTimes(latitude, longitude);
  loadWeather(latitude, longitude, label);
}

async function loadWeather(latitude, longitude, label) {
  const locationLabel = document.getElementById("weather-location");
  const status = document.getElementById("weather-status");
  if (!locationLabel || !status) return;
  const requestId = ++weatherRequestId;
  locationLabel.textContent = label;
  status.textContent = "Hava durumu alınıyor…";
  try {
    const params = new URLSearchParams({
      latitude, longitude,
      current: "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m",
      timezone: "auto"
    });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error(`Hava durumu servisi: ${response.status}`);
    const result = await response.json();
    if (requestId !== weatherRequestId) return;
    const current = result.current;
    if (!current || !Number.isFinite(current.temperature_2m)) throw new Error("Hava durumu bilgisi eksik.");
    const [icon, description] = weatherDescriptions[current.weather_code] || ["🌡️", "Güncel hava"];
    document.getElementById("weather-icon").textContent = icon;
    document.getElementById("weather-temperature").textContent = `${Math.round(current.temperature_2m)}°`;
    document.getElementById("weather-description").textContent = description;
    document.getElementById("weather-details").textContent = `Hissedilen ${Math.round(current.apparent_temperature)}° · Nem %${current.relative_humidity_2m} · Rüzgâr ${Math.round(current.wind_speed_10m)} km/sa`;
    status.textContent = "Güncel hava durumu.";
  } catch (error) {
    if (requestId !== weatherRequestId) return;
    console.error("Hava durumu alınamadı:", error);
    status.textContent = "Hava durumu alınamadı. İnternet bağlantını kontrol edip yeniden dene.";
  }
}

function setLocationLabel(message) {
  const label = document.getElementById("city");
  if (label) label.textContent = message;
}

async function getCityAndCountry(latitude, longitude) {
  const params = new URLSearchParams({ latitude, longitude, localityLanguage: "tr" });
  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${params}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error(`Konum adı servisi: ${response.status}`);
  const place = await response.json();
  const city = place.locality || place.city || place.principalSubdivision || place.countryName;
  const country = place.countryName;
  if (!city && !country) throw new Error("Konum adı bulunamadı.");
  return {
    label: [city, country].filter(Boolean).filter((value, index, all) => all.indexOf(value) === index).join(", "),
    countryCode: place.countryCode || ""
  };
}

async function locateUser() {
  const button = document.getElementById("locate-user");
  const label = document.getElementById("city");
  if (!button || !label) return;
  if (!navigator.geolocation) {
    setLocationLabel("Tarayıcın konum özelliğini desteklemiyor.");
    return;
  }
  if (!window.isSecureContext && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
    setLocationLabel("Konum için uygulamayı HTTPS üzerinden aç.");
    return;
  }

  button.disabled = true;
  setLocationLabel("Konumun alınıyor…");
  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    try {
      const place = await getCityAndCountry(coords.latitude, coords.longitude);
      setLocationLabel(`Konumun bulundu: ${place.label}`);
      const countrySelect = document.getElementById("country-select");
      if (countrySelect && place.countryCode) countrySelect.value = place.countryCode;
    } catch (error) {
      console.warn("Şehir adı alınamadı:", error);
      setLocationLabel("Konumun bulundu; şehir adı alınamadı.");
    } finally {
      button.disabled = false;
    }
    const locationText = document.getElementById("city")?.textContent || "";
    const locationName = locationText.startsWith("Konumun bulundu: ") ? locationText.replace("Konumun bulundu: ", "") : "Bulunduğun yer";
    setActiveLocation(coords.latitude, coords.longitude, locationName);
  }, error => {
    const message = error.code === 1
      ? "Konum izni verilmedi. Tarayıcı ayarlarından izin verip yeniden dene."
      : error.code === 3
        ? "Konum isteği zaman aşımına uğradı. Yeniden deneyebilirsin."
        : "Konum alınamadı. GPS veya ağ bağlantını kontrol et.";
    setLocationLabel(message);
    button.disabled = false;
  }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 });
}

function formatTime(value) {
  const match = typeof value === "string" && value.match(/\b\d{1,2}:\d{2}\b/);
  if (!match) return "—";
  const [hours, minutes] = match[0].split(":").map(Number);
  if (currentTimeFormat === "12") {
    return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
  }
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function renderPrayerTimes() {
  const container = document.getElementById("prayer-times");
  if (!container || !prayerSchedule) return;
  container.replaceChildren();
  prayerSchedule.forEach(([name, time]) => {
    const item = document.createElement("div");
    item.className = "prayer-item";
    const label = document.createElement("span");
    label.textContent = name;
    const value = document.createElement("strong");
    value.textContent = formatTime(time);
    item.append(label, value);
    container.append(item);
  });
}

async function loadPrayerTimes(latitude, longitude) {
  const status = document.getElementById("prayer-status");
  const container = document.getElementById("prayer-times");
  if (!container) return;
  if (status) status.textContent = "Namaz vakitleri alınıyor…";

  try {
    const params = new URLSearchParams({ latitude, longitude, method: "2" });
    const response = await fetch(`https://api.aladhan.com/v1/timings?${params}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error(`API yanıtı: ${response.status}`);

    const result = await response.json();
    const times = result?.data?.timings;
    if (result?.code !== 200 || !times) throw new Error("Namaz vakti verisi bulunamadı.");

    prayerSchedule = [
      ["İmsak", times.Fajr], ["Güneş", times.Sunrise], ["Öğle", times.Dhuhr],
      ["İkindi", times.Asr], ["Akşam", times.Maghrib], ["Yatsı", times.Isha]
    ];
    renderPrayerTimes();

    const hijri = result.data.date?.hijri;
    const dateLabel = document.getElementById("today-date");
    if (dateLabel && hijri?.day && hijri?.month?.tr && hijri?.year) {
      dateLabel.textContent = `${hijri.day} ${hijri.month.tr} ${hijri.year} H`;
    }
    if (status) status.textContent = "Namaz vakitleri bulunduğun konuma göre gösteriliyor.";
  } catch (error) {
    console.error("Namaz vakitleri yüklenemedi:", error);
    if (status) status.textContent = "Namaz vakitleri alınamadı. İnternet bağlantını kontrol edip yeniden deneyebilirsin.";
    container.innerHTML = '<p class="loading-message">Vakitler şu anda görüntülenemiyor.</p>';
  }
}

function populateCountrySelect() {
  const select = document.getElementById("country-select");
  if (!select) return;
  const regionNames = new Intl.DisplayNames(["tr"], { type: "region" });
  const options = countryCodes.map(code => ({ code, name: regionNames.of(code) }))
    .filter(country => country.name && country.name !== country.code)
    .sort((a, b) => a.name.localeCompare(b.name, "tr"));
  select.replaceChildren(new Option("Ülke seç", ""));
  options.forEach(({ code, name }) => select.add(new Option(name, code)));
}

function selectSearchResult(place) {
  const countryName = place.country || "";
  const selectedCountry = document.getElementById("country-select");
  if (selectedCountry && place.country_code) selectedCountry.value = place.country_code;
  const city = place.name;
  setLocationLabel(`Seçilen konum: ${[city, countryName].filter(Boolean).join(", ")}`);
  const help = document.getElementById("location-help");
  if (help) help.textContent = `Namaz vakitleri ${city}${countryName ? `, ${countryName}` : ""} için yükleniyor.`;
  setActiveLocation(place.latitude, place.longitude, `${city}${countryName ? `, ${countryName}` : ""}`);
}

async function searchManualLocation() {
  const country = document.getElementById("country-select");
  const cityInput = document.getElementById("city-search");
  const results = document.getElementById("location-results");
  const help = document.getElementById("location-help");
  const searchButton = document.getElementById("search-location");
  if (!country || !cityInput || !results || !help || !searchButton) return;
  const cityName = cityInput.value.trim();
  if (!country.value || !cityName) {
    help.textContent = "Önce bir ülke seçip şehir adını yaz.";
    return;
  }

  searchButton.disabled = true;
  help.textContent = "Şehir aranıyor…";
  results.replaceChildren();
  try {
    const params = new URLSearchParams({
      name: cityName,
      count: "10",
      language: "tr",
      format: "json",
      countryCode: country.value
    });
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error(`Şehir arama servisi: ${response.status}`);
    const data = await response.json();
    const places = data.results || [];
    if (!places.length) {
      help.textContent = "Bu ülkede eşleşen şehir bulunamadı. Yazımı kontrol edip yeniden dene.";
      return;
    }
    help.textContent = "Listeden doğru şehri seç:";
    places.forEach(place => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "location-result";
      button.setAttribute("role", "option");
      const name = document.createElement("span");
      name.textContent = place.name;
      const details = document.createElement("small");
      details.textContent = [place.admin1, place.country].filter(Boolean).join(" · ");
      button.append(name, details);
      button.addEventListener("click", () => selectSearchResult(place));
      results.append(button);
    });
  } catch (error) {
    console.error("Şehir aranamadı:", error);
    help.textContent = "Şehir aranamadı. İnternet bağlantını kontrol edip tekrar dene.";
  } finally {
    searchButton.disabled = false;
  }
}

function startLocation() {
  setLocationLabel("Konumunu görmek için dokun.");
  const prayerTimes = document.getElementById("prayer-times");
  if (prayerTimes) prayerTimes.innerHTML = '<p class="loading-message">Namaz vakitlerini görmek için mevcut konumunu bul veya şehir seç.</p>';
  const prayerStatus = document.getElementById("prayer-status");
  if (prayerStatus) prayerStatus.textContent = "Konum izni, mevcut konum düğmesine dokunduğunda istenir.";

  populateCountrySelect();
  document.getElementById("locate-user")?.addEventListener("click", locateUser);
  const pickerToggle = document.getElementById("toggle-location-picker");
  const picker = document.getElementById("location-picker");
  pickerToggle?.addEventListener("click", () => {
    if (!picker) return;
    const isOpening = picker.hidden;
    picker.hidden = !isOpening;
    pickerToggle.setAttribute("aria-expanded", String(isOpening));
    if (isOpening) document.getElementById("country-select")?.focus();
  });
  document.getElementById("search-location")?.addEventListener("click", searchManualLocation);
  document.getElementById("city-search")?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchManualLocation();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".site-header")?.setAttribute("inert", "");
  document.getElementById("home")?.setAttribute("inert", "");
  document.querySelector(".site-footer")?.setAttribute("inert", "");
  document.querySelector("#sanctuary-entry .entry-button")?.focus();
  updateDate();
  initializeGallery();
  initializeDashboard();
  const timeFormat = document.getElementById("time-format");
  try {
    currentTimeFormat = localStorage.getItem("iman-time-format") === "12" ? "12" : "24";
    if (timeFormat) timeFormat.value = currentTimeFormat;
  } catch (error) {
    console.warn("Saat biçimi tercihi okunamadı:", error);
  }
  updateDashboardClock();
  timeFormat?.addEventListener("change", () => {
    currentTimeFormat = timeFormat.value === "12" ? "12" : "24";
    try { localStorage.setItem("iman-time-format", currentTimeFormat); } catch (error) { console.warn("Saat biçimi tercihi saklanamadı:", error); }
    renderPrayerTimes();
    updateDashboardClock();
  });
  startLocation();
  document.getElementById("language-tr")?.addEventListener("click", () => setAppLanguage("tr"));
  document.getElementById("language-en")?.addEventListener("click", () => setAppLanguage("en"));
  document.querySelectorAll(".entry-language [data-language]").forEach(button => {
    button.addEventListener("click", () => setAppLanguage(button.dataset.language));
  });
  let savedLanguage = "tr";
  try { savedLanguage = localStorage.getItem("iman-language") === "en" ? "en" : "tr"; } catch {}
  setAppLanguage(savedLanguage);
});
