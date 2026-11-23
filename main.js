(() => {
  "use strict";

  /* ---------- API console ---------- */
  const responses = {
    me: {
      verb: "GET", path: "/api/v1/me", code: "200 OK",
      body: {
        name: "Kaleru Yuvaraj",
        role: "Python Backend Developer",
        education: "B.Tech CSBS, GITAM University Bengaluru (2027)",
        location: "Hyderabad, India",
        experience: [{ company: "Infosys Springboard", title: "AI/ML Intern", period: "Nov 2025 – Jan 2026" }],
        open_to: ["Fresher full-time roles", "Internships"],
        available: true
      }
    },
    stack: {
      verb: "GET", path: "/api/v1/me/stack", code: "200 OK",
      body: {
        backend: ["FastAPI", "Pydantic", "SQLAlchemy", "REST", "JWT", "RBAC"],
        databases: ["PostgreSQL", "MySQL", "SQLite"],
        cloud: ["AWS EC2", "S3", "IAM", "Docker", "GitHub Actions"],
        data: ["Pandas", "NumPy", "Prophet", "Streamlit"],
        languages: ["Python", "Java", "JavaScript", "Bash"]
      }
    },
    projects: {
      verb: "GET", path: "/api/v1/me/projects?featured=true", code: "200 OK",
      body: [
        { name: "SupportDesk", endpoints: 13, roles: 3, live: true },
        { name: "AI Interview Assistant", status: "in_progress" },
        { name: "GitHub Reviewer Agent", llm: "Claude Haiku" },
        { name: "FitPulse", records: 2881, forecast_days: 5 }
      ]
    },
    hire: {
      verb: "POST", path: "/api/v1/hire", code: "201 Created",
      body: {
        message: "Thanks for reaching out!",
        email: "yuvaraj.kaleru.dev@gmail.com",
        phone: "+91 93927 16766",
        response_time_hours: 24,
        next_step: "Scroll to Contact or download the resume"
      }
    }
  };

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Pretty JSON with syntax colouring
  function highlight(obj) {
    const json = JSON.stringify(obj, null, 2);
    return esc(json).replace(
      /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?)/g,
      (m) => {
        let cls = "j-num";
        if (/^"/.test(m)) cls = /:$/.test(m) ? "j-key" : "j-str";
        else if (/true|false|null/.test(m)) cls = "j-bool";
        return `<span class="${cls}">${m}</span>`;
      }
    );
  }

  const out = document.getElementById("json");
  const verbEl = document.getElementById("req-verb");
  const pathEl = document.getElementById("req-path");
  const codeEl = document.getElementById("req-code");
  const tabs = document.querySelectorAll(".console__routes button");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let typing = null;

  function render(key, animate) {
    const r = responses[key];
    verbEl.textContent = r.verb;
    verbEl.className = "verb " + (r.verb === "POST" ? "verb--post" : "verb--get");
    pathEl.textContent = r.path;
    codeEl.textContent = r.code;
    clearInterval(typing);

    const html = highlight(r.body);
    if (!animate || reduced) { out.innerHTML = html; return; }

    // Type the plain text once, then swap in the coloured version
    const plain = JSON.stringify(r.body, null, 2);
    let i = 0;
    typing = setInterval(() => {
      i += 4;
      out.innerHTML = esc(plain.slice(0, i)) + '<span class="caret"></span>';
      if (i >= plain.length) { clearInterval(typing); out.innerHTML = html; }
    }, 16);
  }

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
      render(btn.dataset.route, false);
    });
    btn.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const list = [...tabs];
      const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
      const next = list[(list.indexOf(btn) + dir + list.length) % list.length];
      next.focus(); next.click();
    });
  });

  render("me", true);

  /* ---------- Nav ---------- */
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const links = document.getElementById("nav-links");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  });
  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A" && links.classList.contains("is-open")) toggle.click();
  });

  /* ---------- Certificate viewer ---------- */
  const viewer = document.getElementById("viewer");
  const vImg = document.getElementById("viewer-img");
  const vTitle = document.getElementById("viewer-title");
  document.querySelectorAll(".cert__view").forEach((btn) => {
    btn.setAttribute("aria-label", "View certificate: " + btn.dataset.title);
    btn.addEventListener("click", () => {
      vImg.src = btn.dataset.img;
      vImg.alt = btn.dataset.title + " certificate";
      vTitle.textContent = btn.dataset.title;
      if (typeof viewer.showModal === "function") viewer.showModal();
      else window.open(btn.dataset.img, "_blank");
    });
  });
  document.getElementById("viewer-close").addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", (e) => { if (e.target === viewer) viewer.close(); });

  /* ---------- Copy email ---------- */
  document.querySelectorAll(".copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = "Copied";
      } catch {
        btn.textContent = "Copy failed";
      }
      setTimeout(() => (btn.textContent = "Copy"), 1800);
    });
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
