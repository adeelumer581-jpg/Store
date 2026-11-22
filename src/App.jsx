import { Suspense, lazy, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { OrdersProvider } from './context/OrdersContext.jsx';
import { useHashRoute } from './router/hashRouter.js';
import { getProductBySlug } from './data/products.js';
import { STORE_CONFIG } from './config/store.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import ToastContainer from './components/Toast.jsx';
import Concierge from './components/Concierge.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Shop = lazy(() => import('./pages/Shop.jsx'));
const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const Confirmation = lazy(() => import('./pages/Confirmation.jsx'));
const TrackOrder = lazy(() => import('./pages/TrackOrder.jsx'));
const Story = lazy(() => import('./pages/Story.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function getRouteTitle(route) {
  switch (route.name) {
    case 'home':
      return `${STORE_CONFIG.fullStoreName} | Clean Pakistani Skincare`;
    case 'shop':
      return `The Collection | ${STORE_CONFIG.fullStoreName}`;
    case 'product': {
      const product = getProductBySlug(route.params?.slug);
      return product
        ? `${product.name} | ${STORE_CONFIG.fullStoreName}`
        : `Product Not Found | ${STORE_CONFIG.fullStoreName}`;
    }
    case 'checkout':
      return `Checkout | ${STORE_CONFIG.fullStoreName}`;
    case 'confirmation':
      return `Order Confirmed | ${STORE_CONFIG.fullStoreName}`;
    case 'track':
      return `Track Order | ${STORE_CONFIG.fullStoreName}`;
    case 'story':
      return `Our Story | ${STORE_CONFIG.fullStoreName}`;
    default:
      return `Page Not Found | ${STORE_CONFIG.fullStoreName}`;
  }
}

function PageFallback() {
  return (
    <div className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 py-16 text-center text-[14px] text-[#5C665E]">
      Loading...
    </div>
  );
}

function StorefrontShell() {
  const route = useHashRoute();

  useEffect(() => {
    document.title = getRouteTitle(route);
  }, [route]);

  const renderPage = () => {
    switch (route.name) {
      case 'home':
        return <Home />;
      case 'shop':
        return <Shop route={route} />;
      case 'product':
        return <ProductDetail route={route} />;
      case 'checkout':
        return <Checkout />;
      case 'confirmation':
        return <Confirmation route={route} />;
      case 'track':
        return <TrackOrder route={route} />;
      case 'story':
        return <Story />;
      default:
        return <NotFound />;
    }
  };

  return (
    <div className="min-h-screen-safe flex flex-col bg-[#F6F3EC] text-[#232924]">
      <Header currentRoute={route} />
      <main id="main-content" className="flex-1">
        <Suspense fallback={<PageFallback />}>{renderPage()}</Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
      <Concierge />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <OrdersProvider>
          <StorefrontShell />
        </OrdersProvider>
      </CartProvider>
    </ToastProvider>
  );
}
