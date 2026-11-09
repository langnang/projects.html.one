const of_type = val => Object.prototype.toString.call(val).slice(8, -1);
const h = (tag, attributes = {}, ...children) => {
  if (!tag) return;

  let tagId = tag.match(new RegExp(/#[a-zA-Z0-9-_]+/g));
  // tagId = tagId ? tagId[0].replace('#', '') : '';
  if (tagId) attributes.id = tagId[0].replace('#', '');

  let tagClass = tag.match(new RegExp(/\.[a-zA-Z0-9-_]+/g));
  // tagClass = tagClass ? tagClass.map(v => v.replace('.', '')).join(' ') : '';
  if (tagClass) attributes.class = tagClass.map(v => v.replace('.', '')).join(' ');

  let tagName = tag.match(new RegExp(/^[[a-zA-Z0-9-_]+/g));
  // tagName = tagName ? tagName[0] : '';
  if (tagName) tagName = tagName[0];

  // console.log(tag, tagName, tagId, tagClass)
  const element = document.createElement(tagName)
  for (let attribute in attributes) {
    if (attributes.hasOwnProperty(attribute)) {
      element.setAttribute(attribute, attributes[attribute])
    }
  }
  // console.log(Object.prototype.toString.call(element));
  // console.log(Object.prototype.toString.call(element));
  // console.log(Object.prototype.toString.call(attributes));
  const fragment = document.createDocumentFragment()
  children.forEach((child) => {
    if (!child) return;
    if (typeof child === 'string') {
      child = document.createTextNode(child)
    }
    fragment.appendChild(child)
  })
  element.appendChild(fragment)
  return element
}


const array_unique = array => [...new Set(array)];
const deep_clone = obj => JSON.parse(JSON.stringify(obj));

const local_get = key => key ? localStorage.getItem(key) : null;
const local_set = (key, value) => key ? localStorage.setItem(key, value) : null;
const session_get = key => key ? sessionStorage.getItem(key) : null;
const session_set = (key, value) => key ? sessionStorage.setItem(key, value) : null;

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const deepClone = obj => JSON.parse(JSON.stringify(obj));
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
const escape_html = text => text ? String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') : '';

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

let defaultData = {
  "categories": [
    {
      "id": "useful",
      "title": "常用网站",
      "links": [
        {
          "name": "AMiner",
          "url": "https://www.aminer.cn/",
          "description": "学术搜索与分析",
          "keywords": "示例"
        },
        {
          "name": "X-MOL",
          "url": "https://www.x-mol.com/",
          "description": "学术资讯平台",
          "keywords": "示例"
        }
      ]
    },
    {
      "id": "journals",
      "title": "期刊官网",
      "links": [
        {
          "name": "Nature",
          "url": "https://www.nature.com/",
          "description": "",
          "keywords": ""
        },
        {
          "name": "Science",
          "url": "https://www.science.org/",
          "description": "",
          "keywords": ""
        }
      ]
    },
    {
      "id": "scholars",
      "title": "关注学者",
      "links": [
        {
          "name": "张希",
          "url": "http://zhangxigroup.com/",
          "description": "清华大学",
          "keywords": "超分子"
        },
        {
          "name": "裴坚",
          "url": "http://www.chem.pku.edu.cn/pei/",
          "description": "北京大学",
          "keywords": "有机电子"
        },
        {
          "name": "鲍哲楠",
          "url": "http://baogroup.stanford.edu/",
          "description": "斯坦福大学",
          "keywords": "柔性电子"
        }
      ]
    }
  ]
};



/* ============================================================
 * 常量与工具函数
 * ============================================================ */
// const STORAGE_KEY = 'onenav_data';
const STORAGE_KEY = null;
const MOBILE_BREAKPOINT = 900;

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
(function (global, factory) {


  class OneNav {
    el = "#app";
    title = "OneNav";
    STORAGE_KEY = 'onenav_data';
    MOBILE_BREAKPOINT = 900;
    editable = false;             // 是否允许编辑
    importable = false;           // 是否允许导入
    exportable = false;           // 是否允许导出


    isEditing = false;            // 是否处于编辑模式
    appData = null;               // 当前生效的数据
    tempData = null;              // 编辑前的快照（用于取消时还原）
    dragSrc = null;               // 当前拖拽源 { type, catIdx, linkIdx }
    currentExportFormat = 'json'; // 导出格式

    sidebarOpen = false;          // 移动端侧栏展开状态

    scrollObserver = null;        // 滚动高亮观察器

    showSidebar = true;  // 左侧导航栏
    showNavbar = false; // 顶部菜单栏
    showFooter = true;  // 底部信息
    showGuide = false;  // 指南信息

    showCalendar = true;      // 日历组件
    showSearch = true;  // 搜索组件

    showCategoryHeader = true;
    showCategoryFooter = true;
    showLinkIco = true;
    showLinkDescription = true;
    showLinkKeywords = true;

    onInsertCategory = null;
    onDeleteCategory = null;
    onUpdateCategory = null;
    onInsertLink = null;
    onDeleteLink = null;
    onUpdateLink = null;

    innerHTML = "";

    constructor(options) {
      this.init(options);
      this.render();
      init();
    }
    init(options) {
      Object.keys(this).forEach(key => {
        this[key] = options[key] || this[key];
      })
    }

    render() {
      // 左侧导航栏
      $(this.el).appendChild(h('nav#sidebar.sidebar', {},
        h('div.sidebar-title', {}, this.title),
        h('div#navList', {},),
        h('div#sidebarBottom.sidebar-bottom', {},
          ...this.editable ? [
            h('button#btnEdit.btn.btn-primary', { onclick: toggleEdit() }, "编辑"),
            h('button#btnSave.btn.btn-success', { onclick: "saveData()", style: "display:none;" }, "保存"),
            h('button#btnCancel.btn.btn-secondary', { onclick: "cancelEdit()", style: "display:none;" }, "取消"),
          ] : [],
          h('button#.btn.btn-secondary', { onclick: () => showImport() }, "导出"),
          h('button#.btn.btn-secondary', { onclick: "showImport()" }, "导入"),
          h('button#.btn.btn-secondary', { onclick: "checkAllLinks()" }, "检查链接"),
          h('button#btnGuid.btn.btn-secondary', { onclick: "showGuide()", style: "display:none;", }, "功能介绍"),
        ),
      ));
      $(this.el).appendChild(h('button#sidebarToggle.sidebar-toggle', { onclick: "toggleSidebar()" },));
      $(this.el).appendChild(h('div.main-wrap', {},
        // 顶部日历
        this.showCalendar ? h('div.calendar-bar', {}, h('div#calendarDate.calendar-card', {},),) : '',
        //  融合搜索
        this.showSearch ? h('div.search-section', {},
          h('div.search-box', {},
            h('input#searchInput.search-input', { placeholder: "输入关键词搜索...", onkeydown: "if(event.key==='Enter')doSearch()" }),
            h('button.search-btn', { onclick: "doSearch()" }, "搜索",)),
          h('div#engineList.search-engines', {},
            h('span.engine-tag.active', { "data-url": "https://www.quark.cn/s/?q=" }, "夸克",),
            h('span.engine-tag', { "data-url": "https://www.baidu.com/s?wd=" }, "百度",),
            h('span.engine-tag', { "data-url": "https://cn.bing.com/search?q=" }, "必应",),
            h('span.engine-tag', { "data-url": "https://www.google.com.hk/search?q=" }, "谷歌",),
          ),
        ) : '',
        h('div#mainContainer.container', {},),
        h('div#mainFooter', {},
          "develop by ",
          h('a', { target: "_blank", href: "https://github.com/langnang" }, 'langnang'),
          ' fork from ',
          h('a', { target: "_blank", href: "https://github.com/hemanruc/OmniPage" }, 'hemanruc/OmniPage'),),
      ));


    }
    bind() {

    }
  }

  class toast {
    static show(message, type, duration = 3000) { }
    static info(message, duration = 3000) { }
    static warn(message, duration = 3000) { }
    static warning(message, duration = 3000) { }
    static error(message, duration = 3000) { }
    static success(message, duration = 3000) { }
  }

  this.OneNav = OneNav;
})(this, function () {
  'use strict';
})


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

/* ============================================================
 * 初始化
 * ============================================================ */
function init() {
  appData = loadData();
  render();
  renderNav();
  setupEngines();
  updateCalendar();
}


/** 从 localStorage 读取数据；缺失或损坏时回退到默认数据 */
function loadData() {
  const saved = local_get(STORAGE_KEY);
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
document.addEventListener('click', function (event) {
  console.log(event);
  if (event.target.id == 'sidebarToggle') {
    toggleSidebar();
  }
})
function toggleSidebar() {
  sidebarOpen = !sidebarOpen;
  console.log(`toggleSidebar`, sidebarOpen)
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
  console.log(appData)
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
    section.appendChild(header);

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
    if (cat.links && cat.links.length > 0) {
      cat.links.forEach((link, linkIdx) => {
        grid.appendChild(isEditing
          ? buildEditCard(link, catIdx, linkIdx)
          : buildLinkCard(link));
      });
    } else if (!isEditing) {
      grid.innerHTML = '<div class="empty-state">暂无链接</div>';
    }
    body.appendChild(grid);
    section.appendChild(body);

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
    (link.description ? `<div class="link-description">${escapeHtml(link.description)}</div>` : '') +
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
    field('备注', 'description', link.description || '') +
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
  local_set(STORAGE_KEY, JSON.stringify(appData));
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
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    $('#jsonArea').value = e.target.result;
  };
  reader.readAsText(file);
  input.value = '';
}

function confirmImport() {
  const text = $('#jsonArea').value.trim();
  if (!text) return;
  try {
    const data = JSON.parse(text);
    if (!data.categories || !Array.isArray(data.categories)) throw new Error('格式错误');
    appData = data;
    local_set(STORAGE_KEY, JSON.stringify(appData));
    render();
    renderNav();
    closeModal();
    showToast('导入成功');
  } catch (e) {
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
  // $('#addCatBar').style.display = isEditing ? 'block' : 'none';
  // $('#guideSection').style.display = 'none';
}

/* ============================================================
 * 全局事件
 * ============================================================ */
// 点击遮罩关闭弹窗
// $('#modal').addEventListener('click', (e) => {
//   if (e.target.id === 'modal') closeModal();
// });

// Esc：优先关闭弹窗，其次取消编辑
// document.addEventListener('keydown', (e) => {
//   if (e.key === 'Escape') {
//     if ($('#modal').classList.contains('active')) closeModal();
//     else if (isEditing) cancelEdit();
//   }
// });

/* ============================================================
 * 启动
 * ============================================================ */
// init();