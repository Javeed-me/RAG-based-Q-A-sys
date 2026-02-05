import React from 'react'
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import axios from 'axios'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const DocumentUpload: React.FC = () => {
    const [file, setFile] = React.useState<File | null>(null)
    const [status, setStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
    const [message, setMessage] = React.useState('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setStatus('idle')
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setStatus('uploading')
        const formData = new FormData()
        formData.append('file', file)

        try {
            await axios.post('http://localhost:8000/api/v1/documents/upload', formData)
            setStatus('success')
            setMessage('Document processed and indexed successfully!')
        } catch (err: any) {
            setStatus('error')
            setMessage(err.response?.data?.detail || 'Failed to upload document')
        }
    }

    return (
        <Card className="p-6">
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-semibold">Upload Document</h3>
                    <p className="text-sm text-slate-500">Upload a PDF to start asking questions</p>
                </div>

                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-slate-50 transition-colors"
                >
                    {file ? (
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium">{file.name}</span>
                        </div>
                    ) : (
                        <span className="text-sm text-slate-500">Click to select a PDF</span>
                    )}
                </label>

                {status === 'idle' && file && (
                    <Button onClick={handleUpload} className="w-full">Upload & Process</Button>
                )}

                {status === 'uploading' && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Processing document...
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        {message}
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                        <AlertCircle className="w-4 h-4" />
                        {message}
                    </div>
                )}
            </div>
        </Card>
    )
}
