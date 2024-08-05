const doc_time = $("#time");
const configFilePath = path.join(app.getPath("userData"), "config.yaml");
let config = {};

const speech = new Speech.default();
(async () => {
  await speech.init();
  speech.setLanguage("zh-TW");
  speech.setVoice("Microsoft Yating - Chinese (Traditional, Taiwan)");
  // speech.setLanguage("ja-JP");
  // speech.setVoice("Microsoft Sayaka - Japanese (Japan)");
  speech.setRate(1.5);
})();



function ReadConfig() {
  try {
    if (fs.existsSync(configFilePath)) {
      return yaml.load(fs.readFileSync(configFilePath, "utf8"));
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error reading config:", e);
  }
}

function WriteConfig(data) {
  try {
    const yamlStr = yaml.dump(data);
    fs.writeFileSync(configFilePath, yamlStr, "utf8");
  } catch (e) {
    console.error("Error writing config:", e);
  }
  if (data && data.setting["user-checkbox"]) {
    variable.speech_status = data.setting["user-checkbox"]["other-voice"];
    ipcRenderer.send(
      "updateAutoLaunch",
      data.setting["user-checkbox"]["other-auto-launch"]
    );
  }
}

function config_init() {
  config = ReadConfig();

  if (!config) {
    console.log("Config file does not exist.");
    config = {
      setting: {},
    };
    WriteConfig(config);
  } else if (!config.setting) {
    console.log("missing setting.");
    config.setting = {};
    WriteConfig(config);
  }
}
