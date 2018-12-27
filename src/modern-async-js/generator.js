const city = 'New York, NY, us';
const appid = '90a4ad2e94c942f953551e8552df9e8a';
const weartherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${appid}`;
const fiveDayUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${appid}`;

export function* me() {
  const reponse = yield fetch(weartherUrl);
  const weather = yield reponse.json();

  const fiveDay = yield fetch(fiveDayUrl).then(r => r.json());

  console.log(fiveDay);
  console.log(weather);
}

export function assistant(generator) {
  return new Promise((resolve, reject) => {
    remind(() => generator.next());

    function remind(resume) {
      let next;
      try {
        next = resume();
      } catch (error) {
        reject(error);
        return;
      }
      if (next.done) {
        resolve();
        return;
      }
      const promise = Promise.resolve(next.value);
      promise.then(
        function fulfillReaction(result) {
          remind(() => generator.next(result));
        },
        function rejectReaction(error) {
          remind(() => generator.throw(error));
        }
      );
    }
  });
}
