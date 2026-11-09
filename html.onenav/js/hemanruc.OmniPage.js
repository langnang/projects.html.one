(function (global, factory) {
  "use strict";
  /* ============================================================
   * 农历数据（1900–2100 年）
   * ============================================================ */
  const lunarInfo = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0
  ];

  /* ============================================================
   * 默认书签数据（首次使用或数据损坏时加载）
   * ============================================================ */
  const defaultData = {
    "title": "OneNav",
    "categories": [
      //   {
      //     "id": "useful",
      //     "title": "常用网站",
      //     "links": [
      //       {
      //         "name": "AMiner",
      //         "url": "https://www.aminer.cn/",
      //         "description": "学术搜索与分析",
      //         "keywords": "示例"
      //       },
      //       {
      //         "name": "X-MOL",
      //         "url": "https://www.x-mol.com/",
      //         "description": "学术资讯平台",
      //         "keywords": "示例"
      //       }
      //     ]
      //   },
      //   {
      //     "id": "journals",
      //     "title": "期刊官网",
      //     "links": [
      //       {
      //         "name": "Nature",
      //         "url": "https://www.nature.com/",
      //         "description": "",
      //         "keywords": ""
      //       },
      //       {
      //         "name": "Science",
      //         "url": "https://www.science.org/",
      //         "description": "",
      //         "keywords": ""
      //       }
      //     ]
      //   },
      //   {
      //     "id": "scholars",
      //     "title": "关注学者",
      //     "links": [
      //       {
      //         "name": "张希",
      //         "url": "http://zhangxigroup.com/",
      //         "description": "清华大学",
      //         "keywords": "超分子"
      //       },
      //       {
      //         "name": "裴坚",
      //         "url": "http://www.chem.pku.edu.cn/pei/",
      //         "description": "北京大学",
      //         "keywords": "有机电子"
      //       },
      //       {
      //         "name": "鲍哲楠",
      //         "url": "http://baogroup.stanford.edu/",
      //         "description": "斯坦福大学",
      //         "keywords": "柔性电子"
      //       }
      //     ]
      //   }
    ]
  };



  /* ============================================================
   * 常量与工具函数
   * ============================================================ */
  const STORAGE_KEY = 'onenav_data';
  const MOBILE_BREAKPOINT = 900;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);
  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  /** HTML 转义，防止标题/名称中的特殊字符破坏页面结构 */
  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** 底部 Toast 提示 */
  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  /* ============================================================
   * 农历计算
   * ============================================================ */
  function lunarYearDays(y) {
    let sum = 348;
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
    }
    return sum + leapDays(y);
  }

  function leapDays(y) {
    if (leapMonth(y)) return (lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
    return 0;
  }

  function leapMonth(y) {
    return lunarInfo[y - 1900] & 0xf;
  }

  function monthDays(y, m) {
    return (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
  }

  function solarToLunar(date) {
    const y = date.getFullYear();
    if (y < 1900 || y > 2100) return null;

    const baseDate = new Date(1900, 0, 31);
    let offset = Math.floor((date - baseDate) / 86400000);

    let lunarYear = 1900;
    let i;
    for (i = 1900; i < 2100 && offset > 0; i++) {
      offset -= lunarYearDays(i);
      lunarYear = i;
    }
    if (offset < 0) {
      offset += lunarYearDays(lunarYear);
      lunarYear--;
    }

    const leap = leapMonth(lunarYear);
    let isLeap = false;
    let lunarMonth = 1;
    for (i = 1; i < 13 && offset > 0; i++) {
      let temp;
      if (leap > 0 && i === leap + 1 && !isLeap) {
        --i;
        isLeap = true;
        temp = leapDays(lunarYear);
      } else {
        temp = monthDays(lunarYear, i);
      }
      if (isLeap && i === leap + 1) isLeap = false;
      offset -= temp;
      if (!isLeap) lunarMonth++;
    }
    if (offset === 0 && leap > 0 && i === leap + 1) {
      if (isLeap) { isLeap = false; } else { isLeap = true; --i; }
    }
    if (offset < 0) {
      offset += isLeap ? leapDays(lunarYear) : monthDays(lunarYear, i - 1);
      if (!isLeap) lunarMonth--;
    }
    return { year: lunarYear, month: lunarMonth, day: offset + 1, isLeap: isLeap };
  }

  /** 数字转中文（如 2026 → 二〇二六样式的逐位转换用于年份，带单位转换用于月日） */
  function numToChinese(num) {
    const chars = '零一二三四五六七八九';
    if (num === 0) return '零';
    const units = ['', '十', '百', '千'];
    let str = '';
    let unitPos = 0;
    let zero = false;
    while (num > 0) {
      const digit = num % 10;
      if (digit === 0) {
        if (!zero && str) zero = true;
      } else {
        if (zero) { str = chars[0] + str; zero = false; }
        str = chars[digit] + units[unitPos] + str;
      }
      num = Math.floor(num / 10);
      unitPos++;
    }
    if (str.startsWith('一十') && str.length === 2) str = str.substring(1);
    return str;
  }

  /* ============================================================
   * 全局状态
   * ============================================================ */
  let isEditing = false;            // 是否处于编辑模式
  let appData = null;               // 当前生效的数据
  let tempData = null;              // 编辑前的快照（用于取消时还原）
  let dragSrc = null;               // 当前拖拽源 { type, catIdx, linkIdx }
  let currentExportFormat = 'json'; // 导出格式
  let sidebarOpen = false;          // 移动端侧栏展开状态
  let scrollObserver = null;        // 滚动高亮观察器



  /** 从 localStorage 读取数据；缺失或损坏时回退到默认数据 */
  function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return deepClone(defaultData);
    try {
      const data = JSON.parse(saved);
      // 兼容旧数据：补齐 keywords 字段
      data.categories.forEach(cat => {
        cat.links.forEach(link => {
          if (link.keywords === undefined) link.keywords = '';
        });
      });
      return data;
    } catch (e) {
      return deepClone(defaultData);
    }
  }

  /* ============================================================
   * 顶部日历
   * ============================================================ */
  function updateCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];

    let lunarStr = '';
    const lunar = solarToLunar(now);
    if (lunar) {
      lunarStr = `农历${numToChinese(lunar.year)}年${numToChinese(lunar.month)}月${numToChinese(lunar.day)}日`;
    }

    $('#calendarDate').innerHTML =
      `<div class="cal-gregorian">${year}年${month}月${day}日 ${weekday}</div>` +
      (lunarStr ? `<div class="cal-lunar">${lunarStr}</div>` : '');
  }

  /* ============================================================
   * 渲染：左侧导航
   * ============================================================ */
  function renderNav() {
    const navList = $('#navList');
    navList.innerHTML = '';

    // 顶部「融合搜索」入口
    const searchItem = document.createElement('a');
    searchItem.className = 'nav-item';
    searchItem.textContent = '融合搜索';
    searchItem.onclick = (e) => {
      e.preventDefault();
      hideGuide();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.innerWidth <= MOBILE_BREAKPOINT) toggleSidebar();
    };
    navList.appendChild(searchItem);

    appData.categories.forEach((cat, idx) => {
      const item = document.createElement('a');
      item.className = 'nav-item';
      item.dataset.idx = idx;
      item.textContent = stripEmoji(cat.title);
      item.onclick = (e) => {
        e.preventDefault();
        hideGuide();
        scrollToCategory(idx);
        if (window.innerWidth <= MOBILE_BREAKPOINT) toggleSidebar();
      };
      navList.appendChild(item);
    });
  }

  /** 去除标题中的 emoji 与星标，供导航栏显示 */
  function stripEmoji(text) {
    const stars = '★☆';
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const cp = text.codePointAt(i);
      if (cp >= 0x1F300 && cp <= 0x1F9FF) continue;
      if (cp >= 0x2600 && cp <= 0x27BF) continue;
      if (stars.includes(text[i])) continue;
      result += text[i];
      if (cp > 0xFFFF) i++;
    }
    return result.trim();
  }

  function scrollToCategory(idx) {
    const el = $(`.category[data-idx="${idx}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    $('#sidebar').classList.toggle('open', sidebarOpen);
  }

  /* ============================================================
   * 滚动高亮（scroll spy）
   * ============================================================ */
  function setupScrollSpy() {
    if (scrollObserver) scrollObserver.disconnect();
    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = entry.target.dataset.idx;
          $$('.nav-item').forEach(n => n.classList.remove('active'));
          const activeNav = $(`.nav-item[data-idx="${idx}"]`);
          if (activeNav) activeNav.classList.add('active');
        }
      });
    }, { rootMargin: '-40px 0px -60% 0px', threshold: 0 });
    $$('.category').forEach(cat => scrollObserver.observe(cat));
  }

  /* ============================================================
   * 渲染：主体（分类与链接）
   * ============================================================ */
  function render() {
    const container = $('#mainContainer');
    container.innerHTML = '';


    console.log(`render`, appData)
    appData.categories.forEach((cat, catIdx) => {
      const section = document.createElement('div');
      section.className = 'category' + (isEditing ? ' editing' : '');
      section.dataset.idx = catIdx;
      if (isEditing) {
        section.draggable = true;
        section.addEventListener('dragstart', e => handleCatDragStart(e, catIdx));
        section.addEventListener('dragover', e => handleCatDragOver(e, catIdx));
        section.addEventListener('drop', e => handleCatDrop(e, catIdx));
        section.addEventListener('dragend', handleCatDragEnd);
      }

      // 分类头部
      const header = document.createElement('div');
      header.className = 'cat-header';
      header.innerHTML = isEditing
        ? `<span class="cat-deco"></span>` +
        `<input class="cat-title-input" value="${escapeHtml(cat.title)}" onchange="updateCatTitle(${catIdx}, this.value)">` +
        `<span class="drag-hint">拖拽/箭头调整顺序</span>` +
        `<div class="cat-actions">` +
        `<button class="btn-xs btn-secondary" onclick="moveCat(${catIdx}, -1)">↑</button>` +
        `<button class="btn-xs btn-secondary" onclick="moveCat(${catIdx}, 1)">↓</button>` +
        `<button class="btn-xs btn-danger" onclick="deleteCategory(${catIdx})">删除</button>` +
        `</div>`
        : `<span class="cat-deco"></span><div class="cat-title">${escapeHtml(cat.title)}</div>`;
      if (!isEditing) {
        const tagList = document.createElement('div');
        tagList.className = 'tag-group';
        (cat.tags || []).forEach(tag => {
          const span = document.createElement('span');
          span.innerHTML = tag.title;
          span.className = 'tag-item';
          span.addEventListener('click', e => {
            const target = e.currentTarget;
            const active = e.currentTarget.classList.contains('active');
            [...target.parentNode.children].filter(child => child !== target).forEach(e_v => e_v.classList.remove('active'));
            target.classList.toggle('active', !active);
            section.replaceChild(buildCategoryBody(active ? cat : tag, catIdx), $(`div[data-cat-idx='${catIdx}']`));
          });
          tagList.appendChild(span);
        })
        header.appendChild(tagList);
      }

      section.appendChild(header);


      section.appendChild(buildCategoryBody(cat, catIdx));

      // 编辑模式下的「添加链接」栏
      if (isEditing) {
        const addBar = document.createElement('div');
        addBar.className = 'add-link-bar';
        addBar.innerHTML = `<button class="btn btn-secondary" style="width:100%" onclick="addLink(${catIdx})">➕ 添加链接</button>`;
        section.appendChild(addBar);
      }

      container.appendChild(section);
    });

    setupScrollSpy();
  }
  function buildCategoryBody(cat, catIdx) {
    // 分类主体
    const body = document.createElement('div');
    body.className = 'cat-body';
    body.dataset.catIdx = catIdx;
    if (isEditing) {
      body.addEventListener('dragover', e => handleLinkDragOver(e, catIdx));
      body.addEventListener('drop', e => handleLinkDrop(e, catIdx));
    }

    const grid = document.createElement('div');
    grid.className = 'links-grid';
    const links = [...cat.links, ...(cat.tags || []).reduce((t, v) => [...t, ...v.links], [])]
    if (links && links.length > 0) {
      links.forEach((link, linkIdx) => {
        grid.appendChild(isEditing
          ? buildEditCard(link, catIdx, linkIdx)
          : buildLinkCard(link));
      });
    } else if (!isEditing) {
      grid.innerHTML = '<div class="empty-state">暂无链接</div>';
    }
    body.appendChild(grid);
    return body;
  }
  /** 浏览模式下的链接卡片 */
  function buildLinkCard(link) {
    const a = document.createElement('a');
    a.className = 'link-card';
    a.href = link.url;
    a.target = '_blank';
    a.title = link.url + (link.description ? ' — ' + link.description : '') + (link.keywords ? ' [' + link.keywords + ']' : '');
    const deadDot = link._dead
      ? '<span class="link-status show" style="display:block"></span>'
      : '<span class="link-status"></span>';
    a.innerHTML =
      `<div style="overflow:hidden;width:100%">` +
      `<div class="link-name">${escapeHtml(link.name)}</div>` +
      (link.description ? `<div class="link-desc">${escapeHtml(link.description)}</div>` : '') +
      (link.keywords ? `<div class="link-keywords">${escapeHtml(link.keywords)}</div>` : '') +
      `</div>` + deadDot;
    return a;
  }

  /** 编辑模式下的链接编辑卡片 */
  function buildEditCard(link, catIdx, linkIdx) {
    const card = document.createElement('div');
    card.className = 'link-card';
    card.draggable = true;
    card.dataset.catIdx = catIdx;
    card.dataset.linkIdx = linkIdx;
    card.addEventListener('dragstart', e => handleLinkDragStart(e, catIdx, linkIdx));
    card.addEventListener('dragover', e => handleLinkItemDragOver(e, catIdx, linkIdx));
    card.addEventListener('drop', e => handleLinkItemDrop(e, catIdx, linkIdx));
    card.addEventListener('dragend', handleLinkDragEnd);

    const deadDot = link._dead ? '<span class="link-status show" style="display:block"></span>' : '';
    const field = (placeholder, key, value) =>
      `<input placeholder="${placeholder}" value="${escapeHtml(value)}" onchange="updateLink(${catIdx}, ${linkIdx}, '${key}', this.value)">`;
    card.innerHTML = deadDot +
      `<div class="edit-row">` +
      field('姓名/名称', 'name', link.name) +
      field('URL', 'url', link.url) +
      field('备注', 'desc', link.description || '') +
      field('关键词', 'keywords', link.keywords || '') +
      `<div class="edit-actions"><button class="btn-xs btn-danger" onclick="deleteLink(${catIdx}, ${linkIdx})">删除</button></div>` +
      `</div>`;
    return card;
  }

  /* ============================================================
   * 拖拽：分类排序
   * ============================================================ */
  function handleCatDragStart(e, catIdx) {
    dragSrc = { type: 'cat', catIdx: catIdx };
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'cat:' + catIdx);
  }

  function handleCatDragOver(e, catIdx) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragSrc && dragSrc.type === 'cat' && dragSrc.catIdx !== catIdx) {
      e.currentTarget.classList.add('drag-over');
    }
  }

  function handleCatDrop(e, catIdx) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (!dragSrc || dragSrc.type !== 'cat' || dragSrc.catIdx === catIdx) return;
    const cats = appData.categories;
    const moved = cats.splice(dragSrc.catIdx, 1)[0];
    cats.splice(catIdx, 0, moved);
    render();
    renderNav();
  }

  function handleCatDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    $$('.category').forEach(el => el.classList.remove('drag-over'));
    dragSrc = null;
  }

  /* ============================================================
   * 拖拽：链接排序 / 跨分类移动
   * ============================================================ */
  function handleLinkDragStart(e, catIdx, linkIdx) {
    dragSrc = { type: 'link', catIdx: catIdx, linkIdx: linkIdx };
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `link:${catIdx}:${linkIdx}`);
    e.stopPropagation();
  }

  function handleLinkItemDragOver(e, catIdx, linkIdx) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (dragSrc && dragSrc.type === 'link') {
      e.currentTarget.classList.add('drag-over');
    }
  }

  /** 拖到某个链接卡片上：插入到该位置（支持同分类排序与跨分类移动） */
  function handleLinkItemDrop(e, catIdx, linkIdx) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    if (!dragSrc || dragSrc.type !== 'link') return;
    const fromCat = dragSrc.catIdx;
    const fromLink = dragSrc.linkIdx;
    if (fromCat === catIdx && fromLink === linkIdx) return;
    const link = appData.categories[fromCat].links.splice(fromLink, 1)[0];
    appData.categories[catIdx].links.splice(linkIdx, 0, link);
    render();
  }

  /** 拖到分类空白区域：追加到该分类末尾 */
  function handleLinkDragOver(e, catIdx) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragSrc && dragSrc.type === 'link' && dragSrc.catIdx !== catIdx) {
      e.currentTarget.classList.add('drag-over');
    }
  }

  function handleLinkDrop(e, catIdx) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    if (!dragSrc || dragSrc.type !== 'link' || dragSrc.catIdx === catIdx) return;
    const link = appData.categories[dragSrc.catIdx].links.splice(dragSrc.linkIdx, 1)[0];
    appData.categories[catIdx].links.push(link);
    render();
  }

  function handleLinkDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    $$('.link-card').forEach(el => el.classList.remove('drag-over'));
    $$('.cat-body').forEach(el => el.classList.remove('drag-over'));
    dragSrc = null;
  }

  /* ============================================================
   * 编辑模式
   * ============================================================ */
  function toggleEdit() {
    isEditing = true;
    tempData = deepClone(appData);
    hideGuide();
    updateEditUI();
    render();
  }

  function saveData() {
    isEditing = false;
    tempData = null;
    appData.categories.forEach(cat => {
      cat.links.forEach(link => delete link._dead);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    updateEditUI();
    hideGuide();
    render();
    renderNav();
    showToast('已保存到本地');
  }

  function cancelEdit() {
    isEditing = false;
    if (tempData) appData = tempData;
    tempData = null;
    updateEditUI();
    hideGuide();
    render();
    renderNav();
  }

  /** 根据编辑状态切换侧栏按钮与「添加新分类」栏的显隐 */
  function updateEditUI() {
    $('#btnEdit').style.display = isEditing ? 'none' : 'block';
    $('#btnSave').style.display = isEditing ? 'block' : 'none';
    $('#btnCancel').style.display = isEditing ? 'block' : 'none';
    $('#addCatBar').style.display = isEditing ? 'block' : 'none';
  }

  /* ---- 编辑操作 ---- */
  function updateCatTitle(idx, val) {
    appData.categories[idx].title = val;
    renderNav();
  }

  function updateLink(catIdx, linkIdx, field, val) {
    appData.categories[catIdx].links[linkIdx][field] = val;
  }

  function deleteLink(catIdx, linkIdx) {
    appData.categories[catIdx].links.splice(linkIdx, 1);
    render();
  }

  function addLink(catIdx) {
    appData.categories[catIdx].links.push({ name: '新链接', url: 'https://', description: '', keywords: '' });
    render();
  }

  function addCategory() {
    appData.categories.push({ id: 'cat_' + Date.now(), title: '新分类', links: [] });
    render();
    renderNav();
  }

  function deleteCategory(idx) {
    if (!confirm('确定删除此分类及其所有链接吗？')) return;
    appData.categories.splice(idx, 1);
    render();
    renderNav();
  }

  function moveCat(idx, dir) {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= appData.categories.length) return;
    const cats = appData.categories;
    [cats[idx], cats[newIdx]] = [cats[newIdx], cats[idx]];
    render();
    renderNav();
  }

  /* ============================================================
   * 融合搜索
   * ============================================================ */
  function setupEngines() {
    const tags = $$('.engine-tag');
    tags.forEach(tag => {
      tag.addEventListener('click', () => {
        tags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
      });
    });
  }

  function doSearch() {
    const kw = $('#searchInput').value.trim();
    if (!kw) return;
    hideGuide();
    const active = $('.engine-tag.active');
    window.open(active.dataset.url + encodeURIComponent(kw), '_blank');
  }

  /* ============================================================
   * 链接可达性检查
   * ============================================================ */
  async function checkAllLinks() {
    if (isEditing) {
      showToast('请先保存或取消编辑后再检查');
      return;
    }
    showToast('开始检查链接，请稍候...');

    // 建立「名称 → 卡片」映射，并把所有状态点置为检查中
    const cards = Array.from($$('.link-card'));
    const cardMap = new Map();
    cards.forEach(card => {
      const name = card.querySelector('.link-name')?.textContent;
      if (name) cardMap.set(name, card);

      let statusDot = card.querySelector('.link-status');
      if (!statusDot) {
        statusDot = document.createElement('span');
        card.appendChild(statusDot);
      }
      statusDot.className = 'link-status checking';
      statusDot.style.display = 'block';
    });

    // 收集全部链接
    const allLinks = [];
    appData.categories.forEach((cat, catIdx) => {
      cat.links.forEach((link, linkIdx) => allLinks.push({ link, catIdx, linkIdx }));
    });

    // 分批并发检查
    let dead = 0;
    const batchSize = 5;
    for (let i = 0; i < allLinks.length; i += batchSize) {
      const batch = allLinks.slice(i, i + batchSize);
      await Promise.all(batch.map(async item => {
        const result = await checkLink(item.link.url);
        if (result === 'dead') {
          item.link._dead = true;
          dead++;
        } else {
          delete item.link._dead;
        }
        const card = cardMap.get(item.link.name);
        const statusDot = card && card.querySelector('.link-status');
        if (statusDot) {
          statusDot.classList.remove('checking');
          if (item.link._dead) {
            statusDot.classList.add('show');
            statusDot.style.display = 'block';
          } else {
            statusDot.classList.remove('show');
            statusDot.style.display = 'none';
          }
        }
      }));
    }
    showToast(`检查完成：${allLinks.length} 个链接，${dead} 个可能失效`);
  }

  /** 单个链接检查：先 HEAD，失败后退回 no-cors GET */
  async function checkLink(url) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) return 'ok';
    } catch (e) { /* 忽略，继续尝试 GET */ }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      await fetch(url, { method: 'GET', mode: 'no-cors', signal: controller.signal });
      clearTimeout(timer);
      return 'cors';
    } catch (e) { /* 视为失效 */ }

    return 'dead';
  }

  /* ============================================================
   * 导出
   * ============================================================ */
  function selectExportFormat(fmt) {
    currentExportFormat = fmt;
    $$('.export-option').forEach(el => {
      el.classList.toggle('selected', el.dataset.format === fmt);
    });
    refreshExportContent();
  }

  /** 根据所选格式刷新弹窗中的导出内容 */
  function refreshExportContent() {
    const hint = '点击下方按钮直接保存到本地，或复制文本手动保存。';
    if (currentExportFormat === 'json') {
      $('#jsonArea').value = JSON.stringify(appData, null, 2);
    } else {
      const lines = [];
      appData.categories.forEach(cat => {
        lines.push(`【${cat.title}】`);
        if (cat.links && cat.links.length > 0) {
          cat.links.forEach(link => {
            lines.push(link.name || '', link.url || '', link.description || '', link.keywords || '', '');
          });
        } else {
          lines.push('(暂无链接)', '');
        }
      });
      $('#jsonArea').value = lines.join('\n').trim();
    }
    $('#modalHint').textContent = hint;
  }

  function exportData() {
    currentExportFormat = 'json';
    $$('.export-option').forEach(el => {
      el.classList.toggle('selected', el.dataset.format === 'json');
    });
    $('#modalTitle').textContent = '导出数据';
    $('#modalAction').style.display = 'none';
    $('#exportOptions').style.display = 'flex';
    $('#importFileWrap').style.display = 'none';
    $('#btnDownload').style.display = 'inline-flex';
    refreshExportContent();
    $('#modal').classList.add('active');
  }

  function downloadExport() {
    const content = $('#jsonArea').value;
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `omnipage-${dateStr}.${currentExportFormat}`;
    const mime = currentExportFormat === 'json' ? 'application/json' : 'text/plain';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('已下载: ' + filename);
  }

  /* ============================================================
   * 导入
   * ============================================================ */
  function showImport() {
    $('#jsonArea').value = '';
    $('#modalTitle').textContent = '导入数据';
    $('#modalHint').textContent = '选择本地 JSON 文件上传，或粘贴 JSON 文本后点击确认导入。注意：这会覆盖当前所有数据！';
    $('#modalAction').style.display = 'inline-flex';
    $('#exportOptions').style.display = 'none';
    $('#importFileWrap').style.display = 'block';
    $('#btnDownload').style.display = 'none';
    $('#modal').classList.add('active');
  }

  function handleFileImport(input) {
    const file = input.files[0];
    console.log(file);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      $('#jsonArea').value = e.target.result;
      $('#jsonArea').setAttribute('filename', file.name);
      $('#jsonArea').setAttribute('filetype', file.type);
      $('#jsonArea').setAttribute('filesize', file.size);
    };
    reader.readAsText(file);
    input.value = '';
  }


  function confirmImport() {
    const text = $('#jsonArea').value.trim();
    const filename = $('#jsonArea').getAttribute('filename');
    const filetype = $('#jsonArea').getAttribute('filetype');
    const filesize = $('#jsonArea').getAttribute('filesize');
    if (!text) return;
    try {
      let data = null;
      if (filetype == 'application/json') {
        data = JSON.parse(text);
      } else if (filetype == 'text/html') {
        var doc = (new DOMParser()).parseFromString(text, filetype);
        console.log(doc);
        let categories = [];
        doc.querySelectorAll("body>dl>dt").forEach(el => {
          categories.push(dom_to_json(el, (dom, obj) => {
            if (dom.nodeName == 'DT') {
              const linkNode = obj.children.find(v => v.nodeName == 'A');
              if (linkNode) {
                obj = linkNode;
              }
            }
            return obj
          }));
        })
        console.log(categories);
        return;
      }
      if (!data.categories || !Array.isArray(data.categories)) throw new Error('格式错误');
      appData = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
      render();
      renderNav();
      closeModal();
      showToast('导入成功');
    } catch (e) {
      console.error(`confirmImport: ${e}`);
      alert('JSON 格式错误，请检查文本内容');
    }
  }

  function closeModal() {
    $('#modal').classList.remove('active');
  }

  /* ============================================================
   * 功能介绍页
   * ============================================================ */
  function showGuide() {
    $('.calendar-bar').style.display = 'none';
    $('.search-section').style.display = 'none';
    $('#mainContainer').style.display = 'none';
    $('#addCatBar').style.display = 'none';
    $('#guideSection').style.display = 'block';
    $$('.nav-item').forEach(n => n.classList.remove('active'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function hideGuide() {
    $('.calendar-bar').style.display = '';
    $('.search-section').style.display = '';
    $('#mainContainer').style.display = '';
    $('#addCatBar').style.display = isEditing ? 'block' : 'none';
    $('#guideSection').style.display = 'none';
  }
  /* ============================================================
  * 全局事件
  * ============================================================ */
  function bind() {
    $("#btnEdit").onclick = () => toggleEdit();
    $("#btnSave").onclick = () => saveData();
    $("#btnCancel").onclick = () => cancelEdit();
    $("#btnExport").onclick = () => exportData();
    $("#btnImport").onclick = () => showImport();
    $("#btnCheckLinks").onclick = () => checkAllLinks();

    $("#sidebarToggle").onclick = () => toggleSidebar();

    $("#searchInput").onkeydown = (event) => { if (event.key === 'Enter') doSearch(); }
    $("#btnSearch").onclick = () => doSearch();

    // <div class="export-option" data-format="txt" onclick="selectExportFormat('txt')">
    $$(".export-option").forEach(el => {
      el.onclick = (event) => selectExportFormat(event.currentTarget.getAttribute('data-format'));
    });
    $("#importFile").onchange = (event) => handleFileImport(event.currentTarget);
    $("#modelCancel").onclick = () => closeModal();
    $("#btnDownload").onclick = () => downloadExport();
    $("#modalAction").onclick = () => confirmImport();

    // 点击遮罩关闭弹窗
    $('#modal').addEventListener('click', (e) => {
      if (e.target.id === 'modal') closeModal();
    });

    // Esc：优先关闭弹窗，其次取消编辑
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if ($('#modal').classList.contains('active')) closeModal();
        else if (isEditing) cancelEdit();
      }
    });
  }
  /* ============================================================
   * 初始化
   * ============================================================ */
  function init(options = null) {
    appData = options || loadData();
    console.log(`init`, appData);

    $("#app").innerHTML = `<!-- 左侧导航栏 -->
    <nav class="sidebar" id="sidebar">
      <div class="sidebar-title">${appData.title}</div>
      <div id="navList"></div>
      <div class="sidebar-bottom" id="sidebarBottom">
        <button class="btn btn-primary" id="btnEdit" onclick="toggleEdit()" style="display:none">编辑</button>
        <button class="btn btn-success" id="btnSave" onclick="saveData()" style="display:none">保存</button>
        <button class="btn btn-secondary" id="btnCancel" onclick="cancelEdit()" style="display:none">取消</button>
        <button class="btn btn-secondary" id="btnExport" onclick="exportData()">导出</button>
        <button class="btn btn-secondary" id="btnImport" onclick="showImport()">导入</button>
        <button class="btn btn-secondary" id="btnCheckLinks" onclick="checkAllLinks()">检查链接</button>
        <button class="btn btn-secondary" onclick="showGuide()" style="display:none">功能介绍</button>
      </div>
    </nav>
    <button class="sidebar-toggle" id="sidebarToggle" onclick="toggleSidebar()">☰</button>

    <div class="main-wrap">
      <main class="main" style="height: calc(100vh - 61px);overflow-y: auto;">
      <!-- 顶部日历 -->
      <div class="calendar-bar">
        <div class="calendar-card" id="calendarDate"></div>
      </div>

      <!-- 融合搜索 -->
      <div class="search-section">
        <div class="search-box">
          <input type="text" class="search-input" id="searchInput" placeholder="输入关键词搜索..."
            onkeydown="if(event.key==='Enter')doSearch()">
          <button id="btnSearch" class="search-btn">搜索</button>
        </div>
        <div class="search-engines" id="engineList">
          <span class="engine-tag active" data-url="https://www.quark.cn/s/?q=">夸克</span>
          <span class="engine-tag" data-url="https://www.baidu.com/s?wd=">百度</span>
          <span class="engine-tag" data-url="https://cn.bing.com/search?q=">必应</span>
          <span class="engine-tag" data-url="https://www.google.com.hk/search?q=">谷歌</span>
          <span class="engine-tag" data-url="https://github.com/search?q=">GitHub</span>
          
          <span class="engine-tag" data-url="https://s.taobao.com/search?q=" style="display:none">淘宝</span>
          <span class="engine-tag" data-url="https://search.jd.com/Search?keyword=" style="display:none">京东</span>
        </div>
      </div>

      <!-- 分类与链接（由 JS 渲染） -->
      <div class="container" id="mainContainer"></div>
      </main>

      <!-- 底部信息 -->
      <footer id="mainFooter">
        develop by <a target="_blank" href="https://github.com/langnang">langnang</a> fork from <a target="_blank"
          href="https://github.com/hemanruc/OmniPage">hemanruc/OmniPage</a>
      </footer>

      <div class="add-cat-bar" id="addCatBar">
        <button class="btn btn-primary" onclick="addCategory()">添加新分类</button>
      </div>

      <!-- 功能介绍页 -->
      <div class="guide-section" id="guideSection" style="display:none">
        <div class="guide-header">
          <div class="guide-icon">📖</div>
          <h1>OmniPage 功能介绍</h1>
          <p>您的个人导航主页使用指南</p>
        </div>
        <div class="guide-body">
          <div class="guide-card">
            <div class="guide-figure">
              <div class="fig-bookmark">
                <div class="fig-browser-bar">🌐 OmniPage</div>
                <div class="fig-star">⭐ 已收藏</div>
              </div>
            </div>
            <div class="guide-text">
              <h3><span class="num">1</span>收藏本页为书签</h3>
              <p>建议将本页添加为浏览器书签，方便随时访问：</p>
              <ul>
                <li><strong>Chrome / Edge</strong>：按 <kbd>Ctrl+D</kbd>（Windows）或 <kbd>Cmd+D</kbd>（Mac），选择书签栏保存</li>
                <li><strong>Firefox</strong>：按 <kbd>Ctrl+D</kbd>，选择「书签工具栏」保存</li>
                <li><strong>Safari</strong>：按 <kbd>Cmd+D</kbd>，选择「个人收藏夹」</li>
              </ul>
              <p>💡 <em>提示：您也可以将本页设为浏览器启动主页，每次打开浏览器即可直达。</em></p>
            </div>
          </div>

          <div class="guide-card">
            <div class="guide-figure">
              <div class="fig-search">
                <div class="fig-input"><span>🔍</span> 关键词</div>
                <div class="fig-btns"><span class="fig-tag active">夸克</span><span class="fig-tag">必应</span></div>
              </div>
            </div>
            <div class="guide-text">
              <h3><span class="num">2</span>融合搜索</h3>
              <p>页面顶部是<strong>融合搜索框</strong>，输入关键词后点击「搜索」即可跳转。</p>
              <p>支持切换不同搜索引擎：夸克、必应、谷歌、淘宝、京东。点击标签即可切换默认引擎。</p>
              <p>💡 <em>提示：按回车键可直接触发搜索。</em></p>
            </div>
          </div>

          <div class="guide-card">
            <div class="guide-figure">
              <div class="fig-nav">
                <div class="fig-nav-item active">常用网站</div>
                <div class="fig-nav-item">期刊官网</div>
                <div class="fig-nav-item">关注学者</div>
              </div>
            </div>
            <div class="guide-text">
              <h3><span class="num">3</span>分类导航</h3>
              <p>左侧固定导航栏列出所有分类，点击即可<strong>平滑滚动</strong>到对应板块。</p>
              <p>滚动页面时，左侧导航会自动高亮当前所在分类（滚动监听）。</p>
              <p>每个分类标题前都有<strong>主题色竖条</strong>标识，简洁醒目，风格中性百搭。</p>
            </div>
          </div>

          <div class="guide-card">
            <div class="guide-figure">
              <div class="fig-edit">
                <div class="fig-card">
                  <div class="fig-line" style="width:60%"></div>
                  <div class="fig-line" style="width:40%"></div>
                </div>
                <div class="fig-drag" title="拖拽">↕️</div>
              </div>
            </div>
            <div class="guide-text">
              <h3><span class="num">4</span>编辑模式</h3>
              <p>点击左侧「<strong>编辑</strong>」按钮进入编辑模式，此时：</p>
              <ul>
                <li>每个链接卡片变成可编辑表单，可直接修改<strong>名称、URL、备注、关键词</strong></li>
                <li>拖拽链接卡片可<strong>调整同一分类内</strong>的顺序</li>
                <li>点击 ↑ ↓ 箭头可<strong>调整分类顺序</strong></li>
                <li>点击「➕ 添加链接」可在该分类下新增条目</li>
                <li>点击「添加新分类」可创建全新板块</li>
              </ul>
              <p>✏️ 修改完成后，点击「<strong>保存</strong>」写入浏览器本地存储；点击「取消」放弃修改。</p>
            </div>
          </div>

          <div class="guide-card">
            <div class="guide-figure">
              <div class="fig-io">
                <div class="fig-box">📤 导出 JSON</div>
                <div class="fig-arrow">↓</div>
                <div class="fig-box">📁 本地文件</div>
                <div class="fig-arrow">↓</div>
                <div class="fig-box">📥 导入恢复</div>
              </div>
            </div>
            <div class="guide-text">
              <h3><span class="num">5</span>导入与导出</h3>
              <p>数据完全保存在您本地，支持<strong>备份与迁移</strong>：</p>
              <ul>
                <li><strong>导出</strong>：生成 JSON 或 TXT 格式文件下载到电脑，建议定期备份</li>
                <li><strong>导入</strong>：上传之前备份的 JSON 文件，或粘贴 JSON 文本，即可恢复全部数据</li>
              </ul>
              <p>🔒 <em>数据仅存储在浏览器 localStorage 中，不会上传到任何服务器。</em></p>
            </div>
          </div>

          <div class="guide-card">
            <div class="guide-figure">
              <div class="fig-check">
                <div class="fig-link">链接A <span class="fig-dot ok"></span></div>
                <div class="fig-link">链接B <span class="fig-dot dead"></span></div>
                <div class="fig-link">链接C <span class="fig-dot ok"></span></div>
              </div>
            </div>
            <div class="guide-text">
              <h3><span class="num">6</span>链接检查</h3>
              <p>点击左侧「<strong>检查链接</strong>」按钮，系统会批量检测所有 URL 的可达性。</p>
              <p>检测完成后，失效链接的卡片右上角会显示<strong>红色小圆点</strong>，方便您及时清理或更新。</p>
              <p>⚠️ 注意：部分网站可能因反爬虫机制被误判，请结合实际情况判断。</p>
            </div>
          </div>

          <div class="guide-card">
            <div class="guide-figure">
              <div class="fig-cal">
                <div class="fig-cal-card">
                  <div class="fig-cal-date">2026年08月05日</div>
                  <div class="fig-cal-lunar">农历二〇二六年六月廿三</div>
                </div>
              </div>
            </div>
            <div class="guide-text">
              <h3><span class="num">7</span>日历与农历</h3>
              <p>页面顶部显示<strong>公历日期</strong>与<strong>农历日期</strong>，方便您快速查看今日信息。</p>
            </div>
          </div>

          <div class="guide-footer">
            <p>🎉 以上就是 OmniPage 的全部功能。点击左侧任意分类即可开始使用！</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 导入 / 导出弹窗 -->
    <div class="modal-overlay" id="modal">
      <div class="modal">
        <div class="modal-header" id="modalTitle">导出数据</div>
        <div class="modal-body">
          <div class="export-options" id="exportOptions">
            <div class="export-option selected" data-format="json" onclick="selectExportFormat('json')">
              <div class="export-option-title">JSON</div>
              <div class="export-option-desc">结构化数据，适合备份恢复</div>
            </div>
            <div class="export-option" data-format="txt" onclick="selectExportFormat('txt')">
              <div class="export-option-title">TXT</div>
              <div class="export-option-desc">纯文本格式，逐行罗列</div>
            </div>
          </div>
          <div class="file-input-wrap" id="importFileWrap" style="display:none">
            <input type="file" id="importFile" accept=".htm,.html,.json" onchange="handleFileImport(this)">
            <button class="btn btn-secondary" onclick="document.getElementById('importFile').click()">上传文件</button>
          </div>
          <textarea class="json-area" id="jsonArea" placeholder=""></textarea>
          <div class="hint" id="modalHint">点击下方按钮直接保存到本地，或复制文本手动保存。</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modelCancel" onclick="closeModal()">关闭</button>
          <button class="btn btn-primary" id="btnDownload" onclick="downloadExport()">下载文件</button>
          <button class="btn btn-primary" id="modalAction" onclick="confirmImport()">确认导入</button>
        </div>
      </div>
    </div>`;

    render();
    renderNav();
    setupEngines();
    updateCalendar();

    bind();
  }
  /* ============================================================
   * 启动
   * ============================================================ */
  init();
  if (global.$onenav) {
    appData = global.$onenav;
    if (appData.fetch) {
      appData.fetch().then(res => {
        // console.log(`fetch`, res);
        appData = { ...appData, ...res };
        $(".sidebar-title").innerText = appData.title;
        render();
        renderNav();
      })
    }
  }

})(this, function () {
  'use strict';
});