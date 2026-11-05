// Loads all content from /content/*.json (edited by AKM via /admin) and renders the page.
(function () {
  const $ = (id) => document.getElementById(id);
  const md = (s) => (window.marked ? marked.parse(s || "") : (s || ""));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Make media paths relative so the site works on github.io/AKM_Website/ and on a custom domain.
  const asset = (p) => (p || "").replace(/^\/+/, "").replace(/^AKM_Website\//, "");
  const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const get = (f) => fetch("content/" + f + ".json", { cache: "no-store" }).then((r) => (r.ok ? r.json() : {})).catch(() => ({}));

  function table(columns, rows) {
    if (!columns || !columns.length) return "";
    const head = "<thead><tr>" + columns.map((c) => `<th>${esc(c)}</th>`).join("") + "</tr></thead>";
    const body = "<tbody>" + (rows || []).map((r) => "<tr>" + columns.map((_, i) => `<td>${esc((r.cells || [])[i])}</td>`).join("") + "</tr>").join("") + "</tbody>";
    return head + body;
  }

  // Disclaimer gate (BCI): must agree once per browser session
  const gate = $("disclaimer");
  const unlock = () => { gate.hidden = true; document.body.classList.remove("locked"); };
  let agreed = false;
  try { agreed = sessionStorage.getItem("akm-agreed") === "1"; } catch (e) {}
  if (agreed) unlock();
  $("disc-agree").onclick = () => { try { sessionStorage.setItem("akm-agreed", "1"); } catch (e) {} unlock(); };
  $("show-disclaimer").onclick = (e) => { e.preventDefault(); gate.hidden = false; document.body.classList.add("locked"); };

  // Mobile menu
  $("menu-btn").onclick = () => $("nav").classList.toggle("open");
  $("nav").addEventListener("click", (e) => { if (e.target.tagName === "A") $("nav").classList.remove("open"); });
  $("year").textContent = new Date().getFullYear();

  Promise.all(["settings", "profile", "practice", "sections", "documents", "contact"].map(get)).then(
    ([settings, profile, practice, sections, documents, contact]) => {
      // Settings
      $("disc-text").innerHTML = md(settings.disclaimer);
      $("f-note").textContent = settings.footer_note || "";

      // Profile
      if (profile.name) { $("p-name").textContent = profile.name; $("brand").textContent = profile.name; $("f-name").textContent = profile.name; document.title = profile.name + ", " + (profile.designation || "Advocate"); }
      if (profile.designation) $("p-designation").textContent = profile.designation;
      $("p-facts").innerHTML = (profile.facts || []).map((f) => `<dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd>`).join("");
      if (profile.photo) { $("p-photo").src = asset(profile.photo); $("p-photo").hidden = false; }
      $("p-about").innerHTML = md(profile.about);
      $("p-quals").innerHTML = table(["Qualification", "Institution", "Year"], (profile.qualifications || []).map((q) => ({ cells: [q.degree, q.institution, q.year] })));

      // Practice areas
      $("pr-intro").innerHTML = md(practice.intro);
      $("pr-areas").innerHTML = (practice.areas || []).map((a) => `<div class="card"><h3>${esc(a.title)}</h3><p>${esc(a.description)}</p></div>`).join("");

      // Custom sections (added by AKM)
      const list = (sections.sections || []).filter((s) => s.visible !== false);
      $("custom-sections").innerHTML = list.map((s, i) => {
        const id = "s-" + (slug(s.title) || i);
        const t = s.table && s.table.columns && s.table.columns.length ? `<div class="table-wrap"><table>${table(s.table.columns, s.table.rows)}</table></div>` : "";
        const f = s.file ? `<p><a href="${esc(asset(s.file))}" target="_blank" rel="noopener">${esc(s.file_label || "Download")}</a></p>` : "";
        return `<section id="${id}" class="block${i % 2 ? " alt" : ""}"><div class="wrap"><h2>${esc(s.title)}</h2><div class="prose">${md(s.body)}</div>${t}${f}</div></section>`;
      }).join("");
      $("nav-extra").innerHTML = list.filter((s) => s.show_in_menu).map((s, i) => `<a href="#s-${slug(s.title) || i}">${esc(s.title)}</a>`).join("");

      // Documents
      const docs = documents.documents || [];
      if (docs.length) {
        $("documents").hidden = false; $("nav-docs").hidden = false;
        $("doc-list").innerHTML = docs.map((d) => `<li><a href="${esc(asset(d.file))}" target="_blank" rel="noopener">${esc(d.title)}</a>${d.date ? ` <small>${esc(d.date)}</small>` : ""}${d.description ? `<small>${esc(d.description)}</small>` : ""}</li>`).join("");
      }

      // Contact
      $("c-address").textContent = contact.address || "";
      if (contact.phone) { $("c-phone").textContent = contact.phone; $("c-phone").href = "tel:" + contact.phone.replace(/\s+/g, ""); }
      if (contact.email) { $("c-email").textContent = contact.email; $("c-email").href = "mailto:" + contact.email; }
      $("c-hours").textContent = contact.hours || "";
      if (contact.map_embed_url) { $("c-map").src = contact.map_embed_url; $("c-map").hidden = false; }
    }
  );
})();
