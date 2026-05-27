/* ============================================================
   TooLongAgo — app logic
   - localStorage persistence (with migration)
   - Onboarding wizard
   - Tasks (one-time / recurring), severities, categories
   - Confirm + dismiss-duration dialogs
   - Category bulk actions, mute, dismissed tab
   - Rewarding completion animation
   - i18n (en + da), easy to extend
   - Browser notifications
   ============================================================ */

(() => {
  'use strict';

  /* ============================================================
     i18n
     ============================================================ */
  const I18N = {
    en: {
      name: "English", native: "English",
      // tabs
      "tab.active": "Active",
      "tab.upcoming": "Soon",
      "tab.dismissed": "Dismissed",
      "tab.percent": "%",
      "empty.percentTitle": "Nothing to track",
      "empty.percentBody": "When you have tasks running, they'll line up here by how close they are to their deadline.",
      "tab.all": "All",
      "tab.done": "Done",
      // empty
      "empty.title": "Nothing here yet",
      "empty.body": "Add your first reminder to get started.",
      "empty.cta": "Add a task",
      "empty.activeTitle": "All caught up",
      "empty.activeBody": "No warnings right now. Nice work.",
      "empty.upcomingTitle": "Nothing upcoming",
      "empty.upcomingBody": "Tasks that aren't due yet will live here.",
      "empty.dismissedTitle": "Nothing dismissed",
      "empty.dismissedBody": "Dismissed tasks appear here until they come back.",
      "empty.doneTitle": "Nothing done yet",
      "empty.doneBody": "Tick something off — it'll show up here.",
      // onboarding
      "onboard.welcomeSub": "Gentle nudges for the things you keep meaning to do.",
      "onboard.start": "Get started",
      "onboard.langTitle": "Choose your language",
      "onboard.langSub": "You can change this any time in Settings.",
      "onboard.catTitle": "Severity levels",
      "onboard.catSub": "When a task is overdue, these are how seriously we'll flag it. Tweak the names, colors, or thresholds, or use the defaults.",
      "onboard.notifTitle": "Enable notifications?",
      "onboard.notifSub": "We'll quietly let you know when something needs your attention. You can change this later.",
      "onboard.notifSkip": "Maybe later",
      "onboard.notifEnable": "Enable",
      "onboard.readyTitle": "You're all set",
      "onboard.readySub": "Add a few things you tend to forget. We'll keep an eye on the clock.",
      "onboard.finish": "Add my first task",
      // settings
      "settings.title": "Settings",
      "settings.language": "Language",
      "settings.severities": "Severity levels",
      "settings.severitiesHint": "Thresholds are relative to the task's interval. 100% = exactly due.",
      "settings.categories": "Categories",
      "settings.categoriesHint": "Group tasks like \"Health\" or \"Home\". Color and icon are optional.",
      "settings.notifications": "Notifications",
      "settings.notifEnable": "Enable browser notifications",
      "settings.theme": "Appearance",
      "settings.data": "Your data",
      "settings.export": "Export",
      "settings.import": "Import",
      "settings.reset": "Reset all",
      "theme.auto": "Auto",
      "theme.light": "Light",
      "theme.dark": "Dark",
      "footer.local": "Everything stays on your device",
      // task modal
      "task.new": "New task",
      "task.edit": "Edit task",
      "task.name": "What is it?",
      "task.remindAfter": "Remind me after",
      "task.scheduleType": "Schedule",
      "sched.interval": "Every X time",
      "sched.daily": "Daily",
      "sched.weekly": "Weekly on…",
      "sched.monthly": "Monthly on…",
      "sched.timeLabel": "Time of day",
      "sched.weeklyLabel": "Days & time",
      "sched.monthlyLabel": "Day of month & time",
      "dow.mon": "Mon",
      "dow.tue": "Tue",
      "dow.wed": "Wed",
      "dow.thu": "Thu",
      "dow.fri": "Fri",
      "dow.sat": "Sat",
      "dow.sun": "Sun",
      "task.recurring": "Recurring (repeats after I mark it done)",
      "task.category": "Category (optional)",
      "task.noCategory": "No category",
      "task.notes": "Notes (optional)",
      "task.delete": "Delete",
      // units
      "unit.minute": "minute(s)",
      "unit.hour": "hour(s)",
      "unit.day": "day(s)",
      "unit.week": "week(s)",
      "unit.month": "month(s)",
      "unit.year": "year(s)",
      // severities
      "severity.add": "+ Add level",
      "severity.reminder": "Reminder",
      "severity.warning": "Warning",
      "severity.critical": "Critical",
      // categories
      "category.add": "+ Add category",
      "category.unnamed": "Untitled category",
      "category.muted": "Muted",
      "category.mute": "Mute",
      "category.unmute": "Unmute",
      "category.bulkDoneAll": "Mark all done",
      "category.bulkDismissAll": "Dismiss all",
      "category.icon": "Icon",
      "category.color": "Color",
      "category.name": "Name",
      // status / labels
      "status.dueIn": "due in",
      "status.overdueBy": "overdue by",
      "status.dueNow": "due now",
      "status.dismissedFor": "dismissed for",
      "status.upcoming": "Upcoming",
      "status.oneTime": "one-time",
      "status.recurring": "recurring",
      "status.done": "Done",
      // actions
      "action.markDone": "Mark done",
      "action.dismiss": "Dismiss",
      "action.edit": "Edit",
      "action.undismiss": "Undismiss",
      "action.undo": "Undo",
      // filter
      "filter.title": "Filter by category",
      "filter.uncategorized": "Uncategorized",
      "filter.clear": "Clear filter",
      // history
      "tab.history": "History",
      "history.didIt": "Marked done",
      "history.dismissedIt": "Dismissed",
      "history.deletedTask": "(deleted task)",
      "empty.historyTitle": "No history yet",
      "empty.historyBody": "Each time you mark a task done or dismiss one, it'll show up here.",
      "time.today": "today",
      "time.yesterday": "yesterday",
      // task: per-task severity override
      "task.severityHeader": "Severity (override)",
      "task.useDefaultSeverity": "Use default severity levels",
      "task.customSeverity": "Custom severity for this task",
      "toast.undone": "Undone",
      // toasts
      "toast.created": "Task created",
      "toast.updated": "Task updated",
      "toast.deleted": "Task deleted",
      "toast.markedDone": "Marked done",
      "toast.dismissed": "Dismissed",
      "toast.undismissed": "Back in the list",
      "toast.imported": "Data imported",
      "toast.exported": "Exported",
      "toast.reset": "Everything reset",
      "toast.notifEnabled": "Notifications enabled",
      "toast.notifBlocked": "Notifications blocked in browser",
      "toast.bulkDone": "Marked {n} done",
      "toast.bulkDismiss": "Dismissed {n} tasks",
      "toast.muted": "Category muted",
      "toast.unmuted": "Category unmuted",
      // dialogs
      "confirm.ok": "Confirm",
      "confirm.undismissTitle": "Bring this back?",
      "confirm.undismissBody": "\"{name}\" will return to your active list.",
      "confirm.undismissOk": "Bring back",
      "confirm.undoTitle": "Undo this action?",
      "confirm.undoBody": "{action} for \"{name}\" will be reversed.",
      "confirm.undoOk": "Undo",
      "confirm.markDoneTitle": "Mark this done?",
      "confirm.markDoneBody": "We'll reset the timer for \"{name}\".",
      "confirm.markDoneOk": "Yes, done!",
      "markdone.title": "Mark done",
      "markdone.when": "When did you do this?",
      "markdone.now": "Just now",
      "markdone.ago": "Some time ago",
      "markdone.specific": "On a specific date & time",
      "markdone.agoSuffix": "ago",
      "markdone.confirm": "Done!",
      "unit.second": "second(s)",
      "confirm.deleteTitle": "Delete this task?",
      "confirm.deleteBody": "This can't be undone.",
      "confirm.deleteOk": "Delete",
      "confirm.resetTitle": "Reset everything?",
      "confirm.resetBody": "All your tasks, categories and settings will be deleted.",
      "confirm.resetOk": "Reset all",
      "confirm.bulkDoneTitle": "Mark all done?",
      "confirm.bulkDoneBody": "{n} task(s) in \"{cat}\" will be reset.",
      "confirm.bulkDismissTitle": "Dismiss all in \"{cat}\"?",
      "confirm.bulkDismissBody": "{n} task(s) will be dismissed for the chosen duration.",
      "dismiss.title": "Dismiss for how long?",
      "dismiss.body": "It'll come back when the time is up.",
      "dismiss.confirm": "Dismiss",
      "dismiss.untilDue": "Until next due time",
      "dismiss.1h": "1 hour",
      "dismiss.1d": "1 day",
      "dismiss.1w": "1 week",
      "dismiss.custom": "Custom…",
      "dismiss.customLabel": "Custom duration",
      // icon picker
      "icon.pick": "Pick an icon",
      "icon.none": "No icon",
      // misc
      "back": "Back",
      "next": "Next",
      "save": "Save",
      "cancel": "Cancel",
      // time relative
      "time.now": "now",
      "time.second": "second",
      "time.seconds": "seconds",
      "time.minute": "minute",
      "time.minutes": "minutes",
      "time.hour": "hour",
      "time.hours": "hours",
      "time.day": "day",
      "time.days": "days",
      "time.week": "week",
      "time.weeks": "weeks",
      "time.month": "month",
      "time.months": "months",
      "time.year": "year",
      "time.years": "years",
      // notif
      "notif.title": "TooLongAgo",
      "notif.bodyOne": "{name} is now {level}.",
      // celebrations — rotated through
      "celebrate.0": "Nice work!",
      "celebrate.1": "Done!",
      "celebrate.2": "Keep it up!",
      "celebrate.3": "One more in the bag.",
      "celebrate.4": "Look at you go.",
      "celebrate.5": "Tiny win, big deal.",
      "celebrate.6": "Future-you says thanks.",
      "celebrate.streak": "{n} in a row!",
    },
    da: {
      name: "Danish", native: "Dansk",
      "tab.active": "Aktive",
      "tab.upcoming": "Snart",
      "tab.dismissed": "Udskudte",
      "tab.percent": "%",
      "empty.percentTitle": "Intet at følge",
      "empty.percentBody": "Når du har kørende opgaver, vises de her sorteret efter hvor tæt de er på deres frist.",
      "tab.all": "Alle",
      "tab.done": "Færdige",
      "empty.title": "Intet her endnu",
      "empty.body": "Tilføj din første påmindelse for at komme i gang.",
      "empty.cta": "Tilføj en opgave",
      "empty.activeTitle": "Du er ajour",
      "empty.activeBody": "Ingen advarsler lige nu. Godt gået.",
      "empty.upcomingTitle": "Ingen kommende",
      "empty.upcomingBody": "Opgaver, der endnu ikke er forfaldne, vises her.",
      "empty.dismissedTitle": "Intet udskudt",
      "empty.dismissedBody": "Udskudte opgaver vises her, indtil de vender tilbage.",
      "empty.doneTitle": "Intet er færdigt endnu",
      "empty.doneBody": "Marker noget som færdigt — så vises det her.",
      "onboard.welcomeSub": "Venlige skub til de ting, du bliver ved med at glemme.",
      "onboard.start": "Kom i gang",
      "onboard.langTitle": "Vælg sprog",
      "onboard.langSub": "Du kan altid ændre det i indstillinger.",
      "onboard.catTitle": "Alvorsniveauer",
      "onboard.catSub": "Når en opgave er forsinket, er det sådan, vi flagger den. Tilpas navne, farver og grænser — eller behold standarderne.",
      "onboard.notifTitle": "Aktiver notifikationer?",
      "onboard.notifSub": "Vi giver dig diskret besked, når noget kræver din opmærksomhed. Du kan ændre det senere.",
      "onboard.notifSkip": "Måske senere",
      "onboard.notifEnable": "Aktiver",
      "onboard.readyTitle": "Du er klar",
      "onboard.readySub": "Tilføj et par ting, du plejer at glemme. Vi holder øje med uret.",
      "onboard.finish": "Tilføj min første opgave",
      "settings.title": "Indstillinger",
      "settings.language": "Sprog",
      "settings.severities": "Alvorsniveauer",
      "settings.severitiesHint": "Grænserne er i forhold til opgavens interval. 100 % = præcis forfalden.",
      "settings.categories": "Kategorier",
      "settings.categoriesHint": "Grupper opgaver som \"Sundhed\" eller \"Hjem\". Farve og ikon er valgfrie.",
      "settings.notifications": "Notifikationer",
      "settings.notifEnable": "Slå browser-notifikationer til",
      "settings.theme": "Udseende",
      "settings.data": "Dine data",
      "settings.export": "Eksporter",
      "settings.import": "Importer",
      "settings.reset": "Nulstil alt",
      "theme.auto": "Auto",
      "theme.light": "Lys",
      "theme.dark": "Mørk",
      "footer.local": "Alt bliver på din enhed",
      "task.new": "Ny opgave",
      "task.edit": "Rediger opgave",
      "task.name": "Hvad drejer det sig om?",
      "task.remindAfter": "Mind mig om det efter",
      "task.scheduleType": "Tidsplan",
      "sched.interval": "Hver X tid",
      "sched.daily": "Dagligt",
      "sched.weekly": "Ugentligt på…",
      "sched.monthly": "Månedligt på…",
      "sched.timeLabel": "Tidspunkt",
      "sched.weeklyLabel": "Dage & tid",
      "sched.monthlyLabel": "Dag i måneden & tid",
      "dow.mon": "Man",
      "dow.tue": "Tir",
      "dow.wed": "Ons",
      "dow.thu": "Tor",
      "dow.fri": "Fre",
      "dow.sat": "Lør",
      "dow.sun": "Søn",
      "task.recurring": "Gentages (starter forfra når jeg markerer som færdig)",
      "task.category": "Kategori (valgfri)",
      "task.noCategory": "Ingen kategori",
      "task.notes": "Noter (valgfrit)",
      "task.delete": "Slet",
      "unit.minute": "minut(ter)",
      "unit.hour": "time(r)",
      "unit.day": "dag(e)",
      "unit.week": "uge(r)",
      "unit.month": "måned(er)",
      "unit.year": "år",
      "severity.add": "+ Tilføj niveau",
      "severity.reminder": "Påmindelse",
      "severity.warning": "Advarsel",
      "severity.critical": "Kritisk",
      "category.add": "+ Tilføj kategori",
      "category.unnamed": "Unavngivet kategori",
      "category.muted": "Lyd slået fra",
      "category.mute": "Slå lyd fra",
      "category.unmute": "Slå lyd til",
      "category.bulkDoneAll": "Marker alle færdige",
      "category.bulkDismissAll": "Udskyd alle",
      "category.icon": "Ikon",
      "category.color": "Farve",
      "category.name": "Navn",
      "status.dueIn": "forfalden om",
      "status.overdueBy": "forsinket med",
      "status.dueNow": "forfalden nu",
      "status.dismissedFor": "udskudt i",
      "status.upcoming": "Kommende",
      "status.oneTime": "engangs",
      "status.recurring": "gentagende",
      "status.done": "Færdig",
      "action.markDone": "Marker færdig",
      "action.dismiss": "Udskyd",
      "action.edit": "Rediger",
      "action.undismiss": "Fortryd udskydning",
      "action.undo": "Fortryd",
      "filter.title": "Filtrer efter kategori",
      "filter.uncategorized": "Uden kategori",
      "filter.clear": "Ryd filter",
      "tab.history": "Historik",
      "history.didIt": "Markeret færdig",
      "history.dismissedIt": "Udskudt",
      "history.deletedTask": "(slettet opgave)",
      "empty.historyTitle": "Ingen historik endnu",
      "empty.historyBody": "Hver gang du markerer en opgave færdig eller udskyder en, vises den her.",
      "time.today": "i dag",
      "time.yesterday": "i går",
      "task.severityHeader": "Alvorsniveauer (tilsidesæt)",
      "task.useDefaultSeverity": "Brug standard alvorsniveauer",
      "task.customSeverity": "Brugerdefinerede alvorsniveauer for denne opgave",
      "toast.undone": "Fortrudt",
      "toast.created": "Opgave oprettet",
      "toast.updated": "Opgave opdateret",
      "toast.deleted": "Opgave slettet",
      "toast.markedDone": "Markeret færdig",
      "toast.dismissed": "Udskudt",
      "toast.undismissed": "Tilbage på listen",
      "toast.imported": "Data importeret",
      "toast.exported": "Eksporteret",
      "toast.reset": "Alt nulstillet",
      "toast.notifEnabled": "Notifikationer aktiveret",
      "toast.notifBlocked": "Notifikationer blokeret i browseren",
      "toast.bulkDone": "{n} markeret færdige",
      "toast.bulkDismiss": "{n} opgaver udskudt",
      "toast.muted": "Kategori dæmpet",
      "toast.unmuted": "Kategori aktiv igen",
      "confirm.ok": "Bekræft",
      "confirm.undismissTitle": "Hent tilbage?",
      "confirm.undismissBody": "\"{name}\" vender tilbage til din aktive liste.",
      "confirm.undismissOk": "Hent tilbage",
      "confirm.undoTitle": "Fortryd denne handling?",
      "confirm.undoBody": "{action} for \"{name}\" bliver fortrudt.",
      "confirm.undoOk": "Fortryd",
      "confirm.markDoneTitle": "Marker som færdig?",
      "confirm.markDoneBody": "Vi nulstiller uret for \"{name}\".",
      "confirm.markDoneOk": "Ja, færdig!",
      "markdone.title": "Marker færdig",
      "markdone.when": "Hvornår gjorde du det?",
      "markdone.now": "Lige nu",
      "markdone.ago": "For noget tid siden",
      "markdone.specific": "På et bestemt tidspunkt",
      "markdone.agoSuffix": "siden",
      "markdone.confirm": "Færdig!",
      "unit.second": "sekund(er)",
      "confirm.deleteTitle": "Slet denne opgave?",
      "confirm.deleteBody": "Dette kan ikke fortrydes.",
      "confirm.deleteOk": "Slet",
      "confirm.resetTitle": "Nulstil alt?",
      "confirm.resetBody": "Alle dine opgaver, kategorier og indstillinger slettes.",
      "confirm.resetOk": "Nulstil alt",
      "confirm.bulkDoneTitle": "Marker alle færdige?",
      "confirm.bulkDoneBody": "{n} opgave(r) i \"{cat}\" nulstilles.",
      "confirm.bulkDismissTitle": "Udskyd alle i \"{cat}\"?",
      "confirm.bulkDismissBody": "{n} opgave(r) udskydes i den valgte varighed.",
      "dismiss.title": "Udskyd hvor længe?",
      "dismiss.body": "Den vender tilbage, når tiden er gået.",
      "dismiss.confirm": "Udskyd",
      "dismiss.untilDue": "Indtil næste forfald",
      "dismiss.1h": "1 time",
      "dismiss.1d": "1 dag",
      "dismiss.1w": "1 uge",
      "dismiss.custom": "Brugerdefineret…",
      "dismiss.customLabel": "Varighed",
      "icon.pick": "Vælg et ikon",
      "icon.none": "Intet ikon",
      "back": "Tilbage",
      "next": "Videre",
      "save": "Gem",
      "cancel": "Annuller",
      "time.now": "nu",
      "time.second": "sekund",
      "time.seconds": "sekunder",
      "time.minute": "minut",
      "time.minutes": "minutter",
      "time.hour": "time",
      "time.hours": "timer",
      "time.day": "dag",
      "time.days": "dage",
      "time.week": "uge",
      "time.weeks": "uger",
      "time.month": "måned",
      "time.months": "måneder",
      "time.year": "år",
      "time.years": "år",
      "notif.title": "TooLongAgo",
      "notif.bodyOne": "{name} er nu {level}.",
      "celebrate.0": "Godt gået!",
      "celebrate.1": "Færdig!",
      "celebrate.2": "Bliv ved!",
      "celebrate.3": "Endnu en i kassen.",
      "celebrate.4": "Se lige dig.",
      "celebrate.5": "Lille sejr, stor sag.",
      "celebrate.6": "Fremtidige-dig siger tak.",
      "celebrate.streak": "{n} i træk!",
    },
  };

  const t = (key, vars) => {
    const dict = I18N[state.settings.lang] || I18N.en;
    let s = dict[key] || I18N.en[key] || key;
    if (vars) for (const k in vars) s = s.replace(new RegExp(`\\{${k}\\}`, "g"), vars[k]);
    return s;
  };

  /* ============================================================
     Constants
     ============================================================ */
  const STORAGE_KEY = "toolongago.v1";

  const UNIT_MS = {
    second: 1000,
    minute: 60 * 1000,
    hour:   60 * 60 * 1000,
    day:    24 * 60 * 60 * 1000,
    week:   7 * 24 * 60 * 60 * 1000,
    month:  30 * 24 * 60 * 60 * 1000,
    year:   365 * 24 * 60 * 60 * 1000,
  };

  const DEFAULT_SEVERITIES = () => ([
    { id: cryptoId(), key: "reminder", labelKey: "severity.reminder", color: "#3FB48A", threshold: 80  },
    { id: cryptoId(), key: "warning",  labelKey: "severity.warning",  color: "#F2A93B", threshold: 100 },
    { id: cryptoId(), key: "critical", labelKey: "severity.critical", color: "#E5484D", threshold: 150 },
  ]);

  const ICON_SET = [
    // Health & body
    "💊","💉","🩺","🩹","🩸","🦷","🪥","❤️","🫀","🧠","🦴","🧬","👁️","👂","🦻","🦶","🩻",
    // Self-care & beauty
    "🧴","🧼","🛀","🧖","💆","💇","💅","✂️","🪞",
    // Mind & relax
    "🧘","🕯️","☯️","🌸","🍃","🌿","🪷",
    // Exercise & sport
    "🏃","🚶","🚴","🏊","🏋️","💪","🤸","🧗","🤾","⛹️","🥊","🥋","🤺","🚵","🤽","🏌️","⛳",
    "⚽","🏀","🏈","⚾","🎾","🏐","🏉","🥏","🏓","🏸","🥅","🎳","🛼","🛹","⛸️","🥌",
    // Food
    "🍎","🍌","🍇","🍊","🍓","🍒","🫐","🥝","🍑","🥭","🍉","🍍","🥥","🥑",
    "🥗","🥦","🥕","🥬","🌽","🍅","🍄","🫑","🧅","🧄","🥔","🍠","🌶️",
    "🍞","🥖","🥐","🥯","🧀","🥚","🥞","🧇","🥓","🍖","🍗","🥩","🌭","🍔","🍟","🍕","🥪","🌮","🌯","🥙","🍱","🍣","🍤","🍜","🍝","🍲","🥘","🍛",
    "🍰","🎂","🧁","🍩","🍪","🍫","🍬","🍭","🍮","🍯",
    // Drink
    "💧","☕","🍵","🥤","🧃","🥛","🍶","🍷","🍺","🍻","🍸","🍹","🥂","🍾","🧉",
    // Home / chores
    "🏠","🛏️","🛋️","🪑","🚪","🪟","🪜","🛒","🧹","🧺","🧽","🧯","💡","🔌","🚿","🛁","🚽","🧻","🪴","🌱","🌷","💐","🪥","🧴",
    // Repair / mechanic / tools
    "🛠️","🔧","🔨","🪛","🪚","🔩","⚙️","🧰","🧲","⛓️","🪤","🪓",
    // Vehicles & travel
    "🚗","🚙","🚕","🚌","🚎","🚐","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛹","✈️","🛫","🛬","🚀","🚁","⛵","🚤","🚢","🚆","🚇","🚞","⛽","🛞","🛣️",
    // Work / productivity
    "💼","📚","📖","✏️","🖋️","🖊️","📝","📋","📑","📌","📎","📊","📈","📉","💻","⌨️","🖱️","🖨️","🖥️","📱","☎️","📞","📠","📧","✉️","📨","📤","📥","📬","📮","💰","💳","🧾","💸","🪙",
    // Hobbies & arts
    "🎵","🎶","🎸","🎹","🎻","🎺","🎷","🥁","🪕","🎤","🎧","🎬","🎨","🖼️","🎭","🎲","🧩","♟️","📸","📷","📹","🎥","🪡","🧵","🧶","🪢",
    // Outdoor & nature
    "🌳","🌲","🌴","🌵","🌾","🌻","🌼","🌹","🌺","🍀","☘️","🌿","🍂","🍁","🌍","🌊","⛰️","🏔️","🗻","⛺","🏖️","🏕️","🧭","🔭","🔬",
    // Animals / pets
    "🐶","🐕","🐈","🐈‍⬛","🐹","🐰","🐢","🐦","🐣","🐠","🐟","🐝","🦋","🐾","🐎","🐄","🐑","🐓",
    // Family & social
    "👨‍👩‍👧","👨‍👩‍👦","👪","🧑","👶","🧒","👧","👦","🧑‍🤝‍🧑","👵","👴","🤝","💌","🎁","🎉","🎂","🎈","🎊","🥳","🍰","🎀",
    // Events / dates / time
    "📅","🗓️","⏰","⏳","🕐","📆","🎟️","🏷️",
    // Letters & symbols
    "📨","💌","✉️","📜","📰",
    // Weather & sky
    "☀️","🌤️","⛅","🌧️","⛈️","🌩️","❄️","☃️","🌙","⭐","✨","🔥","⚡","🌈","💫","🌟",
    // Misc utility
    "🎯","✅","📍","🔑","🗝️","🔒","🔓","🔔","🔕","💡","🧠","🤔","💭","💬","🗨️",
  ];

  /* ============================================================
     Helpers
     ============================================================ */
  function cryptoId() {
    if (window.crypto?.randomUUID) return crypto.randomUUID();
    return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  function intervalMs(t) { return (t.amount || 0) * (UNIT_MS[t.unit] || UNIT_MS.day); }

  // Returns the next-due timestamp for a task, supporting interval and calendar schedules.
  function dueAt(task) {
    const type = task.scheduleType || "interval";
    const base = task.lastDoneAt || task.createdAt;
    if (type === "interval") {
      return base + intervalMs(task);
    }
    const [hh, mm] = (task.scheduleTime || "09:00").split(":").map(Number);
    if (type === "daily") {
      const d = new Date(base);
      d.setHours(hh, mm, 0, 0);
      if (d.getTime() <= base) d.setDate(d.getDate() + 1);
      return d.getTime();
    }
    if (type === "weekly") {
      const days = (task.scheduleDays && task.scheduleDays.length) ? task.scheduleDays : [1, 2, 3, 4, 5, 6, 0];
      const d = new Date(base);
      d.setHours(hh, mm, 0, 0);
      // Walk forward day by day; advance at least once if base already passed today's time
      if (d.getTime() <= base) d.setDate(d.getDate() + 1);
      else if (!days.includes(d.getDay())) d.setDate(d.getDate() + 1);
      for (let i = 0; i < 8; i++) {
        if (days.includes(d.getDay()) && d.getTime() > base) return d.getTime();
        d.setDate(d.getDate() + 1);
      }
      return d.getTime();
    }
    if (type === "monthly") {
      const day = Math.max(1, Math.min(31, task.scheduleDay || 1));
      const d = new Date(base);
      d.setHours(hh, mm, 0, 0);
      d.setDate(day);
      while (d.getTime() <= base) {
        d.setMonth(d.getMonth() + 1);
        d.setDate(day);
      }
      return d.getTime();
    }
    return base + intervalMs(task);
  }

  function elapsedPct(task, now) {
    const base = task.lastDoneAt || task.createdAt;
    const due = dueAt(task);
    const span = due - base;
    if (span <= 0) return 0;
    return ((now - base) / span) * 100;
  }
  function activeSeverity(pct, severities) {
    const sorted = [...severities].sort((a, b) => a.threshold - b.threshold);
    let active = null;
    for (const s of sorted) if (pct >= s.threshold) active = s;
    return active;
  }
  function maxThreshold(severities) {
    return severities.reduce((m, c) => Math.max(m, c.threshold), 100);
  }
  function fmtHuman(ms) {
    const abs = Math.abs(ms);
    const units = [
      ["year",   UNIT_MS.year],
      ["month",  UNIT_MS.month],
      ["week",   UNIT_MS.week],
      ["day",    UNIT_MS.day],
      ["hour",   UNIT_MS.hour],
      ["minute", UNIT_MS.minute],
    ];
    for (const [name, ms1] of units) {
      if (abs >= ms1) {
        const n = Math.round(abs / ms1);
        return `${n} ${t("time." + (n === 1 ? name : name + "s"))}`;
      }
    }
    return t("time.now");
  }
  function el(tag, attrs = {}, ...children) {
    const n = document.createElement(tag);
    for (const k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k.startsWith("on") && typeof attrs[k] === "function") n.addEventListener(k.slice(2), attrs[k]);
      else if (k === "style" && typeof attrs[k] === "object") Object.assign(n.style, attrs[k]);
      else if (attrs[k] === true) n.setAttribute(k, "");
      else if (attrs[k] !== false && attrs[k] != null) n.setAttribute(k, attrs[k]);
    }
    for (const c of children) {
      if (c == null || c === false) continue;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return n;
  }
  function $(sel, root = document) { return root.querySelector(sel); }
  function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  /* ============================================================
     State + migration
     ============================================================ */
  const defaultState = () => ({
    onboardingDone: false,
    settings: {
      lang: (navigator.language || "en").toLowerCase().startsWith("da") ? "da" : "en",
      theme: "auto",
      notifications: false,
    },
    severities: DEFAULT_SEVERITIES(),
    categories: [],   // user-defined: { id, name, color?, icon?, muted }
    tasks: [],        // tasks may have optional .severities (override) and .categoryId
    activeTab: "active",
    filter: { categoryIds: [] },   // empty = no filter
    history: [],                   // [{id, taskId, type:'done'|'dismiss', at, prev:{lastDoneAt,dismissedUntil,done}}]
    collapsedCats: [],             // category ids collapsed in the All tab; "__none__" for uncategorized
    stats: { totalDone: 0 },
  });

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn("Failed to load state:", e);
      return null;
    }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { console.warn("Save failed:", e); }
  }

  // Single helper to call after any state mutation: persists, re-renders the main view,
  // and re-renders any auxiliary panels that may be open.
  function commit() {
    save();
    if (!app.hidden) render();
    if (!settingsDrawer.hidden) {
      renderSeverityEditor($("#settingsSeverities"));
      renderCategoryEditor($("#settingsCategories"));
    }
    const fp = $("#filterPanel");
    if (fp && !fp.hidden) renderFilterPanel();
    updateFilterBadge();
    renderTaskCategoryOptions();
  }

  let state = load() || defaultState();

  /* ============================================================
     Translate the static DOM
     ============================================================ */
  function applyI18n() {
    $$("[data-i18n]").forEach(n => {
      const key = n.getAttribute("data-i18n");
      n.textContent = t(key);
    });
    document.documentElement.lang = state.settings.lang;
  }

  /* ============================================================
     Theme
     ============================================================ */
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.settings.theme);
  }

  /* ============================================================
     ONBOARDING
     ============================================================ */
  const onboarding = $("#onboarding");
  const app = $("#app");

  let currentStep = 1;
  const STEP_COUNT = 5;

  function renderDots() {
    const dots = $("#onboardDots");
    dots.innerHTML = "";
    for (let i = 1; i <= STEP_COUNT; i++) {
      dots.appendChild(el("div", { class: "dot" + (i === currentStep ? " is-active" : "") }));
    }
  }
  function showStep(n) {
    currentStep = Math.max(1, Math.min(STEP_COUNT, n));
    $$(".step", onboarding).forEach(s => s.classList.toggle("is-active", +s.dataset.step === currentStep));
    renderDots();
  }
  function bindOnboarding() {
    $$("[data-next]", onboarding).forEach(b => b.onclick = () => showStep(currentStep + 1));
    $$("[data-prev]", onboarding).forEach(b => b.onclick = () => showStep(currentStep - 1));

    renderLangPicker($("#onboardLang"));
    renderSeverityEditor($("#onboardSeverities"));
    $("#onboardAddSeverity").onclick = () => {
      state.severities.push({ id: cryptoId(), key: "custom", labelKey: null, label: "Custom", color: "#9B8CFF", threshold: 120 });
      save();
      renderSeverityEditor($("#onboardSeverities"));
    };

    $("#onboardEnableNotif").onclick = async () => {
      await enableNotifications();
      showStep(currentStep + 1);
    };

    $("#finishOnboarding").onclick = () => {
      state.onboardingDone = true;
      save();
      onboarding.hidden = true;
      app.hidden = false;
      render();
      openTaskModal();
    };
  }

  /* ============================================================
     LANGUAGE PICKER
     ============================================================ */
  function renderLangPicker(container) {
    if (!container) return;
    container.innerHTML = "";
    Object.keys(I18N).forEach(code => {
      const meta = I18N[code];
      const btn = el("button", {
        class: "lang" + (state.settings.lang === code ? " is-active" : ""),
        type: "button",
        onclick: () => {
          state.settings.lang = code;
          save();
          applyI18n();
          renderLangPicker($("#onboardLang"));
          renderLangPicker($("#settingsLang"));
          renderSeverityEditor($("#onboardSeverities"));
          renderSeverityEditor($("#settingsSeverities"));
          renderCategoryEditor($("#settingsCategories"));
          render();
        }
      },
        el("strong", {}, meta.native),
        el("small", {}, meta.name)
      );
      container.appendChild(btn);
    });
  }

  /* ============================================================
     SEVERITY EDITOR
     ============================================================ */
  function severityLabel(sev) {
    if (sev.labelKey) return t(sev.labelKey);
    return sev.label || "Custom";
  }
  function renderSeverityEditor(container) {
    if (!container) return;
    container.innerHTML = "";
    const sorted = [...state.severities].sort((a, b) => a.threshold - b.threshold);

    sorted.forEach(sev => {
      const row = el("div", { class: "cat-row" });

      const color = el("input", { type: "color", value: sev.color });
      color.oninput = (e) => { sev.color = e.target.value; save(); render(); };
      row.appendChild(color);

      const label = el("input", { type: "text", value: severityLabel(sev), maxlength: 24 });
      label.oninput = (e) => {
        sev.label = e.target.value;
        sev.labelKey = null;
        save();
        render();
      };
      row.appendChild(label);

      const pctWrap = el("div", { class: "pct-wrap" });
      const num = el("input", { type: "number", min: 1, max: 1000, step: 1, value: sev.threshold });
      num.oninput = (e) => {
        const v = parseInt(e.target.value, 10);
        if (!isNaN(v) && v > 0) { sev.threshold = v; save(); render(); }
      };
      pctWrap.appendChild(num);
      pctWrap.appendChild(el("span", {}, "%"));
      row.appendChild(pctWrap);

      const del = el("button", { class: "del", type: "button", title: "Delete", "aria-label": "Delete", html: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 7h12l-1 13H7L6 7Zm3-3h6v2H9V4Z"/></svg>' });
      del.onclick = () => {
        if (state.severities.length <= 1) return;
        state.severities = state.severities.filter(c => c.id !== sev.id);
        save();
        renderSeverityEditor(container);
        render();
      };
      row.appendChild(del);

      container.appendChild(row);
    });
  }

  /* ============================================================
     CATEGORY EDITOR  (user-defined task categories)
     ============================================================ */
  function categoryName(cat) {
    return (cat.name && cat.name.trim()) || t("category.unnamed");
  }
  function renderCategoryEditor(container) {
    if (!container) return;
    container.innerHTML = "";

    state.categories.forEach(cat => {
      const card = el("div", { class: "category-card" + (cat.muted ? " is-muted" : "") });

      // Header row: icon + name + color + delete
      const head = el("div", { class: "category-head" });

      const iconBtn = el("button", {
        class: "icon-pick-btn",
        type: "button",
        title: t("category.icon"),
        "aria-label": t("category.icon"),
      }, cat.icon || "＋");
      if (cat.color) iconBtn.style.background = cat.color + "22";
      iconBtn.onclick = () => openIconPicker(icon => {
        cat.icon = icon || null;
        save();
        renderCategoryEditor(container);
        render();
      }, cat.icon);
      head.appendChild(iconBtn);

      const nameInput = el("input", {
        type: "text",
        value: cat.name || "",
        placeholder: t("category.name"),
        maxlength: 32,
      });
      nameInput.oninput = (e) => {
        cat.name = e.target.value;
        save();
        render();
        renderTaskCategoryOptions(); // keep modal in sync
      };
      head.appendChild(nameInput);

      const color = el("input", { type: "color", value: cat.color || "#9B8CFF", title: t("category.color") });
      color.oninput = (e) => { cat.color = e.target.value; save(); renderCategoryEditor(container); render(); };
      head.appendChild(color);

      const del = el("button", { class: "del", type: "button", title: "Delete", "aria-label": "Delete", html: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 7h12l-1 13H7L6 7Zm3-3h6v2H9V4Z"/></svg>' });
      del.onclick = () => {
        // Unassign from tasks
        state.tasks.forEach(tk => { if (tk.categoryId === cat.id) tk.categoryId = null; });
        state.categories = state.categories.filter(c => c.id !== cat.id);
        save();
        renderCategoryEditor(container);
        renderTaskCategoryOptions();
        render();
      };
      head.appendChild(del);

      card.appendChild(head);

      // Action row
      const actions = el("div", { class: "category-actions" });

      const muteBtn = el("button", {
        class: "btn btn-ghost btn-sm",
        type: "button",
        onclick: () => {
          cat.muted = !cat.muted;
          save();
          renderCategoryEditor(container);
          render();
          toast(t(cat.muted ? "toast.muted" : "toast.unmuted"));
        },
      }, cat.muted ? t("category.unmute") : t("category.mute"));
      actions.appendChild(muteBtn);

      const doneAll = el("button", {
        class: "btn btn-ghost btn-sm",
        type: "button",
        onclick: () => bulkMarkDoneForCategory(cat),
      }, t("category.bulkDoneAll"));
      actions.appendChild(doneAll);

      const dismissAll = el("button", {
        class: "btn btn-ghost btn-sm",
        type: "button",
        onclick: () => bulkDismissForCategory(cat),
      }, t("category.bulkDismissAll"));
      actions.appendChild(dismissAll);

      const count = state.tasks.filter(tk => tk.categoryId === cat.id && !(tk.done && !tk.recurring)).length;
      actions.appendChild(el("span", { class: "category-count muted small" }, `${count}`));

      card.appendChild(actions);
      container.appendChild(card);
    });
  }

  /* ============================================================
     SETTINGS DRAWER
     ============================================================ */
  const settingsDrawer = $("#settings");
  function openSettings() {
    settingsDrawer.hidden = false;
    settingsDrawer.setAttribute("aria-hidden", "false");
    renderLangPicker($("#settingsLang"));
    renderSeverityEditor($("#settingsSeverities"));
    renderCategoryEditor($("#settingsCategories"));
    const notifToggle = $("#notifToggle");
    notifToggle.checked = state.settings.notifications && Notification?.permission === "granted";
    refreshNotifStatus();
    $$("#themeSeg button").forEach(b => b.classList.toggle("is-active", b.dataset.theme === state.settings.theme));
  }
  function closeSettings() {
    settingsDrawer.hidden = true;
    settingsDrawer.setAttribute("aria-hidden", "true");
  }
  function bindSettings() {
    $("#menuBtn").onclick = openSettings;
    $$("[data-close-drawer]", settingsDrawer).forEach(b => b.onclick = closeSettings);

    $("#settingsAddSeverity").onclick = () => {
      state.severities.push({ id: cryptoId(), key: "custom", labelKey: null, label: "Custom", color: "#9B8CFF", threshold: 120 });
      save();
      renderSeverityEditor($("#settingsSeverities"));
      render();
    };

    $("#settingsAddCategory").onclick = () => {
      state.categories.push({ id: cryptoId(), name: "", color: null, icon: null, muted: false });
      save();
      renderCategoryEditor($("#settingsCategories"));
      renderTaskCategoryOptions();
      render();
    };

    $("#notifToggle").addEventListener("change", async (e) => {
      if (e.target.checked) {
        const ok = await enableNotifications();
        if (!ok) e.target.checked = false;
      } else {
        state.settings.notifications = false;
        save();
        refreshNotifStatus();
      }
    });

    $$("#themeSeg button").forEach(b => {
      b.onclick = () => {
        state.settings.theme = b.dataset.theme;
        save();
        applyTheme();
        $$("#themeSeg button").forEach(x => x.classList.toggle("is-active", x === b));
      };
    });

    $("#exportBtn").onclick = exportData;
    $("#importBtn").onclick = () => $("#importFile").click();
    $("#importFile").onchange = importData;
    $("#resetBtn").onclick = async () => {
      const ok = await confirmDialog({
        title: t("confirm.resetTitle"),
        body: t("confirm.resetBody"),
        confirmText: t("confirm.resetOk"),
        danger: true,
      });
      if (ok) {
        localStorage.removeItem(STORAGE_KEY);
        state = defaultState();
        save();
        applyTheme();
        applyI18n();
        closeSettings();
        startup();
        toast(t("toast.reset"));
      }
    };
  }

  function refreshNotifStatus() {
    const elS = $("#notifStatus");
    if (!("Notification" in window)) {
      elS.textContent = "Notifications not supported in this browser.";
      $("#notifToggle").disabled = true;
      return;
    }
    const p = Notification.permission;
    if (p === "granted") elS.textContent = state.settings.notifications ? "" : "Permission granted. Toggle on to enable.";
    else if (p === "denied") elS.textContent = "Blocked in browser settings.";
    else elS.textContent = "We'll ask the browser for permission.";
  }

  /* ============================================================
     NOTIFICATIONS
     ============================================================ */
  async function enableNotifications() {
    if (!("Notification" in window)) return false;
    try {
      const res = await Notification.requestPermission();
      if (res === "granted") {
        state.settings.notifications = true;
        save();
        refreshNotifStatus();
        toast(t("toast.notifEnabled"));
        return true;
      } else {
        toast(t("toast.notifBlocked"));
        refreshNotifStatus();
        return false;
      }
    } catch (e) {
      console.warn(e);
      return false;
    }
  }
  function maybeNotify(task, sev) {
    if (!state.settings.notifications) return;
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    // Respect category mute
    const cat = task.categoryId ? state.categories.find(c => c.id === task.categoryId) : null;
    if (cat && cat.muted) return;
    if (task.lastNotifiedSev === sev.id) return;
    const title = t("notif.title");
    const opts = {
      body: t("notif.bodyOne", { name: task.name, level: severityLabel(sev) }),
      icon: "favicon.svg",
      badge: "favicon.svg",
      tag: task.id + ":" + sev.id,
      renotify: false,
    };
    // Mobile Chrome only supports notifications via ServiceWorkerRegistration.showNotification.
    // Use SW path when available; fall back to legacy Notification constructor on desktop.
    const showViaSW = () => swReg && swReg.showNotification(title, opts);
    const showLegacy = () => { try { new Notification(title, opts); } catch (_) {} };
    if (swReg) {
      showViaSW().catch(showLegacy);
    } else if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(reg => {
        swReg = reg;
        reg.showNotification(title, opts).catch(showLegacy);
      }).catch(showLegacy);
    } else {
      showLegacy();
    }
    task.lastNotifiedSev = sev.id;
    save();
  }

  /* ============================================================
     EXPORT / IMPORT
     ============================================================ */
  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "toolongago-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast(t("toast.exported"));
  }
  function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const parsed = JSON.parse(r.result);
        if (!parsed || typeof parsed !== "object") throw new Error("bad");
        state = Object.assign(defaultState(), parsed);
        save();
        applyTheme();
        applyI18n();
        render();
        toast(t("toast.imported"));
      } catch (err) {
        alert("Could not import file.");
      }
    };
    r.readAsText(file);
    e.target.value = "";
  }

  /* ============================================================
     TASK MODAL
     ============================================================ */
  const modal = $("#taskModal");
  let editingTaskId = null;

  function renderTaskCategoryOptions() {
    const sel = $("#taskCategory");
    if (!sel) return;
    const current = sel.value;
    sel.innerHTML = "";
    sel.appendChild(el("option", { value: "" }, t("task.noCategory")));
    state.categories.forEach(cat => {
      const label = (cat.icon ? cat.icon + " " : "") + categoryName(cat);
      sel.appendChild(el("option", { value: cat.id }, label));
    });
    sel.value = current;
  }

  // Per-task severity override (modal-local edit buffer)
  let taskSeverityBuf = null; // null = use defaults; array = custom

  function renderTaskSeverityEditor() {
    const wrap = $("#taskSeverityEditor");
    if (!wrap) return;
    wrap.innerHTML = "";
    if (!taskSeverityBuf) { wrap.hidden = true; return; }
    wrap.hidden = false;
    const sorted = [...taskSeverityBuf].sort((a, b) => a.threshold - b.threshold);
    sorted.forEach(sev => {
      const row = el("div", { class: "cat-row" });
      const color = el("input", { type: "color", value: sev.color });
      color.oninput = (e) => { sev.color = e.target.value; };
      row.appendChild(color);
      const label = el("input", { type: "text", value: severityLabel(sev), maxlength: 24 });
      label.oninput = (e) => { sev.label = e.target.value; sev.labelKey = null; };
      row.appendChild(label);
      const pctWrap = el("div", { class: "pct-wrap" });
      const num = el("input", { type: "number", min: 1, max: 1000, step: 1, value: sev.threshold });
      num.oninput = (e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v > 0) sev.threshold = v; };
      pctWrap.appendChild(num);
      pctWrap.appendChild(el("span", {}, "%"));
      row.appendChild(pctWrap);
      const del = el("button", { class: "del", type: "button", "aria-label": "Delete", html: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 7h12l-1 13H7L6 7Zm3-3h6v2H9V4Z"/></svg>' });
      del.onclick = () => {
        if (taskSeverityBuf.length <= 1) return;
        taskSeverityBuf = taskSeverityBuf.filter(x => x.id !== sev.id);
        renderTaskSeverityEditor();
      };
      row.appendChild(del);
      wrap.appendChild(row);
    });
    const addRow = el("button", { class: "btn btn-ghost btn-block", type: "button", onclick: () => {
      taskSeverityBuf.push({ id: cryptoId(), key: "custom", labelKey: null, label: "Custom", color: "#9B8CFF", threshold: 120 });
      renderTaskSeverityEditor();
    }}, t("severity.add"));
    wrap.appendChild(addRow);
  }

  function renderWeeklyDays(selectedDays) {
    const wrap = $("#taskWeeklyDays");
    if (!wrap) return;
    wrap.innerHTML = "";
    // Mon-Sun order in UI; getDay() returns 0=Sun..6=Sat
    const order = [
      { val: 1, key: "dow.mon" },
      { val: 2, key: "dow.tue" },
      { val: 3, key: "dow.wed" },
      { val: 4, key: "dow.thu" },
      { val: 5, key: "dow.fri" },
      { val: 6, key: "dow.sat" },
      { val: 0, key: "dow.sun" },
    ];
    const set = new Set(selectedDays);
    order.forEach(o => {
      const btn = el("button", {
        type: "button",
        class: "dow-btn" + (set.has(o.val) ? " is-active" : ""),
        "data-day": String(o.val),
        onclick: () => {
          if (set.has(o.val)) set.delete(o.val); else set.add(o.val);
          btn.classList.toggle("is-active");
        },
      }, t(o.key));
      wrap.appendChild(btn);
    });
  }

  function getSelectedWeeklyDays() {
    return Array.from($$("#taskWeeklyDays .dow-btn.is-active")).map(b => parseInt(b.dataset.day, 10));
  }

  function applyScheduleVisibility(type) {
    $("#taskIntervalRow").hidden = type !== "interval";
    $("#taskDailyRow").hidden = type !== "daily";
    $("#taskWeeklyRow").hidden = type !== "weekly";
    $("#taskMonthlyRow").hidden = type !== "monthly";
  }

  function openTaskModal(task) {
    editingTaskId = task?.id || null;
    $("#taskModalTitle").textContent = t(task ? "task.edit" : "task.new");
    $("#taskName").value = task?.name || "";
    $("#taskRecurring").checked = task ? !!task.recurring : true;
    $("#taskNotes").value = task?.notes || "";
    renderTaskCategoryOptions();
    $("#taskCategory").value = task?.categoryId || "";

    // Schedule
    const type = task?.scheduleType || "interval";
    $("#taskScheduleType").value = type;
    $("#taskAmount").value = task?.amount ?? 1;
    $("#taskUnit").value = task?.unit || "day";
    $("#taskDailyTime").value = (type === "daily" && task?.scheduleTime) || task?.scheduleTime || "09:00";
    $("#taskWeeklyTime").value = (type === "weekly" && task?.scheduleTime) || task?.scheduleTime || "09:00";
    $("#taskMonthlyTime").value = (type === "monthly" && task?.scheduleTime) || task?.scheduleTime || "09:00";
    $("#taskMonthlyDay").value = task?.scheduleDay || 1;
    renderWeeklyDays(task?.scheduleDays || [1, 2, 3, 4, 5]);
    applyScheduleVisibility(type);

    taskSeverityBuf = task?.severities ? JSON.parse(JSON.stringify(task.severities)) : null;
    const overrideChk = $("#taskOverrideSeverity");
    if (overrideChk) overrideChk.checked = !!taskSeverityBuf;
    renderTaskSeverityEditor();
    $("#deleteTaskBtn").hidden = !task;
    modal.hidden = false;
    setTimeout(() => $("#taskName").focus(), 60);
  }
  function closeTaskModal() {
    modal.hidden = true;
    editingTaskId = null;
  }
  function bindTaskModal() {
    $("#addBtn").onclick = () => openTaskModal();
    $("#emptyAddBtn").onclick = () => openTaskModal();
    $$("[data-close-modal]", modal).forEach(b => b.onclick = closeTaskModal);

    const overrideChk = $("#taskOverrideSeverity");
    if (overrideChk) {
      overrideChk.onchange = () => {
        if (overrideChk.checked) {
          taskSeverityBuf = JSON.parse(JSON.stringify(state.severities));
        } else {
          taskSeverityBuf = null;
        }
        renderTaskSeverityEditor();
      };
    }

    const schedSel = $("#taskScheduleType");
    if (schedSel) {
      schedSel.onchange = () => applyScheduleVisibility(schedSel.value);
    }

    $("#taskForm").onsubmit = (e) => {
      e.preventDefault();
      const name = $("#taskName").value.trim();
      if (!name) return;
      const recurring = $("#taskRecurring").checked;
      const notes = $("#taskNotes").value.trim();
      const categoryId = $("#taskCategory").value || null;
      const severities = taskSeverityBuf ? JSON.parse(JSON.stringify(taskSeverityBuf)) : null;

      const scheduleType = $("#taskScheduleType").value;
      const schedule = { scheduleType };
      if (scheduleType === "interval") {
        schedule.amount = Math.max(1, parseInt($("#taskAmount").value, 10) || 1);
        schedule.unit = $("#taskUnit").value;
        schedule.scheduleTime = null;
        schedule.scheduleDays = null;
        schedule.scheduleDay = null;
      } else if (scheduleType === "daily") {
        schedule.scheduleTime = $("#taskDailyTime").value || "09:00";
        // Keep amount/unit for human-readable fallbacks
        schedule.amount = 1; schedule.unit = "day";
        schedule.scheduleDays = null;
        schedule.scheduleDay = null;
      } else if (scheduleType === "weekly") {
        const days = getSelectedWeeklyDays();
        schedule.scheduleDays = days.length ? days : [1, 2, 3, 4, 5];
        schedule.scheduleTime = $("#taskWeeklyTime").value || "09:00";
        schedule.amount = 7; schedule.unit = "day";
        schedule.scheduleDay = null;
      } else if (scheduleType === "monthly") {
        schedule.scheduleDay = Math.max(1, Math.min(31, parseInt($("#taskMonthlyDay").value, 10) || 1));
        schedule.scheduleTime = $("#taskMonthlyTime").value || "09:00";
        schedule.amount = 1; schedule.unit = "month";
        schedule.scheduleDays = null;
      }

      if (editingTaskId) {
        const tk = state.tasks.find(x => x.id === editingTaskId);
        if (tk) {
          Object.assign(tk, { name, recurring, notes, categoryId, severities }, schedule);
          tk.lastNotifiedSev = null;
          toast(t("toast.updated"));
        }
      } else {
        state.tasks.push(Object.assign({
          id: cryptoId(),
          name, recurring, notes,
          categoryId,
          severities,
          createdAt: Date.now(),
          lastDoneAt: null,
          dismissedUntil: 0,
          lastNotifiedSev: null,
          doneHistory: [],
          done: false,
        }, schedule));
        toast(t("toast.created"));
      }
      save();
      closeTaskModal();
      render();
    };

    $("#deleteTaskBtn").onclick = async () => {
      if (!editingTaskId) return;
      const ok = await confirmDialog({
        title: t("confirm.deleteTitle"),
        body: t("confirm.deleteBody"),
        confirmText: t("confirm.deleteOk"),
        danger: true,
      });
      if (ok) {
        state.tasks = state.tasks.filter(x => x.id !== editingTaskId);
        save();
        closeTaskModal();
        render();
        toast(t("toast.deleted"));
      }
    };
  }

  /* ============================================================
     GENERIC CONFIRM DIALOG
     ============================================================ */
  function confirmDialog({ title, body, confirmText, danger }) {
    return new Promise((resolve) => {
      const dlg = $("#confirmDialog");
      $("#confirmTitle").textContent = title || "";
      $("#confirmBody").textContent = body || "";
      const okBtn = $("#confirmOk");
      okBtn.textContent = confirmText || t("confirm.ok");
      okBtn.classList.toggle("btn-danger", !!danger);
      okBtn.classList.toggle("btn-primary", !danger);
      dlg.hidden = false;
      const cleanup = () => {
        dlg.hidden = true;
        okBtn.onclick = null;
        $$("[data-cancel]", dlg).forEach(b => b.onclick = null);
      };
      okBtn.onclick = () => { cleanup(); resolve(true); };
      $$("[data-cancel]", dlg).forEach(b => b.onclick = () => { cleanup(); resolve(false); });
    });
  }

  /* ============================================================
     DISMISS DIALOG (returns ms, "untilDue", or null)
     ============================================================ */
  function dismissDialog() {
    return new Promise((resolve) => {
      const dlg = $("#dismissDialog");
      const opts = $("#dismissOptions");
      const customRow = $("#dismissCustomRow");
      customRow.hidden = true;
      let chosen = "untilDue";
      const options = [
        { key: "untilDue", labelKey: "dismiss.untilDue" },
        { key: "1h", labelKey: "dismiss.1h" },
        { key: "1d", labelKey: "dismiss.1d" },
        { key: "1w", labelKey: "dismiss.1w" },
        { key: "custom", labelKey: "dismiss.custom" },
      ];
      opts.innerHTML = "";
      options.forEach(o => {
        const btn = el("button", {
          type: "button",
          class: "opt" + (o.key === chosen ? " is-active" : ""),
          onclick: () => {
            chosen = o.key;
            $$(".opt", opts).forEach(x => x.classList.toggle("is-active", x === btn));
            customRow.hidden = chosen !== "custom";
          },
        }, t(o.labelKey));
        opts.appendChild(btn);
      });
      dlg.hidden = false;
      const cleanup = () => {
        dlg.hidden = true;
        $("#dismissOk").onclick = null;
        $$("[data-cancel]", dlg).forEach(b => b.onclick = null);
      };
      $("#dismissOk").onclick = () => {
        let ms = null;
        if (chosen === "untilDue") ms = "untilDue";
        else if (chosen === "1h") ms = UNIT_MS.hour;
        else if (chosen === "1d") ms = UNIT_MS.day;
        else if (chosen === "1w") ms = UNIT_MS.week;
        else if (chosen === "custom") {
          const amount = Math.max(1, parseInt($("#dismissAmount").value, 10) || 1);
          const unit = $("#dismissUnit").value;
          ms = amount * (UNIT_MS[unit] || UNIT_MS.day);
        }
        cleanup();
        resolve(ms);
      };
      $$("[data-cancel]", dlg).forEach(b => b.onclick = () => { cleanup(); resolve(null); });
    });
  }

  /* ============================================================
     ICON PICKER
     ============================================================ */
  function openIconPicker(onPick, currentIcon) {
    const dlg = $("#iconPicker");
    const grid = $("#iconGrid");
    grid.innerHTML = "";
    ICON_SET.forEach(ico => {
      const b = el("button", {
        type: "button",
        class: "icon-cell" + (currentIcon === ico ? " is-active" : ""),
        onclick: () => { cleanup(); onPick(ico); },
      }, ico);
      grid.appendChild(b);
    });
    dlg.hidden = false;
    const cleanup = () => {
      dlg.hidden = true;
      $$("[data-cancel]", dlg).forEach(b => b.onclick = null);
      $("#iconClear").onclick = null;
    };
    $$("[data-cancel]", dlg).forEach(b => b.onclick = cleanup);
    $("#iconClear").onclick = () => { cleanup(); onPick(null); };
  }

  /* ============================================================
     TASK ACTIONS
     ============================================================ */
  async function markDoneWithConfirm(task) {
    const at = await markDoneDialog(task);
    if (at == null) return;
    markDoneRaw(task, at);
  }

  function markDoneDialog(task) {
    return new Promise((resolve) => {
      const dlg = $("#markDoneDialog");
      $("#markDoneTaskName").textContent = task.name;
      let chosen = "now";

      const opts = $$(".opt", $("#markDoneOpts"));
      opts.forEach(b => {
        b.classList.toggle("is-active", b.dataset.when === "now");
        b.onclick = () => {
          chosen = b.dataset.when;
          opts.forEach(x => x.classList.toggle("is-active", x === b));
          $("#markDoneAgoRow").hidden = chosen !== "ago";
          $("#markDoneSpecificRow").hidden = chosen !== "specific";
        };
      });
      $("#markDoneAgoRow").hidden = true;
      $("#markDoneSpecificRow").hidden = true;

      // Seed the specific input with current local time
      const d = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const localISO = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      $("#markDoneSpecific").value = localISO;

      dlg.hidden = false;

      const cleanup = () => {
        dlg.hidden = true;
        $("#markDoneOk").onclick = null;
        $$("[data-cancel]", dlg).forEach(b => b.onclick = null);
      };

      $("#markDoneOk").onclick = () => {
        let ts;
        if (chosen === "now") {
          ts = Date.now();
        } else if (chosen === "ago") {
          const amount = Math.max(1, parseInt($("#markDoneAgoAmount").value, 10) || 1);
          const unit = $("#markDoneAgoUnit").value;
          const ms = amount * (UNIT_MS[unit] || UNIT_MS.minute);
          ts = Date.now() - ms;
        } else { // specific
          const v = $("#markDoneSpecific").value;
          ts = v ? new Date(v).getTime() : Date.now();
        }
        cleanup();
        resolve(ts);
      };
      $$("[data-cancel]", dlg).forEach(b => b.onclick = () => { cleanup(); resolve(null); });
    });
  }
  function markDoneRaw(task, at) {
    const ts = at || Date.now();
    const prev = { lastDoneAt: task.lastDoneAt, dismissedUntil: task.dismissedUntil, done: task.done };
    task.doneHistory.push(ts);
    task.doneHistory.sort((a, b) => a - b);
    task.lastDoneAt = task.doneHistory[task.doneHistory.length - 1];
    task.lastNotifiedSev = null;
    task.dismissedUntil = 0;
    if (!task.recurring) task.done = true;
    state.stats.totalDone += 1;
    logHistory(task.id, "done", prev);
    save();
    celebrate(task);
    render();
  }
  async function dismissWithDialog(task) {
    const ms = await dismissDialog();
    if (ms == null) return;
    applyDismiss(task, ms);
    save();
    render();
    toast(t("toast.dismissed"));
  }
  function applyDismiss(task, ms) {
    const now = Date.now();
    const prev = { lastDoneAt: task.lastDoneAt, dismissedUntil: task.dismissedUntil, done: task.done };
    if (ms === "untilDue") {
      task.lastDoneAt = now;
      task.dismissedUntil = now + intervalMs(task);
    } else {
      task.dismissedUntil = now + ms;
    }
    task.lastNotifiedSev = null;
    if (!task.recurring && ms === "untilDue") task.done = true;
    logHistory(task.id, "dismiss", prev);
  }
  async function undismiss(task) {
    const ok = await confirmDialog({
      title: t("confirm.undismissTitle"),
      body: t("confirm.undismissBody", { name: task.name }),
      confirmText: t("confirm.undismissOk"),
    });
    if (!ok) return;
    task.dismissedUntil = 0;
    save();
    render();
    toast(t("toast.undismissed"));
  }

  /* ============================================================
     CATEGORY BULK ACTIONS
     ============================================================ */
  async function bulkMarkDoneForCategory(cat) {
    const targets = state.tasks.filter(tk => tk.categoryId === cat.id && !(tk.done && !tk.recurring));
    if (targets.length === 0) return;
    const ok = await confirmDialog({
      title: t("confirm.bulkDoneTitle"),
      body: t("confirm.bulkDoneBody", { n: targets.length, cat: categoryName(cat) }),
      confirmText: t("confirm.ok"),
    });
    if (!ok) return;
    targets.forEach(tk => {
      const now = Date.now();
      const prev = { lastDoneAt: tk.lastDoneAt, dismissedUntil: tk.dismissedUntil, done: tk.done };
      tk.doneHistory.push(now);
      tk.lastDoneAt = now;
      tk.dismissedUntil = 0;
      tk.lastNotifiedSev = null;
      if (!tk.recurring) tk.done = true;
      logHistory(tk.id, "done", prev);
    });
    state.stats.totalDone += targets.length;
    save();
    renderCategoryEditor($("#settingsCategories"));
    render();
    celebrateBulk(targets.length);
    toast(t("toast.bulkDone", { n: targets.length }));
  }
  async function bulkDismissForCategory(cat) {
    const targets = state.tasks.filter(tk => tk.categoryId === cat.id && !(tk.done && !tk.recurring));
    if (targets.length === 0) return;
    const ms = await dismissDialog();
    if (ms == null) return;
    const ok = await confirmDialog({
      title: t("confirm.bulkDismissTitle", { cat: categoryName(cat) }),
      body: t("confirm.bulkDismissBody", { n: targets.length, cat: categoryName(cat) }),
      confirmText: t("dismiss.confirm"),
    });
    if (!ok) return;
    targets.forEach(tk => applyDismiss(tk, ms));
    save();
    renderCategoryEditor($("#settingsCategories"));
    render();
    toast(t("toast.bulkDismiss", { n: targets.length }));
  }

  /* ============================================================
     CELEBRATION
     ============================================================ */
  function recentStreak(task) {
    if (!task.recurring || !task.doneHistory || task.doneHistory.length < 2) return 0;
    const span = intervalMs(task);
    let n = 1;
    for (let i = task.doneHistory.length - 1; i > 0; i--) {
      const gap = task.doneHistory[i] - task.doneHistory[i - 1];
      if (gap > 0 && gap <= span * 1.5) n++;
      else break;
    }
    return n;
  }
  function pickCelebrateMsg(task) {
    const streak = recentStreak(task);
    if (streak >= 3) return t("celebrate.streak", { n: streak });
    const i = (state.stats.totalDone || 0) % 7;
    return t("celebrate." + i);
  }
  let celebrateTimer = null;
  function celebrate(task) {
    const overlay = $("#celebrate");
    const msg = $("#celebrateMsg");
    msg.textContent = pickCelebrateMsg(task);
    overlay.hidden = false;
    overlay.classList.remove("is-on");
    void overlay.offsetWidth;
    overlay.classList.add("is-on");
    clearTimeout(celebrateTimer);
    celebrateTimer = setTimeout(() => {
      overlay.classList.remove("is-on");
      overlay.hidden = true;
    }, 1400);
  }
  function celebrateBulk(n) {
    const overlay = $("#celebrate");
    const msg = $("#celebrateMsg");
    msg.textContent = `+${n}  ${t("celebrate.0")}`;
    overlay.hidden = false;
    overlay.classList.remove("is-on");
    void overlay.offsetWidth;
    overlay.classList.add("is-on");
    clearTimeout(celebrateTimer);
    celebrateTimer = setTimeout(() => {
      overlay.classList.remove("is-on");
      overlay.hidden = true;
    }, 1600);
  }

  /* ============================================================
     FILTER (global, applied across tabs)
     ============================================================ */
  function filteredTasks() {
    const f = state.filter || { categoryIds: [] };
    if (!f.categoryIds || f.categoryIds.length === 0) return state.tasks;
    const set = new Set(f.categoryIds);
    return state.tasks.filter(tk => {
      if (set.has("__none__")) {
        if (!tk.categoryId) return true;
      }
      return tk.categoryId && set.has(tk.categoryId);
    });
  }
  function isFiltered() {
    return (state.filter?.categoryIds || []).length > 0;
  }
  function renderFilterPanel() {
    const panel = $("#filterPanel");
    if (!panel) return;
    const list = $("#filterCatList");
    list.innerHTML = "";
    const f = state.filter || { categoryIds: [] };
    const sel = new Set(f.categoryIds || []);

    // "Uncategorized" option
    const uRow = el("label", { class: "filter-row" });
    const uChk = el("input", { type: "checkbox" });
    uChk.checked = sel.has("__none__");
    uChk.onchange = () => {
      const cur = new Set(state.filter.categoryIds);
      if (uChk.checked) cur.add("__none__"); else cur.delete("__none__");
      state.filter.categoryIds = Array.from(cur);
      save();
      renderFilterPanel();
      render();
      updateFilterBadge();
    };
    uRow.appendChild(uChk);
    uRow.appendChild(el("span", { class: "filter-row-label muted" }, t("filter.uncategorized")));
    list.appendChild(uRow);

    state.categories.forEach(cat => {
      const row = el("label", { class: "filter-row" });
      const chk = el("input", { type: "checkbox" });
      chk.checked = sel.has(cat.id);
      chk.onchange = () => {
        const cur = new Set(state.filter.categoryIds);
        if (chk.checked) cur.add(cat.id); else cur.delete(cat.id);
        state.filter.categoryIds = Array.from(cur);
        save();
        renderFilterPanel();
        render();
        updateFilterBadge();
      };
      row.appendChild(chk);
      if (cat.icon) row.appendChild(el("span", { class: "filter-icon" }, cat.icon));
      const swatch = el("span", { class: "filter-swatch" });
      if (cat.color) swatch.style.background = cat.color;
      row.appendChild(swatch);
      row.appendChild(el("span", { class: "filter-row-label" }, categoryName(cat)));
      list.appendChild(row);
    });
  }
  function updateFilterBadge() {
    const btn = $("#filterBtn");
    if (!btn) return;
    btn.classList.toggle("is-active", isFiltered());
    const badge = $("#filterBadge");
    if (badge) {
      const n = (state.filter?.categoryIds || []).length;
      badge.textContent = n > 0 ? String(n) : "";
      badge.hidden = n === 0;
    }
  }
  function bindFilter() {
    $("#filterBtn").onclick = (e) => {
      e.stopPropagation();
      const p = $("#filterPanel");
      const willShow = p.hidden;
      p.hidden = !willShow;
      if (willShow) renderFilterPanel();
    };
    $("#filterClear").onclick = () => {
      state.filter.categoryIds = [];
      save();
      renderFilterPanel();
      render();
      updateFilterBadge();
    };
    document.addEventListener("click", (e) => {
      const p = $("#filterPanel");
      if (!p || p.hidden) return;
      if (!p.contains(e.target) && e.target.id !== "filterBtn" && !$("#filterBtn").contains(e.target)) {
        p.hidden = true;
      }
    });
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function bindTabs() {
    // Coerce legacy "dismissed" tab selection to "active"
    if (state.activeTab === "dismissed") state.activeTab = "active";
    $$(".tab").forEach(tab => {
      tab.onclick = () => {
        state.activeTab = tab.dataset.tab;
        save();
        $$(".tab").forEach(t2 => t2.classList.toggle("is-active", t2 === tab));
        render();
      };
    });
    $$(".tab").forEach(tab => tab.classList.toggle("is-active", tab.dataset.tab === state.activeTab));
  }
  function buildItems(now, source) {
    const tasks = source || filteredTasks();
    return tasks.map(task => {
      const isDone = task.done && !task.recurring;
      const pct = elapsedPct(task, now);
      const sevList = effectiveSeverities(task);
      const sev = !isDone ? activeSeverity(pct, sevList) : null;
      const due = dueAt(task);
      const remaining = due - now;
      const isDismissed = task.dismissedUntil && now < task.dismissedUntil;
      const cat = task.categoryId ? state.categories.find(c => c.id === task.categoryId) : null;
      return { task, isDone, pct, sev, due, remaining, isDismissed, cat };
    });
  }
  function renderTask(item) {
    const { task, isDone, pct, sev, remaining, isDismissed, cat } = item;
    const sevList = effectiveSeverities(task);
    const maxPct = Math.max(maxThreshold(sevList), 150);
    const widthPct = Math.max(0, Math.min(100, (pct / maxPct) * 100));
    const stripeColor = sev ? sev.color : (cat?.color || "var(--text-faint)");
    const node = el("article", { class: "task" + (cat?.muted ? " is-muted" : ""), style: { "--cat-color": stripeColor } });
    node.appendChild(el("div", { class: "task-stripe" }));
    const head = el("div", { class: "task-head" });
    if (cat?.icon) head.appendChild(el("span", { class: "task-icon", "aria-hidden": "true" }, cat.icon));
    head.appendChild(el("div", { class: "task-title" }, task.name));
    node.appendChild(head);
    const meta = el("div", { class: "task-meta" });
    if (cat) {
      const catChip = el("span", { class: "chip chip-cat", style: cat.color ? { "--chip-color": cat.color } : {} });
      catChip.appendChild(el("span", { class: "dot" }));
      catChip.appendChild(document.createTextNode(categoryName(cat)));
      if (cat.muted) catChip.appendChild(el("span", { class: "mute-indicator", title: t("category.muted") }, "🔕"));
      meta.appendChild(catChip);
    }
    if (sev && !isDismissed) {
      meta.appendChild(el("span", { class: "chip is-cat" },
        el("span", { class: "dot" }),
        severityLabel(sev)
      ));
    } else if (!isDone && !isDismissed) {
      meta.appendChild(el("span", { class: "chip" }, t("status.upcoming")));
    }
    if (task.severities) {
      meta.appendChild(el("span", { class: "chip chip-tiny", title: t("task.customSeverity") }, "⚙"));
    }
    meta.appendChild(el("span", {}, task.recurring ? t("status.recurring") : t("status.oneTime")));
    meta.appendChild(el("span", {}, "·"));
    if (isDone) {
      meta.appendChild(el("span", {}, t("status.done")));
    } else if (isDismissed) {
      const remainingDismiss = task.dismissedUntil - Date.now();
      meta.appendChild(el("span", {}, `${t("status.dismissedFor")} ${fmtHuman(remainingDismiss)}`));
    } else if (remaining > 0) {
      meta.appendChild(el("span", {}, `${t("status.dueIn")} ${fmtHuman(remaining)}`));
    } else if (Math.abs(remaining) < UNIT_MS.minute) {
      meta.appendChild(el("span", {}, t("status.dueNow")));
    } else {
      meta.appendChild(el("span", {}, `${t("status.overdueBy")} ${fmtHuman(remaining)}`));
    }
    node.appendChild(meta);
    if (task.notes) node.appendChild(el("div", { class: "task-notes" }, task.notes));
    const bar = el("div", { class: "task-progress" }, el("span", { style: { width: widthPct + "%" } }));
    node.appendChild(bar);
    const actions = el("div", { class: "task-actions" });
    if (isDismissed) {
      actions.appendChild(el("button", { class: "btn btn-primary", onclick: () => undismiss(task) }, t("action.undismiss")));
    } else if (!isDone) {
      actions.appendChild(el("button", { class: "btn btn-primary", onclick: () => markDoneWithConfirm(task) }, t("action.markDone")));
      actions.appendChild(el("button", { class: "btn btn-ghost", onclick: () => dismissWithDialog(task) }, t("action.dismiss")));
    }
    actions.appendChild(el("button", { class: "btn btn-ghost", onclick: () => openTaskModal(task) }, t("action.edit")));
    node.appendChild(actions);
    return node;
  }
  function renderSection(parent, titleText, items) {
    if (!items.length) return;
    parent.appendChild(el("div", { class: "section-head" },
      el("span", {}, titleText),
      el("span", { class: "count" }, String(items.length))
    ));
    items.forEach(item => parent.appendChild(renderTask(item)));
  }

  /* ============================================================
     HISTORY rendering
     ============================================================ */
  function renderHistoryEvent(ev) {
    const task = state.tasks.find(t2 => t2.id === ev.taskId);
    const taskName = task ? task.name : t("history.deletedTask");
    const node = el("article", { class: "history-event" });
    const ico = el("span", { class: "hev-ico", "aria-hidden": "true" }, ev.type === "done" ? "✅" : "💤");
    node.appendChild(ico);
    const body = el("div", { class: "hev-body" });
    body.appendChild(el("div", { class: "hev-title" }, taskName));
    const sub = el("div", { class: "hev-sub muted small" });
    sub.appendChild(document.createTextNode(t(ev.type === "done" ? "history.didIt" : "history.dismissedIt") + " · " + fmtTime(ev.at)));
    body.appendChild(sub);
    node.appendChild(body);
    node.appendChild(el("button", {
      class: "btn btn-ghost btn-sm",
      onclick: () => undoEvent(ev),
    }, t("action.undo")));
    return node;
  }
  function fmtTime(ts) {
    const d = new Date(ts);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    const sameYesterday = d.toDateString() === yesterday.toDateString();
    const time = d.toLocaleTimeString(state.settings.lang, { hour: "2-digit", minute: "2-digit" });
    if (sameDay) return t("time.today") + " " + time;
    if (sameYesterday) return t("time.yesterday") + " " + time;
    return d.toLocaleDateString(state.settings.lang, { year: "numeric", month: "short", day: "numeric" }) + " " + time;
  }

  /* ============================================================
     RENDER root
     ============================================================ */
  function render() {
    const now = Date.now();
    const tab = state.activeTab;
    const container = $("#tasksList");
    container.innerHTML = "";
    updateFilterBadge();

    // HISTORY: independent rendering
    if (tab === "history") {
      const histAll = (state.history || []).slice().sort((a, b) => b.at - a.at);
      // Apply filter: include only events whose task matches the filter (or task gone & filter all-tasks)
      const allowed = new Set(filteredTasks().map(t2 => t2.id));
      const hist = isFiltered() ? histAll.filter(ev => allowed.has(ev.taskId)) : histAll;
      if (hist.length === 0) return showEmpty("empty.historyTitle", "empty.historyBody");
      hideEmpty();
      hist.forEach(ev => container.appendChild(renderHistoryEvent(ev)));
      return;
    }

    const items = buildItems(now);
    // Dismissed tasks are hidden from all live views; they appear in History where they can be undone.
    const live = items.filter(i => !i.isDone && !i.isDismissed);
    let active = live.filter(i => i.sev);
    let upcoming = live.filter(i => !i.sev);

    active.sort((a, b) => {
      const ta = a.sev?.threshold || 0;
      const tb = b.sev?.threshold || 0;
      if (tb !== ta) return tb - ta;
      return b.pct - a.pct;
    });
    upcoming.sort((a, b) => a.remaining - b.remaining);

    active.forEach(i => maybeNotify(i.task, i.sev));

    if (tab === "active") {
      if (active.length === 0) return showEmpty("empty.activeTitle", "empty.activeBody");
      hideEmpty(); renderSection(container, t("tab.active"), active);
    } else if (tab === "upcoming") {
      if (upcoming.length === 0) return showEmpty("empty.upcomingTitle", "empty.upcomingBody");
      hideEmpty(); renderSection(container, t("tab.upcoming"), upcoming);
    } else if (tab === "percent") {
      // Sort by elapsed-percentage descending — closer to deadline relative to its own cycle wins.
      const sorted = [...live].sort((a, b) => b.pct - a.pct);
      if (sorted.length === 0) return showEmpty("empty.percentTitle", "empty.percentBody");
      hideEmpty(); renderSection(container, t("tab.percent"), sorted);
    } else {
      // "all": group by category, sort categories alphabetically, sort tasks alphabetically inside
      const all = live;
      if (all.length === 0) return showEmpty("empty.title", "empty.body");
      hideEmpty();
      const byCat = new Map(); // catId -> { cat, items[] }
      all.forEach(i => {
        const key = i.cat?.id || "__none__";
        if (!byCat.has(key)) byCat.set(key, { cat: i.cat, items: [] });
        byCat.get(key).items.push(i);
      });
      // Sort categories
      const groups = Array.from(byCat.values()).sort((a, b) => {
        if (!a.cat && b.cat) return 1;
        if (a.cat && !b.cat) return -1;
        const an = a.cat ? categoryName(a.cat) : "";
        const bn = b.cat ? categoryName(b.cat) : "";
        return an.localeCompare(bn, state.settings.lang);
      });
      groups.forEach(g => {
        g.items.sort((a, b) => a.task.name.localeCompare(b.task.name, state.settings.lang));
        const key = g.cat?.id || "__none__";
        const title = g.cat
          ? (g.cat.icon ? g.cat.icon + " " : "") + categoryName(g.cat)
          : t("filter.uncategorized");
        renderCollapsibleSection(container, key, title, g.items);
      });
    }
  }
  function renderCollapsibleSection(parent, key, titleText, items) {
    if (!items.length) return;
    const collapsed = (state.collapsedCats || []).includes(key);
    const head = el("button", {
      class: "section-head section-head-toggle" + (collapsed ? " is-collapsed" : ""),
      type: "button",
      "aria-expanded": collapsed ? "false" : "true",
      onclick: () => {
        state.collapsedCats = state.collapsedCats || [];
        if (collapsed) state.collapsedCats = state.collapsedCats.filter(k => k !== key);
        else state.collapsedCats.push(key);
        save();
        render();
      },
    });
    head.appendChild(el("span", { class: "chev", "aria-hidden": "true" }, "▾"));
    head.appendChild(el("span", { class: "section-title" }, titleText));
    head.appendChild(el("span", { class: "count" }, String(items.length)));
    parent.appendChild(head);
    if (!collapsed) {
      items.forEach(item => parent.appendChild(renderTask(item)));
    }
  }
  function showEmpty(titleKey, bodyKey) {
    $("#tasksList").innerHTML = "";
    const e = $("#emptyState");
    e.hidden = false;
    e.querySelector("h2").textContent = t(titleKey);
    e.querySelector("p").textContent = t(bodyKey);
    e.querySelector("button").textContent = t("empty.cta");
  }
  function hideEmpty() { $("#emptyState").hidden = true; }


  /* ============================================================
     EFFECTIVE SEVERITY (per-task override aware)
     ============================================================ */
  function effectiveSeverities(task) {
    return (task && task.severities && task.severities.length) ? task.severities : state.severities;
  }

  /* ============================================================
     HISTORY logging + undo
     ============================================================ */
  function logHistory(taskId, type, prev) {
    state.history.unshift({
      id: cryptoId(),
      taskId,
      type,
      at: Date.now(),
      prev,
    });
    if (state.history.length > 500) state.history.length = 500;
  }
  async function undoEvent(ev) {
    const task = state.tasks.find(t2 => t2.id === ev.taskId);
    const actionLabel = t(ev.type === "done" ? "history.didIt" : "history.dismissedIt");
    const name = task ? task.name : t("history.deletedTask");
    const ok = await confirmDialog({
      title: t("confirm.undoTitle"),
      body: t("confirm.undoBody", { action: actionLabel, name }),
      confirmText: t("confirm.undoOk"),
    });
    if (!ok) return;
    if (!task) {
      state.history = state.history.filter(h => h.id !== ev.id);
      save(); render();
      return;
    }
    if (ev.prev) {
      if ("lastDoneAt" in ev.prev) task.lastDoneAt = ev.prev.lastDoneAt;
      if ("dismissedUntil" in ev.prev) task.dismissedUntil = ev.prev.dismissedUntil;
      if ("done" in ev.prev) task.done = ev.prev.done;
    }
    if (ev.type === "done" && Array.isArray(task.doneHistory) && task.doneHistory.length) {
      let bestIdx = -1, bestDelta = Infinity;
      task.doneHistory.forEach((ts, i) => {
        const d = Math.abs(ts - ev.at);
        if (d < bestDelta) { bestDelta = d; bestIdx = i; }
      });
      if (bestIdx >= 0) task.doneHistory.splice(bestIdx, 1);
      state.stats.totalDone = Math.max(0, (state.stats.totalDone || 0) - 1);
    }
    task.lastNotifiedSev = null;
    state.history = state.history.filter(h => h.id !== ev.id);
    save(); render();
    toast(t("toast.undone"));
  }

  /* ============================================================
     TOAST
     ============================================================ */
  let toastTimer = null;
  function toast(msg) {
    const elT = $("#toast");
    elT.textContent = msg;
    elT.hidden = false;
    requestAnimationFrame(() => elT.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      elT.classList.remove("show");
      setTimeout(() => { elT.hidden = true; }, 250);
    }, 2200);
  }

  /* ============================================================
     STARTUP
     ============================================================ */
  function startup() {
    applyTheme();
    applyI18n();
    if (!state.onboardingDone) {
      onboarding.hidden = false;
      app.hidden = true;
      showStep(1);
    } else {
      onboarding.hidden = true;
      app.hidden = false;
      updateFilterBadge();
      render();
    }
  }
  let swReg = null;
  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("sw.js").then(reg => {
      swReg = reg;
    }).catch(err => console.warn("SW registration failed:", err));
  }
  function init() {
    bindOnboarding();
    bindSettings();
    bindTaskModal();
    bindTabs();
    bindFilter();
    registerServiceWorker();
    startup();
    setInterval(() => { if (!app.hidden) render(); }, 30 * 1000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !app.hidden) render();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const layers = ["#iconPicker", "#bulkDialog", "#dismissDialog", "#markDoneDialog", "#confirmDialog", "#taskModal"];
      for (const sel of layers) {
        const n = $(sel);
        if (n && !n.hidden) { n.hidden = true; return; }
      }
      const fp = $("#filterPanel");
      if (fp && !fp.hidden) { fp.hidden = true; return; }
      if (!settingsDrawer.hidden) closeSettings();
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
