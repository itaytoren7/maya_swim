/* =========================================================
   MAYA SWIM — הגדרות האתר (Site settings)
   זה הקובץ היחיד שצריך לערוך כדי לעדכן פרטי קשר וקולקציה.
   This is the one file to edit for contact details and the collection.
   ========================================================= */
window.MAYA_CONFIG = {
  brand: "MAYA SWIM",

  /* ---- פרטי קשר / Contact (להחליף בפרטים האמיתיים) ---- */
  // מספר וואטסאפ בפורמט בינלאומי, בלי + ובלי 0 בהתחלה. לדוגמה: 0521234567 → 972521234567
  whatsapp: "972500000000",
  email: "hello@mayaswim.co.il",
  instagram: "mayaswim", // שם המשתמש בלי @

  /* ---- טפסים / Forms ----
     אתר שיושב ב-GitHub Pages לא יכול לשלוח מיילים לבד.
     פתחו טופס חינמי ב-Formspree (או שירות דומה) והדביקו כאן את כתובת ה-endpoint,
     לדוגמה: "https://formspree.io/f/abcdwxyz"
     כל עוד השדה ריק — הטופס יפתח את תוכנת המייל של המבקרת עם ההודעה מוכנה. */
  formEndpoint: "",
  newsletterEndpoint: "", // אם ריק — משתמש ב-formEndpoint

  /* ---- הקולקציה / Collection ----
     טקסט לדוגמה: להחליף בשמות, תיאורים, בדים וכמויות אמיתיים.
     image: קובץ בתיקייה assets/img/designs — כשיהיו צילומים, החליפו ל-jpg/webp (יחס 4:5, לפחות 800×1000). */
  collection: {
    he: "קולקציה 01 · שמש רכה",
    en: "Collection 01 · Soft Sun"
  },
  designs: [
    {
      id: "limona",
      type: "bikini",
      image: "assets/img/designs/limona.svg",
      edition: 30,
      name: { he: "לימונה", en: "Limona" },
      color: { he: "צהוב חמאה", en: "Butter yellow" },
      swatches: ["#F9E27E", "#FFF0A8"],
      short: { he: "ביקיני משולשים קלאסי עם קשירות", en: "Classic triangle bikini with ties" },
      description: {
        he: "ביקיני משולשים קלאסי בצהוב חמאה, עם שרוכים לקשירה בצוואר, בגב ובמותניים — כך שכל אחת מכוונת אותו בדיוק לגוף שלה.",
        en: "A classic triangle bikini in butter yellow, with ties at the neck, back and hips so it adjusts to every body."
      },
      fabric: { he: "ניילון-לייקרה עם בטנה מלאה", en: "Nylon-Lycra, fully lined" }
    },
    {
      id: "chamomile",
      type: "bikini",
      image: "assets/img/designs/chamomile.svg",
      edition: 25,
      name: { he: "קמומיל", en: "Chamomile" },
      color: { he: "הדפס פרחי קמומיל", en: "Chamomile print" },
      swatches: ["#FFF3C4", "#FFFFFF", "#EDBB3E"],
      short: { he: "סטרפלס עם קשירה ותחתון גבוה", en: "Twist bandeau with high-waist bottom" },
      description: {
        he: "טופ סטרפלס עם קשירה במרכז ותחתון גבוה, בהדפס פרחי קמומיל עדינים. נוח, עוטף ונשי.",
        en: "A twist-front bandeau and high-waist bottom in a delicate chamomile print. Comfortable, flattering and soft."
      },
      fabric: { he: "ניילון-לייקרה עם בטנה מלאה", en: "Nylon-Lycra, fully lined" }
    },
    {
      id: "honey-drop",
      type: "bikini",
      image: "assets/img/designs/honey-drop.svg",
      edition: 20,
      name: { he: "טיפת דבש", en: "Honey Drop" },
      color: { he: "דבש חם", en: "Warm honey" },
      swatches: ["#EBBE5E", "#FBE6AC"],
      short: { he: "בלקונט עם מלמלה רכה", en: "Balconette with soft ruffles" },
      description: {
        he: "טופ בלקונט עם מלמלה רכה לאורך הקו העליון, ותחתון עם מלמלה תואמת. גוון דבש חם שמחמיא לכל גוון עור.",
        en: "A balconette top with a soft ruffle along the neckline and a matching ruffled bottom, in a warm honey tone."
      },
      fabric: { he: "ניילון-לייקרה עם בטנה מלאה", en: "Nylon-Lycra, fully lined" }
    },
    {
      id: "dune",
      type: "onepiece",
      image: "assets/img/designs/dune.svg",
      edition: 30,
      name: { he: "דיונה", en: "Dune" },
      color: { he: "חול רך", en: "Soft sand" },
      swatches: ["#EAD3A6", "#F8EBCF"],
      short: { he: "בגד ים שלם עם מחשוף עגול", en: "Scoop-neck one-piece" },
      description: {
        he: "בגד ים שלם עם מחשוף עגול וקווים נקיים, בגוון חול רך. הדגם שהולך עם הכל — מהבוקר בחוף ועד השקיעה.",
        en: "A clean-lined scoop-neck one-piece in soft sand. The one that goes with everything, from morning swim to sunset."
      },
      fabric: { he: "ניילון-לייקרה עם בטנה מלאה", en: "Nylon-Lycra, fully lined" }
    },
    {
      id: "sunbeam",
      type: "onepiece",
      image: "assets/img/designs/sunbeam.svg",
      edition: 15,
      name: { he: "קרן שמש", en: "Sunbeam" },
      color: { he: "צהוב שמש", en: "Sun yellow" },
      swatches: ["#F5D25F", "#FFF7D6"],
      short: { he: "כתף אחת עם קפלי קרניים", en: "One-shoulder with sunray pleats" },
      description: {
        he: "בגד ים שלם בכתף אחת, עם קפלים שנפרשים כמו קרני שמש. הדגם החגיגי של הקולקציה.",
        en: "A one-shoulder one-piece with pleats that fan out like rays of sun. The statement piece of the collection."
      },
      fabric: { he: "ניילון-לייקרה עם בטנה מלאה", en: "Nylon-Lycra, fully lined" }
    },
    {
      id: "shell",
      type: "onepiece",
      image: "assets/img/designs/shell.svg",
      edition: 20,
      name: { he: "צדף", en: "Shell" },
      color: { he: "פסים בצהוב וקרם", en: "Yellow & cream stripes" },
      swatches: ["#F6DD8C", "#FFF9E6", "#C9A24A"],
      short: { he: "פסים עדינים וחיתוך במותן", en: "Soft stripes with a waist cut-out" },
      description: {
        he: "בגד ים שלם בפסים עדינים, עם מחשוף מרובע, חיתוך במותן וטבעת בגוון זהב. מודרני, עם קריצה.",
        en: "A square-neck one-piece in soft stripes, with a waist cut-out and a gold-tone ring. Modern, with a wink."
      },
      fabric: { he: "ניילון-לייקרה עם בטנה מלאה", en: "Nylon-Lycra, fully lined" }
    }
  ],

  /* ---- טבלת מידות (ס"מ) / Size chart (cm) ---- */
  sizes: [
    { size: "XS",  eu: 34, bust: [80, 84],  waist: [62, 66], hips: [86, 90] },
    { size: "S",   eu: 36, bust: [84, 88],  waist: [66, 70], hips: [90, 94] },
    { size: "M",   eu: 38, bust: [88, 92],  waist: [70, 74], hips: [94, 98] },
    { size: "L",   eu: 40, bust: [92, 96],  waist: [74, 78], hips: [98, 102] },
    { size: "XL",  eu: 42, bust: [96, 100], waist: [78, 82], hips: [102, 106] },
    { size: "XXL", eu: 44, bust: [100, 106], waist: [82, 88], hips: [106, 112] }
  ]
};
