import { useState, useEffect } from 'react';

export interface PrintJob {
    id: string;
    filename: string;
    content: string; // Blob URL
    timestamp: string;
    status: 'pending' | 'printed';
}

// Simple in-memory storage for mock
let mockQueue: PrintJob[] = [];
const listeners: Set<(jobs: PrintJob[]) => void> = new Set();

const notifyListeners = () => {
    listeners.forEach(listener => listener([...mockQueue]));
};

export const uploadToTempCloud = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        const newJob: PrintJob = {
            id: Math.random().toString(36).substr(2, 9),
            filename: file.name,
            content: url,
            timestamp: new Date().toLocaleTimeString(),
            status: 'pending',
        };

        mockQueue = [newJob, ...mockQueue];
        notifyListeners();
        resolve(url);
    });
};

export const usePrintQueue = () => {
    const [jobs, setJobs] = useState<PrintJob[]>(mockQueue);

    useEffect(() => {
        const listener = (updatedJobs: PrintJob[]) => setJobs(updatedJobs);
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }, []);

    const markAsPrinted = (id: string) => {
        mockQueue = mockQueue.map(job =>
            job.id === id ? { ...job, status: 'printed' as const } : job
        );
        notifyListeners();
    };

    return { jobs, markAsPrinted };
};
