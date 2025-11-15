export const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Scan Lesion', path: '/scan-lesion' },
  { name: 'How It Works', path: '/#work' },
  { name: 'History', path: '/history' },
  { name: 'About Us', path: '/about-us' },
];
import globules from '../assets/globule.jpg';
import miliaCysts from '../assets/milia-like.jpeg';
import pigmentNetwork from '../assets/Pigment-n.jpeg';
import negativeNetwork from '../assets/negative-n.jpeg';
import streaks from '../assets/streaks.jpeg';
export  const cards = [
 { id: 1,image: streaks, title: 'Streaks', description: 'Linear, radial extensions at the edge of a lesion, often seen in melanomas (specifically the radial growth phase).' },
{ id: 2, image: globules, title: 'Globules', description: 'Round to oval, well-circumscribed structures that can be brown, black, or skin-colored. They are often seen in melanocytic nevi (moles) but can also be a feature of melanoma.' }
,
{ id: 3, image: miliaCysts, title: 'Milia-like Cysts', description: 'Small, white or yellowish round structures within a lesion, representing tiny, surface-level cysts filled with keratin. A classic feature of seborrheic keratosis.' }
,
{ id: 4, image: pigmentNetwork, title: 'Pigment Network', description: 'A grid-like pattern of brown lines over a lighter background. It is a fundamental structure indicating a melanocytic lesion and is seen in both nevi and melanoma.' }
,
{ id: 5, image: negativeNetwork, title: 'Negative Network', description: 'A series of white, "negative" lines that form a network, often described as a "string of pearls" or a grid of light areas. It is a high-risk feature commonly associated with melanoma.' }
  ];
import { Upload, Brain, Database, FileText, Download } from 'lucide-react';

 export  const steps = [
     {
       id: '01',
       icon: Upload,
       title: 'Upload Your Image',
       description: 'Start by uploading a clear image of the skin area you want to analyze. Our system supports standard image formats (JPG, PNG, JPEG) and ensures your data remains private and secure.',
       position: 'right'
     },
     {
       id: '02',
       icon: Brain,
       title: 'AI-Powered Lesion Detection',
       description: 'Once uploaded, our advanced AI model automatically scans the image to detect and classify possible skin lesions. You\'ll get instant insights with high accuracy, based on trained medical data.',
       position: 'left'
     },
     {
       id: '03',
       icon: Database,
       title: 'Save & Manage Your Results',
       description: 'Your detection results are securely stored in your personal dashboard. You can review, compare, or track changes over time for continuous monitoring and follow-up analysis.',
       position: 'right'
     },
     {
       id: '04',
       icon: FileText,
       title: 'Generate a Detailed Report',
       description: 'LesionVision automatically compiles a comprehensive report summarizing the findings, including detected lesion areas, confidence levels, and diagnostic suggestions.',
       position: 'left'
     },
     {
       id: '05',
       icon: Download,
       title: 'Download Your PDF Report',
       description: 'Finally, download your AI-generated report in PDF format. You can share it with your dermatologist, include it in patient files, or keep it for personal health tracking.',
       position: 'right'
     }
   ];