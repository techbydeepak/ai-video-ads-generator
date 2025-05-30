import React from "react";
import WorkspaceProvider from "./provider";

function WorkspaceLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 text-gray-100 font-sans">
      <WorkspaceProvider>
        <div className="w-full px-6 py-6">
          {children}
        </div>
      </WorkspaceProvider>
    </div>
  );
}

export default WorkspaceLayout;
