// src/components/DetectionResults.jsx
import React from "react";
import { Check, X } from "lucide-react";
import DetectionMaskPreview from "./DetectionMaskPreview";
const DetectionResults = ({ lesionTypes, detectionResults }) => {
  const keys = Object.keys(detectionResults || {});
  if (keys.length === 0) return null;

  return (
    <div className=" bg-background rounded-2xl md:rounded-3xl shadow-xl border border-tertiary/20 p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-light mb-4">Detection Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {lesionTypes.map((lesion) => {
          const res = detectionResults[lesion.id];
          if (!res) return null;
          return (
            <div key={lesion.id} className="bg-secondary rounded-xl p-3 md:p-4 border border-tertiary/20">
              <div className="">
                <div className={`w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-lg bg-gradient-to-br ${lesion.color} flex items-center justify-center`}>
                  {res.detected ? <Check className="w-5 h-5 text-white" /> : <X className="w-5 h-5 text-white" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mt-3">
                    <DetectionMaskPreview
                      maskDataUrl={res.mask}
                      lesionName={lesion.name}
                      confidence={res.confidence}
                      detected={res.detected}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetectionResults;
