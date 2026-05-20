/* ============================================================
   TooLongAgo — app logic
   - localStorage persistence
   - Onboarding wizard
   - Tasks (one-time / recurring), warning categories, dismiss/done
   - i18n (en + da), easy to extend
   - Browser notifications
   ============================================================ */

(() => {
  'use strict';

  /* ---------- i18n ---------- */
  const I18N = {
    en: {
      name: "English",
      native: "English",
      // tabs
      "tab.active": "Active",
      "tab.upcoming": "Upcoming",
      "tab.all": "All",
      "tab.done": "Done",
      // empty
      "empty.title": "Nothing here yet",
      "empty.body": "Add your first reminder to get started.",
      "empty.cta": "Add a task",
      "empty.activeTitle": "All caught up",
      "empty.activeBody": "No warnings right now. Nice work.",
      "empty.doneTitle": "Nothing done yet",
      "empty.doneBody": "Mark a task as done and it'll show up here.",
      // onboarding
      "onboard.welcomeSub": "Gentle nudges for the things you keep meaning to do.",
      "onboard.start": "Get started",
      "onboard.langTitle": "Choose your language",
      "onboard.langSub": "You can change this any time in Settings.",
      "onboard.catTitle": "Warning levels",
      "onboard.catSub": "When a task is overdue, this is how seriously we'll flag it. Tweak the names, colors, or thresholds, or stick with the defaults.",
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
      "settings.categories": "Warning levels",
      "settings.categoriesHint": "Thresholds are relative to the task's interval. 100% = exactly due.",
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
      "task.recurring": "Recurring (repeats after I mark it done)",
      "task.notes": "Notes (optional)",
      "task.delete": "Delete",
      // units
      "unit.minute": "minute(s)",
      "unit.hour": "hour(s)",
      "unit.day": "day(s)",
      "unit.week": "week(s)",
      "unit.month": "month(s)",
      "unit.year": "year(s)",
      // categories
      "cat.add": "+ Add level",
      "cat.reminder": "Reminder",
      "cat.warning": "Warning",
      "cat.critical": "Critical",
      // status / labels
      "status.dueIn": "due in",
      "status.overdueBy": "overdue by",
      "status.dueNow": "due now",
      "status.never": "never marked done",
      "status.lastDone": "last done",
      "status.upcoming": "Upcoming",
      "status.oneTime": "one-time",
      "status.recurring": "recurring",
      "status.done": "Done",
      // actions
      "action.markDone": "Mark done",
      "action.dismiss": "Dismiss",
      "action.edit": "Edit",
      "action.snooze": "Snooze",
      "action.undo": "Undo",
      // toasts
      "toast.created": "Task created",
      "toast.updated": "Task updated",
      "toast.deleted": "Task deleted",
      "toast.markedDone": "Marked done",
      "toast.dismissed": "Dismissed",
      "toast.imported": "Data imported",
      "toast.exported": "Exported",
      "toast.reset": "Everything reset",
      "toast.notifEnabled": "Notifications enabled",
      "toast.notifBlocked": "Notifications blocked in browser",
      // misc
      "back": "Back",
      "next": "Next",
      "save": "Save",
      "cancel": "Cancel",
      "confirm.reset": "This will delete all your tasks and settings. Continue?",
      "confirm.delete": "Delete this task?",
      // time relative
      "time.now": "now",
      "time.ago": "ago",
      "time.in": "in",
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
    },
    da: {
      name: "Danish",
      native: "Dansk",
      "tab.active": "Aktive",
      "tab.upcoming": "Kommende",
      "tab.all": "Alle",
      "tab.done": "Færdige",
      "empty.title": "Intet her endnu",
      "empty.body": "Tilføj din første påmindelse for at komme i gang.",
      "empty.cta": "Tilføj en opgave",
      "empty.activeTitle": "Du er ajour",
      "empty.activeBody": "Ingen advarsler lige nu. Godt gået.",
      "empty.doneTitle": "Intet er færdigt endnu",
      "empty.doneBody": "Marker en opgave som færdig, så vises den her.",
      "onboard.welcomeSub": "Venlige skub til de ting, du bliver ved med at glemme.",
      "onboard.start": "Kom i gang",
      "onboard.langTitle": "Vælg sprog",
      "onboard.langSub": "Du kan altid ændre det i indstillinger.",
      "onboard.catTitle": "Advarselsniveauer",
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
      "settings.categories": "Advarselsniveauer",
      "settings.categoriesHint": "Grænserne er i forhold til opgavens interval. 100 % = præcis forfalden.",
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
      "task.recurring": "Gentages (starter forfra når jeg markerer som færdig)",
      "task.notes": "Noter (valgfrit)",
      "task.delete": "Slet",
      "unit.minute": "minut(ter)",
      "unit.hour": "time(r)",
      "unit.day": "dag(e)",
      "unit.week": "uge(r)",
      "unit.month": "måned(er)",
      "unit.year": "år",
      "cat.add": "+ Tilføj niveau",
      "cat.reminder": "Påmindelse",
      "cat.warning": "Advarsel",
      "cat.critical": "Kritisk",
      "status.dueIn": "forfalden om",
      "status.overdueBy": "forsinket med",
      "status.dueNow": "forfalden nu",
      "status.never": "aldrig markeret færdig",
      "status.lastDone": "sidst gjort",
      "status.upcoming": "Kommende",
      "status.oneTime": "engangs",
      "status.recurring": "gentagende",
      "status.done": "Færdig",
      "action.markDone": "Marker færdig",
      "action.dismiss": "Afvis",
      "action.edit": "Rediger",
      "action.snooze": "Udskyd",
      "action.undo": "Fortryd",
      "toast.created": "Opgave oprettet",
      "toast.updated": "Opgave opdateret",
      "toast.deleted": "Opgave slettet",
      "toast.markedDone": "Markeret færdig",
      "toast.dismissed": "Afvist",
      "toast.imported": "Data importeret",
      "toast.exported": "Eksporteret",
      "toast.reset": "Alt nulstillet",
      "toast.notifEnabled": "Notifikationer aktiveret",
      "toast.notifBlocked": "Notifikationer blokeret i browseren",
      "back": "Tilbage",
      "next": "Videre",
      "save": "Gem",
      "cancel": "Annuller",
      "confirm.reset": "Dette sletter alle dine opgaver og indstillinger. Fortsæt?",
      "confirm.delete": "Slet denne opgave?",
      "time.now": "nu",
      "time.ago": "siden",
      "time.in": "om",
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
    },
  };

  const t = (key, vars) => {
    const dict = I18N[state.settings.lang] || I18N.en;
    let s = dict[key] || I18N.en[key] || key;
    if (vars) for (const k in vars) s = s.replace(`{${k}}`, vars[k]);
    return s;
  };

  /* ---------- Constants ---------- */
  const STORAGE_KEY = "toolongago.v1";

  const UNIT_MS = {
    minute: 60 * 1000,
    hour:   60 * 60 * 1000,
    day:    24 * 60 * 60 * 1000,
    week:   7 * 24 * 60 * 60 * 1000,
    month:  30 * 24 * 60 * 60 * 1000,   // approx
    year:   365 * 24 * 60 * 60 * 1000,  // approx
  };

  const DEFAULT_CATEGORIES = () => ([
    { id: cryptoId(), key: "reminder", labelKey: "cat.reminder", color: "#3FB48A", threshold: 80  },
    { id: cryptoId(), key: "warning",  labelKey: "cat.warning",  color: "#F2A93B", threshold: 100 },
    { id: cryptoId(), key: "critical", labelKey: "cat.critical", color: "#E5484D", threshold: 150 },
  ]);

  /* ---------- Helpers ---------- */
  function cryptoId() {
    if (window.crypto?.randomUUID) return crypto.randomUUID();
    return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  function intervalMs(t) { return (t.amount || 0) * (UNIT_MS[t.unit] || UNIT_MS.day); }
  function dueAt(task) {
    const base = task.lastDoneAt || task.createdAt;
    return base + intervalMs(task);
  }
  function elapsedPct(task, now) {
    const base = task.lastDoneAt || task.createdAt;
    const span = intervalMs(task);
    if (!span) return 0;
    return ((now - base) / span) * 100;
  }
  // Returns the category object that applies to this task at the given pct, or null if below the lowest.
  function activeCategory(pct, categories) {
    const sorted = [...categories].sort((a, b) => a.threshold - b.threshold);
    let active = null;
    for (const c of sorted) if (pct >= c.threshold) active = c;
    return active;
  }
  function maxThreshold(categories) {
    return categories.reduce((m, c) => Math.max(m, c.threshold), 100);
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

  /* ---------- State ---------- */
  const defaultState = () => ({
    schemaVersion: 1,
    onboardingDone: false,
    settings: {
      lang: (navigator.language || "en").toLowerCase().startsWith("da") ? "da" : "en",
      theme: "auto",     // auto | light | dark
      notifications: false,
    },
    categories: DEFAULT_CATEGORIES(),
    tasks: [],            // {id, name, notes, amount, unit, recurring, createdAt, lastDoneAt, dismissedUntil, lastNotifiedCat, doneHistory, done(one-time)}
    activeTab: "active",
  });

  let state = load() || defaultState();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("Failed to load state:", e);
      return null;
    }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { console.warn("Save failed:", e); }
  }

  /* ---------- Translate the static DOM ---------- */
  function applyI18n() {
    $$("[data-i18n]").forEach(n => {
      const key = n.getAttribute("data-i18n");
      // For options, only set textContent
      if (n.tagName === "OPTION") n.textContent = t(key);
      else n.textContent = t(key);
    });
    document.documentElement.lang = state.settings.lang;
  }

  /* ---------- Theme ---------- */
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

    renderLangPicker($("#onboardLang"), () => renderLangPicker($("#onboardLang"), () => {}));
    renderCategoryEditor($("#onboardCategories"));
    $("#onboardAddCat").onclick = () => {
      state.categories.push({ id: cryptoId(), key: "custom", labelKey: null, label: "Custom", color: "#9B8CFF", threshold: 120 });
      save();
      renderCategoryEditor($("#onboardCategories"));
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
     LANGUAGE PICKER (used in onboarding + settings)
     ============================================================ */
  function renderLangPicker(container, onChange) {
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
          // Re-render anything that needs translation
          renderLangPicker($("#onboardLang"), onChange);
          renderLangPicker($("#settingsLang"), onChange);
          renderCategoryEditor($("#onboardCategories"));
          renderCategoryEditor($("#settingsCategories"));
          render();
          if (onChange) onChange();
        }
      },
        el("strong", {}, meta.native),
        el("small", {}, meta.name)
      );
      container.appendChild(btn);
    });
  }

  /* ============================================================
     CATEGORY EDITOR
     ============================================================ */
  function categoryLabel(cat) {
    if (cat.labelKey) return t(cat.labelKey);
    return cat.label || "Custom";
  }
  function renderCategoryEditor(container) {
    container.innerHTML = "";
    // Sort by threshold ascending for editing too
    const sorted = [...state.categories].sort((a, b) => a.threshold - b.threshold);

    sorted.forEach(cat => {
      const row = el("div", { class: "cat-row" });

      // Color
      const color = el("input", { type: "color", value: cat.color });
      color.oninput = (e) => { cat.color = e.target.value; save(); render(); };
      row.appendChild(color);

      // Label
      const label = el("input", { type: "text", value: categoryLabel(cat), maxlength: 24 });
      label.oninput = (e) => {
        cat.label = e.target.value;
        cat.labelKey = null; // becomes user-customized
        save();
        render();
      };
      row.appendChild(label);

      // Threshold (%)
      const pctWrap = el("div", { class: "pct-wrap" });
      const num = el("input", { type: "number", min: 1, max: 1000, step: 1, value: cat.threshold });
      num.oninput = (e) => {
        const v = parseInt(e.target.value, 10);
        if (!isNaN(v) && v > 0) { cat.threshold = v; save(); render(); }
      };
      pctWrap.appendChild(num);
      pctWrap.appendChild(el("span", {}, "%"));
      row.appendChild(pctWrap);

      // Delete
      const del = el("button", { class: "del", type: "button", title: "Delete", "aria-label": "Delete" },
        (() => { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("viewBox","0 0 24 24"); s.setAttribute("width","16"); s.setAttribute("height","16"); s.innerHTML = '<path fill="currentColor" d="M6 7h12l-1 13H7L6 7Zm3-3h6v2H9V4Z"/>'; return s; })()
      );
      del.onclick = () => {
        if (state.categories.length <= 1) return;
        state.categories = state.categories.filter(c => c.id !== cat.id);
        save();
        renderCategoryEditor(container);
        render();
      };
      row.appendChild(del);

      container.appendChild(row);
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
    renderCategoryEditor($("#settingsCategories"));
    // Notif state
    const notifToggle = $("#notifToggle");
    notifToggle.checked = state.settings.notifications && Notification?.permission === "granted";
    refreshNotifStatus();
    // Theme seg
    $$("#themeSeg button").forEach(b => b.classList.toggle("is-active", b.dataset.theme === state.settings.theme));
  }
  function closeSettings() {
    settingsDrawer.hidden = true;
    settingsDrawer.setAttribute("aria-hidden", "true");
  }
  function bindSettings() {
    $("#menuBtn").onclick = openSettings;
    $$("[data-close-drawer]", settingsDrawer).forEach(b => b.onclick = closeSettings);

    $("#settingsAddCat").onclick = () => {
      state.categories.push({ id: cryptoId(), key: "custom", labelKey: null, label: "Custom", color: "#9B8CFF", threshold: 120 });
      save();
      renderCategoryEditor($("#settingsCategories"));
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
    $("#resetBtn").onclick = () => {
      if (confirm(t("confirm.reset"))) {
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
    const el = $("#notifStatus");
    if (!("Notification" in window)) {
      el.textContent = "Notifications not supported in this browser.";
      $("#notifToggle").disabled = true;
      return;
    }
    const p = Notification.permission;
    if (p === "granted") el.textContent = state.settings.notifications ? "" : "Permission granted. Toggle on to enable.";
    else if (p === "denied") el.textContent = "Blocked in browser settings.";
    else el.textContent = "We'll ask the browser for permission.";
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
  function maybeNotify(task, cat) {
    if (!state.settings.notifications) return;
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    // Only notify when the category changes upward
    if (task.lastNotifiedCat === cat.id) return;
    try {
      new Notification(t("notif.title"), {
        body: t("notif.bodyOne", { name: task.name, level: categoryLabel(cat) }),
        icon: "favicon.svg",
        tag: task.id + ":" + cat.id,
      });
      task.lastNotifiedCat = cat.id;
      save();
    } catch (e) { /* ignore */ }
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
        // Merge somewhat safely
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

  function openTaskModal(task) {
    editingTaskId = task?.id || null;
    $("#taskModalTitle").textContent = t(task ? "task.edit" : "task.new");
    $("#taskName").value = task?.name || "";
    $("#taskAmount").value = task?.amount ?? 1;
    $("#taskUnit").value = task?.unit || "day";
    $("#taskRecurring").checked = task ? !!task.recurring : true;
    $("#taskNotes").value = task?.notes || "";
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

    $("#taskForm").onsubmit = (e) => {
      e.preventDefault();
      const name = $("#taskName").value.trim();
      if (!name) return;
      const amount = Math.max(1, parseInt($("#taskAmount").value, 10) || 1);
      const unit = $("#taskUnit").value;
      const recurring = $("#taskRecurring").checked;
      const notes = $("#taskNotes").value.trim();

      if (editingTaskId) {
        const tk = state.tasks.find(x => x.id === editingTaskId);
        if (tk) {
          Object.assign(tk, { name, amount, unit, recurring, notes });
          tk.lastNotifiedCat = null;
          toast(t("toast.updated"));
        }
      } else {
        state.tasks.push({
          id: cryptoId(),
          name, amount, unit, recurring, notes,
          createdAt: Date.now(),
          lastDoneAt: null,
          dismissedUntil: 0,
          lastNotifiedCat: null,
          doneHistory: [],
          done: false,
        });
        toast(t("toast.created"));
      }
      save();
      closeTaskModal();
      render();
    };

    $("#deleteTaskBtn").onclick = () => {
      if (!editingTaskId) return;
      if (confirm(t("confirm.delete"))) {
        state.tasks = state.tasks.filter(x => x.id !== editingTaskId);
        save();
        closeTaskModal();
        render();
        toast(t("toast.deleted"));
      }
    };
  }

  /* ============================================================
     TASK ACTIONS
     ============================================================ */
  function markDone(task) {
    const now = Date.now();
    task.doneHistory = task.doneHistory || [];
    task.doneHistory.push(now);
    task.lastDoneAt = now;
    task.lastNotifiedCat = null;
    task.dismissedUntil = 0;
    if (!task.recurring) task.done = true;
    save();
    render();
    toast(t("toast.markedDone"));
  }
  function dismissTask(task) {
    // Effectively "snooze" until next due (treat as if done now for tracking purposes? No — just hide current warning until next cycle)
    const now = Date.now();
    task.dismissedUntil = dueAt(task); // hide until next due time
    // Reset progression so it doesn't immediately re-fire
    task.lastDoneAt = now;
    task.lastNotifiedCat = null;
    if (!task.recurring) task.done = true;
    save();
    render();
    toast(t("toast.dismissed"));
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function bindTabs() {
    $$(".tab").forEach(tab => {
      tab.onclick = () => {
        state.activeTab = tab.dataset.tab;
        save();
        $$(".tab").forEach(t2 => t2.classList.toggle("is-active", t2 === tab));
        render();
      };
    });
    // restore
    $$(".tab").forEach(tab => tab.classList.toggle("is-active", tab.dataset.tab === state.activeTab));
  }

  function tasksForTab(now) {
    return state.tasks.map(task => {
      const isDone = task.done && !task.recurring;
      const pct = elapsedPct(task, now);
      const cat = !isDone && pct >= 0 ? activeCategory(pct, state.categories) : null;
      const due = dueAt(task);
      const remaining = due - now;
      return { task, isDone, pct, cat, due, remaining };
    });
  }

  function renderTask(item) {
    const { task, isDone, pct, cat, remaining } = item;
    const cats = [...state.categories].sort((a, b) => a.threshold - b.threshold);
    const maxPct = Math.max(maxThreshold(state.categories), 150);
    const widthPct = Math.max(0, Math.min(100, (pct / maxPct) * 100));
    const stripeColor = cat ? cat.color : "var(--text-faint)";

    const node = el("article", { class: "task", style: { "--cat-color": stripeColor } });
    node.appendChild(el("div", { class: "task-stripe" }));

    // Head: title + (optional) edit button hidden, click whole card to edit? Provide explicit Edit in actions.
    const head = el("div", { class: "task-head" },
      el("div", { class: "task-title" }, task.name)
    );
    node.appendChild(head);

    // Meta
    const meta = el("div", { class: "task-meta" });
    if (cat) {
      meta.appendChild(el("span", { class: "chip is-cat" },
        el("span", { class: "dot" }),
        categoryLabel(cat)
      ));
    } else {
      meta.appendChild(el("span", { class: "chip" }, t("status.upcoming")));
    }
    meta.appendChild(el("span", {}, task.recurring ? t("status.recurring") : t("status.oneTime")));
    meta.appendChild(el("span", {}, "·"));
    if (isDone) {
      meta.appendChild(el("span", {}, t("status.done")));
    } else if (remaining > 0) {
      meta.appendChild(el("span", {}, `${t("status.dueIn")} ${fmtHuman(remaining)}`));
    } else if (Math.abs(remaining) < UNIT_MS.minute) {
      meta.appendChild(el("span", {}, t("status.dueNow")));
    } else {
      meta.appendChild(el("span", {}, `${t("status.overdueBy")} ${fmtHuman(remaining)}`));
    }
    node.appendChild(meta);

    // Notes
    if (task.notes) node.appendChild(el("div", { class: "task-notes" }, task.notes));

    // Progress bar
    const bar = el("div", { class: "task-progress" }, el("span", { style: { width: widthPct + "%" } }));
    node.appendChild(bar);

    // Actions
    const actions = el("div", { class: "task-actions" });
    if (!isDone) {
      const btnDone = el("button", { class: "btn btn-primary", onclick: () => markDone(task) }, t("action.markDone"));
      actions.appendChild(btnDone);
      const btnDismiss = el("button", { class: "btn btn-ghost", onclick: () => dismissTask(task) }, t("action.dismiss"));
      actions.appendChild(btnDismiss);
    }
    const btnEdit = el("button", { class: "btn btn-ghost", onclick: () => openTaskModal(task) }, t("action.edit"));
    actions.appendChild(btnEdit);
    node.appendChild(actions);

    return node;
  }

  function renderSection(parent, titleKey, items) {
    if (!items.length) return;
    const head = el("div", { class: "section-head" },
      el("span", {}, t(titleKey)),
      el("span", { class: "count" }, String(items.length))
    );
    parent.appendChild(head);
    items.forEach(item => parent.appendChild(renderTask(item)));
  }

  function render() {
    const now = Date.now();
    const items = tasksForTab(now);
    const tab = state.activeTab;

    const container = $("#tasksList");
    container.innerHTML = "";

    // Active = items currently in any category (and not dismissed beyond current due) and not done
    // Upcoming = items below first threshold or dismissed and waiting
    let active = items.filter(i => !i.isDone && i.cat);
    // dismissed: if dismissedUntil > now and the user effectively "marked as done within time", treat as upcoming
    active = active.filter(i => !(i.task.dismissedUntil && now < i.task.dismissedUntil));
    let upcoming = items.filter(i => !i.isDone && !active.includes(i));
    let done = items.filter(i => i.isDone);

    // Sort active by criticality (highest pct vs maxThreshold) then by pct
    active.sort((a, b) => {
      const ta = a.cat?.threshold || 0;
      const tb = b.cat?.threshold || 0;
      if (tb !== ta) return tb - ta;
      return b.pct - a.pct;
    });
    // Upcoming by closest due first
    upcoming.sort((a, b) => a.remaining - b.remaining);
    // Done by most recently done
    done.sort((a, b) => (b.task.lastDoneAt || 0) - (a.task.lastDoneAt || 0));

    // Notifications: fire for items that just transitioned to a higher category
    active.forEach(i => maybeNotify(i.task, i.cat));

    // Decide what to show per tab
    if (tab === "active") {
      if (active.length === 0) {
        showEmpty("empty.activeTitle", "empty.activeBody");
        return;
      } else {
        hideEmpty();
        renderSection(container, "tab.active", active);
      }
    } else if (tab === "upcoming") {
      if (upcoming.length === 0) {
        showEmpty("empty.title", "empty.body");
        return;
      } else {
        hideEmpty();
        renderSection(container, "tab.upcoming", upcoming);
      }
    } else if (tab === "done") {
      if (done.length === 0) {
        showEmpty("empty.doneTitle", "empty.doneBody");
        return;
      } else {
        hideEmpty();
        renderSection(container, "tab.done", done);
      }
    } else {
      // all
      if (active.length + upcoming.length + done.length === 0) {
        showEmpty("empty.title", "empty.body");
        return;
      } else {
        hideEmpty();
        renderSection(container, "tab.active", active);
        renderSection(container, "tab.upcoming", upcoming);
        renderSection(container, "tab.done", done);
      }
    }
  }

  function showEmpty(titleKey, bodyKey) {
    const c = $("#tasksList");
    c.innerHTML = "";
    $("#emptyState").hidden = false;
    $("#emptyState").querySelector("h2").textContent = t(titleKey);
    $("#emptyState").querySelector("p").textContent = t(bodyKey);
    $("#emptyState").querySelector("button").textContent = t("empty.cta");
  }
  function hideEmpty() { $("#emptyState").hidden = true; }

  /* ============================================================
     TOAST
     ============================================================ */
  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => { el.hidden = true; }, 250);
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
      render();
    }
  }

  function init() {
    bindOnboarding();
    bindSettings();
    bindTaskModal();
    bindTabs();
    startup();

    // Recompute progress + notifications periodically
    setInterval(() => { if (!app.hidden) render(); }, 30 * 1000);

    // When user returns to tab, refresh
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !app.hidden) render();
    });

    // Keyboard: ESC closes modals/drawer
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!modal.hidden) closeTaskModal();
        else if (!settingsDrawer.hidden) closeSettings();
      }
    });
  }

  // Boot
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
