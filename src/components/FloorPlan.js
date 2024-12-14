import React, { useState, useEffect, useCallback } from "react";
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
  handleFloorDrop,
  handleFloorClear,
  onGroupSelect,
  isIsometricView,
  isZoomedOut,
  setIsZoomedOut,
  hoveredGroup,
  topCollaborators,
  onGroupDelete,
  capacityWarning,
  setFloorData,
  getCollaborationScore,
}) {
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [draggedFloorId, setDraggedFloorId] = useState(null);
  const [floorCollabScores, setFloorCollabScores] = useState({});
  const [hoveredFloorId, setHoveredFloorId] = useState(null);

  const calculateGroupCollaborationScore = useCallback((group1, group2) => {
    const score = getCollaborationScore(group1, group2);
    const weight1 = group1.peopleCount;
    const weight2 = group2.peopleCount;
    return (score * weight1 + score * weight2) / (weight1 + weight2);
  }, [getCollaborationScore]);

  const handleFloorDragStart = (floorId) => {
    setDraggedFloorId(floorId);
  };

  const handleFloorReorder = (fromIndex, toIndex) => {
    console.log("Reordering floors:", { fromIndex, toIndex });
    setFloorData((prevData) => {
      const newData = [...prevData];
      const [movedFloor] = newData.splice(fromIndex, 1);
      newData.splice(toIndex, 0, movedFloor);
      console.log(
        "New floor order:",
        newData.map((f) => f.floor_id)
      );
      return newData;
    });
  };

  const calculateCollaborationAverage = useCallback((floor1, floor2) => {
    if (!floor1?.groups || !floor2?.groups) return 0;
    if (!floor1.groups.length || !floor2.groups.length) return 0;

    let totalScore = 0;
    let count = 0;

    floor1.groups.forEach(group1 => {
      floor2.groups.forEach(group2 => {
        const score = calculateGroupCollaborationScore(group1, group2);
        totalScore += score;
        count++;
      });
    });

    return count > 0 ? Number((totalScore / count).toFixed(2)) : 0;
  }, [calculateGroupCollaborationScore]);

  const findHighestCollabFloor = (floorId) => {
    if (!floorId) return null;
    
    let highestScore = -1;
    let highestCollabFloorId = null;
    
    const currentFloor = floorData.find(f => f.floor_id === floorId);
    if (!currentFloor) return null;

    floorData.forEach(otherFloor => {
      if (otherFloor.floor_id !== floorId) {
        const score = calculateCollaborationAverage(currentFloor, otherFloor);
        
        if (score > highestScore) {
          highestScore = score;
          highestCollabFloorId = otherFloor.floor_id;
        }
      }
    });
    
    return highestCollabFloorId;
  };

  const highestCollabFloorId = findHighestCollabFloor(hoveredFloorId);

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

  useEffect(() => {
    if (!isZoomedOut) {
      setFloorCollabScores({});
      return;
    }

    const newScores = {};
    floorData.forEach((floor, index) => {
      if (index > 0) {
        const scoreWithAbove = calculateCollaborationAverage(
          floorData[index - 1],
          floor
        );
        newScores[`${floorData[index - 1].floor_id}-${floor.floor_id}`] =
          scoreWithAbove;
      }
      if (index < floorData.length - 1) {
        const scoreWithBelow = calculateCollaborationAverage(
          floor,
          floorData[index + 1]
        );
        newScores[`${floor.floor_id}-${floorData[index + 1].floor_id}`] =
          scoreWithBelow;
      }
    });
    setFloorCollabScores(newScores);
  }, [
    floorData,
    isZoomedOut,
    getCollaborationScore,
    calculateCollaborationAverage,
  ]);

  const handleCloseDetail = () => {
    setSelectedFloor(null);
  };

  const handleFloorClearWithDetailClose = (floorId) => {
    handleFloorClear(floorId);
    setSelectedFloor(null);
  };

  const handleGroupDrop = (group, floorId) => {
    console.log("Handling group drop:", { group, floorId });
    handleFloorDrop(group, floorId);
  };



  

  return (
    <>
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
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transform: isIsometricView ? "scale(0.6) translateY(20%)" : "none",
            transformOrigin: "center center",
            overflowY: isZoomedOut ? "auto" : "",
          maxHeight: isZoomedOut ? "100vh" : "",
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
          <div className={`floors-container ${isZoomedOut ? "grid-view" : ""}`}>
            {floorData.map((floor, index) => {
              const isCurrent = isZoomedOut
                ? true
                : index === currentFloorIndex;
              const relativeIndex =
                index - (isZoomedOut ? 0 : currentFloorIndex);
              const verticalOffset = isIsometricView
                ? relativeIndex * (isZoomedOut ? 10 : 40)
                : relativeIndex * (isZoomedOut ? 30 : 100);

              if (!isIsometricView && !isZoomedOut && !isCurrent) {
                return null;
              }

              return (
                <React.Fragment key={floor.floor_id}>
                  <div
                    style={{
                      position: isZoomedOut ? "relative" : "absolute",
                      width: "90%",
                      height: isZoomedOut ? "80%" : "70%",
                      transform: isZoomedOut
                        ? "none"
                        : isIsometricView
                        ? `rotateX(60deg) rotateZ(-45deg) translate3d(0, -60px, ${
                            verticalOffset * 2
                          }px)`
                        : `translate(-50%, -50%)`,
                      transition: "all 0.5s ease-in-out",
                      pointerEvents: isCurrent ? "auto" : "none",
                      transformStyle: isIsometricView ? "preserve-3d" : "flat",
                      transformOrigin: "center center",
                      zIndex: floorData.length - Math.abs(relativeIndex),
                      perspective: isIsometricView ? "1500px" : "none",
                      left: isZoomedOut
                        ? "5%"
                        : isIsometricView
                        ? "auto"
                        : "50%",
                      top: isIsometricView ? "auto" : "50%",
                      marginBottom: isZoomedOut ? "10px" : "0",
                      marginTop: isZoomedOut ? "10px" : "0",
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
                        boxShadow: isCurrent
                          ? "0 10px 20px rgba(0,0,0,0.3)"
                          : "none",
                        transition: "all 0.5s ease-in-out",
                        cursor: isZoomedOut ? "pointer" : "default",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      opacity={
                        isIsometricView && !isZoomedOut
                          ? isCurrent
                            ? 1
                            : 0.3
                          : 1
                      }
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
                      floorCollabScores={floorCollabScores}
                      floorData={floorData}
                      onFloorHover={setHoveredFloorId}
                      isHighlightedFloor={floor.floor_id === highestCollabFloorId}
                    />
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

   

        {selectedFloor && (
          <FloorDetail
            floor={selectedFloor}
            onClose={handleCloseDetail}
            onClear={handleFloorClearWithDetailClose}
            onGroupSelect={onGroupSelect}
          />
        )}
      </div>
    </>
  );
}

export default FloorPlan;
