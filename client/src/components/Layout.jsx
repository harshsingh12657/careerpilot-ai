const Layout = ({ children }) => {
  return (
    <div className="mesh-bg min-h-screen relative">
      <div className="orb-pink" style={{ top: '-100px', right: '-100px' }} />
      <div className="orb-blue" style={{ bottom: '-100px', left: '-100px' }} />
      <div className="orb-purple" style={{ top: '40%', left: '40%' }} />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;