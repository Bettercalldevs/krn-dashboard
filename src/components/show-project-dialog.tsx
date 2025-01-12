import { useState } from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Project } from "@/lib/types";

interface ShowProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
}

export default function ShowProjectDialog({
  open,
  onClose,
  project,
}: ShowProjectDialogProps) {
  const [_, setCurrentIndex] = useState(0);

  if (!project) return null;

  const images = [
    {
      src: project?.image1,
      title: "16:9 Aspect Ratio",
      aspectRatio: "aspect-video",
    },
    {
      src: project?.image2,
      title: "16:9 Aspect Ratio",
      aspectRatio: "aspect-video",
    },
    {
      src: project?.image3,
      title: "16:9 Aspect Ratio",
      aspectRatio: "aspect-video",
    },
    {
      src: project?.image4,
      title: "3:4 Aspect Ratio",
      aspectRatio: "aspect-[3/4]",
    },
    {
      src: project?.image5,
      title: "3:4 Aspect Ratio",
      aspectRatio: "aspect-[3/4]",
    },
    {
      src: project?.image6,
      title: "3:4 Aspect Ratio",
      aspectRatio: "aspect-[3/4]",
    },
    {
      src: project?.image7,
      title: "3:4 Aspect Ratio",
      aspectRatio: "aspect-[3/4]",
    },
    {
      src: project?.image8,
      title: "1:1 Aspect Ratio",
      aspectRatio: "aspect-square",
    },
    {
      src: project?.image9,
      title: "3:4 Aspect Ratio",
      aspectRatio: "aspect-[3/4]",
    },
  ].filter((img) => img.src);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="h-full max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl sm:text-3xl font-bold">
                {project.name}
              </DialogTitle>
              <DialogDescription className="text-lg sm:text-xl mt-2">
                {project.desc}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {images.length > 0 ? (
                <Carousel
                  className="w-full h-[200px] sm:h-[300px] mx-auto"
                  setApi={(api) => {
                    api?.on("select", () => {
                      setCurrentIndex(api.selectedScrollSnap());
                    });
                  }}
                  plugins={[
                    Autoplay({
                      delay: 4000,
                    }),
                  ]}
                >
                  <CarouselContent>
                    {images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div
                          className={`w-full h-[200px] sm:h-[300px] relative overflow-hidden rounded-lg bg-muted flex items-center justify-center ${image.aspectRatio}`}
                        >
                          <img
                            src={image.src || "/placeholder.svg"}
                            alt={`${project?.name} - ${image.title}`}
                            className="max-w-full max-h-full object-contain"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-center">
                            <p className="text-xs sm:text-sm font-medium">
                              {image.title}
                            </p>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {images.length > 1 && (
                    <>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </>
                  )}
                </Carousel>
              ) : (
                <div className="w-full h-[200px] sm:h-[300px] mx-auto bg-muted flex items-center justify-center rounded-lg">
                  <p className="text-muted-foreground text-sm">
                    No images available
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
