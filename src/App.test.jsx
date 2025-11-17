import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: '40px', fontSize: '24px' }}>
        <h1>TEST PAGE - If you see this, React is working!</h1>
        <p>Current URL: {window.location.href}</p>
      </div>
    </BrowserRouter>
  );
}

export default App;
