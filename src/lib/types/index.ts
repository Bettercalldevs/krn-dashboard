export type Project = {
  id: number;
  name: string;
  desc: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
  image6: string;
  image7: string;
  image8: string;
  image9: string;
};

export type ResponseProject = Project & {
  createdAt: Date;
  updatedAt: Date;
};
