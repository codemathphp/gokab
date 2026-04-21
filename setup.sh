#!/bin/bash

echo "🚀 GoKab MVP - Setting up..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local..."
    cat > .env.local << EOF
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
NEXT_PUBLIC_MAPBOX_TOKEN=YOUR_MAPBOX_TOKEN
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
EOF
    echo "✅ .env.local created with default values"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📖 To start development:"
echo "   npm run dev"
echo ""
echo "🔨 To build for production:"
echo "   npm run build"
echo ""
echo "🌐 Then run:"
echo "   npm start"
