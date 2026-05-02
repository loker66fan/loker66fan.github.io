const { createApp } = Vue;
const CAPTURE_MODE = new URLSearchParams(window.location.search).get('capture') === '1';

const LINKS = [
    { url: 'https://www.csdn.net/', icon: 'fa-solid fa-blog', name: 'CSDN', desc: '技术文章与问题检索', accent: '#38bdf8', tag: '技术社区' },
    { url: 'https://pan.baidu.com/', icon: 'fa-solid fa-cloud', name: '百度网盘', desc: '文件同步与资料管理', accent: '#60a5fa', tag: '云存储' },
    { url: 'https://music.163.com/', icon: 'fa-solid fa-music', name: '网易云音乐', desc: '找歌、歌单和日常陪伴', accent: '#fb7185', tag: '音乐娱乐' },
    { url: 'https://www.bing.com/', icon: 'fa-solid fa-compass', name: 'Bing', desc: '默认搜索与灵感入口', accent: '#818cf8', tag: '搜索入口' },
    { url: 'https://www.loker.ltd', icon: 'fa-solid fa-note-sticky fa-beat', name: '个人笔记博客', desc: '沉淀碎片知识与备忘', accent: '#34d399', tag: '知识沉淀' },
    { url: 'https://a.loker.love', icon: 'fa-solid fa-blog fa-beat-fade', name: '个人文章博客', desc: '输出长文与项目记录', accent: '#f59e0b', tag: '内容输出' },
];

const EXTRA_LINKS = [
    { url: 'https://starxn.com',              name: '星辰云' },
    { url: 'https://cloud.mhjz1.cn/cart?fid=11', name: '嘿华' },
    { url: 'https://jwgl.qdc.edu.cn/',         name: '学校云平台' },
    { url: 'https://v3.chaoxing.com/',         name: '超星学习通' },
    { url: 'https://portals.zhihuishu.com/',    name: '智慧树' },
    { name: '更多', isMore: true },
];

const UPDATES = [
    { icon: 'fa-solid fa-circle-plus', text: '壁纸支持重复点击刷新新背景' },
    { icon: 'fa-solid fa-circle-plus', text: '音乐播放器支持网易云歌单 ID 自定义' },
    { icon: 'fa-solid fa-screwdriver-wrench', text: '修复搜索栏特效位置偏移' },
    { icon: 'fa-solid fa-screwdriver-wrench', text: '优化长备注显示与卡片排版' },
    { icon: 'fa-solid fa-link', text: '统一博客入口链接为 a.loker.love' },
    { icon: 'fa-solid fa-circle-plus', text: '加快网页相应速度 By.阿坤' },
    { icon: 'fa-solid fa-circle-plus', text: '添加搜索框及动画css样式' },
    { icon: 'fa-solid fa-circle-plus', text: '音乐歌单支持快速自定义' },
    { icon: 'fa-solid fa-circle-plus', text: '壁纸支持个性化设置' },
    { icon: 'fa-solid fa-circle-plus', text: '音乐播放器支持音量控制' },
    { icon: 'fa-solid fa-screwdriver-wrench', text: '修复天气 API' },
    { icon: 'fa-solid fa-screwdriver-wrench', text: '时光胶囊显示错误' },
    { icon: 'fa-solid fa-screwdriver-wrench', text: '移动端动画及细节' },
    { icon: 'fa-solid fa-screwdriver-wrench', text: '图标更换为 Font Awesome' },
];

const MOURNING_DAYS = ['4.4','5.12','7.7','9.9','9.18','12.13'];

const WALLPAPER_OPTIONS = [
    { value: '1', label: '默认壁纸' },
    { value: '2', label: '必应精选 · 换一张' },
    { value: '3', label: '随机风景 · 换一张' },
    { value: '4', label: '随机动漫 · 换一张' },
];

const FALLBACK = [
    { name:'Track 1', artist:'SoundHelix', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', pic:'', lrc:'' },
    { name:'Track 2', artist:'SoundHelix', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', pic:'', lrc:'' },
    { name:'Track 3', artist:'SoundHelix', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', pic:'', lrc:'' },
];

const DEFAULT_PLAYLIST_ID = '6924865524';
const MUSIC_PLAYLIST_COOKIE_KEY = 'music_playlist_id';

const DEFAULT_ENGINES = [
    { id: 'bing',    name: 'Bing',    url: 'https://cn.bing.com/search?q={s}', icon: 'https://www.bing.com/favicon.ico' },
    { id: 'google',  name: 'Google',  url: 'https://www.google.com/search?q={s}', icon: 'https://www.google.com/favicon.ico' },
    { id: 'baidu',   name: '百度',     url: 'https://www.baidu.com/s?wd={s}', icon: 'https://www.baidu.com/favicon.ico' },
    { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q={s}', icon: 'https://duckduckgo.com/favicon.ico' },
    { id: 'github',  name: 'GitHub',  url: 'https://github.com/search?q={s}', icon: 'https://github.com/favicon.ico' },
];

const SEARCH_PRESETS = [
    { label: 'Vue 动效', query: 'Vue 3 页面动效', icon: 'fa-brands fa-vuejs' },
    { label: '导航设计', query: '个人导航页 UI 设计', icon: 'fa-solid fa-palette' },
    { label: '图标素材', query: 'Font Awesome icons', icon: 'fa-solid fa-icons' },
    { label: '天气查看', query: '青岛天气', icon: 'fa-solid fa-cloud-sun' },
];

function loadSearchEngines() {
    if (CAPTURE_MODE) {
        return DEFAULT_ENGINES.map(engine => ({ ...engine, icon: '' }));
    }
    try {
        const raw = Cookies.get('search_engines');
        if (raw) {
            const saved = JSON.parse(raw);
            if (Array.isArray(saved) && saved.length) return saved;
        }
    } catch {}
    return [...DEFAULT_ENGINES];
}

function saveSearchEngines(engines) {
    Cookies.set('search_engines', JSON.stringify(engines), { expires: 36500 });
}

function loadCurrentEngineId() {
    try {
        const id = Cookies.get('current_engine');
        if (id) return id;
    } catch {}
    return 'bing';
}

function normalizePlaylistId(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (/^\d+$/.test(raw)) return raw;
    const queryMatch = raw.match(/[?&]id=(\d+)/);
    if (queryMatch) return queryMatch[1];
    const pathMatch = raw.match(/playlist\/(\d+)/);
    if (pathMatch) return pathMatch[1];
    const digitMatch = raw.match(/\d{6,}/);
    return digitMatch ? digitMatch[0] : '';
}

function loadMusicPlaylistId() {
    try {
        const id = normalizePlaylistId(Cookies.get(MUSIC_PLAYLIST_COOKIE_KEY));
        if (id) return id;
    } catch {}
    return DEFAULT_PLAYLIST_ID;
}

function saveMusicPlaylistId(id) {
    Cookies.set(MUSIC_PLAYLIST_COOKIE_KEY, id, { expires: 36500 });
}

function getMusicPlaylistUrl(id) {
    return 'https://api.injahow.cn/meting/?server=netease&type=playlist&id=' + encodeURIComponent(id);
}

function getWallpaperRequestKey() {
    return Date.now() + '_' + Math.random().toString(36).slice(2) + '_' + Math.floor(Math.random() * 1e9);
}

function getWallpaperUrl(type, nonce = getWallpaperRequestKey()) {
    switch (type) {
        case '2':
            return 'https://api.dujin.org/bing/1920.php?refresh=' + nonce;
        case '3':
            return 'https://api.btstu.cn/sjbz/api.php?lx=fengjing&method=mobile&refresh=' + nonce;
        case '4':
            return 'https://www.dmoe.cc/random.php?sort=动漫&refresh=' + nonce;
        default:
            return './img/icon/云朵 旷野郊游 线条小狗高清电脑壁纸全屏_彼岸壁纸.jpg';
    }
}

const formatTime = s => {
    if (!s || !isFinite(s)) return '00:00';
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return String(m).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
};

const chunk = (arr, n) => {
    const r = [];
    for (let i = 0; i < arr.length; i += n) r.push(arr.slice(i, i + n));
    return r;
};

createApp({
    data: () => ({
        loaded: false,
        loadingText: 'Loading......',
        currentYear: new Date().getFullYear(),
        searched: false,
        searchOpen: false,
        searchText: '',
        searchAnimating: false,
        searchVisible: false,
        searchClosing: false,
        showEngineMenu: false,
        searchEngines: loadSearchEngines(),
        currentEngineId: loadCurrentEngineId(),
        newEngineName: '',
        newEngineUrl: '',
        timeStr: '',
        moreOpen: false,
        moreAnimating: false,
        moreClosing: false,
        boxOpen: false,
        menuOpen: false,
        mobileRight: false,
        hitokotoText: '༼ つ ◕_◕ ༽つ-',
        hitokotoFrom: 'loker66fan',
        hitokotoLoading: false,
        socialHover: false,
        socialHint: '通过这里联系我',
        showMusicBtn: false,
        musicInited: false,
        musicLoading: false,
        musicPlaying: false,
        musicMuted: false,
        musicName: '未播放音乐',
        musicVolume: 0.5,
        musicPlaylistId: loadMusicPlaylistId(),
        playlistInput: loadMusicPlaylistId(),
        musicConfigOpen: false,
        playMode: 'random',
        currentSong: { name:'未播放', artist:'--', pic:'' },
        playlist: [],
        currentIndex: 0,
        currentTime: 0,
        duration: 0,
        wallpaperType: '1',
        accordion1Open: true,
        accordion2Open: false,
        accordion3Open: false,
        mourning: false,
        aplayerInstance: null,
        _lrcTimer: null,
        _timeTimer: null,
        wallpaperOptions: WALLPAPER_OPTIONS,
        updates: UPDATES,
    }),
    computed: {
        currentEngine() {
            return this.searchEngines.find(e => e.id === this.currentEngineId) || this.searchEngines[0];
        },
        greetingText() {
            const h = new Date().getHours();
            if (h < 6) return '凌晨好';
            if (h < 9) return '早上好';
            if (h < 12) return '上午好';
            if (h < 14) return '中午好';
            if (h < 17) return '下午好';
            if (h < 19) return '傍晚好';
            if (h < 22) return '晚上好';
            return '夜深了';
        },
        wallpaperLabel() {
            const item = this.wallpaperOptions.find(opt => opt.value === this.wallpaperType);
            return item ? item.label : '默认壁纸';
        },
        linkChunks() { return chunk(LINKS, 3); },
        linkTotal() { return LINKS.length; },
        extraLinkChunks() { return chunk(EXTRA_LINKS, 3); },
        isDefaultMusicPlaylist() {
            return this.musicPlaylistId === DEFAULT_PLAYLIST_ID;
        },
        progressItems() {
            const n = new Date();
            const ts = new Date(n.toLocaleDateString()).getTime();
            const dp = ((n.getTime() - ts) / 36e5);
            const wm = { 0:7,1:1,2:2,3:3,4:4,5:5,6:6 };
            const wd = wm[n.getDay()];
            const yr = n.getFullYear(), mo = n.getMonth() + 1, dt = n.getDate();
            const ma = new Date(yr, mo, 0).getDate();
            return [
                { label:'今日', value:Math.floor(dp), unit:'小时', pct:Math.floor(dp/24*100) },
                { label:'本周', value:wd, unit:'天', pct:Math.floor(wd/7*100) },
                { label:'本月', value:dt, unit:'天', pct:Math.floor(dt/ma*100) },
                { label:'今年', value:mo, unit:'个月', pct:Math.floor(mo/12*100) },
            ];
        },
        currentTimeStr() { return formatTime(this.currentTime); },
        durationStr() { return formatTime(this.duration); },
        progressPercent() { return this.duration ? (this.currentTime / this.duration) * 100 : 0; },
        volumeIcon() {
            if (this.musicMuted || this.musicVolume === 0) return 'fa-solid fa-volume-xmark';
            if (this.musicVolume <= 0.3) return 'fa-solid fa-volume-off';
            if (this.musicVolume <= 0.6) return 'fa-solid fa-volume-low';
            return 'fa-solid fa-volume-high';
        },
        modeIcon() {
            return { random:'fa-solid fa-shuffle', single:'fa-solid fa-repeat', list:'fa-solid fa-list' }[this.playMode] || 'fa-solid fa-shuffle';
        },
        modeLabel() {
            return { random:'随机', single:'单曲循环', list:'列表循环' }[this.playMode] || '随机';
        },
        quickPanels() {
            return [
                {
                    title: '搜索',
                    value: this.currentEngine ? this.currentEngine.name : '默认',
                    desc: '打开输入框开始检索',
                    icon: 'fa-solid fa-magnifying-glass',
                    action: 'search',
                },
                {
                    title: '天气',
                    value: '查看当地天气',
                    desc: '弹出未来几天的天气面板',
                    icon: 'fa-solid fa-cloud-sun',
                    action: 'weather',
                },
                {
                    title: '音乐',
                    value: this.musicInited ? (this.musicPlaying ? '播放中' : '歌单已就绪') : (this.isDefaultMusicPlaylist ? '默认歌单' : '自定义歌单'),
                    desc: this.musicInited ? (this.currentSong.name || '准备切歌') : '支持配置网易云歌单 ID',
                    icon: 'fa-solid fa-compact-disc',
                    action: 'music',
                },
                {
                    title: '设置',
                    value: this.wallpaperLabel,
                    desc: '壁纸、引擎和时间胶囊',
                    icon: 'fa-solid fa-sliders',
                    action: 'more',
                },
            ];
        },
        searchPresets() {
            const presets = [...SEARCH_PRESETS];
            if (this.musicInited && this.currentSong.name && this.currentSong.name !== '未播放') {
                presets.unshift({
                    label: '当前歌曲',
                    query: `${this.currentSong.name} ${this.currentSong.artist}`.trim(),
                    icon: 'fa-solid fa-music',
                });
            }
            return presets.slice(0, 5);
        },
    },
    watch: {
        boxOpen(v) {
            if (v && !this.musicInited && !this.musicLoading) {
                setTimeout(() => this.tryInitMusic(), 300);
            }
        },
    },
    methods: {
        /* search */
        openSearch() {
            if (this.searchAnimating) return;
            this.searchAnimating = true;
            this.searchClosing = false;
            this.searchOpen = true;
            this.showEngineMenu = false;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.searchVisible = true;
                });
            });
            setTimeout(() => { const i = this.$refs.searchInput; if (i) i.focus(); }, 520);
            setTimeout(() => { this.searchAnimating = false; }, 900);
        },
        closeSearch() {
            this.searchClosing = true;
            this.searchVisible = false;
            this.showEngineMenu = false;
            setTimeout(() => {
                this.searchOpen = false;
                this.searchClosing = false;
                this.searchVisible = false;
                this.searchText = '';
            }, 360);
        },
        doSearch() {
            const q = this.searchText.trim();
            if (!q) return;
            const url = this.currentEngine.url.replace('{s}', encodeURIComponent(q));
            window.open(url, '_self');
        },
        selectEngine(id) {
            this.currentEngineId = id;
            Cookies.set('current_engine', id, { expires: 36500 });
        },
        cycleSearchEngine() {
            const idx = this.searchEngines.indexOf(this.currentEngine);
            const next = (idx + 1) % this.searchEngines.length;
            this.selectEngine(this.searchEngines[next].id);
            iziToast.show({ timeout: 2000, icon: 'fa-solid fa-magnifying-glass', message: '引擎切换: ' + this.searchEngines[next].name });
        },
        addCustomEngine() {
            const name = this.newEngineName.trim();
            const url = this.newEngineUrl.trim();
            if (!name || !url) {
                iziToast.show({ timeout: 2000, icon: 'fa-solid fa-circle-exclamation', message: '请填写名称和搜索URL' });
                return;
            }
            if (!url.includes('{s}')) {
                iziToast.show({ timeout: 3000, icon: 'fa-solid fa-circle-exclamation', message: 'URL 必须包含 {s} 作为搜索关键词占位符' });
                return;
            }
            const id = 'custom_' + Date.now();
            const newEngine = { id, name, url, icon: '', custom: true };
            this.searchEngines.push(newEngine);
            this.currentEngineId = id;
            saveSearchEngines(this.searchEngines);
            Cookies.set('current_engine', id, { expires: 36500 });
            this.newEngineName = '';
            this.newEngineUrl = '';
            iziToast.show({ timeout: 2500, icon: 'fa-solid fa-circle-check', message: '已添加引擎: ' + name });
        },
        removeCustomEngine(id) {
            if (this.searchEngines.length <= 1) {
                iziToast.show({ timeout: 2000, icon: 'fa-solid fa-triangle-exclamation', message: '至少保留一个搜索引擎' });
                return;
            }
            const e = this.searchEngines.find(e => e.id === id);
            if (!e) return;
            this.searchEngines = this.searchEngines.filter(e => e.id !== id);
            if (this.currentEngineId === id) {
                this.currentEngineId = this.searchEngines[0].id;
                Cookies.set('current_engine', this.searchEngines[0].id, { expires: 36500 });
            }
            saveSearchEngines(this.searchEngines);
            iziToast.show({ timeout: 2000, icon: 'fa-solid fa-trash', message: '已删除: ' + (e.name || id) });
        },
        /* time */
        updateTime() {
            const n = new Date();
            const wd = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
            const h = String(n.getHours()).padStart(2,'0');
            const m = String(n.getMinutes()).padStart(2,'0');
            const s = String(n.getSeconds()).padStart(2,'0');
            this.timeStr = n.getFullYear() + ' 年 ' + (n.getMonth()+1) + ' 月 ' + n.getDate() + ' 日 <span class="weekday">' + wd[n.getDay()] + '</span><br><span class="time-text">' + h + ':' + m + ':' + s + '</span>';
        },
        /* hitokoto */
        async fetchHitokoto() {
            if (this.hitokotoLoading) return;
            this.hitokotoLoading = true;
            try {
                const r = await fetch('https://v1.hitokoto.cn?max_length=24');
                const d = await r.json();
                this.hitokotoText = d.hitokoto;
                this.hitokotoFrom = d.from;
            } catch {}
            setTimeout(() => { this.hitokotoLoading = false; }, 1100);
        },
        /* more */
        toggleMore() {
            if (!this.moreOpen) {
                this.moreClosing = false;
                this.moreAnimating = true;
                this.moreOpen = true;
                setTimeout(() => { this.moreAnimating = false; }, 1150);
                return;
            }
            this.closeMorePanel();
        },
        closeMorePanel() {
            if (!this.moreOpen || this.moreClosing) return;
            this.moreClosing = true;
            this.moreAnimating = false;
            setTimeout(() => {
                this.moreOpen = false;
                this.moreClosing = false;
            }, 520);
        },
        useSearchPreset(preset) {
            if (!preset || !preset.query) return;
            this.searchText = preset.query;
            this.showEngineMenu = false;
            const focusInput = () => {
                const input = this.$refs.searchInput;
                if (input) {
                    input.focus();
                    if (input.setSelectionRange) {
                        const len = this.searchText.length;
                        input.setSelectionRange(len, len);
                    }
                }
            };
            if (!this.searchOpen) {
                this.openSearch();
                setTimeout(focusInput, 900);
                return;
            }
            focusInput();
        },
        runQuickAction(action) {
            if (action === 'search') {
                this.openSearch();
                return;
            }
            if (action === 'weather') {
                this.openWeather();
                return;
            }
            if (action === 'music') {
                this.openMusicList();
                return;
            }
            if (action === 'more') {
                this.toggleMore();
            }
        },
        /* music */
        openMusicList() { this.boxOpen = true; this.moreOpen = false; },
        async applyMusicPlaylist() {
            const playlistId = normalizePlaylistId(this.playlistInput);
            if (!playlistId) {
                iziToast.show({ timeout: 2500, icon: 'fa-solid fa-circle-exclamation', message: '请输入有效的网易云歌单 ID 或歌单链接' });
                return;
            }
            await this.loadMusicPlaylist(playlistId, {
                persist: true,
                successMessage: '网易云歌单已更新',
            });
        },
        async resetMusicPlaylist() {
            this.playlistInput = DEFAULT_PLAYLIST_ID;
            await this.loadMusicPlaylist(DEFAULT_PLAYLIST_ID, {
                allowFallback: true,
                persist: true,
                successMessage: '已恢复默认歌单',
            });
        },
        async fetchMusicPlaylist(playlistId) {
            const r = await fetch(getMusicPlaylistUrl(playlistId));
            if (!r.ok) throw Error('http');
            const d = await r.json();
            if (!Array.isArray(d) || !d.length) throw Error('empty');
            return d;
        },
        destroyMusicPlayer(resetPlaylist = true) {
            if (this._lrcTimer) {
                clearInterval(this._lrcTimer);
                this._lrcTimer = null;
            }
            if (this._timeTimer) {
                clearInterval(this._timeTimer);
                this._timeTimer = null;
            }
            if (this.aplayerInstance) {
                try { this.aplayerInstance.destroy(); } catch {}
                this.aplayerInstance = null;
            }
            this.musicInited = false;
            this.musicPlaying = false;
            this.currentTime = 0;
            this.duration = 0;
            this.currentIndex = 0;
            if (resetPlaylist) {
                this.playlist = [];
                this.currentSong = { name:'未播放', artist:'--', pic:'' };
                this.musicName = '未播放音乐';
            }
            const pw = document.querySelector('.power');
            const lr = document.getElementById('lrc');
            if (pw) pw.style.display = 'block';
            if (lr) {
                lr.style.display = 'none';
                lr.innerHTML = '';
            }
        },
        async loadMusicPlaylist(playlistId, { allowFallback = false, persist = false, successMessage = '' } = {}) {
            const normalizedId = normalizePlaylistId(playlistId);
            if (!normalizedId || this.musicLoading) return false;
            const ct = document.getElementById('aplayer-hidden');
            if (!ct) return false;
            this.musicLoading = true;
            let audio = null;
            let usedFallback = false;
            try {
                audio = await this.fetchMusicPlaylist(normalizedId);
            } catch (e) {
                if (!allowFallback) {
                    iziToast.show({ timeout: 3200, icon: 'fa-solid fa-circle-exclamation', message: '歌单加载失败，请检查网易云歌单 ID 是否正确' });
                    this.musicLoading = false;
                    return false;
                }
                usedFallback = true;
                audio = FALLBACK;
                iziToast.show({ timeout: 3200, icon: 'fa-solid fa-triangle-exclamation', message: '网易云歌单加载失败，已切换到内置歌单' });
            }
            this.destroyMusicPlayer();
            this.musicPlaylistId = normalizedId;
            this.playlistInput = normalizedId;
            if (persist) saveMusicPlaylistId(normalizedId);
            this.setupPlayer(audio);
            this.musicLoading = false;
            if (successMessage) {
                iziToast.show({
                    timeout: 2600,
                    icon: 'fa-solid fa-circle-check',
                    message: usedFallback ? successMessage + '，当前使用内置歌单' : successMessage,
                });
            }
            return true;
        },
        musicToggle() { if (this.aplayerInstance) this.aplayerInstance.toggle(); else this.openMusicList(); },
        musicPrev() { if (this.aplayerInstance) { this.aplayerInstance.skipBack(); this.aplayerInstance.play(); } },
        musicNext() { if (this.aplayerInstance) { this.aplayerInstance.skipForward(); this.aplayerInstance.play(); } },
        playSong(i) {
            if (!this.aplayerInstance) return;
            this.aplayerInstance.list.switch(i);
            this.aplayerInstance.play();
            this.updateSongMeta();
        },
        seekProgress(e) {
            if (!this.aplayerInstance || !this.duration) return;
            const b = this.$refs.progressBar;
            if (!b) return;
            const p = (e.clientX - b.getBoundingClientRect().left) / b.offsetWidth;
            this.aplayerInstance.seek(p * this.duration);
        },
        setVolume(e) {
            const v = parseFloat(e.target.value);
            this.musicVolume = v;
            this.musicMuted = false;
            if (this.aplayerInstance) this.aplayerInstance.volume(v, true);
        },
        toggleMute() {
            if (!this.aplayerInstance) return;
            if (this.musicMuted || this.musicVolume === 0) {
                this.aplayerInstance.volume(0.5, true);
                this.musicVolume = 0.5;
                this.musicMuted = false;
            } else {
                this.aplayerInstance.volume(0, true);
                this.musicMuted = true;
            }
        },
        cycleMode() {
            const ms = ['random','single','list'];
            this.playMode = ms[(ms.indexOf(this.playMode) + 1) % 3];
            if (this.aplayerInstance) this.aplayerInstance.setMode(this.playMode);
        },
        updateSongMeta() {
            if (!this.aplayerInstance || !this.playlist.length) return;
            const i = this.aplayerInstance.list.index;
            this.currentIndex = i;
            const s = this.playlist[i];
            if (s) this.currentSong = { name:s.name||'未知', artist:s.artist||'未知', pic:s.pic||'' };
            this.musicName = (this.currentSong.name || '') + ' - ' + (this.currentSong.artist || '');
        },
        tryInitMusic() {
            if (this.musicInited || this.musicLoading) return;
            if (!this.boxOpen) return;
            this.loadMusicPlaylist(this.musicPlaylistId, { allowFallback: true });
        },
        setupPlayer(audio) {
            const ct = document.getElementById('aplayer-hidden');
            if (!ct) return;
            this.playlist = audio.map(a => ({
                name:a.name||'未知歌曲', artist:a.artist||'', pic:a.pic||a.cover||'', lrc:a.lrc||'', url:a.url||''
            }));
            const ap = new APlayer({
                container: ct, order:this.playMode, preload:'auto', listMaxHeight:'336px',
                volume:this.musicVolume, mutex:true, lrcType:3, audio,
            });
            this.aplayerInstance = ap;
            this.musicInited = true;
            if (this.musicMuted) ap.volume(0, true);
            this.updateSongMeta();
            this._timeTimer = setInterval(() => {
                if (ap && ap.audio) {
                    this.currentTime = ap.audio.currentTime || 0;
                    this.duration = ap.audio.duration || 0;
                }
            }, 200);
            this._lrcTimer = setInterval(() => {
                const t = document.querySelector('.aplayer-lrc-current');
                if (t) { const el = document.getElementById('lrc'); if (el) el.innerHTML = '<span class="lrc-show"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465z" fill="rgba(255,255,255,1)"/></svg>&nbsp;'+t.textContent+'&nbsp;<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465z" fill="rgba(255,255,255,1)"/></svg></span>'; }
            }, 500);
            ap.on('play', () => {
                this.musicPlaying = true;
                this.updateSongMeta();
                iziToast.info({ timeout:4000, icon:'fa-solid fa-circle-play', displayMode:'replace', message:this.musicName });
                if (window.innerWidth >= 990) {
                    const pw = document.querySelector('.power'), lr = document.getElementById('lrc');
                    if (pw) pw.style.display = 'none';
                    if (lr) lr.style.display = 'block';
                }
            });
            ap.on('pause', () => {
                this.musicPlaying = false;
                if (window.innerWidth >= 990) {
                    const pw = document.querySelector('.power'), lr = document.getElementById('lrc');
                    if (pw) pw.style.display = 'block';
                    if (lr) lr.style.display = 'none';
                }
            });
            ap.on('listswitch', () => this.updateSongMeta());
        },
        /* wallpaper */
        async resolveWallpaperUrl(t) {
            if (t !== '2') return getWallpaperUrl(t);
            const requestKey = getWallpaperRequestKey();
            try {
                const r = await fetch('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=zh-CN&refresh=' + requestKey);
                if (!r.ok) throw Error('http');
                const d = await r.json();
                let images = Array.isArray(d.images) ? d.images : [];
                let urls = images
                    .map(item => item && item.url ? 'https://cn.bing.com' + item.url : '')
                    .filter(Boolean);
                const bg = document.getElementById('bg');
                const currentSrc = bg ? (bg.dataset.wallpaperSrc || bg.currentSrc || bg.src || '') : '';
                if (urls.length > 1) {
                    urls = urls.filter(url => !currentSrc.includes(url));
                }
                const next = urls[Math.floor(Math.random() * urls.length)];
                if (next) return next + (next.includes('?') ? '&' : '?') + 'refresh=' + requestKey;
            } catch {}
            return getWallpaperUrl('2', requestKey);
        },
        applyWallpaper(bg, src, useRefreshEffect = true) {
            bg.style.background = '';
            bg.style.backgroundSize = '';
            bg.onload = null;
            bg.onerror = null;
            bg.dataset.wallpaperSrc = src;
            if (!useRefreshEffect) {
                bg.src = src;
                return;
            }
            bg.style.opacity = '0.6';
            bg.removeAttribute('src');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    bg.onload = () => {
                        bg.style.opacity = '1';
                        bg.onload = null;
                    };
                    bg.onerror = () => {
                        bg.style.opacity = '1';
                        bg.onerror = null;
                    };
                    bg.src = src;
                });
            });
        },
        async setWallpaper(t) {
            this.wallpaperType = t;
            const bg = document.getElementById('bg');
            if (!bg) return;
            const nextSrc = await this.resolveWallpaperUrl(t);
            this.applyWallpaper(bg, nextSrc, t !== '1');
            Cookies.set('bg_img', JSON.stringify({ type: t }), { expires: 36500 });
            iziToast.show({
                icon:'fa-solid fa-image',
                timeout:2500,
                message: t === '1' ? '默认壁纸已恢复' : '壁纸已刷新，已切换到新图片',
            });
        },
        initWallpaper() {
            if (CAPTURE_MODE) {
                this.wallpaperType = '1';
                const bg = document.getElementById('bg');
                if (bg) this.applyWallpaper(bg, getWallpaperUrl('1'), false);
                return;
            }
            let s;
            try { const r = Cookies.get('bg_img'); if (r && r !== '{}') s = JSON.parse(r); } catch {}
            const t = (s && s.type) || '1';
            this.wallpaperType = t;
            this.setWallpaper(t);
        },
        openWeather() { if (window.__weatherApp) window.__weatherApp.open(); },
        onResize() {
            if (window.innerWidth >= 600) this.menuOpen = false;
            if (window.innerWidth <= 990) { this.moreOpen = false; this.boxOpen = false; }
        },
        revealPage() {
            if (this.loaded) return;
            this.loaded = true;
            const bg = document.getElementById('bg');
            if (bg) {
                bg.style.transform = 'scale(1)';
                bg.style.filter = 'blur(0px)';
                bg.style.transition = 'ease 1.5s';
                bg.style.opacity = '1';
            }
            const cv = this.$refs.cover;
            if (cv) cv.style.cssText = 'opacity:1;transition:ease 1.5s;';
            const sc = this.$refs.section;
            if (sc) {
                sc.style.transform = 'scale(1)';
                sc.style.opacity = '1';
                sc.style.filter = 'blur(0px)';
            }
            if (!CAPTURE_MODE) {
                setTimeout(() => iziToast.show({ timeout:2500, icon:false, title:this.greetingText, message:'欢迎来到我的主页' }), 800);
            }
            const p = document.getElementById('g-pointer-2');
            if (p && (CAPTURE_MODE || /Mobile/i.test(navigator.userAgent))) p.style.display = 'none';
        },
    },
    mounted() {
        iziToast.settings({
            timeout:10000, progressBar:false, close:false, closeOnEscape:true,
            position:'topCenter', transitionIn:'bounceInDown', transitionOut:'flipOutX',
            displayMode:'replace', layout:'1',
            backgroundColor:'#00000040', titleColor:'#efefef', messageColor:'#efefef',
            icon:'Fontawesome', iconColor:'#efefef',
        });
        if (CAPTURE_MODE) {
            this.loadingText = 'Preparing repository preview...';
            this.hitokotoText = 'A Vue-powered personal start page for static hosting.';
            this.hitokotoFrom = 'Repository preview';
        }
        this.initWallpaper();
        const n = new Date();
        if (!CAPTURE_MODE && MOURNING_DAYS.includes((n.getMonth()+1) + '.' + n.getDate())) {
            this.mourning = true;
            setTimeout(() => iziToast.show({ timeout:14000, icon:'fa-solid fa-clock', message:'今天是中国国家纪念日' }), 4600);
        }
        if (CAPTURE_MODE) {
            requestAnimationFrame(() => this.revealPage());
        } else if (document.readyState === 'complete') {
            this.revealPage();
        } else {
            window.addEventListener('load', () => this.revealPage(), { once: true });
        }
        if (!CAPTURE_MODE) {
            setTimeout(() => { this.loadingText = '字体及文件加载可能需要一定时间'; }, 3000);
        }
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        if (!CAPTURE_MODE) this.fetchHitokoto();
        window.addEventListener('resize', () => this.onResize());
        document.addEventListener('keydown', e => {
            if (e.key === ' ' && !this.boxOpen && !this.searchOpen) {
                e.preventDefault();
                if (this.aplayerInstance) this.aplayerInstance.toggle();
            }
        });
        const el = document.getElementById('g-pointer-2');
        if (el && !CAPTURE_MODE) {
            const hw = el.offsetWidth / 2;
            document.addEventListener('mousemove', e => {
                requestAnimationFrame(() => {
                    el.style.transform = 'translate3d(' + (e.clientX - hw) + 'px,' + (e.clientY - hw) + 'px,0)';
                });
            });
        } else if (el) {
            el.style.display = 'none';
        }
        if (!CAPTURE_MODE) {
            document.oncontextmenu = () => {
                iziToast.show({ timeout:2000, icon:'fa-solid fa-circle-exclamation', message:'为了浏览体验，本站禁用右键' });
                return false;
            };
        }
        document.addEventListener('click', (e) => {
            if (this.showEngineMenu && !e.target.closest('.engine-menu') && !e.target.closest('.search-engine-switch')) {
                this.showEngineMenu = false;
            }
        });
        console.log('%cMyIndex %c v1.0.0\n%cRepository: https://github.com/loker66fan/loker66fan.github.io',
            'font-size:20px;font-weight:600;color:rgb(244,167,89);',
            'font-size:12px;color:rgb(244,167,89);',
            'color:rgb(30,152,255);');
    },
    beforeUnmount() {
        this.destroyMusicPlayer(false);
    },
}).mount('#app');
