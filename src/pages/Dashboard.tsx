import { useState } from "react";

import AddProjectCard from "@/components/add-project-card";
import ProjectList from "@/components/project-list";
import ShowProjectDialog from "@/components/show-project-dialog";
import { Project } from "@/lib/types";
import { useProject } from "@/context/ProjectContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ProjectDialog from "@/components/project-dialog";

export default function DashboardPage() {
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const { isLoading, projects, deleteProject } = useProject();

  const handleDeleteClick = (id: number) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
    setSelectedProject(null);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      setSelectedProject(null);
    }
  };

  const handleDeleteDialogClose = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setProjectToDelete(null);
      setSelectedProject(null);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-medium tracking-tight mt-5 mb-8 text-left">
          Welcome, KRN Admin
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <AddProjectCard
            onClick={() => {
              setSelectedProject(null);
              setEditDialogOpen(true);
            }}
          />
          <ProjectList
            projects={projects}
            isLoading={isLoading}
            onProjectClick={(project) => setSelectedProject(project)}
            onProjectEdit={(project) => {
              setSelectedProject(project);
              setEditDialogOpen(true);
            }}
            onProjectDelete={handleDeleteClick}
          />
        </div>
      </div>
      <ProjectDialog
        open={editDialogOpen}
        onClose={(value: boolean) => {
          setSelectedProject(null);
          setEditDialogOpen(value);
        }}
        initialData={selectedProject!}
      />
      <ShowProjectDialog
        open={!editDialogOpen && !deleteDialogOpen && !!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={handleDeleteDialogClose}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project and remove all of its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
