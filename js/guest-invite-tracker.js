(function () {
  "use strict";

  var CATEGORIES = ["Friends", "Office HESTA", "Office AKQA", "Business"];
  var RSVP_OPTIONS = ["Pending", "Attending", "Declined"];
  var TABLE = "guest_invites";

  var SEED_DATA = [
    { category: "Friends", familyUnit: "Ram family", people: "Ram, Shweta", adults: 2, kids: 0, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Friends", familyUnit: "Ayush family", people: "Ayush, Ruchi, Ayush’s mom, 1 kid", adults: 3, kids: 1, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Friends", familyUnit: "Deepankar family", people: "Deepankar, Vinni", adults: 2, kids: 0, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Friends", familyUnit: "Kritika family", people: "Kritika, Ankur, 1 infant", adults: 2, kids: 1, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Friends", familyUnit: "Balram family", people: "Balram, Toshi", adults: 2, kids: 0, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Friends", familyUnit: "Prateek family", people: "Prateek, Shiikha", adults: 2, kids: 0, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Friends", familyUnit: "Mohit family", people: "Mohit, Swati, 2 kids", adults: 2, kids: 2, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Friends", familyUnit: "Nitesh family", people: "Nitesh, Ptiyanka, Amaira", adults: 2, kids: 1, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office HESTA", familyUnit: "Sarah", people: "Sarah", adults: 1, kids: 0, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office HESTA", familyUnit: "Jackson family", people: "Jackson, Jackson’s wife, 2 kids", adults: 2, kids: 2, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office HESTA", familyUnit: "Tom", people: "Tom", adults: 1, kids: 0, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office HESTA", familyUnit: "Ashley family", people: "Ashley, Ashley’s husband, 2 kids", adults: 2, kids: 2, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office HESTA", familyUnit: "Jess", people: "Jess", adults: 1, kids: 0, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office HESTA", familyUnit: "Kate", people: "Kate", adults: 1, kids: 0, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office HESTA", familyUnit: "Michal family", people: "Michal see, Michal wife", adults: 2, kids: 0, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office HESTA", familyUnit: "Nikolai", people: "Nikolai", adults: 1, kids: 0, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office HESTA", familyUnit: "Jessen family", people: "Jessen, Jessen wife, 1 kid", adults: 2, kids: 1, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office HESTA", familyUnit: "Jebin family", people: "Jebin, Jebin wife, kid", adults: 2, kids: 1, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office AKQA", familyUnit: "Kristina", people: "Kristina", adults: 1, kids: 0, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office AKQA", familyUnit: "Don family", people: "Don, Don’s husband, kid", adults: 2, kids: 1, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office AKQA", familyUnit: "Luch family", people: "Luch, Camila", adults: 2, kids: 0, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office AKQA", familyUnit: "Bennor family", people: "Bennor, Sonia, kid", adults: 2, kids: 1, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office AKQA", familyUnit: "Khusboo family", people: "Khusboo, husband, kid", adults: 2, kids: 1, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office AKQA", familyUnit: "Saroja family", people: "Saroja, kid", adults: 1, kids: 1, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office AKQA", familyUnit: "Shree family", people: "Shree, kid", adults: 1, kids: 1, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Office AKQA", familyUnit: "Ben Lau family", people: "Ben Lau, Ben’s wife, kid", adults: 2, kids: 1, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Business", familyUnit: "Sonu Bal family", people: "Sonu Bal, Bal, Amardeep", adults: 3, kids: 0, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Business", familyUnit: "Deniel", people: "Deniel", adults: 1, kids: 0, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Business", familyUnit: "Rahul", people: "Rahul", adults: 1, kids: 0, invited: false, rsvpStatus: "Pending", notes: "" },
    { category: "Business", familyUnit: "Kapil family", people: "Kapil, Kapil’s wife, 2 kids", adults: 2, kids: 2, invited: false, rsvpStatus: "Pending", notes: "" }
  ];

  var supabase = null;
  var guests = [];
  var savedIds = [];
  var dirty = false;
  var saving = false;

  var filters = {
    category: "All",
    search: "",
    invitedOnly: false,
    pendingOnly: false
  };

  var els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function cacheEls() {
    els = {
      authPanel: $("auth-panel"),
      appMain: $("app-main"),
      summary: $("summary"),
      list: $("guest-list"),
      pills: $("category-pills"),
      search: $("search"),
      invitedOnly: $("invited-only"),
      pendingOnly: $("pending-only"),
      toggleInvited: $("toggle-invited"),
      togglePending: $("toggle-pending"),
      resetFilters: $("reset-filters"),
      addFamily: $("add-family"),
      addRow: $("add-row"),
      addRowBottom: $("add-row-bottom"),
      exportCsv: $("export-csv"),
      themeToggle: $("theme-toggle"),
      logoutBtn: $("logout-btn"),
      loginForm: $("login-form"),
      loginEmail: $("login-email"),
      loginPassword: $("login-password"),
      loginError: $("login-error"),
      saveStatus: $("save-status"),
      saveButtons: [$("save-all"), $("save-all-mid"), $("save-all-bottom")].filter(Boolean)
    };
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeCount(value) {
    var n = parseInt(value, 10);
    if (isNaN(n) || n < 0) return 0;
    return n;
  }

  function mapDbRow(row) {
    return {
      id: row.id,
      category: row.category,
      familyUnit: row.family_unit || "",
      people: row.people || "",
      adults: normalizeCount(row.adults),
      kids: normalizeCount(row.kids),
      invited: Boolean(row.invited),
      rsvpStatus: RSVP_OPTIONS.indexOf(row.rsvp_status) >= 0 ? row.rsvp_status : "Pending",
      notes: row.notes || ""
    };
  }

  function toDbRow(row, index) {
    return {
      id: row.id,
      category: row.category,
      family_unit: row.familyUnit || "",
      people: row.people || "",
      adults: normalizeCount(row.adults),
      kids: normalizeCount(row.kids),
      invited: Boolean(row.invited),
      rsvp_status: RSVP_OPTIONS.indexOf(row.rsvpStatus) >= 0 ? row.rsvpStatus : "Pending",
      notes: row.notes || "",
      sort_order: index,
      updated_at: new Date().toISOString()
    };
  }

  function setDirty(value) {
    dirty = Boolean(value);
    updateSaveUi();
  }

  function setSaveStatus(message, kind) {
    if (!els.saveStatus) return;
    els.saveStatus.textContent = message;
    els.saveStatus.classList.remove("is-dirty", "is-ok", "is-error");
    if (kind) els.saveStatus.classList.add(kind);
  }

  function updateSaveUi() {
    els.saveButtons.forEach(function (btn) {
      btn.disabled = saving || !dirty;
      btn.textContent = saving ? "Saving…" : "Save";
    });

    if (saving) {
      setSaveStatus("Saving to database…", null);
    } else if (dirty) {
      setSaveStatus("Unsaved changes — click Save.", "is-dirty");
    } else {
      setSaveStatus("All changes saved.", "is-ok");
    }
  }

  function showLogin(message) {
    els.authPanel.hidden = false;
    els.appMain.hidden = true;
    els.summary.hidden = true;
    els.exportCsv.hidden = true;
    els.addFamily.hidden = true;
    els.logoutBtn.hidden = true;
    els.saveButtons.forEach(function (btn) {
      btn.hidden = true;
    });

    if (message) {
      els.loginError.hidden = false;
      els.loginError.textContent = message;
      setSaveStatus(message, "is-error");
    } else {
      els.loginError.hidden = true;
      els.loginError.textContent = "";
      setSaveStatus("Sign in to load and save.", null);
    }
  }

  function showApp() {
    els.authPanel.hidden = true;
    els.appMain.hidden = false;
    els.summary.hidden = false;
    els.exportCsv.hidden = false;
    els.addFamily.hidden = false;
    els.logoutBtn.hidden = false;
    els.saveButtons.forEach(function (btn) {
      btn.hidden = false;
    });
    els.loginError.hidden = true;
  }

  function getFilteredRows() {
    var query = filters.search.trim().toLowerCase();

    return guests.filter(function (row) {
      if (filters.category !== "All" && row.category !== filters.category) return false;
      if (filters.invitedOnly && !row.invited) return false;
      if (filters.pendingOnly && row.rsvpStatus !== "Pending") return false;
      if (query) {
        var haystack = (row.familyUnit + " " + row.people).toLowerCase();
        if (haystack.indexOf(query) === -1) return false;
      }
      return true;
    });
  }

  function getSummary(rows) {
    var source = rows || guests;
    var adults = 0;
    var kids = 0;
    var invited = 0;
    var pending = 0;

    source.forEach(function (row) {
      adults += normalizeCount(row.adults);
      kids += normalizeCount(row.kids);
      if (row.invited) invited += 1;
      if (row.rsvpStatus === "Pending") pending += 1;
    });

    return {
      families: source.length,
      adults: adults,
      kids: kids,
      guests: adults + kids,
      invited: invited,
      pending: pending
    };
  }

  function findRow(id) {
    for (var i = 0; i < guests.length; i++) {
      if (guests[i].id === id) return guests[i];
    }
    return null;
  }

  function applyFieldValue(row, field, value) {
    if (field === "adults" || field === "kids") {
      row[field] = normalizeCount(value);
    } else if (field === "invited") {
      row.invited = Boolean(value);
    } else if (field === "category") {
      row.category = CATEGORIES.indexOf(value) >= 0 ? value : CATEGORIES[0];
    } else if (field === "rsvpStatus") {
      row.rsvpStatus = RSVP_OPTIONS.indexOf(value) >= 0 ? value : "Pending";
    } else {
      row[field] = value;
    }
  }

  function updateRow(id, field, value, options) {
    var row = findRow(id);
    if (!row) return;

    applyFieldValue(row, field, value);
    setDirty(true);

    var opts = options || {};
    if (opts.soft) {
      renderSummary();
      return;
    }

    render();
  }

  function addFamily() {
    guests.unshift({
      id: createId(),
      category: CATEGORIES[0],
      familyUnit: "",
      people: "",
      adults: 0,
      kids: 0,
      invited: false,
      rsvpStatus: "Pending",
      notes: ""
    });
    setDirty(true);
    render();

    var firstInput = els.list.querySelector('[data-field="familyUnit"]');
    if (firstInput) firstInput.focus();
  }

  function deleteRow(id) {
    var row = findRow(id);
    if (!row) return;

    var label = row.familyUnit && row.familyUnit.trim() ? row.familyUnit.trim() : "this family";
    if (!window.confirm("Delete " + label + "? Click Save afterward to persist this in the database.")) {
      return;
    }

    guests = guests.filter(function (item) {
      return item.id !== id;
    });
    setDirty(true);
    render();
  }

  function csvEscape(value) {
    var text = String(value == null ? "" : value);
    if (/[",\n\r]/.test(text)) {
      return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
  }

  function exportCSV() {
    var rows = getFilteredRows();
    var headers = [
      "id",
      "category",
      "familyUnit",
      "people",
      "adults",
      "kids",
      "invitationSent",
      "rsvpStatus",
      "notes"
    ];

    var lines = [headers.join(",")];
    rows.forEach(function (row) {
      lines.push(
        [
          csvEscape(row.id),
          csvEscape(row.category),
          csvEscape(row.familyUnit),
          csvEscape(row.people),
          csvEscape(row.adults),
          csvEscape(row.kids),
          csvEscape(row.invited ? "Yes" : "No"),
          csvEscape(row.rsvpStatus),
          csvEscape(row.notes)
        ].join(",")
      );
    });

    var blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "guest-invite-tracker.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function renderSummary() {
    var summary = getSummary(getFilteredRows());
    var items = [
      { label: "Total Families", value: summary.families },
      { label: "Total Adults", value: summary.adults },
      { label: "Total Kids", value: summary.kids },
      { label: "Total Guests", value: summary.guests },
      { label: "Invitation Sent", value: summary.invited },
      { label: "Pending RSVPs", value: summary.pending }
    ];

    els.summary.innerHTML = items
      .map(function (item) {
        return (
          '<div class="stat">' +
          '<span class="stat-label">' +
          escapeHtml(item.label) +
          "</span>" +
          '<span class="stat-value">' +
          escapeHtml(item.value) +
          "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderPills() {
    var options = ["All"].concat(CATEGORIES);
    els.pills.innerHTML = options
      .map(function (category) {
        var pressed = filters.category === category ? "true" : "false";
        return (
          '<button type="button" class="pill" data-category="' +
          escapeHtml(category) +
          '" aria-pressed="' +
          pressed +
          '">' +
          escapeHtml(category) +
          "</button>"
        );
      })
      .join("");
  }

  function categoryOptions(selected) {
    return CATEGORIES.map(function (category) {
      return (
        '<option value="' +
        escapeHtml(category) +
        '"' +
        (category === selected ? " selected" : "") +
        ">" +
        escapeHtml(category) +
        "</option>"
      );
    }).join("");
  }

  function rsvpOptions(selected) {
    return RSVP_OPTIONS.map(function (status) {
      return (
        '<option value="' +
        escapeHtml(status) +
        '"' +
        (status === selected ? " selected" : "") +
        ">" +
        escapeHtml(status) +
        "</option>"
      );
    }).join("");
  }

  function renderRow(row) {
    var id = row.id;
    var inviteLabel = row.invited ? "Sent" : "No";
    return (
      '<tr class="' +
      (row.invited ? "is-invited" : "") +
      '" data-id="' +
      escapeHtml(id) +
      '">' +
      "<td>" +
      '<label class="sr-only" for="category-' +
      escapeHtml(id) +
      '">Category</label>' +
      '<select class="field" id="category-' +
      escapeHtml(id) +
      '" data-field="category">' +
      categoryOptions(row.category) +
      "</select>" +
      "</td>" +
      "<td>" +
      '<label class="sr-only" for="family-' +
      escapeHtml(id) +
      '">Family</label>' +
      '<input class="field" id="family-' +
      escapeHtml(id) +
      '" data-field="familyUnit" type="text" value="' +
      escapeHtml(row.familyUnit) +
      '" placeholder="Family">' +
      "</td>" +
      "<td>" +
      '<label class="sr-only" for="people-' +
      escapeHtml(id) +
      '">People</label>' +
      '<input class="field" id="people-' +
      escapeHtml(id) +
      '" data-field="people" type="text" value="' +
      escapeHtml(row.people) +
      '" placeholder="Names">' +
      "</td>" +
      "<td>" +
      '<div class="qty" role="group" aria-label="Adults">' +
      '<button type="button" class="qty-btn" data-action="dec" data-field="adults" aria-label="Decrease adults">−</button>' +
      '<input class="field" data-field="adults" type="number" min="0" inputmode="numeric" value="' +
      escapeHtml(row.adults) +
      '" aria-label="Adults count">' +
      '<button type="button" class="qty-btn" data-action="inc" data-field="adults" aria-label="Increase adults">+</button>' +
      "</div>" +
      "</td>" +
      "<td>" +
      '<div class="qty" role="group" aria-label="Kids">' +
      '<button type="button" class="qty-btn" data-action="dec" data-field="kids" aria-label="Decrease kids">−</button>' +
      '<input class="field" data-field="kids" type="number" min="0" inputmode="numeric" value="' +
      escapeHtml(row.kids) +
      '" aria-label="Kids count">' +
      '<button type="button" class="qty-btn" data-action="inc" data-field="kids" aria-label="Increase kids">+</button>' +
      "</div>" +
      "</td>" +
      '<td class="invite-cell">' +
      '<label class="invite-check' +
      (row.invited ? " is-on" : "") +
      '" for="invited-' +
      escapeHtml(id) +
      '" title="' +
      (row.invited ? "Invitation sent" : "Invitation not sent") +
      '">' +
      '<input id="invited-' +
      escapeHtml(id) +
      '" data-field="invited" type="checkbox"' +
      (row.invited ? " checked" : "") +
      ' aria-label="Invitation sent for ' +
      escapeHtml(row.familyUnit || "family") +
      '">' +
      '<span class="status-pill">' +
      inviteLabel +
      "</span>" +
      "</label>" +
      "</td>" +
      "<td>" +
      '<label class="sr-only" for="rsvp-' +
      escapeHtml(id) +
      '">RSVP</label>' +
      '<select class="field" id="rsvp-' +
      escapeHtml(id) +
      '" data-field="rsvpStatus">' +
      rsvpOptions(row.rsvpStatus) +
      "</select>" +
      "</td>" +
      "<td>" +
      '<label class="sr-only" for="notes-' +
      escapeHtml(id) +
      '">Notes</label>' +
      '<input class="field" id="notes-' +
      escapeHtml(id) +
      '" data-field="notes" type="text" value="' +
      escapeHtml(row.notes) +
      '" placeholder="Notes">' +
      "</td>" +
      "<td>" +
      '<button type="button" class="btn btn-delete" data-action="delete" aria-label="Delete ' +
      escapeHtml(row.familyUnit || "family") +
      '" title="Delete">×</button>' +
      "</td>" +
      "</tr>"
    );
  }

  function renderList() {
    var rows = getFilteredRows();
    if (!rows.length) {
      els.list.innerHTML = '<p class="empty">No families match the current filters.</p>';
      return;
    }

    els.list.innerHTML =
      '<table class="guest-table">' +
      "<colgroup>" +
      '<col class="col-cat">' +
      '<col class="col-family">' +
      '<col class="col-people">' +
      '<col class="col-adults">' +
      '<col class="col-kids">' +
      '<col class="col-invite">' +
      '<col class="col-rsvp">' +
      '<col class="col-notes">' +
      '<col class="col-actions">' +
      "</colgroup>" +
      "<thead>" +
      "<tr>" +
      '<th scope="col">Category</th>' +
      '<th scope="col">Family</th>' +
      '<th scope="col">People</th>' +
      '<th scope="col">Adults</th>' +
      '<th scope="col">Kids</th>' +
      '<th scope="col">Sent</th>' +
      '<th scope="col">RSVP</th>' +
      '<th scope="col">Notes</th>' +
      '<th scope="col"><span class="sr-only">Delete</span></th>' +
      "</tr>" +
      "</thead>" +
      "<tbody>" +
      rows.map(renderRow).join("") +
      "</tbody>" +
      "</table>";
  }

  function syncToggleStyles() {
    els.toggleInvited.classList.toggle("is-active", filters.invitedOnly);
    els.togglePending.classList.toggle("is-active", filters.pendingOnly);
  }

  function render() {
    renderPills();
    renderSummary();
    renderList();
    syncToggleStyles();
    updateSaveUi();
  }

  function getRowId(element) {
    var row = element.closest("tr[data-id]");
    if (!row) return null;
    return row.getAttribute("data-id");
  }

  async function saveAll() {
    if (!supabase || saving || !dirty) return;

    saving = true;
    updateSaveUi();

    try {
      var payload = guests.map(toDbRow);
      var currentIds = guests.map(function (row) {
        return row.id;
      });
      var toDelete = savedIds.filter(function (id) {
        return currentIds.indexOf(id) === -1;
      });

      if (toDelete.length) {
        var delResult = await supabase.from(TABLE).delete().in("id", toDelete);
        if (delResult.error) throw delResult.error;
      }

      if (payload.length) {
        var upsertResult = await supabase.from(TABLE).upsert(payload, { onConflict: "id" });
        if (upsertResult.error) throw upsertResult.error;
      }

      savedIds = currentIds.slice();
      dirty = false;
      setSaveStatus("Saved " + payload.length + " families to database.", "is-ok");
    } catch (error) {
      console.error("Failed to save guest invites:", error);
      setSaveStatus(error.message || "Could not save. Try again.", "is-error");
    } finally {
      saving = false;
      updateSaveUi();
    }
  }

  async function seedIfEmpty() {
    var seeded = SEED_DATA.map(function (row) {
      return Object.assign({ id: createId() }, row);
    });

    guests = seeded;
    var payload = guests.map(toDbRow);
    var result = await supabase.from(TABLE).insert(payload);
    if (result.error) throw result.error;

    savedIds = guests.map(function (row) {
      return row.id;
    });
    dirty = false;
  }

  async function loadGuests() {
    setSaveStatus("Loading guest list…", null);

    var result = await supabase
      .from(TABLE)
      .select("id, category, family_unit, people, adults, kids, invited, rsvp_status, notes, sort_order")
      .order("sort_order", { ascending: true });

    if (result.error) throw result.error;

    var rows = result.data || [];
    if (!rows.length) {
      await seedIfEmpty();
      setSaveStatus("Loaded starter guest list and saved to database.", "is-ok");
    } else {
      guests = rows.map(mapDbRow);
      savedIds = guests.map(function (row) {
        return row.id;
      });
      dirty = false;
      setSaveStatus("Loaded " + guests.length + " families from database.", "is-ok");
    }

    render();
  }

  function bindEvents() {
    els.list.addEventListener("input", function (event) {
      var target = event.target;
      var field = target.getAttribute("data-field");
      if (!field) return;

      var id = getRowId(target);
      if (!id) return;

      if (
        field === "notes" ||
        field === "familyUnit" ||
        field === "people" ||
        field === "adults" ||
        field === "kids"
      ) {
        updateRow(id, field, target.value, { soft: true });
      }
    });

    els.list.addEventListener("change", function (event) {
      var target = event.target;
      var field = target.getAttribute("data-field");
      if (!field) return;

      var id = getRowId(target);
      if (!id) return;

      if (field === "category" || field === "rsvpStatus") {
        updateRow(id, field, target.value);
      } else if (field === "invited") {
        updateRow(id, field, target.checked);
      } else if (field === "adults" || field === "kids") {
        updateRow(id, field, target.value);
      }
    });

    els.list.addEventListener("click", function (event) {
      var button = event.target.closest("[data-action]");
      if (!button) return;

      var id = getRowId(button);
      if (!id) return;

      var action = button.getAttribute("data-action");
      var field = button.getAttribute("data-field");
      var row = findRow(id);
      if (!row) return;

      if (action === "delete") {
        deleteRow(id);
        return;
      }

      if ((action === "inc" || action === "dec") && (field === "adults" || field === "kids")) {
        var next = normalizeCount(row[field]) + (action === "inc" ? 1 : -1);
        if (next < 0) next = 0;
        updateRow(id, field, next);
      }
    });

    els.pills.addEventListener("click", function (event) {
      var pill = event.target.closest("[data-category]");
      if (!pill) return;
      filters.category = pill.getAttribute("data-category");
      render();
    });

    els.search.addEventListener("input", function () {
      filters.search = els.search.value;
      render();
    });

    els.invitedOnly.addEventListener("change", function () {
      filters.invitedOnly = els.invitedOnly.checked;
      render();
    });

    els.pendingOnly.addEventListener("change", function () {
      filters.pendingOnly = els.pendingOnly.checked;
      render();
    });

    els.resetFilters.addEventListener("click", function () {
      filters.category = "All";
      filters.search = "";
      filters.invitedOnly = false;
      filters.pendingOnly = false;
      els.search.value = "";
      els.invitedOnly.checked = false;
      els.pendingOnly.checked = false;
      render();
    });

    [els.addFamily, els.addRow, els.addRowBottom].forEach(function (btn) {
      btn.addEventListener("click", addFamily);
    });

    els.saveButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        saveAll();
      });
    });

    els.exportCsv.addEventListener("click", exportCSV);

    els.logoutBtn.addEventListener("click", async function () {
      if (dirty && !window.confirm("You have unsaved changes. Sign out anyway?")) {
        return;
      }
      await supabase.auth.signOut();
      guests = [];
      savedIds = [];
      dirty = false;
      showLogin();
    });

    els.loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      var email = els.loginEmail.value.trim();
      var password = els.loginPassword.value;

      if (!email || !password) {
        showLogin("Enter your email and password.");
        return;
      }

      var result = await supabase.auth.signInWithPassword({ email: email, password: password });
      if (result.error) {
        showLogin(result.error.message);
        return;
      }

      showApp();
      try {
        await loadGuests();
      } catch (error) {
        console.error(error);
        showLogin(error.message || "Could not load guest list.");
      }
    });

    els.themeToggle.addEventListener("click", function () {
      var root = document.documentElement;
      var isDark = root.getAttribute("data-theme") === "dark";
      if (isDark) {
        root.removeAttribute("data-theme");
        els.themeToggle.setAttribute("aria-pressed", "false");
        els.themeToggle.textContent = "Dark mode";
        document.querySelector('meta[name="theme-color"]').setAttribute("content", "#f7f5f2");
      } else {
        root.setAttribute("data-theme", "dark");
        els.themeToggle.setAttribute("aria-pressed", "true");
        els.themeToggle.textContent = "Light mode";
        document.querySelector('meta[name="theme-color"]').setAttribute("content", "#161513");
      }
    });

    window.addEventListener("beforeunload", function (event) {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    });
  }

  async function init() {
    cacheEls();
    bindEvents();

    supabase = typeof getSupabaseClient === "function" ? getSupabaseClient() : null;
    if (!supabase) {
      showLogin("Supabase is not configured. Add credentials in js/config.js.");
      return;
    }

    var sessionResult = await supabase.auth.getSession();
    if (sessionResult.data && sessionResult.data.session) {
      showApp();
      try {
        await loadGuests();
      } catch (error) {
        console.error(error);
        showLogin(error.message || "Could not load guest list. Please sign in again.");
      }
    } else {
      showLogin();
    }
  }

  window.GuestTracker = {
    render: render,
    getFilteredRows: getFilteredRows,
    getSummary: getSummary,
    addFamily: addFamily,
    updateRow: updateRow,
    deleteRow: deleteRow,
    exportCSV: exportCSV,
    saveAll: saveAll
  };

  document.addEventListener("DOMContentLoaded", init);
})();
