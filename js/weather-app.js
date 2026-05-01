const { createApp: createWeatherApp } = Vue;

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

        <div v-else-if="error" style="text-align:center;padding:20px 0;color:rgba(255,255,255,0.6);cursor:pointer;" @click="fetchWeather">
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
                <span v-if="windDirection"><i class="fa-solid fa-wind"></i> {{ windDirection }}风 {{ windSpeed }}级</span>
                <span v-if="humidity"><i class="fa-solid fa-droplet"></i> 湿度 {{ humidity }}%</span>
              </div>
            </div>
          </div>

          <div class="weather-divider"></div>

          <div class="weather-forecast-title">未来天气</div>
          <div class="weather-forecast">
            <div class="weather-day" v-for="d in forecast" :key="d.date">
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
        };
    },
    computed: {
        weatherIcon() {
            return this.getWeatherIcon(this.weather);
        },
        weatherIconClass() {
            return this.getWeatherIconClass(this.weather);
        },
    },
    methods: {
        open() {
            this.visible = true;
            if (!this.city && !this.loading) {
                this.fetchWeather();
            }
        },
        close() {
            this.visible = false;
        },
        getWeatherIcon(w) {
            const s = (w || '').toLowerCase();
            if (s.includes('sunny') || s.includes('clear')) return 'fa-solid fa-sun';
            if (s.includes('partly cloudy')) return 'fa-solid fa-cloud-sun';
            if (s.includes('cloudy') || s.includes('overcast')) return 'fa-solid fa-cloud';
            if (s.includes('rain') || s.includes('drizzle')) return 'fa-solid fa-cloud-rain';
            if (s.includes('thunder') || s.includes('thundery')) return 'fa-solid fa-cloud-bolt';
            if (s.includes('snow') || s.includes('ice') || s.includes('sleet')) return 'fa-solid fa-snowflake';
            if (s.includes('mist') || s.includes('fog')) return 'fa-solid fa-smog';
            if (s.includes('wind')) return 'fa-solid fa-wind';
            return 'fa-solid fa-cloud-sun';
        },
        getWeatherIconClass(w) {
            const s = (w || '').toLowerCase();
            if (s.includes('sunny') || s.includes('clear')) return 'sunny';
            if (s.includes('rain') || s.includes('drizzle') || s.includes('thunder')) return 'rainy';
            if (s.includes('snow') || s.includes('ice') || s.includes('sleet')) return 'snowy';
            if (s.includes('mist') || s.includes('fog')) return 'foggy';
            if (s.includes('cloud') || s.includes('overcast')) return 'cloudy';
            return '';
        },
        dayIcon(desc) {
            return this.getWeatherIcon(desc);
        },
        dayIconClass(desc) {
            return this.getWeatherIconClass(desc);
        },
        windScale(kmh) {
            const n = parseInt(kmh) || 0;
            if (n < 1) return 0; if (n <= 5) return 1; if (n <= 11) return 2;
            if (n <= 19) return 3; if (n <= 28) return 4; if (n <= 38) return 5;
            if (n <= 49) return 6; if (n <= 61) return 7; if (n <= 74) return 8;
            if (n <= 88) return 9; if (n <= 102) return 10; if (n <= 117) return 11;
            return 12;
        },
        windDirCN(dir) {
            const map = {
                N: '北', NNE: '东北偏北', NE: '东北', ENE: '东北偏东',
                E: '东', ESE: '东南偏东', SE: '东南', SSE: '东南偏南',
                S: '南', SSW: '西南偏南', SW: '西南', WSW: '西南偏西',
                W: '西', WNW: '西北偏西', NW: '西北', NNW: '西北偏北'
            };
            return map[dir] || dir;
        },
        dayLabel(dateStr) {
            const d = new Date(dateStr);
            const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const afterTomorrow = new Date(today);
            afterTomorrow.setDate(today.getDate() + 2);

            if (d.toDateString() === today.toDateString()) return '今天';
            if (d.toDateString() === tomorrow.toDateString()) return '明天';
            if (d.toDateString() === afterTomorrow.toDateString()) return '后天';
            return days[d.getDay()];
        },
        async fetchWeather() {
            this.loading = true;
            this.error = '';

            try {
                const res = await fetch('https://wttr.in/?format=j2');
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const data = await res.json();

                const area = data.nearest_area && data.nearest_area[0];
                const cond = data.current_condition && data.current_condition[0];
                if (!area || !cond) throw new Error('数据格式异常');

                this.city = (area.areaName && area.areaName[0].value) || (area.region && area.region[0].value) || '未知城市';
                this.weather = (cond.weatherDesc && cond.weatherDesc[0].value) || '';
                this.temperature = cond.temp_C;
                this.humidity = cond.humidity;
                this.windDirection = this.windDirCN(cond.winddir16Point);
                this.windSpeed = this.windScale(parseInt(cond.windspeedKmph) || 0);

                this.forecast = (data.weather || []).slice(0, 4).map(day => {
                    const h = day.hourly || [];
                    const midday = h[4] || h[3] || h[0];
                    return {
                        date: day.date,
                        label: this.dayLabel(day.date),
                        high: day.maxtempC,
                        low: day.mintempC,
                        desc: midday ? (midday.weatherDesc && midday.weatherDesc[0].value) || '' : '',
                    };
                });
            } catch (err) {
                console.error('天气获取失败:', err);
                this.error = '天气信息获取失败';
            } finally {
                this.loading = false;
            }
        },
    },
});

const instance = weatherApp.mount('#weather-app');
window.__weatherApp = instance;
