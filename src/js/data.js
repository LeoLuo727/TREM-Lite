/* eslint-disable no-undef */
let replay_timer;
if (variable.replay_list.length)
  replay_timer = setInterval(() => read_replay_file(), 1000);

ntp();

setInterval(() => {
  show_rts_list();

  // if (variable.replay_list.length) return;
  realtime_rts();
  realtime_eew();
}, 1000);

setInterval(() => {
  if (Object.keys(variable.eew_list).length !== 0) return;
  report();
}, 10000);

setInterval(() => {
  ntp();
}, 60000);

setInterval(() => {
  checkForNewRelease();
}, 3_600_000);

function read_replay_file() {
  if (!variable.replay_list.length) {
    variable.replay = 0;
    if (replay_timer) clearInterval(replay_timer);
    return;
  }

  const name = variable.replay_list.shift();

  // eslint-disable-next-line no-constant-condition
  if (1 == 2) {
    const data = JSON.parse(
      fs
        .readFileSync(path.join(app.getPath("userData"), `replay/${name}`))
        .toString()
    );

    const alert = Object.keys(data.rts.box).length;
    data.rts.eew = data.eew;
    show_rts_dot(data.rts, alert);
    if (alert) show_rts_box(data.rts.box);

    for (const eew of data.eew) {
      eew.time = data.rts.time;
      eew.timestamp = now();
      // eew.eq.mag = 1;
      show_eew(eew);
    }

    for (const intensity of data.intensity) show_intensity(intensity);

    variable.replay = data.rts.time;
    variable.report.replay_status = data.rts.time;
    // variable.report.replay_data = data.rts;
    variable.last_get_data_time = now();
  }
}

async function realtime_rts() {
  if (variable.report.replay_status) return;
  const res = await fetchData(`${LB_url()}v1/trem/rts`);
  const data = await res.json();

  const alert = Object.keys(data.box).length;
  show_rts_dot(data, alert);
  if (alert) show_rts_box(data.box);

  variable.last_get_data_time = now();
  $("#connect").style.color = "goldenrod";
}

async function realtime_eew() {
  if (variable.report.replay_status) return;
  const res = await fetchData(`${LB_url()}v1/eq/eew`);
  const data = await res.json();
  for (const eew of data) {
    eew.timestamp = now();
    show_eew(eew);
  }
}

async function ntp() {
  const res = await fetchData(
    `https://lb-${Math.ceil(Math.random() * 4)}.exptech.com.tw/ntp`
  );
  const data = await res.text();
  variable.time_offset = Number(data) - Date.now();
}

let rts_replay_time = 0;

setInterval(() => {
  try {
    if (!rts_replay_time) return;
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 2500);
    const _replay_time = Math.round(rts_replay_time / 1000);
    rts_replay_time += 1000;
    const ts = _replay_time * 1000;

    fetch(`https://api-2.exptech.com.tw/api/v1/trem/rts/${ts}`, {
      signal: controller.signal,
    })
      .then(async (ans) => {
        ans = await ans.json();
        if (!rts_replay_time) return;

        const alert = Object.keys(ans.box).length;
        show_rts_dot(ans, alert);
        if (alert) show_rts_box(ans.box);

        variable.last_get_data_time = now();
        variable.report.replay_data = ans;
        $("#connect").style.color = "goldenrod";
      })
      .catch((err) => {
        console.log(err, "replay_rts");
      });

    fetch(`https://api-2.exptech.com.tw/api/v1/eq/eew/${ts}`, {
      signal: controller.signal,
    })
      .then(async (ans_eew) => {
        ans_eew = await ans_eew.json();
        if (!rts_replay_time) return;
        const _now = now();
        for (const eew of ans_eew) {
          // 計算台灣跟震央的距離
          if (distance(eew.eq.lat, eew.eq.lon)(23.6, 120.4) <= 800) {
            eew.time = eew.eq.time;
            eew.timestamp = _now - (_replay_time * 1000 - eew.time);
            show_eew(eew);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
}, 1000);

function early(data) {
  if (data && data.author) {
    const authorKey = `early-warning-${data.author.toUpperCase()}`;
    return checkbox(authorKey) !== 1;
  }
  return false;
}
