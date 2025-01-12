import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";

import {
  apiCreateProject,
  apiDeleteProject,
  apiGetProjects,
  apiUpdateProject,
} from "@/api/project";
import { useAppContext } from "@/context/AppContext";
import { Project, ResponseProject } from "@/lib/types";

interface ProjectContextType {
  isLoading: boolean;
  projects: Project[];
  createProject: (project: Omit<Project, "id">, onSuccess: () => void) => void;
  deleteProject: (id: number) => void;
  updateProject: (updatedProject: Project, onSuccess: () => void) => void;
  getProjects: () => void;
}

interface ResponseError {
  [key: string]: string;
}

function extractError(error: ResponseError) {
  const key = Object.keys(error);
  if (key.length === 1) return error[key[0]];
  return null;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  function getProjects() {
    if (!isLoggedIn) return;
    setIsLoading(true);
    toast.promise(apiGetProjects, {
      loading: "Loading projects...",
      success: (data: ResponseProject[]) => {
        const result: Project[] = data.map((project) => ({
          id: project.id,
          name: project.name,
          desc: project.desc,
          image1: project.image1,
          image2: project.image2,
          image3: project.image3,
          image4: project.image4,
          image5: project.image5,
          image6: project.image6,
          image7: project.image7,
          image8: project.image8,
          image9: project.image9,
        }));
        setProjects(result);
        setIsLoading(false);
        return "Projects loaded successfully";
      },
      error: () => {
        setIsLoading(false);
        return "Failed to load projects";
      },
    });
  }

  function createProject(project: Omit<Project, "id">, onSuccess: () => void) {
    toast.promise(apiCreateProject(project), {
      loading: "Creating project...",
      success: (data: ResponseProject) => {
        setProjects((prev) => [
          ...prev,
          {
            id: data.id,
            name: data.name,
            desc: data.desc,
            image1: data.image1,
            image2: data.image2,
            image3: data.image3,
            image4: data.image4,
            image5: data.image5,
            image6: data.image6,
            image7: data.image7,
            image8: data.image8,
            image9: data.image9,
          },
        ]);
        onSuccess();
        return "Project created successfully";
      },
      error: () => "Failed to create project",
    });
  }

  function deleteProject(id: number) {
    toast.promise(apiDeleteProject(id), {
      loading: "Deleting project...",
      success: () => {
        setProjects((prev) => prev.filter((project) => project.id !== id));
        return "Project deleted successfully";
      },
      error: () => "Failed to delete project",
    });
  }

  function updateProject(updatedProject: Project, onSuccess: () => void) {
    toast.promise(apiUpdateProject(updatedProject), {
      loading: "Updating project...",
      success: (_: ResponseProject) => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === updatedProject.id
              ? {
                  id: updatedProject.id,
                  name: updatedProject.name,
                  desc: updatedProject.desc,
                  image1: updatedProject.image1,
                  image2: updatedProject.image2,
                  image3: updatedProject.image3,
                  image4: updatedProject.image4,
                  image5: updatedProject.image5,
                  image6: updatedProject.image6,
                  image7: updatedProject.image7,
                  image8: updatedProject.image8,
                  image9: updatedProject.image9,
                }
              : project
          )
        );
        onSuccess();
        return "Project updated successfully";
      },
      error: (error) => {
        return extractError(error) || "Failed to update project";
      },
    });
  }

  useEffect(() => {
    getProjects();
  }, [isLoggedIn]);

  return (
    <ProjectContext.Provider
      value={{
        isLoading,
        projects,
        createProject,
        deleteProject,
        updateProject,
        getProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};
