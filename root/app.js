const apiKey = 'YOUR_API_KEY'

Vue.createApp({
    // el: '#app',
    data() {
      return {
        userInput: "",
        // city
        uid: 0,
        city: null,
        population: null,
        sunrise: null,
        sunset: null,
        geo: {
          lat: null,
          lon: null
        },
        mapSouce: null,
        // forcast
        forcastTime: [],
        minTemp: [],
        maxTemp: [],
        condition: [],
        icon: [],
        // covid-19
        cases: null,
        casesArray: [],
        // cities container
        weatherInfoArray: [],
        // modal
        overlay: false,
        modal: false,
        // current weather
        c_condition: null,
        c_icon: null,
        c_temp: null,
        currentWeatherArray: [],
      }
    },
    methods: {
        keydown(event) {
            this.userInput = event.target.value
        },
        convertTime(t) {
          let convertedTime = t.substring(11,16);
          return convertedTime;
        },
        calcCelsius(k) {
          let val = k - 273.15;
          return Math.floor(val);
        },
        fetchData (e) {
          if(e.key == "Enter") {
            this.weatherInfoArray = [];
            let uid;
            let $key = this.userInput;
            // get current weather
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${$key}&appid=${apiKey}`)
            .then(function(res){
              this.c_condition = res.data.weather[0].main
              this.c_icon = `http://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`
              this.c_temp = this.calcCelsius(res.data.main.temp)
              // this.currentWeatherArray.push({
              //   id: uid++,
              //   condition : this.c_condition,
              //   icon : `http://openweathermap.org/img/wn/${res.data.weather.icon}@2x.png`,
              //   temp : this.c_temp,
              // });
            }.bind(this))
            .catch(function(error){
              console.log(error)
            })
            // get forcast
            axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${$key}&appid=${apiKey}`)
            .then(function(res){
              console.log(res.data);
              this.city = res.data.city.name
              this.population = res.data.city.population
              this.sunrise = res.data.city.sunrise
              this.sunset = res.data.city.sunset
              this.geo.lat = res.data.city.coord.lat
              this.geo.lon = res.data.city.coord.lon
              this.mapSouce = `https://maps.google.co.jp/maps?output=embed&q=${res.data.city.coord.lat},${res.data.city.coord.lon}`
              // weather info 3:00 to 21:00
              for(let i = 0; i < 6; i++) {
                this.forcastTime[i] = this.convertTime(res.data.list[i].dt_txt)
                this.minTemp[i] = this.calcCelsius(res.data.list[i].main.temp_min)
                this.maxTemp[i] = this.calcCelsius(res.data.list[i].main.temp_max)
                this.condition[i] = res.data.list[i].weather[0].main
                this.icon[i] = `http://openweathermap.org/img/wn/${res.data.list[i].weather[0].icon}@2x.png`
              }
              // covid-19
              for(let i = 0; i < this.casesArray.length; i++) {
                if(this.casesArray[i].name_en == $key) {
                    this.cases = this.casesArray[i].cases;
                    // var $cases = this.cases * (1000 / this.population)
                    // $cases = Math.round($cases)
                    // console.log($cases)
                }
              }
              this.weatherInfoArray.push({
                id: uid++,
                city : this.city,
                population : this.population,
                sunrise : this.sunrise,
                sunset : this.sunset,
                forcastTime : this.forcastTime,
                minTemp : this.minTemp,
                maxTemp : this.maxTemp,
                condition : this.condition,
                icon : this.icon,
              });
            }.bind(this))
            .catch(function(error){
              console.log(error)
            })
            this.userInput = ""
          }
        },
        // addToArray () {
        //   this.weatherInfoArray.push({
        //     uid: this.uid++,
        //     city: this.city,
        //     temp: this.temp,
        //     condition: this.condition,
        //     lat: this.lat,
        //     lon: this.lon,
        //     mapSouce: this.mapSouce,
        //     ixonPath: this.iconPath,
        //     completed: false
        //   });
        // },
        addActive () {
          console.log('run');
        },
        openModal() {
          this.overlay = true
          this.modal = true
        },
        closeModal() {
          this.overlay = false
          this.modal = false
        }
    },
    filters: {
      // roundUp(value){
      //   return Math.ceil(value)
      // }
    },
    mounted() {
      // covid-19
      axios.get(`https://covid19-japan-web-api.now.sh/api/v1/prefectures`)
      .then(function(res){
        for(let i = 0; i < res.data.length; i++) {
          this.casesArray.push(res.data[i]);
        }
      }.bind(this))
      .catch(function(error){
        console.log(error)
      })
    },
  }).mount('#app');