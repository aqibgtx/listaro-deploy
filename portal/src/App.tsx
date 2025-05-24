import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Plus, Trash2, Image as ImageIcon, X, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import toast, { Toaster } from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import "yet-another-react-lightbox/styles.css";
import { supabase } from './supabaseClient';

async function validateUser(userId: string, tempKey: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .eq('temp_key', tempKey)
      .single();

    if (error) {
      console.error('Error validating user:', error);
      return false;
    }

    // Store branch in localStorage if available
    if (data?.branch) {
      localStorage.setItem('branch', data.branch);
    }

    return !!data;
  } catch (error) {
    console.error('Error in validateUser:', error);
    return false;
  }
}

function getOrCreateUserId(): string {
  const storedUserId = localStorage.getItem('user_id');
  if (!storedUserId) {
    localStorage.removeItem('user_id');
  }
  return storedUserId || '';
}

interface LoginForm {
  userId: string;
  tempKey: string;
}

interface ListingForm {
  title: string;
  description: string;
  price: number;
  images: File[];
  title_style: string;
  desc_style: string;
  priceMod: number;
}

interface CookedListing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: 'pending' | 'ready';
}

const titleStyles = [
  { value: "sloppy_english", label: "Sloppy English (🔥 Street Style)" },
  { value: "sloppy_malay", label: "Sloppy Malay (🇲🇾 Mamak Vibe)" }
];

const descStyles = [
  { value: "sloppy_english", label: "Sloppy English (Gary Halbert Style)" },
  { value: "sloppy_malay", label: "Sloppy Malay (Legit Kedai Style)" }
];

const ITEMS_PER_PAGE = 10;
const POLL_INTERVAL = 3000;

const emptyListing = (): ListingForm => ({
  title: '',
  description: '',
  price: '',
  images: [],
  title_style: '',
  desc_style: '',
  priceMod: -1
});

const cleanGPTOutput = (text: string): string => {
  return text
    .replace(/^(?:Title|Description|Result|Output|Here's?(?:\s+(?:your|the))?(?:\s+(?:result|listing|post|title|description))?):?\s*/i, '')
    .replace(/^["']|["']$/g, '')
    .replace(/^(?:I've generated|I have created|Here is|This is)\s+(?:a|the)\s+(?:listing|post|title|description)(?:\s+for you)?:?\s*/i, '')
    .replace(/\s*(?:Let me know if you'd like any changes|How's that|Is this what you were looking for)\??$/i, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/ +\n/g, '\n')
    .replace(/\n +/g, '\n')
    .trim();
};

const optimizeImageUrl = (url: string): string => {
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', '/upload/c_scale,w_1280,q_auto,f_auto/');
  }
  return url;
};

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "listaro_preset");

  const response = await fetch("https://api.cloudinary.com/v1_1/dtqi9u5lk/image/upload", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
};

const ImagePreview = React.memo(({ file, onRemove, onClick, index }: { 
  file: File;
  onRemove: () => void;
  onClick: () => void;
  index: number;
}) => {
  const [objectUrl, setObjectUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="relative group flex-shrink-0 w-[200px]">
      <div 
        className="aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
        onClick={onClick}
      >
        <img
          src={objectUrl}
          alt={`Preview ${index + 1}`}
          className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
          loading="lazy"
          draggable={false}
        />
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={16} className="text-gray-600" />
      </button>
    </div>
  );
});

const ImageGallery = ({ images, onRemove, onImageClick, onAddImages }: {
  images: File[];
  onRemove: (index: number) => void;
  onImageClick: (index: number) => void;
  onAddImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [images]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const targetScroll = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative group touch-pan-x">
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors dark:bg-gray-800/90 dark:hover:bg-gray-800"
        >
          <ChevronLeft size={20} className="dark:text-white" />
        </button>
      )}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors dark:bg-gray-800/90 dark:hover:bg-gray-800"
        >
          <ChevronRight size={20} className="dark:text-white" />
        </button>
      )}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth select-none"
        onScroll={checkScrollButtons}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {images.map((file, index) => (
          <ImagePreview
            key={`${index}-${file.name}`}
            file={file}
            index={index}
            onRemove={() => onRemove(index)}
            onClick={() => !isDragging && onImageClick(index)}
          />
        ))}
        {images.length < 10 && (
          <label 
            className="flex-shrink-0 w-[200px] aspect-square flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-600 dark:hover:border-blue-500"
          >
            <div className="text-center">
              <Plus className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
              <span className="mt-2 block text-sm font-medium text-gray-600 dark:text-gray-400">Add More</span>
              <input
                type="file"
                className="hidden"
                onChange={onAddImages}
                multiple
                accept="image/*"
              />
            </div>
          </label>
        )}
      </div>
    </div>
  );
};

const ListingForm = React.memo(({ 
  listing, 
  index,
  onUpdate, 
  onRemove,
  onImageChange,
  onOpenLightbox,
  isDarkMode
}: {
  listing: ListingForm;
  index: number;
  onUpdate: (index: number, field: keyof ListingForm, value: any) => void;
  onRemove: () => void;
  onImageChange: (index: number, files: File[]) => void;
  onOpenLightbox: (listingIndex: number, imageIndex: number) => void;
  isDarkMode: boolean;
}) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files).slice(0, 10);
      onImageChange(index, [...listing.images, ...files].slice(0, 10));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onImageChange(index, [...listing.images, ...files].slice(0, 10));
    }
  };

  const removeImage = (imageIndex: number) => {
    const newImages = listing.images.filter((_, i) => i !== imageIndex);
    onImageChange(index, newImages);
  };

  const handlePriceInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', '.'];
    if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className={`p-8 rounded-2xl shadow-lg border relative backdrop-blur-sm ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-100'}`}>
      {index > 0 && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-gray-700/80 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors group"
          title="Delete listing"
        >
          <Trash2 size={20} className="text-gray-400 group-hover:text-red-500 dark:text-gray-400 dark:group-hover:text-red-400 transition-colors" />
        </button>
      )}
      
      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Product Images (Max 10)
          </label>
          {listing.images.length === 0 ? (
            <label 
              className="block cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl hover:border-blue-400 transition-colors ${isDarkMode ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-50/50 border-gray-300'}`}>
                <div className="space-y-1 text-center">
                  <ImageIcon className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <div className={`flex text-sm justify-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="relative font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                      Upload files
                      <input
                        type="file"
                        className="sr-only"
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                      />
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    PNG, JPG, GIF up to 10 files
                  </p>
                </div>
              </div>
            </label>
          ) : (
            <ImageGallery
              images={listing.images}
              onRemove={removeImage}
              onImageClick={(imgIndex) => onOpenLightbox(index, imgIndex)}
              onAddImages={handleImageChange}
            />
          )}
        </div>

        <div>
          <label htmlFor={`title-${index}`} className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Listing Title
          </label>
          <input
            type="text"
            id={`title-${index}`}
            value={listing.title}
            onChange={(e) => onUpdate(index, 'title', e.target.value)}
            className={`mt-1 px-4 block w-full rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'border-gray-300 placeholder-gray-400'
            }`}
            placeholder="e.g., Beautiful Vintage Leather Sofa"
            required
          />
        </div>

        <div>
          <label htmlFor={`description-${index}`} className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Description
          </label>
          <textarea
            id={`description-${index}`}
            value={listing.description}
            onChange={(e) => onUpdate(index, 'description', e.target.value)}
            rows={4}
            className={`mt-1 px-4 py-2 block w-full rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'border-gray-300 placeholder-gray-400'
            }`}
            placeholder="Describe your item in detail..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor={`price-${index}`} className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Price (RM)
            </label>
            <input
              type="text"
              id={`price-${index}`}
              value={listing.price}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d.]/g, '');
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  onUpdate(index, 'price', value);
                }
              }}
              onKeyDown={handlePriceInput}
              className={`mt-1 px-4 block w-full rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'border-gray-300 placeholder-gray-400'
              }`}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label htmlFor={`priceMod-${index}`} className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Price Modifier
            </label>
            <input
              type="text"
              id={`priceMod-${index}`}
              value={listing.priceMod}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d.-]/g, '');
                if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
                  onUpdate(index, 'priceMod', value);
                }
              }}
              onKeyDown={handlePriceInput}
              className={`mt-1 px-4 block w-full rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'border-gray-300 placeholder-gray-400'
              }`}
              placeholder="-1.00"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor={`titleStyle-${index}`} className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Title Style
            </label>
            <select
              id={`titleStyle-${index}`}
              value={listing.title_style}
              onChange={(e) => onUpdate(index, 'title_style', e.target.value)}
              className={`mt-1 px-4 block w-full rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300'
              }`}
            >
              <option value="">Select a style...</option>
              {titleStyles.map(style => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`descStyle-${index}`} className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Description Style
            </label>
            <select
              id={`descStyle-${index}`}
              value={listing.desc_style}
              onChange={(e) => onUpdate(index, 'desc_style', e.target.value)}
              className={`mt-1 px-4 block w-full rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300'
              }`}
            >
              <option value="">Select a style...</option>
              {descStyles.map(style => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
});

const LoginScreen = ({ onLogin }: { onLogin: (userId: string) => void }) => {
  const [form, setForm] = useState<LoginForm>({ userId: '', tempKey: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.userId.trim() || !form.tempKey.trim()) {
      toast.error('Please enter both User ID and Temporary Key');
      return;
    }

    setIsLoading(true);
    try {
      const isValid = await validateUser(form.userId, form.tempKey);
      if (isValid) {
        localStorage.setItem('user_id', form.userId);
        onLogin(form.userId);
        toast.success('Login successful!');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
            Welcome <Sparkles className="text-blue-500" />
          </h2>
          <p className="mt-2 text-gray-600">Sign in to start creating listings</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              required
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your user ID"
            />
          </div>
          <div>
            <label htmlFor="tempKey" className="block text-sm font-medium text-gray-700">
              Temporary Key
            </label>
            <input
              id="tempKey"
              type="password"
              required
              value={form.tempKey}
              onChange={(e) => setForm({ ...form, tempKey: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your temporary key"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  const [userId, setUserId] = useState(getOrCreateUserId());
  const [listings, setListings] = useState<ListingForm[]>([emptyListing()]);
  const [cookedListings, setCookedListings] = useState<CookedListing[]>([]);
  const [displayedListings, setDisplayedListings] = useState<CookedListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentListingIndex, setCurrentListingIndex] = useState(0);
  const [cookedLightboxOpen, setCookedLightboxOpen] = useState(false);
  const [currentCookedListingIndex, setCurrentCookedListingIndex] = useState(0);
  const [currentCookedImageIndex, setCurrentCookedImageIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [sessionId, setSessionId] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showMinListingsAlert, setShowMinListingsAlert] = useState(false);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  });

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      if (sessionId) {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('original_id', sessionId)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setCookedListings(data as CookedListing[]);
          setDisplayedListings(data.slice(0, ITEMS_PER_PAGE) as CookedListing[]);
        }
      }
    }, POLL_INTERVAL);

    return () => clearInterval(pollInterval);
  }, [sessionId, userId]);

  const loadMore = useCallback(() => {
    const currentLength = displayedListings.length;
    const nextBatch = cookedListings.slice(
      currentLength,
      currentLength + ITEMS_PER_PAGE
    );
    if (nextBatch.length > 0) {
      setDisplayedListings(prev => [...prev, ...nextBatch]);
    }
  }, [cookedListings, displayedListings.length]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleImageChange = (index: number, files: File[]) => {
    setListings(current => {
      const updated = [...current];
      updated[index] = { ...updated[index], images: files };
      return updated;
    });
  };

  const addListing = () => {
    setListings(current => [...current, emptyListing()]);
  };

  const removeListing = (index: number) => {
    setListings(current => current.filter((_, i) => i !== index));
  };

  const updateListing = (index: number, field: keyof ListingForm, value: string | number | File[]) => {
    setListings(current => {
      const updated = [...current];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const openLightbox = (listingIndex: number, imageIndex: number) => {
    setCurrentListingIndex(listingIndex);
    setCurrentImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  const openCookedLightbox = (listingIndex: number, imageIndex: number) => {
    setCurrentCookedListingIndex(listingIndex);
    setCurrentCookedImageIndex(imageIndex);
    setCookedLightboxOpen(true);
  };

  const handleLogin = (newUserId: string) => {
    setUserId(newUserId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (listings.length < 3) {
      setShowMinListingsAlert(true);
      return;
    }
    
    setShowConfirmation(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmation(false);
    setIsLoading(true);

    const loadingToast = toast.loading('Saving listings...');

    try {
      const newSessionId = Date.now().toString();
      setSessionId(newSessionId);

      const uploadPromises = listings.flatMap(listing => 
        listing.images.map(file => uploadToCloudinary(file))
      );

      const uploadedUrls = await Promise.all(uploadPromises);

      let urlIndex = 0;
      const pendingListings = listings.map(listing => {
        const listingImages = uploadedUrls.slice(urlIndex, urlIndex + listing.images.length);
        urlIndex += listing.images.length;
        
        return {
          title: listing.title,
          description: listing.description,
          price: parseFloat(listing.price),
          images: listingImages,
          status: "pending",
          title_style: listing.title_style,
          desc_style: listing.desc_style,
          price_mod: parseFloat(listing.priceMod) || 0,
          original_id: newSessionId,
          user_id: userId,
          branch: localStorage.getItem('branch')
        };
      });

      const { error } = await supabase
        .from('listings')
        .insert(pendingListings);

      if (error) {
        throw error;
      }

      setCookedListings(pendingListings as CookedListing[]);
      setDisplayedListings(pendingListings.slice(0, ITEMS_PER_PAGE) as CookedListing[]);

      const preservedSettings = listings[0];
      setListings([{
        ...emptyListing(),
        title_style: preservedSettings.title_style,
        desc_style: preservedSettings.desc_style,
        priceMod: preservedSettings.priceMod
      }]);

      toast.success('Listings saved! Processing in background...', {
        id: loadingToast
      });

    } catch (err) {
      console.error("Error:", err);
      toast.error('Failed to save listings. Please try again.', {
        id: loadingToast
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-12 relative">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full transition-colors duration-200 dark:bg-gray-800 bg-white shadow-lg hover:shadow-xl"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2 dark:from-blue-400 dark:to-purple-400">
            Facebook Marketplace AI <Sparkles className="text-blue-500 dark:text-blue-400" />
          </h1>
          <p className="text-gray-600 mt-2 text-lg dark:text-gray-300">Generate engaging listings with AI assistance</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {listings.map((listing, index) => (
            <ListingForm
              key={`listing-${index}`}
              listing={listing}
              index={index}
              onUpdate={updateListing}
              onRemove={() => removeListing(index)}
              onImageChange={handleImageChange}
              onOpenLightbox={openLightbox}
              isDarkMode={isDarkMode}
            />
          ))}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={addListing}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Plus size={16} /> Add Another Listing
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex justify-center items-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Cooking...
                </>
              ) : (
                <>Cook Listings 🔥</>
              )}
            </button>
          </div>
        </form>

        {displayedListings.length > 0 && (
          <div className="mt-16 space-y-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">Saved Listings</h2>
            <div className="grid gap-6">
              {displayedListings.map((listing, index) => (
                <div 
                  key={listing.id} 
                  className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow dark:bg-gray-800 dark:border-gray-700 ${
                    listing.status === 'pending' ? 'opacity-70' : ''
                  }`}
                >
                  {listing.status === 'pending' && (
                    <div className="mb-4 flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Processing...
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{listing.title}</h3>
                  <p className="mt-4 text-gray-600 whitespace-pre-wrap dark:text-gray-300">{listing.description}</p>
                  <p className="mt-4 text-lg font-semibold text-green-600 dark:text-green-400">RM {listing.price.toFixed(2)}</p>
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {listing.images.map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="cursor-pointer transform hover:scale-105 transition-transform"
                        onClick={() => openCookedLightbox(index, imgIndex)}
                      >
                        <img
                          src={optimizeImageUrl(image)}
                          alt={`Product ${imgIndex + 1}`}
                          className="h-24 w-full object-cover rounded-xl shadow-sm hover:shadow-md transition-shadow"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {displayedListings.length < cookedListings.length && (
                <div ref={loadMoreRef} className="flex justify-center py-4">
                  <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading more...</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showMinListingsAlert && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setShowMinListingsAlert(false)}
        >
          <div 
            className={`bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl transform animate-popup ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold pr-8">Minimum Listings Required</h3>
              <button
                onClick={() => setShowMinListingsAlert(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please add at least 3 listings to start cooking! (Maximum: 10 listings)
            </p>
            <button
              onClick={() => setShowMinListingsAlert(false)}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <h3 className="text-xl font-bold mb-4">Ready to Cook {listings.length} Listing{listings.length > 1 ? 's' : ''}?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please keep your browser open until all listings are fully saved and processed. This may take a few minutes.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmedSubmit}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {lightboxOpen && listings[currentListingIndex]?.images && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={currentImageIndex}
          slides={listings[currentListingIndex].images.map(file => ({
            src: URL.createObjectURL(file)
          }))}
          plugins={[Zoom]}
          zoom={{
            maxZoomPixelRatio: 5,
            zoomInMultiplier: 2,
            doubleTapDelay: 300,
            doubleClickDelay: 300,
            doubleClickMaxStops: 2,
            keyboardMoveDistance: 50,
            wheelZoomDistanceFactor: 100,
            pinchZoomDistanceFactor: 100,
            scrollToZoom: false
          }}
        />
      )}

      {cookedLightboxOpen && cookedListings[currentCookedListingIndex]?.images && (
        <Lightbox
          open={cookedLightboxOpen}
          close={() => setCookedLightboxOpen(false)}
          index={currentCookedImageIndex}
          slides={cookedListings[currentCookedListingIndex].images.map(image => ({
            src: image
          }))}
          plugins={[Zoom]}
          zoom={{
            maxZoomPixelRatio: 5,
            zoomInMultiplier: 2,
            doubleTapDelay: 300,
            doubleClickDelay: 300,
            doubleClickMaxStops: 2,
            keyboardMoveDistance: 50,
            wheelZoomDistanceFactor: 100,
            pinchZoomDistanceFactor: 100,
            scrollToZoom: false
          }}
        />
      )}

      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;