import React, { useState, useCallback } from "react";
import UploadSection from "../components/UploadSection";
import DetectionButtons from "../components/DetectionButtons";
import DetectionResults from "../components/DetectionResults";
import PatientForm from "../components/PatientForm";
import ReportView from "../components/ReportView";
import {toast} from 'react-toastify'
import { generateFakeMaskImage } from "../lib/fakeMasks.js";

const lesionTypes = [
  { id: "streaks", name: "Streaks", color: "from-red-500 to-orange-500" },
  { id: "globules", name: "Globules", color: "from-blue-500 to-cyan-500" },
  { id: "milia", name: "Milia-like Cysts", color: "from-yellow-500 to-amber-500" },
  { id: "pigment", name: "Pigment Network", color: "from-green-500 to-emerald-500" },
  { id: "negative", name: "Negative Network", color: "from-purple-500 to-pink-500" },
];

const ScanLesion = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [detectionResults, setDetectionResults] = useState({});
  const [isDetecting, setIsDetecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    contact: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setDetectionResults({});
  };

  // simulate progress bar
  const simulateProgress = (duration = 2000) => {
    setProgress(0);
    const start = Date.now();
    return new Promise((resolve) => {
      const tick = () => {
        const elapsed = Date.now() - start;
        const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
        setProgress(pct);
        if (pct >= 100) {
          setTimeout(() => {
            setProgress(100);
            resolve();
          }, 150);
        } else {
          requestAnimationFrame(tick);
        }
      };
      tick();
    });
  };

  const detectSingle = useCallback(
    async (lesionId) => {
      if (!selectedImage) {
        toast.error("Please upload an image first");
        return;
      }
      setIsDetecting(true);
      await simulateProgress(1600 + Math.random() * 1200);

      // fake detection result
      const detected = Math.random() > 0.35;
      const confidence = Math.floor(Math.random() * 25) + 70; // 70-94

      // generate mask (fake)
      const mask = generateFakeMaskImage({
        width: 512,
        height: 512,
        detected,
        seed: Date.now() + lesionId.length,
      });

      setDetectionResults((prev) => ({
        ...prev,
        [lesionId]: {
          detected,
          confidence,
          timestamp: new Date().toLocaleTimeString(),
          mask,
          name: lesionTypes.find((l) => l.id === lesionId)?.name ?? lesionId,
        },
      }));

      setIsDetecting(false);
      setProgress(0);
    },
    [selectedImage]
  );

  const detectAll = useCallback(async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }
    setIsDetecting(true);
    await simulateProgress(2600 + Math.random() * 1600);

    const results = {};
    for (const lesion of lesionTypes) {
      const detected = Math.random() > 0.35;
      const confidence = Math.floor(Math.random() * 25) + 70;
      const mask = generateFakeMaskImage({
        width: 512,
        height: 512,
        detected,
        seed: Date.now() + lesion.id.length + Math.floor(Math.random() * 1000),
      });
      results[lesion.id] = {
        detected,
        confidence,
        timestamp: new Date().toLocaleTimeString(),
        mask,
        name: lesion.name,
      };
    }

    setDetectionResults(results);
    setIsDetecting(false);
    setProgress(0);
  }, [selectedImage]);

  const handleInputChange = (e) => {
    setPatientData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSaveReport = () => {
    if (!patientData.name || !patientData.age || !patientData.contact) {
      toast.error("Please fill in all patient information");
      return;
    }
    if (Object.keys(detectionResults).length === 0) {
      toast.error("Please perform at least one detection");
      return;
    }
    setShowReport(true);
  };

  const handleDownloadPDF = () => {
    toast.error("PDF download functionality would be implemented later using jsPDF or html2pdf.");
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDetectionResults({});
    setShowReport(false);
    setPatientData({
      name: "",
      age: "",
      contact: "",
      date: new Date().toISOString().split("T")[0],
    });
    setProgress(0);
  };

  if (showReport) {
    return (
      <ReportView
        imagePreview={imagePreview}
        patientData={patientData}
        detectionResults={detectionResults}
        onDownload={handleDownloadPDF}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="min-h-screen bg-light py-8 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mb-3 md:mb-4">AI-Powered Lesion Detection</h1>
          <p className="text-base md:text-lg text-primary max-w-2xl mx-auto px-4">
            Upload a clear image of the skin area for advanced AI analysis
          </p>
        </div>

        <div className="flex-col flex gap-4">
          <div className="space-y-4 md:space-y-6">
            <UploadSection imagePreview={imagePreview} onChangeFile={handleImageUpload} />

            <div className="relative">
              <DetectionButtons imagePreview={imagePreview} lesionTypes={lesionTypes} onDetect={detectSingle} onDetectAll={detectAll} isDetecting={isDetecting} />

              {/* Progress bar overlay */}
              {isDetecting && (
                <div className="mt-3">
                  <div className="w-full bg-tertiary/20 rounded-full h-2 overflow-hidden">
                    <div className="h-2 rounded-full bg-gradient-to-r from-background to-secondary transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-secondary">
                    <span>Detecting...</span>
                    <span>{progress}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <DetectionResults lesionTypes={lesionTypes} detectionResults={detectionResults} />

            <PatientForm patientData={patientData} onChange={handleInputChange} onSaveReport={handleSaveReport} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanLesion;
