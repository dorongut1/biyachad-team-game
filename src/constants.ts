import { GameStage, Quote, Question, BattleQuestion, TeamChallenge, Team } from './types';

// ציטוטים יהודיים לכל שלב
export const QUOTES: Record<GameStage, Quote> = {
  [GameStage.Welcome]: {
    text: "אַל תִּסְתַּכֵּל בַּקַּנְקַן, אֶלָּא בְּמַה שֶׁיֵּשׁ בּוֹ",
    source: "משנה אבות ד:כ"
  },
  [GameStage.IceBreaker]: {
    text: "הֱוֵי מְקַבֵּל אֶת כָּל הָאָדָם בְּסֵבֶר פָּנִים יָפוֹת",
    source: "משנה אבות א:טו"
  },
  [GameStage.WhoKnowsWho]: {
    text: "דַּע מַה לְּמַעְלָה מִמְּךָ: עַיִן רוֹאָה",
    source: "משנה אבות ב:א"
  },
  [GameStage.TeamAssignment]: {
    text: "טוֹבִים הַשְּׁנַיִם מִן הָאֶחָד",
    source: "קהלת ד:ט"
  },
  [GameStage.TeamBattle]: {
    text: "קִנְאַת סוֹפְרִים תַּרְבֶּה חָכְמָה",
    source: "בבא בתרא כא ע\"א"
  },
  [GameStage.TwoTruths]: {
    text: "מִדְּבַר שֶׁקֶר תִּרְחָק",
    source: "שמות כג:ז"
  },
  [GameStage.TeamChallenge]: {
    text: "אִם אֵין אֲנִי לִי, מִי לִי? וּכְשֶׁאֲנִי לְעַצְמִי, מָה אֲנִי?",
    source: "משנה אבות א:יד"
  },
  [GameStage.Gift]: {
    text: "אַל תִּמְנַע טוֹב מִבְּעָלָיו",
    source: "משלי ג:כז"
  },
  [GameStage.Reflection]: {
    text: "אֵיזֶהוּ חָכָם? הַלּוֹמֵד מִכָּל אָדָם",
    source: "משנה אבות ד:א"
  },
  [GameStage.Finale]: {
    text: "הִנֵּה מַה טּוֹב וּמַה נָּעִים שֶׁבֶת אַחִים גַּם יָחַד",
    source: "תהילים קלג:א"
  }
};

// שמות שלבים בעברית
export const STAGE_NAMES: Record<GameStage, string> = {
  [GameStage.Welcome]: "ברוכים הבאים",
  [GameStage.IceBreaker]: "שבירת קרח",
  [GameStage.WhoKnowsWho]: "מי מכיר את מי",
  [GameStage.TeamAssignment]: "חלוקה לצוותים",
  [GameStage.TeamBattle]: "קרב צוותים",
  [GameStage.TwoTruths]: "שתי אמיתות ושקר",
  [GameStage.TeamChallenge]: "אתגר הצוות",
  [GameStage.Gift]: "מתנות במילים",
  [GameStage.Reflection]: "רפלקציה",
  [GameStage.Finale]: "סיום"
};

// שאלות שבירת קרח
export const ICE_BREAKER_QUESTIONS: Question[] = [
  { id: 'ib1', text: "מה המאכל האהוב עליך?", type: 'text' },
  { id: 'ib2', text: "לאן הייתם טסים מחר בבוקר?", type: 'text' },
  { id: 'ib3', text: "איזה כוח-על היית בוחר?", type: 'choice', options: ['טלפורטציה', 'קריאת מחשבות', 'כוח-על', 'היעלמות', 'טיסה'] },
  { id: 'ib4', text: "מה השיר שמרים לך את מצב הרוח?", type: 'text' },
  { id: 'ib5', text: "קפה או תה?", type: 'choice', options: ['☕ קפה', '🍵 תה'] },
  { id: 'ib6', text: "מה התחביב שלך מחוץ לעבודה?", type: 'text' },
];

// שאלות מי מכיר את מי
export const WHO_KNOWS_QUESTIONS: string[] = [
  "מי הכי סביר שיארגן הפתעה למישהו?",
  "מי הכי סביר שיישאר עד הסוף לעזור לסדר?",
  "מי הכי סביר שיביא עוגה ליום הולדת?",
  "מי הכי סביר שיפתור בעיה בצורה יצירתית?",
  "מי הכי סביר שירים את מצב הרוח כשקשה?",
  "מי הכי סביר שיזכור את יום ההולדת של כולם?",
  "מי הכי סביר שיעזור בלי שיבקשו?",
  "מי הכי סביר שיאחר לפגישה? 😅",
  "מי הכי סביר שיתחיל לרקוד ראשון?",
  "מי הכי סביר שיזמין משהו מוזר במסעדה?"
];

// שאלות לקרב צוותים
export const BATTLE_QUESTIONS: BattleQuestion[] = [
  {
    question: "איזו חברה ישראלית המציאה את הדיסק-און-קי?",
    options: ["M-Systems", "Check Point", "Waze", "Mobileye"],
    correctIndex: 0
  },
  {
    question: "באיזו שנה הוקמה מדינת ישראל?",
    options: ["1947", "1948", "1949", "1950"],
    correctIndex: 1
  },
  {
    question: "כמה ימים יש בשנה מעוברת?",
    options: ["364", "365", "366", "367"],
    correctIndex: 2
  },
  {
    question: "מה הנהר הארוך בעולם?",
    options: ["אמזונס", "נילוס", "מיסיסיפי", "ינגצה"],
    correctIndex: 1
  },
  {
    question: "כמה שחקנים יש בקבוצת כדורגל?",
    options: ["9", "10", "11", "12"],
    correctIndex: 2
  },
  {
    question: "מהי בירת אוסטרליה?",
    options: ["סידני", "מלבורן", "קנברה", "פרת'"],
    correctIndex: 2
  }
];

// אתגרי צוות
export const TEAM_CHALLENGES: TeamChallenge[] = [
  { id: 'tc1', title: "מכנה משותף", name: "מכנה משותף", description: "מצאו 5 דברים משותפים לכל חברי הצוות", time: 120, timeLimit: 120, points: 20, emoji: "🔍" },
  { id: 'tc2', title: "פירמידה אנושית", name: "פירמידה אנושית", description: "צרו פירמידה אנושית וצלמו", time: 90, timeLimit: 90, points: 25, emoji: "🏛️" },
  { id: 'tc3', title: "סלוגן מנצח", name: "סלוגן מנצח", description: "המציאו סיסמה לחברה שלכם ב-3 מילים בלבד", time: 120, timeLimit: 120, points: 15, emoji: "📢" },
  { id: 'tc4', title: "פסל אנושי", name: "פסל אנושי", description: "צרו פסל אנושי שמייצג את המילה 'ביחד'", time: 60, timeLimit: 60, points: 20, emoji: "🗿" },
  { id: 'tc5', title: "סיפור שרשרת", name: "סיפור שרשרת", description: "ספרו סיפור - כל אחד מוסיף משפט אחד", time: 90, timeLimit: 90, points: 15, emoji: "📖" }
];

// הגדרות צוותים
export const TEAM_TEMPLATES: Team[] = [
  { id: 'blue', name: 'הכחולים 💙', color: 'text-blue-400', bgColor: 'bg-blue-500', score: 0 },
  { id: 'red', name: 'האדומים ❤️', color: 'text-red-400', bgColor: 'bg-red-500', score: 0 },
  { id: 'green', name: 'הירוקים 💚', color: 'text-emerald-400', bgColor: 'bg-emerald-500', score: 0 },
  { id: 'purple', name: 'הסגולים 💜', color: 'text-purple-400', bgColor: 'bg-purple-500', score: 0 },
];

// אימוג'ים לבחירה
export const EMOJI_OPTIONS = ['😊', '😎', '🤩', '🔥', '🚀', '🌈', '🙏', '💪', '🥳', '🙌', '✨', '🎯', '🦁', '🦅', '⚡', '🌟'];

// שאלות רפלקציה
export const REFLECTION_QUESTIONS = [
  "דבר אחד חדש שלמדתי על מישהו הערב...",
  "דבר אחד שהפתיע אותי...",
  "משהו שאני לוקח/ת מהערב הזה...",
  "מה הרגע הכי משמעותי עבורי?"
];
