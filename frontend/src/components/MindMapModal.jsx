function MindMapModal() {
  // Simply opens the static HTML file in a new browser tab
  const openMindMap = () => {
    // In development, Vite serves 'public' files at the root
    // In production (Vercel), it does the same!
    window.open('/mindmap.html', '_blank', 'width=1200,height=800');
  };

  return (
    <button 
      onClick={openMindMap}
      className="fixed top-4 right-4 bg-gray-800 text-white px-3 py-1.5 rounded-md shadow-lg hover:bg-gray-700 z-50 text-sm"
    >
      🪾 Project Mind Map
    </button>
  );
}

export default MindMapModal;