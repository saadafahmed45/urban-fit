import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import CartDrawer from './CartDrawer';
import SearchDialog from './SearchDialog';
import MobileMenu from './MobileMenu';
import TrustStrip from './TrustStrip';
import Footer from './Footer';

export default function ShopLayout({ children, showTrustStrip = true }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1EC] text-[#111111]">
      {/* Top Announcement */}
      <AnnouncementBar />

      {/* Main Sticky Navbar */}
      <Navbar />

      {/* Slide-over Overlays */}
      <CartDrawer />
      <SearchDialog />
      <MobileMenu />

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Trust Strip */}
      {showTrustStrip && <TrustStrip />}

      {/* Footer */}
      <Footer />
    </div>
  );
}
