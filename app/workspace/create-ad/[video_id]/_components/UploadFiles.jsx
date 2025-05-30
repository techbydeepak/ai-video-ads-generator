import { FilePlus2, ImageUp, X } from "lucide-react";
import React, { useEffect, useState } from "react";

function UploadFiles({ videoData, onHandleInputChange }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    setFiles((prev) => {
      const prevFileNames = new Set(prev.map((file) => file.name));
      const newUniqueFiles = selectedFiles.filter(
        (file) => !prevFileNames.has(file.name)
      );
      return [...prev, ...newUniqueFiles];
    });
  };

  const removeImage = (indexToRemove) => {
    const uploadedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(uploadedFiles);
  };

  useEffect(() => {
    files && onHandleInputChange("rawFiles", files);
  }, [files]);

  return (
    <div className="p-6 rounded-2xl shadow-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 mt-6 border-4 border-red-700 max-w-full">
      <h2 className="font-extrabold text-2xl text-red-600 flex gap-3 items-center tracking-wider">
        <ImageUp className="p-3 bg-red-700 rounded-md text-white w-12 h-12" />
        Image / Video Upload
      </h2>
      <hr className="my-4 border-red-700" />
      <div className="mt-4">
        <label className="text-gray-400 font-semibold">
          Upload Image or Video for your ads
        </label>
        <label htmlFor="fileUpload">
          <div
            className="mt-3 p-6 bg-gray-800 border-2 border-dashed border-red-600 cursor-pointer rounded-2xl
            flex flex-col items-center justify-center hover:bg-red-900 transition duration-300"
          >
            <h2 className="text-red-500 font-bold text-lg mb-2">
              Click here to upload files
            </h2>
            <FilePlus2 className="w-12 h-12 text-red-600" />
          </div>
        </label>
        <input
          type="file"
          id="fileUpload"
          className="invisible"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 mt-6">
        {files.map((file, index) => {
          const previewUrl = URL.createObjectURL(file);
          return (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden shadow-lg border-2 border-red-700 hover:scale-105 transform transition-transform duration-300"
            >
              <X
                className="absolute top-1 right-1 z-10 cursor-pointer text-red-600 bg-gray-900 rounded-full p-1 hover:bg-red-700"
                onClick={() => removeImage(index)}
                size={18}
              />
              <img
                src={previewUrl}
                alt="uploaded preview"
                className="w-full h-20 object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UploadFiles;
