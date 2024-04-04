import React from 'react';
import EngageModal from './components/EngageModal';
import AmendModal from './components/AmendModal';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <h1>Create User</h1>
      <EngageModal />
      <AmendModal />
    </div>
  );
}

export default App;