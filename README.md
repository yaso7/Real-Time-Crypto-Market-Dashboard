# Real-Time Crypto Market Dashboard

A modern, responsive cryptocurrency market dashboard built with Next.js 16 and TypeScript, featuring real-time WebSocket data from Binance, advanced filtering, and a polished user experience.

## 🚀 Features

### Core Features
- **Real-time Market Data**: Live WebSocket streams from Binance for instant price updates
- **Markets List**: 15+ trading pairs with current prices and 24h changes
- **Market Details**: Dedicated pages for each cryptocurrency with comprehensive statistics
- **Connection Status**: Visual indicators with automatic reconnection mechanism
- **Favorites System**: Persistent favorite markets using localStorage
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Track A Features
- **Search**: Real-time symbol search functionality
- **Advanced Sorting**: 7 sorting options (alphabetical, price, change, favorites first)
- **Recently Viewed**: Quick access to last 5 viewed markets
- **Mobile-First**: Fully responsive UI with touch-friendly interactions

### Bonus Features
- **Dark/Light Theme**: System theme detection with manual toggle
- **Loading Skeletons**: Sophisticated loading states for better perceived performance
- **Smart Formatting**: Dynamic price formatting, volume abbreviations, and relative timestamps
- **24h Price Charts**: Interactive charts using Recharts
- **Keyboard Navigation**: Full keyboard accessibility support

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **WebSocket**: Binance WebSocket API
- **Icons**: Lucide React + CoinGecko CDN
- **Charts**: Recharts
- **State Management**: React hooks with localStorage persistence

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yaso7/Real-Time-Crypto-Market-Dashboard.git
   cd Real-Time-Crypto-Market-Dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🏗️ Architecture

### Project Structure
```
├── app/                    # Next.js App Router
│   ├── market/[symbol]/    # Dynamic market detail pages
│   ├── layout.tsx          # Root layout with theme provider
│   └── page.tsx            # Home page with markets grid
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── market-card.tsx     # Market card component
│   ├── market-detail.tsx   # Market detail view
│   └── markets-grid.tsx    # Markets list with search/sort
├── hooks/                  # Custom React hooks
│   ├── use-binance-websocket.ts  # WebSocket connection management
│   ├── use-local-storage.ts      # localStorage abstraction
│   └── use-single-ticker.ts      # Single market WebSocket
├── lib/                    # Utility libraries
│   ├── binance-utils.ts    # Binance API utilities
│   ├── format.ts           # Number/date formatting
│   └── types.ts            # TypeScript type definitions
└── public/                 # Static assets
```

### Real-Time Data Handling

The application uses a sophisticated WebSocket management system:

1. **Connection Pooling**: Single WebSocket connection for all markets using Binance's combined streams
2. **Automatic Reconnection**: Exponential backoff strategy with maximum retry limits
3. **Data Validation**: Strict validation of incoming WebSocket messages
4. **State Management**: Efficient Map-based state for market data updates
5. **Error Handling**: Comprehensive error boundaries and user feedback

### State Management Approach

- **Local State**: React useState for UI state
- **Persistent State**: localStorage for favorites and recently viewed
- **Real-time State**: Custom hooks manage WebSocket data flow
- **Optimization**: useMemo and useCallback prevent unnecessary re-renders

### Failure Handling & Reconnection

- **Connection Monitoring**: Real-time connection status tracking
- **Automatic Retry**: Exponential backoff (1s, 2s, 4s, 8s, 16s)
- **Maximum Attempts**: 5 reconnection attempts before manual intervention
- **User Feedback**: Clear status indicators and manual reconnect button
- **Graceful Degradation**: Skeleton states during connection issues

## 🔄 How the Dashboard Works

### User Journey & Interactions

#### 1. **Home Page - Markets Overview**
- **Initial Load**: The dashboard displays a grid of 15 cryptocurrency trading pairs
- **Real-time Updates**: Each market card shows live price data via WebSocket connections
- **Search**: Type in the search bar to filter markets by symbol (e.g., "BTC" shows Bitcoin)
- **Sorting**: Use the dropdown to sort markets by:
  - Default order
  - Favorites first (starred markets appear at top)
  - Alphabetical (A-Z)
  - Highest/Lowest price
  - Biggest gainers/losers (24h change)
- **Favorites**: Click the star icon on any card to mark/unmark as favorite (persists across sessions)
- **Recently Viewed**: Horizontal scrollable section shows your last 5 viewed markets

#### 2. **Market Detail Page**
- **Navigation**: Click any market card to view detailed information
- **Live Data**: Individual WebSocket connection for real-time price updates
- **Key Metrics**:
  - Current price with 24h change indicator
  - 24h high/low prices
  - 24h trading volume
  - Last update timestamp with relative time
- **Interactive Chart**: 24h price history visualization
- **Back Navigation**: Return to markets list via the back button

### Technical Data Flow

#### WebSocket Architecture
```
Binance WebSocket API
    ↓ (Combined streams)
useBinanceWebSocket Hook
    ↓ (Parsed & validated data)
MarketData Map (React State)
    ↓ (Component updates)
UI Components
```

#### Data Processing Pipeline
1. **Connection**: Establish WebSocket to `wss://stream.binance.com:9443/stream?streams={symbols}@ticker`
2. **Validation**: Incoming messages validated against expected schema
3. **Parsing**: Raw ticker data transformed to normalized `MarketData` format
4. **State Update**: React state updated with new price information
5. **UI Render**: Components re-render with latest data
6. **Persistence**: Favorites and recently viewed saved to localStorage

#### State Management Flow
```
User Action (Favorite/View)
    ↓
useLocalStorage Hook
    ↓
Browser localStorage
    ↓
Persist Across Sessions
```

### Connection Management

#### Multi-Symbol WebSocket (Home Page)
- **Single Connection**: One WebSocket handles all 15+ markets efficiently
- **Stream Combination**: Uses Binance's combined streams feature
- **Auto-Reconnection**: Exponential backoff: 1s → 2s → 4s → 8s → 16s
- **Error Recovery**: Automatic retry with manual fallback option

#### Single-Symbol WebSocket (Detail Page)
- **Focused Connection**: Dedicated WebSocket for individual market
- **Optimized Performance**: Only processes data for viewed market
- **Connection Status**: Visual indicator shows connection state

### Real-Time Features

#### Price Updates
- **Frequency**: Updates multiple times per second as new trades occur
- **Instant Display**: UI reflects price changes immediately
- **Change Indicators**: Green/red arrows show price direction
- **Percentage Calculations**: Real-time 24h change percentages

#### Connection Monitoring
- **Status Badge**: Shows "Live", "Disconnected", or "Reconnecting"
- **Visual Feedback**: Animated pulse indicator for live connections
- **Manual Control**: Retry button available when disconnected
- **Graceful Handling**: Skeleton loading during connection issues

### User Experience Features

#### Responsive Design
- **Mobile**: Single column grid with touch-friendly cards
- **Tablet**: 2-3 column layout with optimized spacing
- **Desktop**: 4 column grid with hover effects
- **Adaptive UI**: Components adjust based on screen size

#### Performance Optimizations
- **Memoization**: Prevents unnecessary re-renders with useMemo/useCallback
- **Efficient State**: Map-based market data for O(1) lookups
- **Lazy Loading**: Components load data as needed
- **Skeleton States**: Smooth loading experience

#### Accessibility
- **Keyboard Navigation**: Full keyboard access to all interactive elements
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Focus Management**: Clear focus indicators and logical tab order
- **Color Blindness**: Not color-dependent for critical information

### Data Persistence

#### Favorites System
```typescript
// Stored in localStorage as JSON array
["BTCUSDT", "ETHUSDT", "SOLUSDT"]
```

#### Recently Viewed
```typescript
// Limited to 5 items, newest first
["BNBUSDT", "ADAUSDT", "DOTUSDT"]
```

#### Theme Preference
```typescript
// System preference or user selection
"light" | "dark" | "system"
```

## ⚖️ Technical Trade-offs

### Performance vs. Data Freshness
- **Trade-off**: Chose WebSocket over polling for real-time updates
- **Rationale**: WebSocket provides instant updates with lower overhead
- **Impact**: Better user experience, slightly more complex connection management

### Bundle Size vs. Feature Richness
- **Trade-off**: Used comprehensive UI library (shadcn/ui) for polished interface
- **Rationale**: Professional appearance outweighs additional bundle size
- **Impact**: Initial load time slightly higher, but better UX

### Simplicity vs. Scalability
- **Trade-off**: Used localStorage instead of external state management
- **Rationale**: Simpler for demo purposes, sufficient for current requirements
- **Impact**: Limited to single device, but easier to maintain

## 📄 License

This project is for demonstration purposes as part of a technical assignment.

## 🤝 Contributing

This is a demonstration project. For production use, please ensure proper security measures and testing.

