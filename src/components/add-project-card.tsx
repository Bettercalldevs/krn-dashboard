import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface AddProjectCardProps {
  onClick: () => void;
}

const AddProjectCard = ({ onClick }: AddProjectCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="w-full overflow-hidden group border border-border cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary hover:scale-[1.02]"
    >
      <div className="relative h-[200px] bg-gray-100 flex items-center justify-center">
        <Plus className="h-12 w-12 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">Add Project</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Click to add a new project
        </p>
      </CardContent>
    </Card>
  );
};

export default AddProjectCard;
