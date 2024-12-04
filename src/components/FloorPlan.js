import React, { useState, useEffect } from "react";
import Floor from "./Floor";
import FloorDetail from "./FloorDetail";
import "../styles/FloorPlan.css";
import "../styles/CustomScrollbar.css";

const getDominantTeamColor = (groups) => {
  if (!groups || groups.length === 0) return "#1a1a1a";

  const typeCounts = groups.reduce((acc, group) => {
    acc[group.type] = (acc[group.type] || 0) + 1;
    return acc;
  }, {});

  const dominantType = Object.entries(typeCounts).sort(
    ([, a], [, b]) => b - a
  )[0][0];

  const GROUP_COLORS = {
    project: "rgba(255, 205, 210, 0.15)", // Light red
    department: "rgba(200, 230, 201, 0.15)", // Light green
    team: "rgba(227, 242, 253, 0.15)", // Light blue
  };

  return GROUP_COLORS[dominantType] || "#1a1a1a";
};

function FloorPlan({
  floorData,
  handleFloorDrop: handleGroupDrop,
  handleFloorClear,
  onGroupSelect,
  isIsometricView,
  isZoomedOut,
  setIsZoomedOut,
  hoveredGroup,
  topCollaborators,
  onGroupDelete,
  capacityWarning,
  setFloorData
}) {
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [draggedFloorId, setDraggedFloorId] = useState(null);

  const handleFloorDragStart = (floorId) => {
    setDraggedFloorId(floorId);
  };

  const handleFloorReorder = (fromIndex, toIndex) => {
    setFloorData(prevData => {
      const newData = [...prevData];
      const [movedFloor] = newData.splice(fromIndex, 1);
      newData.splice(toIndex, 0, movedFloor);
      return newData;
    });
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        const currentFloor = floorData[currentFloorIndex];
        if (currentFloor.groups.length > 0) {
          // Show floor details instead of group modals
          setSelectedFloor(currentFloor);
        }
      } else if (
        e.key === "ArrowUp" &&
        currentFloorIndex < floorData.length - 1
      ) {
        setSelectedFloor(null);
        setCurrentFloorIndex((prev) => prev + 1);
      } else if (e.key === "ArrowDown" && currentFloorIndex > 0) {
        setSelectedFloor(null);
        setCurrentFloorIndex((prev) => prev - 1);
      } else if (e.key === "Escape") {
        setSelectedFloor(null);
        onGroupSelect(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentFloorIndex, floorData, onGroupSelect]);

  const handleCloseDetail = () => {
    setSelectedFloor(null);
  };

  const handleFloorClearWithDetailClose = (floorId) => {
    handleFloorClear(floorId);
    setSelectedFloor(null);
  };

  return (
    <div
      className={`floor-plan ${isZoomedOut ? "zoomed-out" : ""} ${
        isIsometricView ? "isometric" : ""
      }`}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {capacityWarning && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255, 87, 87, 0.9)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "4px",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          {capacityWarning}
        </div>
      )}
      <div
        className={`floors-container ${isZoomedOut ? "grid-view" : ""}`}
        style={{
          position: isZoomedOut ? "static" : "relative",
          width: "100%",
          height: "100%",
          display: isZoomedOut ? "grid" : "block",
          gridTemplateColumns: isZoomedOut ? "repeat(1, 1fr)" : "none",
          gap: isZoomedOut ? "20px" : "0",
          padding: isZoomedOut ? "20px" : "0",
          overflowY: isZoomedOut ? "auto" : "",
          maxHeight: "100%",
          left: isZoomedOut ? "0" : "150px",
          top: isZoomedOut ? "0" : "50px",
        }}
      >
        {floorData.map((floor, index) => {
          console.log("Rendering floor:", index + 1);
          console.log("Floor data:", floor);
          console.log("Floor groups:", floor.groups);
          const isCurrent = isZoomedOut ? true : index === currentFloorIndex;
          const relativeIndex = index - (isZoomedOut ? 0 : currentFloorIndex);
          const verticalOffset = isIsometricView
            ? relativeIndex * (isZoomedOut ? 10 : 30) // Smaller offset when zoomed out
            : relativeIndex * (isZoomedOut ? 30 : 100); // Adjust vertical spacing

          return (
            <div
              key={floor.floor_id}
              style={{
                position: isZoomedOut ? "relative" : "absolute",
                width: isZoomedOut ? "90%" : "70%",
                height: isZoomedOut ? "90%" : "70%",
                transform: isZoomedOut
                  ? "none"
                  : isIsometricView
                  ? `rotateX(60deg) rotateZ(-30deg) translate3d(0, -40px, ${verticalOffset}px)`
                  : `translateY(${verticalOffset}px)`,
                transition: "all 0.5s ease-in-out",
                pointerEvents: isCurrent ? "auto" : "none",
                transformStyle: isIsometricView ? "preserve-3d" : "flat",
                transformOrigin: "center center",
                zIndex: floorData.length - Math.abs(relativeIndex),
              }}
            >
              <Floor
                id={floor.floor_id}
                index={index}
                floorNumber={floor.floor_id}
                groups={floor.groups || []}
                collaborationScore={floor.collaborationScore}
                onDrop={handleGroupDrop}
                onClear={handleFloorClearWithDetailClose}
                hoveredGroup={hoveredGroup}
                topCollaborators={topCollaborators}
                style={{
                  width: "100%",
                  height: "100%",
                  border: `2px solid ${isCurrent ? "#444" : "#333"}`,
                  boxShadow: isCurrent ? "0 10px 20px rgba(0,0,0,0.3)" : "none",
                  transition: "all 0.5s ease-in-out",
                  cursor: isZoomedOut ? "pointer" : "default",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => {
                  if (isZoomedOut) {
                    setCurrentFloorIndex(index);
                    setIsZoomedOut(false);
                  }
                }}
                onGroupDelete={onGroupDelete}
                isZoomedOut={isZoomedOut}
                onFloorDragStart={handleFloorDragStart}
                onFloorDrop={handleFloorReorder}
              />
            </div>
          );
        })}
      </div>

      {/* Navigation hints - hide when zoomed out */}
      {!isZoomedOut && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            width: "100%",
            textAlign: "center",
            color: "#f5e6d3",
            fontSize: "0.75em",
          }}
        >
          <div>
            <span style={{ marginRight: "20px" }}>
              ⬆️ Use Up Arrow to go up a floor
            </span>
            <span>⬇️ Use Down Arrow to go down a floor</span>
          </div>
          <div style={{ marginTop: "5px", color: "#999" }}>
            {`${
              floorData.length - currentFloorIndex - 1
            } floors above, ${currentFloorIndex} floors below`}
          </div>
        </div>
      )}

      {selectedFloor && (
        <FloorDetail
          floor={selectedFloor}
          onClose={handleCloseDetail}
          onClear={handleFloorClearWithDetailClose}
          onGroupSelect={onGroupSelect}
        />
      )}
    </div>
  );
}

export default FloorPlan;
