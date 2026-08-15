import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import apiClient, { API_BASE_URL } from "~/utils/apiClient";

export type ImageSlide = {
  _id: string;
  filename?: string;
  imageUrl?: string;
  path?: string;
  caption?: string;
  title?: string;
  description?: string;
  size?: number;
  mimetype?: string;
  createdAt?: string;
};

type ImageCarouselProps = {
  slideInterval?: number;
};

export default function ImageCarousel({
  slideInterval = 5000,
}: ImageCarouselProps) {
  const [slides, setSlides] = useState<ImageSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // ============================================================
  // FORMAT IMAGE URL
  // ============================================================

  const getImageUrl = (image: ImageSlide): string => {
    // If backend already returns an absolute URL
    if (
      image.imageUrl &&
      (image.imageUrl.startsWith("http://") ||
        image.imageUrl.startsWith("https://"))
    ) {
      return image.imageUrl;
    }

    // Backend returns:
    // /uploads/gallery/Carousal/filename.jpg
    if (image.imageUrl) {
      return `${API_BASE_URL}${image.imageUrl.startsWith("/") ? "" : "/"}${
        image.imageUrl
      }`;
    }

    // Fallback if only filename exists
    if (image.filename) {
      return `${API_BASE_URL}/uploads/gallery/Carousal/${encodeURIComponent(
        image.filename
      )}`;
    }

    return "";
  };

  // ============================================================
  // FETCH CAROUSEL
  // ============================================================

  const fetchCarousel = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await apiClient.get("/carousel");

      const data = response.data?.data;

      const list: ImageSlide[] = Array.isArray(data) ? data : [];

      const formattedSlides = list
        .map((image) => ({
          ...image,
          imageUrl: getImageUrl(image),
        }))
        .filter((image) => image.imageUrl);

      setSlides(formattedSlides);

      // Reset index after fetching
      setCurrentIndex(0);
    } catch (error) {
      console.error("Failed to load carousel:", error);
      setSlides([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchCarousel();
  }, [fetchCarousel]);

  // ============================================================
  // NEXT SLIDE
  // ============================================================

  const nextSlide = useCallback(() => {
    setCurrentIndex((previousIndex) => {
      if (slides.length === 0) {
        return 0;
      }

      return previousIndex === slides.length - 1
        ? 0
        : previousIndex + 1;
    });
  }, [slides.length]);

  // ============================================================
  // PREVIOUS SLIDE
  // ============================================================

  const previousSlide = useCallback(() => {
    setCurrentIndex((previousIndex) => {
      if (slides.length === 0) {
        return 0;
      }

      return previousIndex === 0
        ? slides.length - 1
        : previousIndex - 1;
    });
  }, [slides.length]);

  // ============================================================
  // GO TO SLIDE
  // ============================================================

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // ============================================================
  // AUTO PLAY
  // ============================================================

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      nextSlide();
    }, slideInterval);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    isAutoPlaying,
    slides.length,
    slideInterval,
    nextSlide,
  ]);

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <div className="relative w-full h-[60vh] md:h-[600px] min-h-[350px] overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-900 shadow-xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="w-10 h-10 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />

          <p className="text-sm font-medium text-white/70">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // NO SLIDES
  // ============================================================

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-[60vh] md:h-[600px] min-h-[350px] overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 shadow-xl flex items-center justify-center">
        <div className="text-center px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Manipur Institute of Technology
          </h2>

          <p className="mt-2 text-sm text-white/60">
            Welcome to MIT
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // CURRENT SLIDE
  // ============================================================

  const currentSlide = slides[currentIndex] || slides[0];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="relative w-full h-[60vh] md:h-[600px] min-h-[350px] overflow-hidden rounded-2xl border border-cyan-500/30 shadow-2xl bg-slate-900"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* ========================================================
          BLURRED BACKGROUND
      ======================================================== */}

      <div
        className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-30"
        style={{
          backgroundImage: `url("${currentSlide.imageUrl}")`,
        }}
      />

      {/* ========================================================
          DARK OVERLAY
      ======================================================== */}

      <div className="absolute inset-0 bg-slate-950/40" />

      {/* ========================================================
          MAIN IMAGE
      ======================================================== */}

      <div className="absolute inset-0 flex items-center justify-center">
        <img
          key={currentSlide._id}
          src={currentSlide.imageUrl}
          alt={
            currentSlide.title ||
            currentSlide.caption ||
            "Manipur Institute of Technology"
          }
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={(event) => {
            event.currentTarget.style.opacity = "0";
          }}
        />
      </div>

      {/* ========================================================
          GRADIENT OVERLAY
      ======================================================== */}

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

      {/* ========================================================
          TITLE / CAPTION
      ======================================================== */}

      {(currentSlide.title ||
        currentSlide.caption ||
        currentSlide.description) && (
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 text-white">
          {currentSlide.title && (
            <h2 className="text-xl md:text-3xl font-bold text-cyan-300 drop-shadow-lg">
              {currentSlide.title}
            </h2>
          )}

          {currentSlide.caption && (
            <p className="mt-1 text-sm md:text-base text-white/90 drop-shadow">
              {currentSlide.caption}
            </p>
          )}

          {currentSlide.description && (
            <p className="mt-1 text-sm md:text-base text-white/80">
              {currentSlide.description}
            </p>
          )}
        </div>
      )}

      {/* ========================================================
          PREVIOUS BUTTON
      ======================================================== */}

      {slides.length > 1 && (
        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous slide"
          className="
            absolute
            left-3 md:left-5
            top-1/2
            -translate-y-1/2
            z-20
            w-10 h-10 md:w-12 md:h-12
            flex items-center justify-center
            rounded-full
            bg-black/40
            backdrop-blur-md
            border border-white/20
            text-white
            hover:bg-cyan-500
            hover:border-cyan-400
            transition-all
            duration-200
            shadow-lg
          "
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}

      {/* ========================================================
          NEXT BUTTON
      ======================================================== */}

      {slides.length > 1 && (
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="
            absolute
            right-3 md:right-5
            top-1/2
            -translate-y-1/2
            z-20
            w-10 h-10 md:w-12 md:h-12
            flex items-center justify-center
            rounded-full
            bg-black/40
            backdrop-blur-md
            border border-white/20
            text-white
            hover:bg-cyan-500
            hover:border-cyan-400
            transition-all
            duration-200
            shadow-lg
          "
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}

      {/* ========================================================
          SLIDE COUNTER
      ======================================================== */}

      {slides.length > 1 && (
        <div className="absolute top-4 right-4 z-20">
          <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-medium">
            {currentIndex + 1} / {slides.length}
          </div>
        </div>
      )}

      {/* ========================================================
          DOT NAVIGATION
      ======================================================== */}

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            {slides.map((slide, index) => (
              <button
                key={slide._id || index}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`
                  h-2 rounded-full
                  transition-all duration-300
                  ${
                    currentIndex === index
                      ? "w-7 bg-cyan-400"
                      : "w-2 bg-white/60 hover:bg-white"
                  }
                `}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}