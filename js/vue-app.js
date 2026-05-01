const { createApp: createMainApp } = Vue;

const LINKS = [
    { url: 'https://www.csdn.net/', icon: 'fa-solid fa-blog', name: 'CSDN' },
    { url: 'https://pan.baidu.com/', icon: 'fa-solid fa-cloud', name: '百度网盘' },
    { url: 'https://music.163.com/', icon: 'fa-solid fa-music', name: '网易Music' },
    { url: 'https://www.bing.com/', icon: 'fa-solid fa-compass', name: 'Bing' },
    { url: 'https://www.loker.ltd', icon: 'fa-solid fa-note-sticky fa-beat', name: '个人笔记博客' },
    { url: 'https://a.loker.love', icon: 'fa-solid fa-blog fa-beat-fade', name: '个人文章博客' },
];

const EXTRA_LINKS = [
    [
        { url: 'https://starxn.com', name: '星辰云' },
        { url: 'https://cloud.mhjz1.cn/cart?fid=11', name: '嘿华' },
        { url: 'https://jwgl.qdc.edu.cn/', name: '学校云平台' },
    ],
    [
        { url: 'https://v3.chaoxing.com/', name: '超星学习通' },
        { url: 'https://portals.zhihuishu.com/', name: '智慧树' },
        { name: '更多', isMore: true },
    ],
];

const SOCIAL_HINTS = {
    github: '去 Github 看看',
    qq: '有什么事吗',
    email: '来封 Email',
    bilibili: '来 B 站看看 ~',
    telegram: '你懂的 ~',
};

const MOURNING_DAYS = ['4.4', '5.12', '7.7', '9.9', '9.18', '12.13'];

const UPDATES = [
    { icon: 'fa-solid fa-circle-plus', text: '壁纸支持重复点击刷新新背景' },
    { icon: 'fa-solid fa-screwdriver-wrench', text: '修复搜索栏特效位置偏移' },
    { icon: 'fa-solid fa-screwdriver-wrench', text: '优化长备注显示与卡片排版' },
    { icon: 'fa-solid fa-link', text: '统一博客入口链接为 zy.loker.ltd' },
    { icon: 'fa-solid fa-circle-plus', text: '加快网页相应速度' },
    { icon: 'fa-solid fa-circle-plus', text: '添加搜索框及动画css样式' },
    { icon: 'fa-solid fa-circle-plus', text: '音乐歌单支持快速自定义' },
    { icon: 'fa-solid fa-circle-plus', text: '壁纸支持个性化设置' },
    { icon: 'fa-solid fa-circle-plus', text: '音乐播放器支持音量控制' },
    { icon: 'fa-solid fa-screwdriver-wrench', text: '修复天气 API' },
    { icon: 'fa-solid fa-screwdriver-wrench', text: '时光胶囊显示错误' },
    { icon: 'fa-solid fa-screwdriver-wrench', text: '移动端动画及细节' },
];

const FALLBACK_PLAYLIST = [
    { name: 'Sunflower', artist: 'Street Musician', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', pic: '', lrc: '' },
    { name: 'Ambient', artist: 'SoundHelix', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', pic: '', lrc: '' },
    { name: 'Electronic', artist: 'SoundHelix', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', pic: '', lrc: '' },
];

const app = createMainApp({
    data() {
        return {
            loaded: false,
            searchOpen: false,
            searchText: '',
            searchAnimating: false,
            timeStr: '',
            hitokotoText: '༼ つ ◕_◕ ༽つ-',
            hitokotoFrom: 'loker66fan',
            hitokotoLoading: false,
            socialHover: false,
            socialHint: '通过这里联系我',
            musicName: '未播放音乐',
            musicPlaying: false,
            musicLoading: false,
            musicInited: false,
            showMusicBtn: false,
            currentSong: { name: '未播放', artist: '--', pic: '' },
            playlist: [],
            currentIndex: 0,
            currentTime: 0,
            duration: 0,
            musicVolume: 0.5,
            musicMuted: false,
            playMode: 'random',
            moreOpen: false,
            boxOpen: false,
            menuOpen: false,
            mobileRight: false,
            wallpaperType: '1',
            accordion1Open: true,
            accordion2Open: false,
            mourning: false,
            hello: '',
            loadingText: 'Loading......',
            progressData: {
                dayPass: 0, dayPercent: 0,
                weekDay: 0, weekPercent: 0,
                monthDay: 0, monthPercent: 0,
                yearMonth: 0, yearPercent: 0,
            },
            aplayerInstance: null,
            lrcInterval: null,
            wallpaperOptions: [
                { value: '1', label: '默认壁纸' },
                { value: '2', label: '必应每日 · 换一张' },
                { value: '3', label: '随机风景 · 换一张' },
                { value: '4', label: '随机动漫 · 换一张' },
            ],
            LINKS,
            EXTRA_LINKS,
            UPDATES,
        };
    },
    computed: {
        containerClass() {
            return { container: true, mores: this.moreOpen };
        },
        rowClass() {
            return { row: true, menus: this.menuOpen };
        },
        rightoneClass() {
            const c = { row: true, rightone: true };
            if (this.menuOpen) c.menus = true;
            if (this.mobileRight) c.mobile = true;
            return c;
        },
        currentTimeStr() {
            return this.fmtTime(this.currentTime);
        },
        durationStr() {
            return this.fmtTime(this.duration);
        },
        progressPercent() {
            if (!this.duration) return 0;
            return (this.currentTime / this.duration) * 100;
        },
        volumeIcon() {
            if (this.musicMuted || this.musicVolume === 0) return 'fa-solid fa-volume-xmark';
            if (this.musicVolume <= 0.3) return 'fa-solid fa-volume-off';
            if (this.musicVolume <= 0.6) return 'fa-solid fa-volume-low';
            return 'fa-solid fa-volume-high';
        },
        modeIcon() {
            const m = { random: 'fa-solid fa-shuffle', single: 'fa-solid fa-repeat', list: 'fa-solid fa-list' };
            return m[this.playMode] || 'fa-solid fa-shuffle';
        },
        modeLabel() {
            const m = { random: '随机', single: '单曲循环', list: '列表循环' };
            return m[this.playMode] || '随机';
        },
    },
    watch: {
        boxOpen(val) {
            if (val && !this.musicInited && !this.musicLoading) {
                setTimeout(() => this.tryInitMusic(), 200);
            }
        },
    },
    methods: {
        /* ===== 搜索 ===== */
        openSearch() {
            if (this.searchAnimating) return;
            this.searchAnimating = true;
            this.searchOpen = true;
            this.$nextTick(() => {
                setTimeout(() => {
                    const inp = this.$refs.searchInput;
                    if (inp) inp.focus();
                }, 850);
                setTimeout(() => { this.searchAnimating = false; }, 1500);
            });
        },
        closeSearch() {
            this.searchOpen = false;
            this.searchText = '';
        },
        doSearch() {
            const q = this.searchText.trim();
            if (q) window.open('https://cn.bing.com/search?q=' + encodeURIComponent(q), '_self');
        },
        onSearchKeydown(e) {
            if (e.key === 'Enter') this.doSearch();
        },

        /* ===== 时间 ===== */
        updateTime() {
            const now = new Date();
            const y = now.getFullYear();
            const mm = now.getMonth() + 1;
            const d = now.getDate();
            const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            const wd = weekdays[now.getDay()];
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            this.timeStr = `${y} 年 ${mm} 月 ${d} 日 <span class="weekday">${wd}</span><br><span class="time-text">${h}:${m}:${s}</span>`;
        },

        /* ===== 时间胶囊 ===== */
        updateLifeTime() {
            const now = new Date();
            const todayStart = new Date(now.toLocaleDateString()).getTime();
            const dayPass = ((now.getTime() - todayStart) / 1000 / 60 / 60);
            const dayPercent = (dayPass / 24) * 100;
            const weekMap = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };
            const weekDay = weekMap[now.getDay()];
            const weekPercent = (weekDay / 7) * 100;
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const date = now.getDate();
            const monthAll = new Date(year, month, 0).getDate();
            const monthPercent = (date / monthAll) * 100;
            const yearPercent = (month / 12) * 100;
            this.progressData = {
                dayPass: Math.floor(dayPass), dayPercent: Math.floor(dayPercent),
                weekDay, weekPercent: Math.floor(weekPercent),
                monthDay: date, monthPercent: Math.floor(monthPercent),
                yearMonth: month, yearPercent: Math.floor(yearPercent),
            };
        },

        /* ===== 一言 ===== */
        async fetchHitokoto() {
            if (this.hitokotoLoading) return;
            this.hitokotoLoading = true;
            try {
                const res = await fetch('https://v1.hitokoto.cn?max_length=24');
                const data = await res.json();
                this.hitokotoText = data.hitokoto;
                this.hitokotoFrom = data.from;
            } catch (e) {
                iziToast.show({ timeout: 2000, icon: 'fa-solid fa-circle-exclamation', message: '一言获取失败' });
            }
            setTimeout(() => { this.hitokotoLoading = false; }, 1100);
        },

        /* ===== 社交链接 ===== */
        showSocialHint(key) {
            this.socialHover = true;
            this.socialHint = SOCIAL_HINTS[key] || '通过这里联系我';
        },
        hideSocialHint() {
            this.socialHover = false;
            this.socialHint = '通过这里联系我';
        },

        /* ===== 音乐播放器 ===== */
        fmtTime(sec) {
            if (!sec || !isFinite(sec)) return '00:00';
            const m = Math.floor(sec / 60);
            const s = Math.floor(sec % 60);
            return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        },
        updateSong() {
            if (!this.aplayerInstance || !this.playlist.length) return;
            const idx = this.aplayerInstance.list.index;
            this.currentIndex = idx;
            if (this.playlist[idx]) {
                this.currentSong = {
                    name: this.playlist[idx].name || '未知',
                    artist: this.playlist[idx].artist || '未知',
                    pic: this.playlist[idx].pic || '',
                };
            }
        },
        tryInitMusic() {
            if (this.musicInited || this.musicLoading) return;
            if (!this.boxOpen) return;
            const container = document.getElementById('aplayer');
            if (!container) return;
            this.musicLoading = true;

            const server = 'netease', type = 'playlist', id = '6924865524';
            fetch(`https://api.injahow.cn/meting/?server=${server}&type=${type}&id=${id}`)
                .then(r => r.json())
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        this.setupPlayer(data);
                    } else {
                        throw new Error('empty playlist');
                    }
                })
                .catch(() => {
                    this.setupPlayer(FALLBACK_PLAYLIST);
                })
                .finally(() => {
                    this.musicLoading = false;
                });
        },
        setupPlayer(audio) {
            const container = document.getElementById('aplayer');
            if (!container || this.musicInited) return;

            this.playlist = audio.map(a => ({
                name: a.name || '未知歌曲',
                artist: a.artist || '',
                pic: a.pic || a.cover || '',
                lrc: a.lrc || '',
                url: a.url || '',
            }));

            const ap = new APlayer({
                container,
                order: 'random', preload: 'auto', listMaxHeight: '336px',
                volume: this.musicVolume, mutex: true, lrcType: 3,
                audio,
            });
            this.aplayerInstance = ap;
            this.musicInited = true;

            this.updateSong();

            const timeUpdater = setInterval(() => {
                if (ap && ap.audio) {
                    this.currentTime = ap.audio.currentTime || 0;
                    this.duration = ap.audio.duration || 0;
                }
            }, 200);

            this.lrcInterval = setInterval(() => {
                const lrcText = document.querySelector('.aplayer-lrc-current');
                if (lrcText) {
                    const el = document.getElementById('lrc');
                    if (el) el.innerHTML = `<span class='lrc-show'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18'><path fill='none' d='M0 0h24v24H0z'/><path d='M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465z' fill='rgba(255,255,255,1)'/></svg>&nbsp;${lrcText.textContent}&nbsp;<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18'><path fill='none' d='M0 0h24v24H0z'/><path d='M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465z' fill='rgba(255,255,255,1)'/></svg></span>`;
                }
            }, 500);
            this._timeUpdater = timeUpdater;

            ap.on('play', () => {
                this.musicPlaying = true;
                this.updateSong();
                this.musicName = (this.currentSong.name || '') + ' - ' + (this.currentSong.artist || '');
                iziToast.info({ timeout: 4000, icon: 'fa-solid fa-circle-play', displayMode: 'replace', message: this.musicName });
                if (window.innerWidth >= 990) {
                    const power = document.querySelector('.power');
                    const lrc = document.getElementById('lrc');
                    if (power) power.style.display = 'none';
                    if (lrc) lrc.style.display = 'block';
                }
            });

            ap.on('pause', () => {
                this.musicPlaying = false;
                if (window.innerWidth >= 990) {
                    const power = document.querySelector('.power');
                    const lrc = document.getElementById('lrc');
                    if (power) power.style.display = 'block';
                    if (lrc) lrc.style.display = 'none';
                }
            });

            ap.on('listswitch', () => {
                this.$nextTick(() => this.updateSong());
            });
        },
        musicToggle() {
            if (this.aplayerInstance) { this.aplayerInstance.toggle(); return; }
            this.openMusicList();
        },
        musicPrev() {
            if (this.aplayerInstance) { this.aplayerInstance.skipBack(); this.aplayerInstance.play(); }
        },
        musicNext() {
            if (this.aplayerInstance) { this.aplayerInstance.skipForward(); this.aplayerInstance.play(); }
        },
        playSong(idx) {
            if (!this.aplayerInstance) return;
            this.aplayerInstance.list.switch(idx);
            this.aplayerInstance.play();
            this.currentIndex = idx;
            this.updateSong();
        },
        seekProgress(e) {
            if (!this.aplayerInstance || !this.duration) return;
            const bar = this.$refs.progressBar;
            if (!bar) return;
            const rect = bar.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            this.aplayerInstance.setMode('normal');
            this.aplayerInstance.seek(pct * this.duration);
        },
        setVolume(e) {
            const v = parseFloat(e.target.value);
            this.musicVolume = v;
            this.musicMuted = false;
            if (this.aplayerInstance) this.aplayerInstance.volume(v, true);
        },
        toggleMute() {
            if (this.aplayerInstance) {
                if (this.musicMuted || this.musicVolume === 0) {
                    this.aplayerInstance.volume(0.5, true);
                    this.musicVolume = 0.5;
                    this.musicMuted = false;
                } else {
                    this.aplayerInstance.volume(0, true);
                    this.musicMuted = true;
                }
            }
        },
        cycleMode() {
            const modes = ['random', 'single', 'list'];
            const idx = modes.indexOf(this.playMode);
            this.playMode = modes[(idx + 1) % 3];
            if (this.aplayerInstance) {
                this.aplayerInstance.setMode(this.playMode);
            }
        },
        openMusicList() {
            this.boxOpen = true;
            this.moreOpen = false;
        },

        /* ===== 更多页面 ===== */
        toggleMore() {
            if (window.innerWidth < 990) return;
            this.moreOpen = !this.moreOpen;
        },
        closeMore() {
            this.moreOpen = false;
        },
        openBox() {
            this.boxOpen = true;
        },
        closeBox() {
            this.boxOpen = false;
        },

        /* ===== 移动端菜单 ===== */
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        },
        toggleMobileRight() {
            this.mobileRight = !this.mobileRight;
        },

        /* ===== 壁纸 ===== */
        setWallpaper(type) {
            this.wallpaperType = type;
            const bg = document.getElementById('bg');
            if (!bg) return;

            switch (type) {
                case '1':
                    bg.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    bg.style.backgroundSize = 'cover';
                    bg.removeAttribute('src');
                    break;
                case '2':
                    bg.removeAttribute('style');
                    bg.src = 'https://api.dujin.org/bing/1920.php';
                    break;
                case '3':
                    bg.removeAttribute('style');
                    bg.src = 'https://tu.ltyuanfang.cn/api/fengjing.php';
                    break;
                case '4':
                    bg.removeAttribute('style');
                    bg.src = 'https://t.mwm.moe/pc';
                    break;
            }

            Cookies.set('bg_img', JSON.stringify({ type }), { expires: 36500 });
            iziToast.show({ icon: 'fa-solid fa-image', timeout: 2500, message: '壁纸设置成功，已生效' });
        },

        openWeather() {
            if (window.__weatherApp) window.__weatherApp.open();
        },
        /* ===== 初始化 ===== */
        initWallpaper() {
            let saved;
            try {
                const raw = Cookies.get('bg_img');
                if (raw && raw !== '{}') saved = JSON.parse(raw);
            } catch (e) { /* ignore */ }
            const type = (saved && saved.type) || '1';
            this.wallpaperType = type;
            this.$nextTick(() => this.setWallpaper(type));
        },

        onWindowResize() {
            if (window.innerWidth >= 600) {
                this.menuOpen = false;
            }
            if (window.innerWidth <= 990) {
                this.moreOpen = false;
                this.boxOpen = false;
            }
        },

        checkMourning() {
            const now = new Date();
            const md = `${now.getMonth() + 1}.${now.getDate()}`;
            if (MOURNING_DAYS.includes(md)) {
                this.mourning = true;
                setTimeout(() => {
                    iziToast.show({ timeout: 14000, icon: 'fa-solid fa-clock', message: '今天是中国国家纪念日' });
                }, 4600);
            }
        },
    },
    mounted() {
        iziToast.settings({
            timeout: 10000, progressBar: false, close: false, closeOnEscape: true,
            position: 'topCenter', transitionIn: 'bounceInDown', transitionOut: 'flipOutX',
            displayMode: 'replace', layout: '1',
            backgroundColor: '#00000040', titleColor: '#efefef', messageColor: '#efefef',
            icon: 'Fontawesome', iconColor: '#efefef',
        });

        this.checkMourning();
        this.initWallpaper();

        /* 问候语 */
        const hour = new Date().getHours();
        if (hour < 6) this.hello = '凌晨好';
        else if (hour < 9) this.hello = '早上好';
        else if (hour < 12) this.hello = '上午好';
        else if (hour < 14) this.hello = '中午好';
        else if (hour < 17) this.hello = '下午好';
        else if (hour < 19) this.hello = '傍晚好';
        else if (hour < 22) this.hello = '晚上好';
        else this.hello = '夜深了';

        /* 加载动画 */
        window.addEventListener('load', () => {
            this.loaded = true;
            this.$nextTick(() => {
                const bg = document.getElementById('bg');
                if (bg) {
                    bg.style.transform = 'scale(1)';
                    bg.style.filter = 'blur(0px)';
                    bg.style.transition = 'ease 1.5s';
                }
                const cover = this.$refs.cover;
                if (cover) cover.style.cssText = 'opacity: 1;transition: ease 1.5s;';
                const section = this.$refs.section;
                if (section) section.style.cssText = 'transform: scale(1) !important;opacity: 1 !important;filter: blur(0px) !important';
            });

            setTimeout(() => {
                iziToast.show({ timeout: 2500, icon: false, title: this.hello, message: '欢迎来到我的主页' });
            }, 800);

            if (/AppWebKit.*Mobile.*/i.test(navigator.userAgent)) {
                const p2 = document.getElementById('g-pointer-2');
                if (p2) p2.style.display = 'none';
            }
        });

        setTimeout(() => { this.loadingText = '字体及文件加载可能需要一定时间'; }, 3000);

        /* 时间 */
        this.updateTime();
        this.updateLifeTime();
        setInterval(() => { this.updateTime(); this.updateLifeTime(); }, 1000);

        /* 一言 */
        this.fetchHitokoto();

        /* 窗口 */
        window.addEventListener('resize', () => this.onWindowResize());

        /* 键盘快捷键 */
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && !this.boxOpen && !this.searchOpen) {
                e.preventDefault();
                if (this.aplayerInstance) this.aplayerInstance.toggle();
            }
        });

        /* 鼠标 */
        const el2 = document.getElementById('g-pointer-2');
        if (el2) {
            const hw = el2.offsetWidth / 2;
            document.addEventListener('mousemove', e => {
                requestAnimationFrame(() => {
                    el2.style.transform = `translate(${e.clientX - hw + 1}px, ${e.clientY - hw + 1}px)`;
                });
            });
        }

        /* 屏蔽右键 */
        document.oncontextmenu = () => {
            iziToast.show({ timeout: 2000, icon: 'fa-solid fa-circle-exclamation', message: '为了浏览体验，本站禁用右键' });
            return false;
        };

        /* 控制台 */
        console.log(
            '%c無名の主页 %c\n _____ __  __  _______     ____     __\n|_   _|  \\/  |/ ____\\ \\   / /\\ \\   / /\n  | | | \\  / | (___  \\ \\_/ /  \\ \\_/ / \n  | | | |\\/| |\\___ \\  \\   /    \\   /  \n _| |_| |  | |____) |  | |      | |   \n|_____|_|  |_|_____/   |_|      |_|     \n%c\n版 本 号：3.4\n更新日期：2022-07-24\n\n主页:  https://www.imsyy.top\nGithub:  https://github.com/imsyy/home',
            'font-size:20px;font-weight:600;color:rgb(244,167,89);',
            'font-size:12px;color:rgb(244,167,89);',
            'color:rgb(30,152,255);'
        );
    },
    beforeUnmount() {
        if (this.lrcInterval) clearInterval(this.lrcInterval);
        if (this._timeUpdater) clearInterval(this._timeUpdater);
        if (this.aplayerInstance) this.aplayerInstance.destroy();
    },
});

app.mount('#app');
