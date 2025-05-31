import WorkspaceProvider from "./provider";

export default function WorkspaceLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 text-gray-100 font-sans">
      <WorkspaceProvider>
        {children}
      </WorkspaceProvider>
    </div>
  );
}