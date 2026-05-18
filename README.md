# Samex Delivery - Shipment Tracker

A B2B logistics platform mini-app built with the MERN stack (Node.js + Express + React) for tracking shipments.

## Features Implemented

### Core Requirements
- **Backend API (Express)**
  - `GET /api/shipments` - Returns all shipments
  - `POST /api/shipments` - Creates new shipment (defaults to "Pending")
  - `PATCH /api/shipments/:id/status` - Updates shipment status
  - In-memory store with 8 pre-seeded shipments
  - Status flow: Pending → Picked Up → In Transit → Delivered (+ Cancelled)

- **Frontend (React)**
  - Clean table view of all shipments
  - Form to create new shipments
  - Status update dropdown (inline updates)
  - Search by sender, receiver, origin, or destination
  - Filter by status (All, Pending, Picked Up, In Transit, Delivered, Cancelled)

### Optional features Implemented
- **Input validation**: Required field checks with error states
- **Stats strip**: Live counts per status at the top
- **Error handling**: Toast notifications for success/error states

### Design Decisions
- **Industrial/utilitarian aesthetic**: Clean, functional design appropriate for logistics
- **Monospace font (IBM Plex Mono)**: Technical, operational feel
- **Status color coding**: Visual hierarchy for shipment states
- **Responsive layout**: Works on desktop and mobile

## Tech Stack

- **Backend**: Node.js + Express + UUID
- **Frontend**: React 18 + Vite
- **Storage**: In-memory array (no database setup required)
- **Styling**: Pure CSS

## Setup & Running

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm start
```

The API will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

### Quick Start (Both at Once)

**Terminal 1 - Backend:**
```bash
cd backend && npm install && npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm install && npm run dev
```

Then open `http://localhost:3000` in your browser.

## API Endpoints

### GET /api/shipments
Returns all shipments.

**Response:**
```json
[
  {
    "id": "uuid",
    "sender": "Raj Mehta",
    "receiver": "Anita Sharma",
    "origin": "Mumbai",
    "destination": "Delhi",
    "status": "Delivered",
    "createdAt": "2025-05-10T00:00:00.000Z"
  }
]
```

### POST /api/shipments
Creates a new shipment.

**Request Body:**
```json
{
  "sender": "John Doe",
  "receiver": "Jane Smith",
  "origin": "Chennai",
  "destination": "Bangalore"
}
```

**Response:** `201 Created` with shipment object

### PATCH /api/shipments/:id/status
Updates shipment status.

**Request Body:**
```json
{
  "status": "In Transit"
}
```

**Response:** Updated shipment object

## What I Would Do Next With More Time

### High Priority
1. **MongoDB Integration**: Replace in-memory store with MongoDB for persistence
2. **Authentication**: JWT-based auth with user roles (admin, driver, customer)
3. **Real-time Updates**: WebSocket integration for live shipment tracking
4. **Driver Assignment**: Assign drivers to shipments and track their location
5. **Enhanced Validation**: Backend validation middleware and more comprehensive input checks

### Medium Priority
6. **Status History**: Track all status changes with timestamps and user attribution
7. **Bulk Operations**: Upload CSV, bulk status updates, export reports
8. **Advanced Filtering**: Date ranges, multi-select filters, saved filter presets
9. **Notifications**: Email/SMS alerts for status changes
10. **Analytics Dashboard**: Charts for delivery times, success rates, regional performance

### Nice to Have
11. **Route Optimization**: Integration with mapping APIs for delivery route planning
12. **Mobile App**: React Native version for drivers
13. **File Attachments**: Upload proof of delivery, invoices, signatures
14. **Multi-language Support**: i18n for different regions
15. **Dark Mode**: Theme toggle for user preference

## AI Usage Note

**Tools Used:** Claude (Anthropic) for code generation and architecture decisions.

**Where AI Helped:**
- Rapid scaffolding of Express API with proper error handling and status validation
- Generated clean, production-ready code with proper separation of concerns

**Where AI Required Guidance:**
- Needed to specify the industrial/logistics-appropriate design aesthetic
- Clarified priorities: core functionality first, then stretch goals
- Validated that in-memory storage was acceptable per assignment brief

**Quality Checks:**
- Manually tested all API endpoints using the frontend UI
- Verified status transition logic (can go from any status to any other status)
- Checked responsive behavior at mobile breakpoints
- Confirmed error handling for network failures and validation errors
- Reviewed code structure for readability and maintainability

## Project Structure

```
delivery-shipment-tracker/
├── backend/
│   ├── server.js          # Express API with all endpoints
│   └── package.json       # Backend dependencies
└── frontend/
    ├── src/
    │   ├── App.jsx        # Main React component
    │   ├── App.css        # Component styles
    │   ├── main.jsx       # React entry point
    │   └── index.css      # Global styles
    ├── index.html         # HTML template
    ├── package.json       # Frontend dependencies
    └── vite.config.js     # Vite configuration
```

Built by Geethika