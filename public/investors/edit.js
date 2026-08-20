/**
 * Inline edit mode for /investors. Loaded only for signed-in admins.
 *
 * Every element the compiler marked with [data-e] becomes contenteditable
 * while editing is on. Saving PUTs the changed fragments to the draft API;
 * Publish copies the stored draft to the published doc. The deck-stage
 * engine already ignores keyboard/tap navigation while focus is inside a
 * contenteditable element, so presenting and editing coexist.
 */
(() => {
  const ctxEl = document.getElementById("inv-ctx");
  if (!ctxEl) return;
  const ctx = JSON.parse(ctxEl.textContent);

  const $ = (sel, root) => (root || document).querySelector(sel);
  const editables = () => [...document.querySelectorAll("[data-e]")];

  const baseline = new Map();
  const dirty = new Set();
  let editing = false;
  const storageReady = ctx.storage !== "none";

  /* ---------------------------------------------------------- toolbar */
  const bar = document.createElement("div");
  bar.className = "inv-bar";
  bar.innerHTML = `
    <span class="inv-badge ${ctx.view === "draft" ? "draft" : ""}">${ctx.view.toUpperCase()}</span>
    <span class="inv-status" data-r="status">${storageReady ? "" : "no storage"}</span>
    <button data-r="edit" ${storageReady && ctx.view === "draft" ? "" : "disabled"}>Edit</button>
    <button data-r="save" disabled>Save</button>
    <button data-r="publish" class="primary" ${storageReady ? "" : "disabled"}>Publish</button>
    <a class="inv-btn" data-r="view" href="${ctx.view === "draft" ? "/investors?view=published" : "/investors"}">${
      ctx.view === "draft" ? "View published" : "Back to draft"
    }</a>
    <button data-r="gate" ${storageReady ? "" : "disabled"}>Gate</button>
    <a class="inv-btn" href="/api/investors/logout" title="Signed in as ${ctx.email}">Sign out</a>
  `;
  document.body.appendChild(bar);

  const pop = document.createElement("div");
  pop.className = "inv-pop";
  pop.innerHTML = `
    <h3>VISITOR ACCESS</h3>
    <label><input type="checkbox" data-r="gate-on" ${ctx.gateEnabled ? "checked" : ""}> Require a passphrase</label>
    <input type="password" data-r="gate-pass" placeholder="${
      ctx.gateHasPassword ? "New passphrase (leave blank to keep)" : "Set a passphrase"
    }" autocomplete="new-password">
    <p class="hint">Changing the passphrase signs every current visitor out. Admins are never gated.</p>
    <div class="row"><span class="inv-status" data-r="gate-status"></span><button data-r="gate-save">Apply</button></div>
  `;
  document.body.appendChild(pop);

  const el = {
    status: $('[data-r="status"]', bar),
    edit: $('[data-r="edit"]', bar),
    save: $('[data-r="save"]', bar),
    publish: $('[data-r="publish"]', bar),
    gate: $('[data-r="gate"]', bar),
    gateOn: $('[data-r="gate-on"]', pop),
    gatePass: $('[data-r="gate-pass"]', pop),
    gateSave: $('[data-r="gate-save"]', pop),
    gateStatus: $('[data-r="gate-status"]', pop),
  };

  const setStatus = (msg, warn) => {
    el.status.textContent = msg;
    el.status.classList.toggle("warn", !!warn);
  };

  /* ----------------------------------------------------------- editing */
  const captureBaselines = () => {
    for (const e of editables()) baseline.set(e.getAttribute("data-e"), e.innerHTML);
  };
  captureBaselines();

  const refreshDirtyUI = () => {
    el.save.disabled = dirty.size === 0;
    setStatus(dirty.size ? `${dirty.size} unsaved` : editing ? "editing" : "");
  };

  const setEditing = (on) => {
    editing = on;
    document.body.toggleAttribute("data-inv-editing", on);
    el.edit.classList.toggle("on", on);
    el.edit.textContent = on ? "Editing" : "Edit";
    for (const e of editables()) {
      if (on) e.setAttribute("contenteditable", "true");
      else e.removeAttribute("contenteditable");
    }
    refreshDirtyUI();
  };

  document.addEventListener("input", (ev) => {
    const t = ev.target && ev.target.closest && ev.target.closest("[data-e]");
    if (!t || !editing) return;
    const slug = t.getAttribute("data-e");
    if (t.innerHTML === baseline.get(slug)) {
      dirty.delete(slug);
      t.removeAttribute("data-inv-dirty");
    } else {
      dirty.add(slug);
      t.setAttribute("data-inv-dirty", "");
    }
    refreshDirtyUI();
  });

  // Paste as plain text; Enter inserts a line break instead of a <div>.
  document.addEventListener("paste", (ev) => {
    const t = ev.target && ev.target.closest && ev.target.closest("[data-e]");
    if (!t || !editing) return;
    ev.preventDefault();
    const text = (ev.clipboardData || window.clipboardData).getData("text/plain");
    document.execCommand("insertText", false, text);
  });
  document.addEventListener("keydown", (ev) => {
    if (!editing || ev.key !== "Enter") return;
    const t = ev.target && ev.target.closest && ev.target.closest("[data-e]");
    if (!t) return;
    ev.preventDefault();
    document.execCommand("insertLineBreak");
  });

  window.addEventListener("beforeunload", (ev) => {
    if (dirty.size) {
      ev.preventDefault();
      ev.returnValue = "";
    }
  });

  /* --------------------------------------------------------------- api */
  const api = async (path, opts) => {
    const res = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      ...opts,
    });
    let data = null;
    try {
      data = await res.json();
    } catch {}
    if (!res.ok) throw new Error((data && data.error) || `HTTP ${res.status}`);
    return data;
  };

  const save = async () => {
    if (!dirty.size) return true;
    const changes = {};
    for (const slug of dirty) {
      const node = editables().find((e) => e.getAttribute("data-e") === slug);
      if (node) changes[slug] = node.innerHTML;
    }
    setStatus("saving…");
    try {
      await api("/api/investors/draft", { method: "PUT", body: JSON.stringify({ changes }) });
      for (const slug of Object.keys(changes)) {
        baseline.set(
          slug,
          (editables().find((e) => e.getAttribute("data-e") === slug) || {}).innerHTML
        );
        dirty.delete(slug);
      }
      editables().forEach((e) => e.removeAttribute("data-inv-dirty"));
      refreshDirtyUI();
      setStatus("saved ✓");
      setTimeout(() => refreshDirtyUI(), 1600);
      return true;
    } catch (err) {
      setStatus(err.message === "unauthorized" ? "session expired — reload" : `save failed: ${err.message}`, true);
      return false;
    }
  };

  const publish = async () => {
    if (dirty.size && !(await save())) return;
    if (!confirm("Publish the current draft? This is what visitors will see immediately.")) return;
    setStatus("publishing…");
    try {
      await api("/api/investors/publish", { method: "POST" });
      setStatus("published ✓");
      setTimeout(() => refreshDirtyUI(), 2000);
    } catch (err) {
      setStatus(`publish failed: ${err.message}`, true);
    }
  };

  el.edit.addEventListener("click", () => setEditing(!editing));
  el.save.addEventListener("click", save);
  el.publish.addEventListener("click", publish);
  el.gate.addEventListener("click", () => pop.toggleAttribute("data-open"));
  el.gateSave.addEventListener("click", async () => {
    const body = { gateEnabled: el.gateOn.checked };
    if (el.gatePass.value) body.password = el.gatePass.value;
    el.gateStatus.textContent = "…";
    try {
      const out = await api("/api/investors/config", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      el.gateOn.checked = out.gate.enabled;
      el.gatePass.value = "";
      el.gatePass.placeholder = out.gate.hasPassword
        ? "New passphrase (leave blank to keep)"
        : "Set a passphrase";
      el.gateStatus.textContent = out.gate.enabled ? "gated ✓" : "open ✓";
    } catch (err) {
      el.gateStatus.textContent =
        err.message === "no_password_set" ? "set a passphrase first" : err.message;
    }
  });
})();
