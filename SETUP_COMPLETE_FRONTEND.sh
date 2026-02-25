#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# DeVault Complete Frontend Setup - Master Script
# ONE COMMAND to create entire frontend!
# ═══════════════════════════════════════════════════════════════════════

set -e

clear
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║   🔐 DeVault - Complete Frontend Setup                              ║"
echo "║                                                                      ║"
echo "║   This will create the ENTIRE frontend in one command                ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Working directory: $(pwd)"
echo ""
echo "⏳ This will take about 30 seconds..."
echo ""

# Ensure we are inside project directory
cd ~/Downloads/DeVault

# Run the scripts in sequence
echo "🚀 Step 1/3: Creating project structure..."
bash create-frontend.sh

echo ""
echo "🎨 Step 2/3: Creating React components..."
bash CREATE_FRONTEND_COMPONENTS.sh

echo ""
echo "🎭 Step 3/3: Creating UI components..."
bash CREATE_FRONTEND_UI.sh

echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║   ✅ Frontend Created Successfully!                                  ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📦 Next Steps:"
echo ""
echo "   1. Navigate to frontend:"
echo "      cd frontend"
echo ""
echo "   2. Install dependencies:"
echo "      npm install"
echo ""
echo "   3. Update contract addresses:"
echo "      Edit: src/contracts/addresses.json"
echo "      Add your deployed contract addresses"
echo ""
echo "   4. Start development server:"
echo "      npm start"
echo ""
echo "🌐 The app will open at: http://localhost:3000"
echo ""
echo "📚 Documentation: ../README.md"
echo ""

