import api from "@/api";
import { Project, ResponseProject } from "@/lib/types";

//get all projects
export async function apiGetProjects(): Promise<ResponseProject[]> {
  try {
    let response = await api.get("/projects");

    const { success, data } = response.data;

    if (!success) throw new Error("Failed to fetch projects");

    return data.projects;
  } catch (error: any) {
    if (error.response) throw error.response.data;
    throw error;
  }
}

//create a project
export async function apiCreateProject(
  project: Omit<Project, "id">
): Promise<ResponseProject> {
  try {
    const response = await api.post("/create-project", project);

    const { success, data } = response.data;

    if (!success) throw new Error("Failed to create project");

    return data.createdProject;
  } catch (error: any) {
    if (error.response) throw error.response.data.error;
    throw error;
  }
}

//update a project
export async function apiUpdateProject(
  project: Project
): Promise<ResponseProject> {
  try {
    const response = await api.put(`/update-project?id=${project.id}`, project);

    const { success, data } = response.data;

    if (!success) throw new Error("Failed to update project");

    return data.updatedProject;
  } catch (error: any) {
    if (error.response) throw error.response.data;
    throw error;
  }
}

//delete a project
export async function apiDeleteProject(id: number): Promise<boolean> {
  try {
    const response = await api.delete(`/delete-project?id=${id}`);

    const { success } = response.data;

    if (!success) throw new Error("Failed to delete project");

    return true;
  } catch (error: any) {
    if (error.response) throw error.response.data.error;
    throw error;
  }
}
