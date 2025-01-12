import ProjectCard from "@/components/project-card";
import SkeletonProjectCard from "@/components/skeleton-project-card";

import { Project } from "@/lib/types";

interface ProjectListProps {
  projects: Project[] | null;
  isLoading: boolean;
  onProjectClick: (project: Project) => void;
  onProjectEdit: (project: Project) => void;
  onProjectDelete: (id: number) => void;
}

const ProjectList = ({
  projects,
  isLoading,
  onProjectClick,
  onProjectEdit,
  onProjectDelete,
}: ProjectListProps) => {
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 9 }).map((_, index) => (
          <SkeletonProjectCard key={index} />
        ))}
      </>
    );
  }

  if (!projects || projects.length === 0) {
    return;
  }

  return (
    <>
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          images={[
            project.image1,
            project.image2,
            project.image3,
            project.image4,
            project.image5,
            project.image6,
            project.image7,
            project.image8,
            project.image9,
          ]}
          name={project.name}
          desc={project.desc}
          onClick={() => onProjectClick(project)}
          onEdit={() => onProjectEdit(project)}
          onDelete={() => onProjectDelete(project.id)}
        />
      ))}
    </>
  );
};

export default ProjectList;
