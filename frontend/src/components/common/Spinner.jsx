const Spinner = ({ fullScreen }) => (
  <div className={`flex items-center justify-center ${fullScreen ? 'h-screen' : 'py-12'}`}>
    <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);
export default Spinner;