# AKM Website

Information website for **Ashok Kumar Mittal, Advocate** — static site on GitHub Pages, content edited by AKM through `/admin`.

## Structure
- `index.html`, `css/`, `js/` — the public site (reads everything from `content/*.json`)
- `content/` — all editable text, tables, lists
- `uploads/` — photos and documents uploaded from the admin panel
- `admin/` — Content Manager (Sveltia CMS) with GitHub login

## Go live
1. Push this folder to `main` of `sachinxploro1/AKM_Website`.
2. Repo → Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
3. Site: `https://sachinxploro1.github.io/AKM_Website/` · Admin: `.../AKM_Website/admin/`

## How AKM logs in and edits
1. AKM needs a GitHub account, added as a collaborator (Write) on the repo.
2. Create a fine‑grained token for him: GitHub → Settings → Developer settings → Fine‑grained tokens → Repository: `AKM_Website` → Permissions: **Contents: Read and write**.
3. Open `/admin/` → **Sign In with Token** → paste token.
4. Edit any section → **Save**. Site updates in ~1 minute.

Optional: replace the token login with a "Sign in with GitHub" button by deploying the free `sveltia-cms-auth` Cloudflare Worker and adding `base_url` under `backend` in `admin/config.yml`.

## Bar Council of India (Rule 36) checklist
- Disclaimer gate shown before any content (visitor must click "I Agree").
- Only permitted info: name, address, phone, email, enrolment, qualifications, areas of practice.
- Do NOT add: testimonials, client names, case wins, fees, "best/top/expert" claims, photos with clients, rankings, or calls to "contact us for free consultation".
- No contact/enquiry form (avoids solicitation).
