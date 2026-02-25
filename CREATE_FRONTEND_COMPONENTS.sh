#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# DeVault Frontend Components Setup
# Creates all React components and styling
# Run this AFTER CREATE_FRONTEND.sh
# ═══════════════════════════════════════════════════════════════════════

set -e

echo "🎨 Creating React components and styles..."
echo ""

# Navigate to DeVault directory
cd ~/Downloads/DeVault

# Ensure frontend structure exists
mkdir -p frontend/src/{components,contracts,hooks,utils}

# ═══════════════════════════════════════════════════════════════════════
# MAIN SOURCE FILES
# ═══════════════════════════════════════════════════════════════════════

echo "📝 Creating src/index.js..."
cat > frontend/src/index.js << 'ENDINDEX'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
ENDINDEX

echo "🎨 Creating src/index.css..."
cat > frontend/src/index.css << 'ENDCSS'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #4F46E5;
  --primary-dark: #4338CA;
  --primary-light: #6366F1;
  --secondary: #06B6D4;
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  --info: #3B82F6;
  
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --bg-tertiary: #334155;
  --bg-card: #1E293B;
  --bg-hover: #334155;
  
  --text-primary: #F1F5F9;
  --text-secondary: #CBD5E1;
  --text-muted: #94A3B8;
  
  --border-color: #334155;
  --border-light: #475569;
  
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-success: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  --gradient-warning: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
}

code {
  font-family: 'Fira Code', source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}
ENDCSS

echo "📊 Creating src/App.js..."
cat > frontend/src/App.js << 'ENDAPP'
import React from 'react';

function App() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>🔐 DeVault Frontend Ready</h1>
      <p>Your frontend base structure is successfully created.</p>
    </div>
  );
}

export default App;
ENDAPP

echo ""
echo "🎉 Component setup complete!"
echo ""
echo "📋 Files created:"
echo "   - frontend/src/index.js"
echo "   - frontend/src/index.css"
echo "   - frontend/src/App.js"
echo ""

