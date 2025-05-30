import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { PlayCircle, PauseCircle, Mic } from "lucide-react";

function VoiceList({ videoData, onHandleInputChange }) {
  const [voiceList, setVoiceList] = useState([]);
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [loading, setLoading] = useState(true);  // loading state add ki
  const audioRef = useRef(null);

  useEffect(() => {
    GetVoiceList();
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const GetVoiceList = async () => {
    setLoading(true); // loading start
    try {
      const result = await axios.get("/api/get-voice-list");
      const voices = Array.isArray(result.data.voices) ? result.data.voices : [];
      setVoiceList(voices);
    } catch (error) {
      console.error("Failed to load voices:", error);
      setVoiceList([]);
    } finally {
      setLoading(false); // loading end
    }
  };

  const togglePlay = (voice) => {
    if (playingVoiceId === voice.voice_id) {
      audioRef.current?.pause();
      setPlayingVoiceId(null);
    } else {
      audioRef.current?.pause();
      const newAudio = new Audio(voice.preview_audio);
      audioRef.current = newAudio;
      newAudio.play();
      setPlayingVoiceId(voice.voice_id);
      newAudio.onended = () => setPlayingVoiceId(null);
    }
  };

  const genderIcon = (gender) =>
    gender.toLowerCase() === "male" ? "♂️" : "♀️";

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg shadow-2xl min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full mb-6"></div>
        <p className="text-red-600 text-xl font-semibold">Loading voices...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg shadow-2xl min-h-screen">
      <h2 className="flex items-center gap-3 text-3xl font-extrabold text-red-600 mb-8 select-none tracking-wide">
        <Mic className="text-red-500 w-8 h-8" />
        Select Voice
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-h-[60vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-900">
        {voiceList.slice(0, 250).map((voice) => {
          const isSelected = videoData?.voice?.voice_id === voice.voice_id;
          return (
            <div
              key={voice.voice_id}
              onClick={() => onHandleInputChange("voice", voice)}
              className={`cursor-pointer rounded-xl border-2 p-5 flex flex-col justify-between transition-all duration-300
                ${
                  isSelected
                    ? "border-red-600 bg-gradient-to-tr from-red-900 to-black shadow-lg shadow-red-800/70 text-red-400"
                    : "border-gray-700 bg-gray-900 hover:border-red-600 hover:bg-gray-800 text-gray-300 hover:text-red-500"
                }
                `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 font-bold text-lg tracking-wide select-none">
                  <span className="text-red-500">{voice.name}</span>
                  <span className="text-xl">{genderIcon(voice.gender)}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay(voice);
                  }}
                  className={`transition-transform duration-200 rounded-full p-1 
                    ${
                      playingVoiceId === voice.voice_id
                        ? "bg-red-700 text-red-300 hover:bg-red-800"
                        : "bg-red-900 text-red-600 hover:bg-red-700"
                    }
                  `}
                  aria-label={playingVoiceId === voice.voice_id ? "Pause Voice" : "Play Voice"}
                >
                  {playingVoiceId === voice.voice_id ? (
                    <PauseCircle className="w-7 h-7" />
                  ) : (
                    <PlayCircle className="w-7 h-7" />
                  )}
                </button>
              </div>

              <div className="text-sm font-mono text-red-400 tracking-wider select-none">
                {voice.language}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VoiceList;
