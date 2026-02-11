import { GoabFileUploadInput, GoabButton, GoabIcon } from '@abgov/react-components';
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

    const handleFileSelect = (docId: string, detail: { file?: File }) => {
        if (detail?.file) {
            onUpload(docId, detail.file);
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
                                <GoabFileUploadInput
                                    maxFileSize="10MB"
                                    onSelectFile={(detail) => handleFileSelect(doc.documentId, detail)}
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
