import axios from "axios";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

function AvatarList({ videoData, onHandleInputChange }) {
  const [avatarList, setAvatarList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetAvatarList();
  }, []);

  const GetAvatarList = async () => {
    setLoading(true); // loading start
    try {
      const result = await axios.get("/api/get-avatar-list");
      console.log("Avatar List Response:", result.data);
      const avatars = Array.isArray(result.data.avatars) ? result.data.avatars : [];
      setAvatarList(avatars);
    } catch (error) {
      console.error("Failed to load avatars:", error);
      setAvatarList([]); // ya empty rakho agar error aaye
    } finally {
      setLoading(false); // loading end
    }
  };

  if (loading) {
    // Loading spinner or placeholder while avatars load ho rahe hain
    return (
      <div className="p-8 mt-10 max-w-7xl mx-auto rounded-3xl shadow-2xl bg-gradient-to-r from-gray-900 via-black to-gray-900 border-4 border-red-700 flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full mb-6"></div>
        <p className="text-red-500 text-lg font-semibold">Loading avatars...</p>
      </div>
    );
  }

  return (
    <div className="p-8 mt-10 max-w-7xl mx-auto rounded-3xl shadow-2xl bg-gradient-to-r from-gray-900 via-black to-gray-900 border-4 border-red-700">
      <h2 className="flex items-center gap-4 mb-6 text-3xl font-extrabold tracking-wide text-red-500 drop-shadow-lg">
        <User className="p-3 bg-red-700 rounded-xl text-white w-12 h-12 shadow-md" />
        Select Avatar
      </h2>
      <hr className="border-t border-red-600 mb-6" />
      <p className="text-gray-300 mb-6 max-w-xl text-lg font-medium">
        Choose your favorite avatar for the video ad:
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-h-[36vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-700 scrollbar-track-gray-800">
        {avatarList.slice(0, 250).map((avatar, index) => (
          <div
            key={index}
            onClick={() => onHandleInputChange("avatar", avatar)}
            className={`cursor-pointer rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl
              ${
                videoData?.avatar?.avatar_id === avatar?.avatar_id
                  ? "border-4 border-red-600 bg-red-900 text-red-300"
                  : "bg-gray-800 border border-gray-700 text-gray-200"
              }
              `}
          >
            <img
              src={avatar?.preview_image_url}
              alt={avatar?.avatar_name || `Avatar ${index + 1}`}
              className="w-full h-32 object-cover"
              loading="lazy"
            />
            <div className="p-3 text-center font-semibold truncate text-xl">
              {avatar?.avatar_name || "Unnamed Avatar"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvatarList;
