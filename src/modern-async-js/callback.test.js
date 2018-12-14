import {
  getCurrentCity,
  getForecast,
  getWeather,
  fetchCurrentCity
} from './operation';
import { callDone } from './multiDone';

describe('Callback examples', () => {
  it('Nesting serial async dependencies', done => {
    getCurrentCity(function(error, city) {
      getWeather(city, function(error, weather) {
        console.log('weather', weather);
        done();
      });

      console.log(`Weather for ${city}:`);
    });
  });

  it('Verbose, hard to reuse, easy to forget, additional error handling mechanism', done => {
    getCurrentCity(function(error, city) {
      if (error) {
        done(error);
        return;
      }

      getWeather(city, function(error, weather) {
        if (error) {
          done(error);
          return;
        }

        console.log('weather', weather);
        done();
      });

      console.log(`Weather for ${city}:`);
    });
  });

  it('Seams rip across program', function(done) {
    let _city;
    getCurrentCity((error, city) => (_city = city));

    getWeather(_city, function(error, city) {
      if (error) {
        done(error);
        return;
      }
    });
  });

  it("Results aren't easily reused", function(done) {
    // say I need to reuse something across my app, like a connection pool to a database.
    // that pool has to be created and a connection opened, that's async
    // I have to wait for all subsequent code with DB calls until this is done or I can have issues

    getCurrentCity((error, city) => {
      getWeather(city, (error, weather) => {
        console.log(weather);
      });
    });

    // later on, how can I use the current city again without re-fetching it?

    getCurrentCity((error, city) => {
      getForecast(city, (error, forecast) => {
        console.log(forecast);

        // brittle - gambling this happens last
        done();
      });
    });
  });

  it('Parallel result synchronization', done => {
    const city = 'NYC';

    let weatherData;
    let forecastData;

    getWeather(city, function(error, weather) {
      weatherData = weather;
      console.log('weather', weather);
      finishIfReady();
    });

    getForecast(city, function(error, forecast) {
      forecastData = forecast;
      console.log('forecast', forecast);
      finishIfReady();
    });

    function finishIfReady() {
      if (weatherData && forecastData) {
        // could add logic here to update UI all at once
        console.log('both done!');
        done();
        return;
      }
      console.log('not done yet');
    }
  });

  it('Combined serial async dependencies and parallel result synchronization, with error handling', done => {
    getCurrentCity(function(error, city) {
      if (error) {
        return done(error);
      }

      let weatherData;
      let forecastData;

      getWeather(city, function(error, weather) {
        if (error) {
          return done(error);
        }

        weatherData = weather;
        console.log('weather', weather);
        finishIfReady();
      });

      getForecast(city, function(error, forecast) {
        if (error) {
          return done(error);
        }

        forecastData = forecast;
        console.log('forecast', forecast);
        finishIfReady();
      });

      function finishIfReady() {
        if (weatherData && forecastData) {
          // could add logic here to update UI all at once
          console.log('both done!');
          done();
          return;
        }
        console.log('not done yet');
      }

      console.log(`Weather for ${city}:`);
    });
  });

  it.only('register only error handler inores error handler', function(done) {
    const operation = fetchCurrentCity();
    operation.onCommplete(result => done());
    operation.onFailure(error => done(error));
  });

  it.only('register only success handler inores error handler', function(done) {
    const operation = fetchCurrentCity();
    operation.onCommplete(result => done(new Error(`shouldn't succed `)));
    operation.onFailure(error => done(error));
  });

  // it.only('pass multipe  callbacks - all of them are called', function(done) {
  //   const operation = fetchCurrentCity();
  //   const multipeDone = callDone(done).afterTwoCalls();
  //   operation.onCommplete(result => multipeDone());
  // });

  /* 
   // What I would like this to look like
   // - imagine `await` waits for an async operation to complete and then returns the result
   // - `await` does this without blocking
   // - `await` will throw any errors from the async operation 
   const city = await getCurrentCity();
   // fire both requests in parallel, so I have to defer waiting for result
   const weatherRequest = getWeather(city);
   const forecastRequest = getForecast(city);
   const weather = await weatherRequest;
   console.log("weather", weather); 
   const forecast = await forecastRequest; 
   console.log("forecast", forecast); 
   done();
   */
});

// note: more callback challenges can be done here, for example multiple callbacks