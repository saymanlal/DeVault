#!/bin/bash

# DeVault Frontend Setup Script
# This script creates the complete frontend structure with all files

set -e

echo "🚀 Creating DeVault Frontend..."
echo ""

# Always work from project root
cd ~/Downloads/DeVault

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p frontend/public
mkdir -p frontend/src/components
mkdir -p frontend/src/contracts
mkdir -p frontend/src/hooks
mkdir -p frontend/src/utils

# Create package.json
echo "📦 Creating package.json..."
cat > frontend/package.json << 'PKG'
{
  "name": "devault-frontend",
  "version": "1.0.0",
  "description": "DeVault - Decentralized Token Locking Platform Frontend",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "ethers": "^6.9.0",
    "react-hot-toast": "^2.4.1",
    "react-icons": "^4.12.0",
    "date-fns": "^3.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": ["react-app"]
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
PKG

# Create public/index.html
echo "📄 Creating index.html..."
cat > frontend/public/index.html << 'HTML'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#4F46E5" />
    <meta name="description" content="DeVault - Secure decentralized token locking platform on BNB Chain" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <title>DeVault - Decentralized Token Locking Platform</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
HTML

# Create public/manifest.json
cat > frontend/public/manifest.json << 'MANIFEST'
{
  "short_name": "DeVault",
  "name": "DeVault - Token Locking Platform",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#4F46E5",
  "background_color": "#0F172A"
}
MANIFEST

# Create favicon placeholder
touch frontend/public/favicon.ico

echo ""
echo "✅ Frontend structure created successfully!"
echo ""
echo "📂 Structure:"
echo "   frontend/"
echo "   ├── package.json"
echo "   ├── public/"
echo "   │   ├── index.html"
echo "   │   ├── manifest.json"
echo "   │   └── favicon.ico"
echo "   └── src/"
echo ""
echo "🎨 Next: Run your component setup script"
echo ""

