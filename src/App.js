import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import EngageModal from './components/EngageModal';
import AmendModal from './components/AmendModal';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [showEngage, setShowEngage] = useState(false);
  const [showAmend, setShowAmend] = useState(false);

  return (
    <div className="App">
      {/* Conditional rendering of modals */}
      {showEngage && <EngageModal handleClose={() => setShowEngage(false)} />}
      {showAmend && <AmendModal handleClose={() => setShowAmend(false)} />}
      
      {/* Passing control functions as context to Outlet */}
      <Outlet context={{ setShowEngage, setShowAmend }} />
    </div>
  );
}

export default App;

