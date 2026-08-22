import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadData, loadDemoData } from '../api';
import { Upload as UploadIcon, FileText, CheckCircle, Database } from 'lucide-react';

export default function Upload() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  async function handleDemoLoad() {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const res = await loadDemoData();
      setSuccess(`Demo data loaded successfully. Analyzed ${res.count} requests.`);
      
      // Auto redirect to dashboard after a short delay
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message || "Failed to load demo data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const res = await uploadData(file);
      setSuccess(`File uploaded successfully. Analyzed ${res.count} requests.`);
      
      // Auto redirect to dashboard
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message || "We couldn't read this file. Please check that it is a valid CSV.");
    } finally {
      setLoading(false);
      // Reset input
      e.target.value = '';
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Add Service Requests</h1>
      <p className="text-xl text-gray-600 mb-12">Upload your service-request data to analyze SLA risk.</p>

      {error && (
        <div className="mb-8 p-4 bg-danger/10 border-l-4 border-danger text-danger text-lg font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-8 p-6 bg-success/10 border-l-4 border-success text-success-foreground text-xl font-bold flex items-center gap-4 rounded-r-lg">
          <CheckCircle className="w-8 h-8 text-success" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Card */}
        <div className="card p-8 border-2 border-dashed border-gray-300 hover:border-primary transition-colors text-center relative flex flex-col items-center justify-center min-h-[300px]">
          <input 
            type="file" 
            accept=".csv"
            onChange={handleFileUpload}
            disabled={loading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
          />
          <UploadIcon className="w-16 h-16 text-gray-400 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload CSV file</h2>
          <p className="text-lg text-gray-500 mb-6 px-4">
            Drag and drop your CSV here or click to choose a file.
          </p>
          <button className="btn-primary pointer-events-none" disabled={loading}>
            {loading ? 'ANALYZING...' : 'CHOOSE CSV FILE'}
          </button>
        </div>

        {/* Demo Data Card */}
        <div className="card p-8 text-center flex flex-col items-center justify-center min-h-[300px] bg-blue-50 border-blue-200">
          <Database className="w-16 h-16 text-blue-500 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Demo Mode</h2>
          <p className="text-lg text-gray-600 mb-6 px-4">
            Load realistic synthetic data for the hackathon presentation.
          </p>
          <button 
            onClick={handleDemoLoad} 
            disabled={loading}
            className="btn-outline border-blue-600 text-blue-800 hover:bg-blue-100"
          >
            {loading ? 'LOADING...' : 'LOAD DEMO DATA'}
          </button>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <a href="#" className="inline-flex items-center text-lg text-primary hover:underline font-medium">
          <FileText className="w-5 h-5 mr-2" /> Download Sample CSV
        </a>
      </div>
    </div>
  );
}
