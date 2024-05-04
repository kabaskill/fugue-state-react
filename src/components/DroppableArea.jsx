// components/DroppableArea.js
import { useDroppable } from "@dnd-kit/core";

const DroppableArea = ({ children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable-area",
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-96 h-96 border-2 ${isOver ? "border-green-500" : "border-gray-500"}`}
    >
      <p className="text-center">droppable area</p>
      {children}
    </div>
  );
};

export default DroppableArea;
