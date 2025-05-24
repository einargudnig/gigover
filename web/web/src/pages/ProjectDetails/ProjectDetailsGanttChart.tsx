import React from 'react';
import { useProjectDetails } from '../../hooks/useProjectDetails';

const ProjectDetailsGanttChart: React.FC = () => {
  const { data, isPending, isError, error } = useProjectDetails(Number(projectId));

  return (
    <div>
      {isPending ? (
        // ... existing code ...
      ) : (
        // ... existing code ...
      )}
    </div>
  );
};

export default ProjectDetailsGanttChart; 