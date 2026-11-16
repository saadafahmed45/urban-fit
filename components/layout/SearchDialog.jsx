'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { formatPrice } from '@/lib/utils';

const POPULAR_SEARCHES = ['Heavyweight Hoodie', 'Boxy Tee', 'Cargo Sweatpants', 'Beanie', 'Oversized', 'Taupe'];

export default function SearchDialog() {
  const router = useRouter();
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}&limit=6`);
        const json = await res.json();
        if (json?.success) {
          setResults(json.data || []);
        } else {
          setResults([]);
        }
      } catch (err) {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      closeSearch();
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectTag = (tag) => {
    setQuery(tag);
  };

  return (
    <Dialog.Root open={isSearchOpen} onOpenChange={(open) => !open && closeSearch()}>
      <AnimatePresence>
        {isSearchOpen && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-[#111111]/70 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            {/* Dialog Content */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-12 md:top-20 inset-x-4 max-w-3xl mx-auto z-50 bg-[#F5F1EC] border border-[#E3DBD2] shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[80vh]"
              >
                {/* Search Bar Header */}
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-3 px-6 py-4 border-b border-[#E3DBD2] bg-[#EFE8E0]"
                >
                  <Search className="w-5 h-5 text-[#736E67] shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="SEARCH OVERSIZED HOODIES, TEES, CARGOS..."
                    className="w-full bg-transparent font-heading text-sm md:text-base uppercase tracking-wider text-[#111111] placeholder:text-[#736E67] focus:outline-none"
                  />
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin text-[#B38B66] shrink-0" />}
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="text-[#736E67] hover:text-[#111111] p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="ml-2 text-xs uppercase tracking-widest font-heading px-2 py-1 bg-[#111111] text-white hover:bg-[#B38B66] transition-colors"
                    >
                      ESC
                    </button>
                  </Dialog.Close>
                </form>

                {/* Popular Tags */}
                <div className="px-6 py-3 bg-[#F7F4F0] border-b border-[#E3DBD2] flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-streetwear font-heading text-[#736E67]">
                    TRENDING:
                  </span>
                  {POPULAR_SEARCHES.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSelectTag(tag)}
                      className="text-xs uppercase font-heading px-2.5 py-0.5 border border-[#E3DBD2] hover:border-[#111111] hover:bg-[#111111] hover:text-white transition-all text-[#111111]"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Search Results / Empty State */}
                <div className="overflow-y-auto p-6 space-y-4">
                  {results.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs uppercase tracking-streetwear font-heading text-[#736E67]">
                          FOUND {results.length} PIECES
                        </span>
                        <Link
                          href={`/shop?search=${encodeURIComponent(query)}`}
                          onClick={closeSearch}
                          className="text-xs uppercase font-heading text-[#B38B66] hover:underline flex items-center gap-1"
                        >
                          VIEW ALL RESULTS <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {results.map((product) => (
                          <Link
                            key={product._id}
                            href={`/product/${product.slug}`}
                            onClick={closeSearch}
                            className="group flex gap-3 p-2 bg-[#F7F4F0] border border-[#E3DBD2] hover:border-[#111111] transition-all"
                          >
                            <div className="relative w-16 h-20 bg-[#EFE8E0] shrink-0 overflow-hidden">
                              <Image
                                src={product.images?.[0]?.url || '/placeholder.jpg'}
                                alt={product.name}
                                fill
                                sizes="64px"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex flex-col justify-between py-0.5 min-w-0">
                              <div>
                                <span className="text-[9px] uppercase tracking-widest text-[#B38B66] font-heading block truncate">
                                  {product.categoryName || product.category}
                                </span>
                                <h4 className="font-heading text-xs uppercase text-[#111111] line-clamp-2 leading-tight group-hover:text-[#B38B66] transition-colors">
                                  {product.name}
                                </h4>
                              </div>
                              <span className="font-heading text-xs font-semibold text-[#111111]">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : query.trim() && !isLoading ? (
                    <div className="py-12 text-center">
                      <p className="font-heading text-lg uppercase text-[#111111] mb-1">
                        NO STREETWEAR FOUND FOR &ldquo;{query}&rdquo;
                      </p>
                      <p className="font-sans text-xs text-[#736E67] mb-4">
                        Check your spelling or search by hoodie, tee, bottoms, or color.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          closeSearch();
                          router.push('/shop');
                        }}
                        className="btn-primary text-xs py-2 px-4"
                      >
                        EXPLORE ALL PRODUCTS →
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-[#736E67]">
                      <p className="font-heading text-xs uppercase tracking-streetwear">
                        TYPE TO SEARCH OUR ARCHIVE
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
