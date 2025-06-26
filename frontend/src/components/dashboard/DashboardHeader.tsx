import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { FileUp } from "lucide-react";

const DashboardHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Document Dashboard</h1>
        <p className="text-muted-foreground">
          Upload, manage, and analyze your notes and documents
        </p>
      </div>

      <Button asChild>
        <Link to="/upload">
          <FileUp className="mr-2 h-4 w-4" />
          Upload New
        </Link>
      </Button>
    </div>
  );
};

export default DashboardHeader;
