// src/components/DetectionMaskPreview.jsx
import React from "react";

/**
 * Displays mask image (black/white) with a small label and optional confidence.
 */
const DetectionMaskPreview = ({ maskDataUrl, lesionName, confidence, detected }) => {
  return (
    <div className="bg-secondary rounded-xl p-4 md:p-6 border border-tertiary/20">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-light font-semibold text-sm md:text-base">{lesionName}</h4>
          <p className="text-tertiary text-xs md:text-sm">{detected ? "Detected" : "Not Detected"}</p>
        </div>
        <div className="text-right">
          <p className="text-xl md:text-2xl font-bold text-primary">{confidence ?? "-" }%</p>
          <p className="text-tertiary text-xs">Confidence</p>
        </div>
      </div>

      <div className="bg-black rounded-md overflow-hidden border border-tertiary/10">
        {maskDataUrl ? (
          <img src={maskDataUrl} alt={`${lesionName} mask`} className="w-full h-56 object-contain" />
        ) : (
          <div className="w-full h-56 flex items-center justify-center text-tertiary">No mask available</div>
        )}
      </div>
    </div>
  );
};

export default DetectionMaskPreview;
