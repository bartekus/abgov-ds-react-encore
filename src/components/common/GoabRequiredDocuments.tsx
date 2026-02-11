import { GoabFileUploadCard, GoabButton, GoabIcon } from '@abgov/react-components';
import { RequiredDocument } from '../../types/formDefinitions';

interface GoabRequiredDocumentsProps {
    documents: RequiredDocument[];
    uploadedFiles: Record<string, File | null>;
    onUpload: (docId: string, file: File) => void;
    onRemove: (docId: string) => void;
}

export function GoabRequiredDocuments({
    documents,
    uploadedFiles,
    onUpload,
    onRemove
}: GoabRequiredDocumentsProps) {

    const handleFileSelect = (docId: string, event: CustomEvent) => {
        // GoabFileUploadCard detail contains { file: File } or similar?
        // Need to verify the event signature for GoabFileUploadCard
        // Assuming standard CustomEvent with detail.file or detail.filename
        console.log('Upload event', event.detail);
        // Mocking file object since we can't easily get it from web component event in this context without testing
        // Actually, standard is detail.file
        if (event.detail && event.detail.file) {
            onUpload(docId, event.detail.file);
        }
    };

    return (
        <div>
            <h3>Required Documents</h3>
            {documents.map(doc => {
                const file = uploadedFiles[doc.documentId];

                return (
                    <div key={doc.documentId} style={{
                        border: '1px solid #ccc',
                        padding: '16px',
                        borderRadius: '4px',
                        marginBottom: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 8px 0' }}>{doc.documentName}</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{doc.description}</p>
                            {file && (
                                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', color: 'green' }}>
                                    <GoabIcon type="checkmark-circle" />
                                    <span style={{ marginLeft: '8px' }}>{file.name}</span>
                                </div>
                            )}
                        </div>

                        <div style={{ marginLeft: '16px' }}>
                            {!file ? (
                                <GoabFileUploadCard
                                    filename={doc.documentId}
                                    maxSize="10MB"
                                    onFileSelected={(e: never) => handleFileSelect(doc.documentId, e)}
                                />
                            ) : (
                                <GoabButton type="secondary" onClick={() => onRemove(doc.documentId)} variant="destructive">
                                    Remove
                                </GoabButton>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
