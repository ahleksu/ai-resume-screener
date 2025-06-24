export interface Resume {
    id?: string;
    fileName: string;
    file: File,
    extractedText?: string;
    hasPhoto?: boolean;
    photoUrl?: boolean;
    uploadedAt?: Date;
    processingStatus?: 'pending' | 'processing' | 'completed' | 'error';
}
