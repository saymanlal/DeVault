#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# DeVault Frontend - ONE COMMAND INSTALLATION
# Run this single script to create the entire frontend!
# ═══════════════════════════════════════════════════════════════════════

set -e

clear
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║                    🔐 DeVault Frontend Setup                        ║"
echo "║                                                                      ║"
echo "║              ONE COMMAND TO CREATE EVERYTHING!                       ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Move to project root
cd ~/Downloads/DeVault

# Run all setup scripts
echo "🚀 Running setup scripts..."
echo ""

bash CREATE_FRONTEND.sh && \
bash CREATE_FRONTEND_COMPONENTS.sh && \
bash CREATE_FRONTEND_UI.sh

echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║              ✅ FRONTEND CREATED SUCCESSFULLY!                       ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📁 Frontend structure created in: ./frontend/"
echo ""
echo "🎯 Quick Start:"
echo ""
echo "   cd frontend"
echo "   npm install"
echo "   npm start"
echo ""
echo "⚙️  Before running, update contract addresses in:"
echo "   frontend/src/contracts/addresses.json"
echo ""
echo "📚 Full documentation: README.md"
echo ""
echo "🎉 Happy building!"
echo ""

