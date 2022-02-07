//
// SpectrumHandler.js
// Handlers analyzing audio
// A lot of code taken from: https://github.com/TheNexusAvenger/Monstercat-Audio-Spectrum-Visualizer
//

setTimeout(() => {
    console.log("Preparing Handler...");
}, 3000);

var audioContext = new AudioContext();
var sampleRate = audioContext.sampleRate;
var source;

var audioAnalyzer = audioContext.createAnalyser();
var gainNode = audioContext.createGain();
var audioNode = audioContext.createScriptProcessor(bufferInterval, 1, 1);

var startTime = 0;
var songLength = 0;
var CurrentTimeOffset = 0;

var songCache = [];
var CompiledSongData = "return {"

function handleAudio() {
    var data = new Uint8Array(Analyser.frequencyBinCount);
    audioAnalyzer.getByteFrequencyData(data);

    var visualData = GetVisualBins(data);

    var Time = Date.now()
    var Frame = -1
    var SongTime = 0

    SongTime = currentTime - startTime - CurrentTimeOffset
    var TimeToEnd = TimeLength - SongTime

    var CurrentFrame = Math.floor(SongTime / 1000 * 60)
    if (CurrentFrame == LastRenderedFrame) { return }
    LastRenderedFrame = CurrentFrame

    Frame = Math.floor(SongTime / 1000 * 60)

    if (Frame != -1 && LastFrame != Frame) {
        LastFrame = Frame
        CompiledSongData = CompiledSongData + "\n[" + Frame + "] = {"
        for (var i = 0; i < SpectrumBarCount; i++) {
            var Height = TransformedVisualData[i] / 255
            CompiledSongData = CompiledSongData + Math.floor(Height * RecordDownScale) + ","
        }
        CompiledSongData = CompiledSongData + "},"
    }
}

function runSpectrumHandler() {
    audioNode.onaudioprocess = handleAudio;
    audioAnalyzer.fftSize = fftSize;
    audioAnalyzer.smoothingTimeConstant = 0;

    gainNode.connect(audioContext.destination);
    audioNode.connect(audioContext.destination);
    audioAnalyzer.connect(audioNode);
}

function createBuffer(ExistingBuffer) {
    source = audioContext.createBufferSource();
    source.connect(GainNode);
    source.connect(Analyser);
    if (ExistingBuffer != null) {
        source.buffer = ExistingBuffer.buffer;
        source.connect(audioContext.destination);
    }
    source.onended = function () {
        forceStopSong();
    };
}

function pushValues(NewValue) {
    var FirstValue = LastCachedURLs[0];
    for (var i = 0; i < MaxCachedURLs - 1; i++) {
        LastCachedURLs[i] = LastCachedURLs[i + 1];
    }
    LastCachedURLs[MaxCachedURLs - 1] = NewValue;
    return FirstValue;
}

function getAudio(songUrl, callback) {
    var existing = songCache[songUrl];
    if (existing) {
        if (callback) {
            callback(existing);
        }
    } else {
        var request = new XMLHttpRequest();
        request.open("GET", songUrl, true);
        request.responseType = "arraybuffer";

        request.onload = () => {
            audioContext.decodeAudioData(
                request.response,
                function (Buffer) {
                    songCache[Url] = Buffer;
                    var clearedCache = pushValues(Url);
                    if (clearedCache) {
                        songCache[clearedCache] = null;
                    }

                    if (callback) {
                        callback(Buffer);
                    }
                },
                function (Message) {
                    console.log(Message);
                }
            );
        };

        request.send();
    }
}

function loadSong(url) {
    startTime = false;

    const callback = (Buffer) => {
        createBuffer();
        source.buffer = Buffer;
        source.connect(audioContext.destination);

        songLength = Math.round(Buffer.duration * 1000);
        startTime = Date.now();

        document.title = Source.start(0);
    }

    getAudio(url, callback);
    getAudio(url, function () { });
}

function playSong() {
    ompiledSongData = CompiledSongData + "\n\tRecordFrequency = " + RecordFrequency + ","
    CompiledSongData = CompiledSongData + "\n\tRecordDownScale = " + RecordDownScale + ","
    loadSong("songs/EndZone_OST.mp3");
}

function forceStopSong() {
    Playing = false
    Paused = false
    CurrentTimeOffset = 0

    var ModuleName = ArtistName + "_" + SongName
    CompiledSongData = '<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4"> <External>null</External> <External>nil</External> <Item class="ModuleScript" referent="RBX040E8D154ACF48B48C3F54832CED08C8"><Properties> <Content name="LinkedSource"><null></null></Content> <string name="Name">' + ModuleName + '</string> <ProtectedString name="Source"><![CDATA[' + CompiledSongData;
    CompiledSongData = CompiledSongData + "\n}";
    CompiledSongData = CompiledSongData + ']]></ProtectedString> </Properties> </Item> </roblox>';

    var FileName = "Exported Song Data.rbxmx"
    download(CompiledSongData, FileName, "text/plain");

    CompiledSongData = "return {"
    LastFrame = 0
    playSong();
}

runSpectrumHandler();
playSong();
