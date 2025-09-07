"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// HomepageContainer interface
interface HomepageContainer {
  id: string;
  title: string;
  container_type: "PRODUCT" | "BANNER" | "CATEGORY" | "FEATURED" | "CUSTOM";
  description?: string;
  sequence: number;
  status: "ACTIVE" | "DEACTIVE";
  items?: any[];
  enriched_items?: any[];
  settings?: {
    layout?: "grid" | "carousel" | "list" | "featured";
    columns?: number;
    showTitle?: boolean;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    fullWidth?: boolean;
    autoplay?: boolean;
    autoplaySpeed?: number;
    infinite?: boolean;
  };
}

// ProductCard component
const ProductCard = ({ product }: { product: any }) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden group">
      <div className="relative h-60 overflow-hidden">
        {product.medias && product.medias[0] ? (
          <Image
            src={product.medias[0]}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <CardContent className="flex-grow py-4">
        <h3 className="font-medium text-sm line-clamp-2">{product.title}</h3>
        {product.pricing && (
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold">৳{product.pricing.price}</span>
            {product.pricing.compareAtPrice > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ৳{product.pricing.compareAtPrice}
              </span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

// CategoryCard component
const CategoryCard = ({ category }: { category: any }) => {
  return (
    <Link href={`/category/${category.slug}`} className="block">
      <Card className="overflow-hidden text-center h-full flex flex-col">
        <div className="relative h-40 w-full">
          {category.medias && category.medias[0] ? (
            <Image
              src={category.medias[0]}
              alt={category.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <CardContent className="flex-grow flex items-center justify-center py-4">
          <h3 className="font-medium">{category.title}</h3>
        </CardContent>
      </Card>
    </Link>
  );
};

// BannerSlide component
const BannerSlide = ({ banner }: { banner: any }) => {
  return (
    <div className="relative w-full h-full">
      <div className="relative w-full" style={{ height: "400px" }}>
        <Image
          src={banner.image}
          alt={banner.title || "Banner"}
          fill
          sizes="100vw"
          className="object-cover"
        />
        {(banner.title || banner.link) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 bg-black bg-opacity-40">
            {banner.title && (
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                {banner.title}
              </h2>
            )}
            {banner.subtitle && (
              <p className="text-lg md:text-xl mb-6 max-w-lg text-center">
                {banner.subtitle}
              </p>
            )}
            {banner.link && (
              <Button asChild size="lg">
                <Link href={banner.link}>
                  {banner.buttonText || "Learn More"}
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Dynamic container renderer component
const ContainerRenderer = ({ container }: { container: HomepageContainer }) => {
  const {
    title,
    container_type,
    items = [],
    enriched_items = [],
    settings = {},
  } = container;

  // Default settings
  const {
    layout = "grid",
    columns = 4,
    showTitle = true,
    backgroundColor,
    textColor,
    padding = "1rem",
    fullWidth = false,
  } = settings;

  // Style object for container
  const containerStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || undefined,
    color: textColor || undefined,
    padding: padding || undefined,
  };

  // Helper function to get grid columns class
  const getColumnsClass = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      case 5:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
      case 6:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6";
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
  };

  // Render based on container type
  const renderContainerContent = () => {
    // For PRODUCT containers
    if (container_type === "PRODUCT") {
      const productData = enriched_items.length > 0 ? enriched_items : items;

      if (layout === "carousel") {
        return (
          <Carousel>
            <CarouselContent>
              {productData.map((product: any) => (
                <CarouselItem
                  key={product.id}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        );
      }

      return (
        <div className={`grid gap-4 ${getColumnsClass()}`}>
          {productData.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      );
    }

    // For CATEGORY containers
    if (container_type === "CATEGORY") {
      const categoryData = enriched_items.length > 0 ? enriched_items : items;

      if (layout === "carousel") {
        return (
          <Carousel>
            <CarouselContent>
              {categoryData.map((category: any) => (
                <CarouselItem
                  key={category.id}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <CategoryCard category={category} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        );
      }

      return (
        <div className={`grid gap-4 ${getColumnsClass()}`}>
          {categoryData.map((category: any) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      );
    }

    // For BANNER containers
    if (container_type === "BANNER") {
      if (items.length === 0) {
        return null;
      }

      if (items.length === 1) {
        return <BannerSlide banner={items[0]} />;
      }

      return (
        <Carousel className="w-full">
          <CarouselContent>
            {items.map((banner: any, index: number) => (
              <CarouselItem key={index}>
                <BannerSlide banner={banner} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      );
    }

    // For other container types
    return (
      <div className="py-4 text-center text-gray-500">
        {container_type} container - Custom rendering required
      </div>
    );
  };

  return (
    <section
      style={containerStyle}
      className={`${fullWidth ? "w-full" : "container mx-auto"}`}
    >
      <div className={`${fullWidth ? "container mx-auto" : ""}`}>
        {showTitle && title && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            {container.description && (
              <p className="text-gray-600 mt-1">{container.description}</p>
            )}
          </div>
        )}
        {renderContainerContent()}
      </div>
    </section>
  );
};

// Main Homepage component
export default function Homepage() {
  const [containers, setContainers] = useState<HomepageContainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8787/v1/homepage/homepage"
        );
        if (response.data.success) {
          setContainers(response.data.data);
        } else {
          setError("Failed to load homepage data");
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setError("An error occurred while fetching homepage data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-10">
        <div className="w-full h-96 rounded-xl bg-gray-200 animate-pulse" />

        <div>
          <div className="h-8 w-64 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-60 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-8 w-full rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (containers.length === 0) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No Content Available</h2>
        <p className="text-gray-600">
          The homepage content is currently being updated. Please check back
          later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-10 py-6">
        {containers
          .sort((a, b) => a.sequence - b.sequence)
          .map((container) => (
            <ContainerRenderer key={container.id} container={container} />
          ))}
      </div>
    </div>
  );
}
