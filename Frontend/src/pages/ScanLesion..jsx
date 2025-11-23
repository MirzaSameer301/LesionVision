import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import UploadSection from "../components/UploadSection";
import DetectionButtons from "../components/DetectionButtons";
import DetectionResults from "../components/DetectionResults";
import PatientForm from "../components/PatientForm";

import {
  detectLesions,
  createPatientWithLesions,
} from "../store/patientsSlice";

const lesionTypes = [
  { id: "streaks", name: "Streaks", color: "from-red-500 to-orange-500" },
  { id: "globules", name: "Globules", color: "from-blue-500 to-cyan-500" },
  { id: "milia", name: "Milia-like Cysts", color: "from-yellow-500 to-amber-500" },
  { id: "pigment", name: "Pigment Network", color: "from-green-500 to-emerald-500" },
  { id: "negative", name: "Negative Network", color: "from-purple-500 to-pink-500" },
];

// Map local lesion ids -> backend schema keys
const LOCAL_TO_SCHEMA = {
  streaks: "streaks",
  globules: "globules",
  milia: "miliaLikeCysts",
  pigment: "pigmentNetwork",
  negative: "negativeNetwork",
};

const ScanLesion = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

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
    gender: ""
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

  const normalizeBackendResults = (backendResults) => {
    // backendResults expected like { streaks: { status, confidence, detectedImage, labeledImage }, ... }
    const normalized = {};
    for (const [k, v] of Object.entries(backendResults)) {
      // keep local keys (use local id if present)
      // backend uses schema keys (streaks, globules, pigmentNetwork, negativeNetwork, miliaLikeCysts)
      // map back to local ids:
      let localKey = Object.keys(LOCAL_TO_SCHEMA).find(
        (lk) => LOCAL_TO_SCHEMA[lk] === k
      );
      if (!localKey) {
        // if backend returned local key already
        localKey = k;
      }
      normalized[localKey] = {
        detected: !!v.status,
        confidence: v.confidence ?? 0,
        timestamp: new Date().toLocaleTimeString(),
        mask: v.detectedImage ?? v.mask ?? null,
        labeledImage: v.labeledImage ?? null,
        name: lesionTypes.find((l) => l.id === localKey)?.name ?? localKey,
      };
    }
    return normalized;
  };

  const fallbackCreateFakeResult = (lesionId) => {
    const detected = Math.random() > 0.35;
    const confidence = Math.floor(Math.random() * 25) + 70;
    const mask = generateFakeMaskImage({
      width: 512,
      height: 512,
      detected,
      seed: Date.now() + lesionId.length,
    });
    return {
      detected,
      confidence,
      timestamp: new Date().toLocaleTimeString(),
      mask,
      labeledImage: mask, // for demo we reuse mask as labeled
      name: lesionTypes.find((l) => l.id === lesionId)?.name ?? lesionId,
    };
  };

  const detectSingle = useCallback(
    async (lesionId) => {
      if (!imagePreview) {
        toast.error("Please upload an image first");
        return;
      }

      setIsDetecting(true);
      await simulateProgress(1200 + Math.random() * 1200);

      try {
        // call backend detection via Redux thunk
        const types = lesionId; // single
        const resultAction = await dispatch(
          detectLesions({ imageBase64: imagePreview, types })
        );
        const payload = resultAction.payload ?? resultAction; // thunk returns payload

        // payload is expected `{ streaks: {...} }` or mapping for requested lesions
        // Convert to local UI format
        const normalized = normalizeBackendResults(payload);
        setDetectionResults((prev) => ({ ...prev, ...normalized }));
      } catch (err) {
        // fallback to fake mask when backend fails
        toast.error("Detection API failed — using demo mask.");
        const fake = fallbackCreateFakeResult(lesionId);
        setDetectionResults((prev) => ({ ...prev, [lesionId]: fake }));
      } finally {
        setIsDetecting(false);
        setProgress(0);
      }
    },
    [imagePreview, dispatch]
  );

  const detectAll = useCallback(async () => {
    if (!imagePreview) {
      toast.error("Please upload an image first");
      return;
    }

    setIsDetecting(true);
    await simulateProgress(2600 + Math.random() * 1600);

    try {
      const resultAction = await dispatch(
        detectLesions({ imageBase64: imagePreview, types: "all" })
      );
      const payload = resultAction.payload ?? resultAction;

      const normalized = normalizeBackendResults(payload);
      setDetectionResults((prev) => ({ ...prev, ...normalized }));
    } catch (err) {
      toast.error("Detection API failed — using demo masks.");
      const results = {};
      for (const lesion of lesionTypes) {
        results[lesion.id] = fallbackCreateFakeResult(lesion.id);
      }
      setDetectionResults(results);
    } finally {
      setIsDetecting(false);
      setProgress(0);
    }
  }, [imagePreview, dispatch]);

  const handleInputChange = (e) => {
    setPatientData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  // Build payload lesions object matching your DB schema keys
  const buildLesionsPayloadForSave = (detectionResults) => {
    const lesionsPayload = {};
    // initialize empty objects for all schema keys (optional)
    Object.values(LOCAL_TO_SCHEMA).forEach((schemaKey) => {
      lesionsPayload[schemaKey] = {
        status: false,
        confidence: 0,
        detectedImage: null,
        labeledImage: null,
      };
    });

    for (const [localId, result] of Object.entries(detectionResults)) {
      const schemaKey = LOCAL_TO_SCHEMA[localId];
      if (!schemaKey) continue;
      lesionsPayload[schemaKey] = {
        status: !!result.detected,
        confidence: result.confidence ?? 0,
        detectedImage: result.mask ?? null,
        labeledImage: result.labeledImage ?? result.mask ?? null,
      };
    }

    return lesionsPayload;
  };

  const handleSaveReport = async () => {
    if (!patientData.name || !patientData.age || !patientData.contact ||!patientData.gender) {
      toast.error("Please fill in all patient information");
      return;
    }
    if (Object.keys(detectionResults).length === 0) {
      toast.error("Please perform at least one detection");
      return;
    }

    const lesionsToSave = buildLesionsPayloadForSave(detectionResults);

    console.log(lesionsToSave);
    
    const payload = {
      userID: user?._id,
      patientName: patientData.name,
      patientPhone: patientData.contact,
      patientAge: Number(patientData.age),
      patientGender:patientData.gender,
      patientLesionImage: imagePreview,
      lesions: lesionsToSave,
    };

    try {
      const action = await dispatch(createPatientWithLesions(payload));
      const savedPatient = action.payload ?? action;
      toast.success("Report saved");
      navigate(`/view-report/${savedPatient._id || savedPatient.id}`);
    } catch (err) {
      toast.error("Failed to save report");
    }
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
      gender: ""
    });
  };


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
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <DetectionResults lesionTypes={lesionTypes} detectionResults={detectionResults} />

            <PatientForm patientData={patientData} onChange={handleInputChange} onSaveReport={() => {
              // show save confirmation modal or directly save
              handleSaveReport();
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanLesion;
