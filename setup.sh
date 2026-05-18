#!/bin/bash

echo "Starting Samex Delivery Shipment Tracker..."
echo ""
echo "Installing backend dependencies..."
cd backend && npm install

echo ""
echo "Installing frontend dependencies..."
cd ../frontend && npm install

echo ""
echo "Setup complete!"
echo ""
echo "To run the application:"
echo "  Terminal 1: cd backend && npm start"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
