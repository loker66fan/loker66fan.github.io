const { createApp: createWeatherApp } = Vue;

const WEATHER_ENDPOINT = 'https://wttr.in';
const WEATHER_TIMEOUT = 8000;
const WEATHER_CACHE_KEY = 'weather_cache_v3';
const WEATHER_CACHE_MAX_AGE = 30 * 60 * 1000;
const WEATHER_DEFAULT_CITY = '青岛';

function fetchJson(url, timeout = WEATHER_TIMEOUT) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    return fetch(url, { signal: controller.signal })
        .then(response => {
            clearTimeout(timer);
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.json();
        })
        .catch(error => {
            clearTimeout(timer);
            throw error;
        });
}

function firstFilled(...values) {
    for (const value of values) {
        if (value === null || value === undefined) continue;
        if (String(value).trim() === '') continue;
        return value;
    }
    return '';
}

function normalizeText(value) {
    return String(value || '').trim();
}

function normalizeNumberText(value) {
    const raw = normalizeText(value);
    const matched = raw.match(/-?\d+(?:\.\d+)?/);
    return matched ? matched[0] : raw;
}

function normalizeHumidity(value) {
    const raw = normalizeText(value);
    const matched = raw.match(/\d+(?:\.\d+)?/);
    return matched ? matched[0] : raw.replace(/%$/, '');
}

function readValueText(value) {
    if (Array.isArray(value)) return readValueText(value[0]);
    if (value && typeof value === 'object') return normalizeText(value.value);
    return normalizeText(value);
}

function normalizeWindDirection(value) {
    const raw = normalizeText(value).toUpperCase();
    const map = {
        N: '北',
        NNE: '东北偏北',
        NE: '东北',
        ENE: '东北偏东',
        E: '东',
        ESE: '东南偏东',
        SE: '东南',
        SSE: '东南偏南',
        S: '南',
        SSW: '西南偏南',
        SW: '西南',
        WSW: '西南偏西',
        W: '西',
        WNW: '西北偏西',
        NW: '西北',
        NNW: '西北偏北',
    };
    return map[raw] || normalizeText(value);
}

function parseWeatherDate(value) {
    const raw = normalizeText(value);
    if (!raw) return null;
    const compact = raw.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (compact) return new Date(Number(compact[1]), Number(compact[2]) - 1, Number(compact[3]));
    const dashed = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dashed) return new Date(Number(dashed[1]), Number(dashed[2]) - 1, Number(dashed[3]));
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function extractWeekdayLabel(raw) {
    const text = normalizeText(raw);
    const matched = text.match(/(星期[一二三四五六日天]|周[一二三四五六日天])/);
    return matched ? matched[1] : text;
}

function buildWeatherUrl(city = '') {
    const path = city ? '/' + encodeURIComponent(city) : '/';
    const params = new URLSearchParams({
        format: 'j1',
        lang: 'zh',
    });
    return WEATHER_ENDPOINT + path + '?' + params.toString();
}

function isValidWeatherPayload(payload) {
    return !!(
        payload &&
        Array.isArray(payload.current_condition) &&
        payload.current_condition.length &&
        Array.isArray(payload.weather) &&
        payload.weather.length
    );
}

function loadWeatherCache() {
    try {
        const raw = localStorage.getItem(WEATHER_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.payload || !parsed.timestamp) return null;
        return parsed;
    } catch {
        return null;
    }
}

function saveWeatherCache(payload) {
    try {
        localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
            payload,
            timestamp: Date.now(),
        }));
    } catch {}
}

function pickForecastSnapshot(hourly = []) {
    if (!Array.isArray(hourly) || !hourly.length) return {};
    return hourly.find(item => normalizeText(item.time) === '1200') || hourly[Math.floor(hourly.length / 2)] || hourly[0] || {};
}

function getForecastDescription(day) {
    const snapshot = pickForecastSnapshot(day && day.hourly);
    return normalizeText(firstFilled(
        readValueText(snapshot.lang_zh),
        readValueText(snapshot.weatherDesc),
        readValueText(day && day.lang_zh),
        readValueText(day && day.weatherDesc),
    ));
}

const weatherApp = createWeatherApp({
    template: `
    <div v-if="visible" class="weather-overlay" @click.self="close">
      <div class="weather-popup">
        <div class="weather-popup-close" @click="close">
          <i class="fa-solid fa-xmark"></i>
        </div>

        <div v-if="loading" style="text-align:center;padding:20px 0;color:rgba(255,255,255,0.6);">
          <i class="fa-solid fa-spinner fa-spin"></i>&nbsp; 正在获取天气...
        </div>

        <div v-else-if="error" style="text-align:center;padding:20px 0;color:rgba(255,255,255,0.6);cursor:pointer;" @click="fetchWeather(true)">
          <i class="fa-solid fa-cloud-sun-rain"></i>&nbsp; {{ error }}&nbsp; <small>点击重试</small>
        </div>

        <template v-else>
          <div class="weather-current">
            <div class="weather-current-icon" :class="weatherIconClass">
              <i :class="weatherIcon"></i>
            </div>
            <div class="weather-current-body">
              <div class="weather-current-city">
                <i class="fa-solid fa-location-dot"></i> {{ city }}
              </div>
              <div class="weather-current-temp">{{ temperature }}°</div>
              <div class="weather-current-cond">{{ weather }}</div>
              <div class="weather-current-meta">
                <span v-if="windText"><i class="fa-solid fa-wind"></i> {{ windText }}</span>
                <span v-if="humidity"><i class="fa-solid fa-droplet"></i> 湿度 {{ humidity }}%</span>
              </div>
            </div>
          </div>

          <div class="weather-divider"></div>

          <div class="weather-forecast-title">未来天气</div>
          <div class="weather-forecast">
            <div class="weather-day" v-for="d in forecast" :key="d.key">
              <div class="weather-day-label">{{ d.label }}</div>
              <div class="weather-day-icon" :class="dayIconClass(d.desc)">
                <i :class="dayIcon(d.desc)"></i>
              </div>
              <div class="weather-day-desc">{{ d.desc || '--' }}</div>
              <div class="weather-day-hilo">
                <span class="hi">{{ d.high }}°</span>
                <span class="lo">{{ d.low }}°</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  `,
    data() {
        return {
            visible: false,
            loading: false,
            error: '',
            city: '',
            weather: '',
            temperature: '',
            windDirection: '',
            windSpeed: '',
            humidity: '',
            forecast: [],
            lastLoadedAt: 0,
        };
    },
    computed: {
        weatherIcon() {
            return this.getWeatherIcon(this.weather);
        },
        weatherIconClass() {
            return this.getWeatherIconClass(this.weather);
        },
        windText() {
            const parts = [];
            const direction = normalizeText(this.windDirection);
            const speed = normalizeText(this.windSpeed);
            if (direction) parts.push(direction.includes('风') ? direction : direction + '风');
            if (speed) parts.push(speed);
            return parts.join(' ');
        },
    },
    methods: {
        open() {
            this.visible = true;
            if (!this.loading && (!this.city || Date.now() - this.lastLoadedAt > WEATHER_CACHE_MAX_AGE)) {
                this.fetchWeather();
            }
        },
        close() {
            this.visible = false;
        },
        getWeatherIcon(w) {
            const raw = normalizeText(w);
            const s = raw.toLowerCase();
            if (raw.includes('雷') || s.includes('thunder')) return 'fa-solid fa-cloud-bolt';
            if (raw.includes('雪') || raw.includes('冰') || raw.includes('霜') || s.includes('snow') || s.includes('ice') || s.includes('sleet')) return 'fa-solid fa-snowflake';
            if (raw.includes('雨') || s.includes('rain') || s.includes('drizzle')) return 'fa-solid fa-cloud-rain';
            if (raw.includes('雾') || raw.includes('霾') || raw.includes('烟') || s.includes('mist') || s.includes('fog')) return 'fa-solid fa-smog';
            if (raw.includes('风') || raw.includes('沙') || raw.includes('尘') || s.includes('wind')) return 'fa-solid fa-wind';
            if (raw.includes('晴') || s.includes('sunny') || s.includes('clear')) return 'fa-solid fa-sun';
            if (raw.includes('多云') || raw.includes('少云') || s.includes('partly cloudy')) return 'fa-solid fa-cloud-sun';
            if (raw.includes('阴') || raw.includes('云') || s.includes('cloudy') || s.includes('overcast')) return 'fa-solid fa-cloud';
            return 'fa-solid fa-cloud-sun';
        },
        getWeatherIconClass(w) {
            const raw = normalizeText(w);
            const s = raw.toLowerCase();
            if (raw.includes('雷') || raw.includes('雨') || s.includes('rain') || s.includes('drizzle') || s.includes('thunder')) return 'rainy';
            if (raw.includes('雪') || raw.includes('冰') || raw.includes('霜') || s.includes('snow') || s.includes('ice') || s.includes('sleet')) return 'snowy';
            if (raw.includes('雾') || raw.includes('霾') || raw.includes('烟') || s.includes('mist') || s.includes('fog')) return 'foggy';
            if (raw.includes('多云') || raw.includes('阴') || raw.includes('云') || s.includes('cloud') || s.includes('overcast')) return 'cloudy';
            if (raw.includes('晴') || s.includes('sunny') || s.includes('clear')) return 'sunny';
            return '';
        },
        dayIcon(desc) {
            return this.getWeatherIcon(desc);
        },
        dayIconClass(desc) {
            return this.getWeatherIconClass(desc);
        },
        forecastLabel(index, rawDate) {
            if (index === 0) return '今天';
            if (index === 1) return '明天';
            if (index === 2) return '后天';
            const parsed = parseWeatherDate(rawDate);
            if (parsed) {
                const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                return weekdays[parsed.getDay()];
            }
            return extractWeekdayLabel(rawDate) || '未来';
        },
        applyWeatherPayload(payload, { persist = true, loadedAt = Date.now() } = {}) {
            if (!isValidWeatherPayload(payload)) throw new Error('天气数据为空');
            const current = payload.current_condition[0] || {};
            const area = payload.nearest_area && payload.nearest_area[0] ? payload.nearest_area[0] : {};
            const days = payload.weather.slice(0, 4);
            const areaName = readValueText(area.areaName);
            const regionName = readValueText(area.region);
            const cityLabel = [areaName, regionName].filter(Boolean).join(' · ');

            this.city = normalizeText(firstFilled(cityLabel, areaName, regionName, WEATHER_DEFAULT_CITY));
            this.weather = normalizeText(firstFilled(readValueText(current.lang_zh), readValueText(current.weatherDesc)));
            this.temperature = normalizeNumberText(firstFilled(current.temp_C, current.FeelsLikeC, days[0] && days[0].avgtempC));
            this.humidity = normalizeHumidity(current.humidity);
            this.windDirection = normalizeWindDirection(current.winddir16Point);
            this.windSpeed = normalizeText(current.windspeedKmph ? current.windspeedKmph + ' km/h' : current.windspeedMiles ? current.windspeedMiles + ' mph' : '');
            this.forecast = days.map((day, index) => ({
                key: String(firstFilled(day.date, day.day, index)),
                label: this.forecastLabel(index, firstFilled(day.date, day.day)),
                high: normalizeNumberText(firstFilled(day.maxtempC, day.avgtempC)),
                low: normalizeNumberText(firstFilled(day.mintempC, day.avgtempC)),
                desc: getForecastDescription(day),
            }));

            if (!this.weather && this.forecast.length) {
                this.weather = normalizeText(this.forecast[0].desc);
            }
            if (!this.weather || !this.forecast.length) throw new Error('天气数据为空');
            this.lastLoadedAt = loadedAt;
            if (persist) saveWeatherCache(payload);
        },
        async requestWeatherPayload(city = '') {
            const payload = await fetchJson(buildWeatherUrl(city));
            if (!isValidWeatherPayload(payload)) throw new Error('天气接口返回异常');
            return payload;
        },
        restoreCachedWeather() {
            const cached = loadWeatherCache();
            if (!cached || !cached.payload) return false;
            try {
                this.applyWeatherPayload(cached.payload, {
                    persist: false,
                    loadedAt: cached.timestamp,
                });
                if (Date.now() - cached.timestamp > WEATHER_CACHE_MAX_AGE) {
                    this.error = '';
                }
                return true;
            } catch {
                return false;
            }
        },
        async fetchWeather(forceRefresh = false) {
            if (this.loading) return;
            this.loading = true;
            this.error = '';

            try {
                if (window.location.protocol === 'file:') {
                    throw new Error('当前通过 file:// 打开页面，浏览器会限制部分网络请求');
                }

                if (!forceRefresh && this.restoreCachedWeather() && Date.now() - this.lastLoadedAt <= WEATHER_CACHE_MAX_AGE) {
                    this.loading = false;
                    return;
                }

                let payload;
                try {
                    payload = await this.requestWeatherPayload();
                } catch {
                    payload = await this.requestWeatherPayload(WEATHER_DEFAULT_CITY);
                }

                this.applyWeatherPayload(payload);
            } catch (err) {
                console.error('天气获取失败:', err);
                if (!this.restoreCachedWeather()) {
                    this.error = window.location.protocol === 'file:' ? '请通过本地服务器打开页面后再使用天气功能' : '天气信息获取失败';
                }
            } finally {
                this.loading = false;
            }
        },
    },
});

const instance = weatherApp.mount('#weather-app');
window.__weatherApp = instance;
