"use client";

import { useState } from "react";
import { Trash2, Edit } from "lucide-react";
import Fade from "embla-carousel-fade";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface ProjectCardProps {
  images: string[];
  name: string;
  desc: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export default function ProjectCard({
  images,
  name,
  desc,
  onEdit = () => null,
  onDelete = () => null,
  onClick = () => null,
}: ProjectCardProps) {
  const [_, setCurrentIndex] = useState(0);

  return (
    <Card
      onClick={onClick}
      className="w-full overflow-hidden group border border-border cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary hover:scale-[1.02]"
    >
      <div className="relative">
        <Carousel
          className="w-full h-[200px]"
          setApi={(api) => {
            api?.on("select", () => {
              setCurrentIndex(api.selectedScrollSnap());
            });
          }}
          plugins={[Fade()]}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <img
                  src={image}
                  alt={`${name} - Image ${index + 1}`}
                  className="w-full h-[200px] object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-background/80 backdrop-blur-sm"
          >
            Project
          </Badge>
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit();
            }}
            className="h-8 w-8 rounded-full bg-blue-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out hover:bg-blue-600 hover:scale-110 hover:rotate-12 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            <Edit className="h-4 w-4 transform transition-transform duration-300 ease-in-out group-hover:scale-110" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            className="h-8 w-8 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out hover:bg-red-600 hover:scale-110 hover:-rotate-12 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
          >
            <Trash2 className="h-4 w-4 transform transition-transform duration-300 ease-in-out group-hover:scale-110" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {desc}
        </p>
      </CardContent>
    </Card>
  );
}
