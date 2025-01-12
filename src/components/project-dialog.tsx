"use client";

import { useState, useCallback, useEffect } from "react";
import axios, { AxiosProgressEvent } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { useProject } from "@/context/ProjectContext";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";

import { Project } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  desc: z
    .string()
    .min(20, { message: "Description must be at least 20 characters long." }),
  image1: z.string().optional(),
  image2: z.string().optional(),
  image3: z.string().optional(),
  image4: z.string().optional(),
  image5: z.string().optional(),
  image6: z.string().optional(),
  image7: z.string().optional(),
  image8: z.string().optional(),
  image9: z.string().optional(),
});

interface ProjectDialogProps {
  initialData?: Project;
  open: boolean;
  onClose?: (value: boolean) => void;
}

export default function ProjectDialog({
  initialData,
  open = false,
  onClose = () => null,
}: ProjectDialogProps) {
  const { createProject, updateProject } = useProject();
  const [step, setStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState<{
    image1: string | null;
    image2: string | null;
    image3: string | null;
    image4: string | null;
    image5: string | null;
    image6: string | null;
    image7: string | null;
    image8: string | null;
    image9: string | null;
  }>({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    image6: null,
    image7: null,
    image8: null,
    image9: null,
  });

  const form = useForm<Project>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      desc: "",
      image1: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
      image6: "",
      image7: "",
      image8: "",
      image9: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      setPreviews({
        image1: initialData.image1 || null,
        image2: initialData.image2 || null,
        image3: initialData.image3 || null,
        image4: initialData.image4 || null,
        image5: initialData.image5 || null,
        image6: initialData.image6 || null,
        image7: initialData.image7 || null,
        image8: initialData.image8 || null,
        image9: initialData.image9 || null,
      });
    }
  }, [initialData, form]);

  const handleImageChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      imageKey:
        | "image1"
        | "image2"
        | "image3"
        | "image4"
        | "image5"
        | "image6"
        | "image7"
        | "image8"
        | "image9"
    ) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => ({
            ...prev,
            [imageKey]: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const removeImage = useCallback(
    (
      imageKey:
        | "image1"
        | "image2"
        | "image3"
        | "image4"
        | "image5"
        | "image6"
        | "image7"
        | "image8"
        | "image9"
    ) => {
      setPreviews((prev) => ({ ...prev, [imageKey]: null }));
      form.setValue(imageKey, "");
    },
    [form]
  );

  const uploadImages = useCallback(async () => {
    setIsUploading(true);
    setUploadProgress(0);

    const uploadedUrls: {
      image1?: string;
      image2?: string;
      image3?: string;
      image4?: string;
      image5?: string;
      image6?: string;
      image7?: string;
      image8?: string;
      image9?: string;
    } = {};

    const uploadToCloudinary = async (
      file: File,
      imageKey:
        | "image1"
        | "image2"
        | "image3"
        | "image4"
        | "image5"
        | "image6"
        | "image7"
        | "image8"
        | "image9"
    ) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string
      );

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_NAME
          }/image/upload`,
          formData,
          {
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
              if (progressEvent.total && progressEvent.lengthComputable) {
                setUploadProgress(
                  Math.round((progressEvent.loaded * 100) / progressEvent.total)
                );
              }
            },
          }
        );

        uploadedUrls[imageKey] = response.data.secure_url;
      } catch (error) {
        toast.error("Failed to upload the images, try again later");
      }
    };

    const uploadImage = async (
      imageKey:
        | "image1"
        | "image2"
        | "image3"
        | "image4"
        | "image5"
        | "image6"
        | "image7"
        | "image8"
        | "image9"
    ) => {
      if (previews[imageKey]) {
        const file = await fetch(previews[imageKey]!).then((res) => res.blob());
        await uploadToCloudinary(file as File, imageKey);
      }
    };

    Promise.all([
      uploadImage("image1"),
      uploadImage("image2"),
      uploadImage("image3"),
      uploadImage("image4"),
      uploadImage("image5"),
      uploadImage("image6"),
      uploadImage("image7"),
      uploadImage("image8"),
      uploadImage("image9"),
    ])
      .then(() => {
        toast.success("Images uploaded successfully");
        form.setValue("image1", uploadedUrls.image1 || "");
        form.setValue("image2", uploadedUrls.image2 || "");
        form.setValue("image3", uploadedUrls.image3 || "");
        form.setValue("image4", uploadedUrls.image4 || "");
        form.setValue("image5", uploadedUrls.image5 || "");
        form.setValue("image6", uploadedUrls.image6 || "");
        form.setValue("image7", uploadedUrls.image7 || "");
        form.setValue("image8", uploadedUrls.image8 || "");
        form.setValue("image9", uploadedUrls.image9 || "");
      })
      .catch(() => {
        toast.error("Failed to upload the images, try again later");
      })
      .finally(() => {
        setIsUploading(false);
        setUploadProgress(0);
      });
  }, [form, previews]);

  const handleSubmit = async (data: Project) => {
    if (initialData) {
      updateProject(
        {
          ...initialData,
          ...data,
        },
        () => onOpenChange(false)
      );
    } else {
      createProject(data, () => onOpenChange(false));
    }
  };

  function onOpenChange(value: boolean) {
    onClose(value);
    setStep(1);
    if (initialData) {
      setPreviews({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        image6: null,
        image7: null,
        image8: null,
        image9: null,
      });

      form.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit project" : "Add a new project"} - Step {step}{" "}
            of 4
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="desc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => {
                    form.trigger(["name", "desc"]).then((isValid) => {
                      if (isValid) {
                        setStep(2);
                      }
                    });
                  }}
                  className="w-full"
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <div className="space-y-4">
                  {["image1", "image2", "image3"].map((imageKey, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={imageKey as "image1" | "image2" | "image3"}
                      render={() => (
                        <FormItem>
                          <FormLabel>16:9 Aspect Ratio Image</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              onChange={(e) =>
                                handleImageChange(
                                  e,
                                  imageKey as "image1" | "image2" | "image3"
                                )
                              }
                              className="file:mr-4 file:relative file:top-[1.7px] file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 hover:file:cursor-pointer"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {["image1", "image2", "image3"].map((imageKey, index) => (
                    <div key={imageKey} className="relative">
                      {(previews[imageKey as "image1" | "image2" | "image3"] ||
                        form.getValues(
                          imageKey as "image1" | "image2" | "image3"
                        )) && (
                        <>
                          <a
                            href={
                              previews[
                                imageKey as "image1" | "image2" | "image3"
                              ] ||
                              form.getValues(
                                imageKey as "image1" | "image2" | "image3"
                              )
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={
                                previews[
                                  imageKey as "image1" | "image2" | "image3"
                                ] ||
                                form.getValues(
                                  imageKey as "image1" | "image2" | "image3"
                                )
                              }
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-md cursor-pointer"
                            />
                          </a>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() =>
                              removeImage(
                                imageKey as "image1" | "image2" | "image3"
                              )
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  onClick={uploadImages}
                  disabled={
                    isUploading || (!previews.image1 && !previews.image2)
                  }
                  className="w-full relative overflow-hidden"
                >
                  {isUploading ? (
                    <>
                      <span className="relative z-10">
                        Uploading... {uploadProgress}%
                      </span>
                      <Progress
                        value={uploadProgress}
                        className="w-full h-full absolute top-0 left-0 rounded-none"
                      />
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Images
                    </>
                  )}
                </Button>
                <div className="flex justify-between mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      form
                        .trigger(["image1", "image2", "image3"])
                        .then((isValid) => {
                          if (isValid) {
                            setStep(3);
                          }
                        });
                    }}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div className="space-y-4">
                  {["image4", "image5", "image6"].map((imageKey, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={imageKey as "image4" | "image5" | "image6"}
                      render={() => (
                        <FormItem>
                          <FormLabel>3:4 Aspect Ratio Image</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              onChange={(e) =>
                                handleImageChange(
                                  e,
                                  imageKey as "image4" | "image5" | "image6"
                                )
                              }
                              className="file:mr-4 file:relative file:top-[1.7px] file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 hover:file:cursor-pointer"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {["image4", "image5", "image6"].map((imageKey, index) => (
                    <div key={imageKey} className="relative">
                      {(previews[imageKey as "image4" | "image5" | "image6"] ||
                        form.getValues(
                          imageKey as "image4" | "image5" | "image6"
                        )) && (
                        <>
                          <a
                            href={
                              previews[
                                imageKey as "image4" | "image5" | "image6"
                              ] ||
                              form.getValues(
                                imageKey as "image4" | "image5" | "image6"
                              )
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={
                                previews[
                                  imageKey as "image4" | "image5" | "image6"
                                ] ||
                                form.getValues(
                                  imageKey as "image4" | "image5" | "image6"
                                )
                              }
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-md cursor-pointer"
                            />
                          </a>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() =>
                              removeImage(
                                imageKey as "image4" | "image5" | "image6"
                              )
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  onClick={uploadImages}
                  disabled={
                    isUploading || (!previews.image1 && !previews.image2)
                  }
                  className="w-full relative overflow-hidden"
                >
                  {isUploading ? (
                    <>
                      <span className="relative z-10">
                        Uploading... {uploadProgress}%
                      </span>
                      <Progress
                        value={uploadProgress}
                        className="w-full h-full absolute top-0 left-0 rounded-none"
                      />
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Images
                    </>
                  )}
                </Button>
                <div className="flex justify-between mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      form.trigger([]).then((isValid) => {
                        if (isValid) {
                          setStep(4);
                        }
                      });
                    }}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
            {step === 4 && (
              <>
                <div className="space-y-4">
                  {["image7", "image8", "image9"].map((imageKey, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={imageKey as "image7" | "image8" | "image9"}
                      render={() => (
                        <FormItem>
                          <FormLabel>
                            {index % 2 === 1
                              ? "1:1 Aspect Ratio Image"
                              : "3:4 Aspect Ratio Image"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              onChange={(e) =>
                                handleImageChange(
                                  e,
                                  imageKey as "image7" | "image8" | "image9"
                                )
                              }
                              className="file:mr-4 file:relative file:top-[1.7px] file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 hover:file:cursor-pointer"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {["image7", "image8", "image9"].map((imageKey, index) => (
                    <div key={imageKey} className="relative">
                      {(previews[imageKey as "image7" | "image8" | "image9"] ||
                        form.getValues(
                          imageKey as "image7" | "image8" | "image9"
                        )) && (
                        <>
                          <a
                            href={
                              previews[
                                imageKey as "image7" | "image8" | "image9"
                              ] ||
                              form.getValues(
                                imageKey as "image7" | "image8" | "image9"
                              )
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={
                                previews[
                                  imageKey as "image7" | "image8" | "image9"
                                ] ||
                                form.getValues(
                                  imageKey as "image7" | "image8" | "image9"
                                )
                              }
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-md cursor-pointer"
                            />
                          </a>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() =>
                              removeImage(
                                imageKey as "image7" | "image8" | "image9"
                              )
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  onClick={uploadImages}
                  disabled={
                    isUploading || (!previews.image1 && !previews.image2)
                  }
                  className="w-full relative overflow-hidden"
                >
                  {isUploading ? (
                    <>
                      <span className="relative z-10">
                        Uploading... {uploadProgress}%
                      </span>
                      <Progress
                        value={uploadProgress}
                        className="w-full h-full absolute top-0 left-0 rounded-none"
                      />
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Images
                    </>
                  )}
                </Button>
                <div className="flex justify-between mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(3)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !form.getValues("image1") && !form.getValues("image2")
                    }
                  >
                    {initialData ? "Update" : "Create"}
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
