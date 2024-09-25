import { Button, Text, Container } from '@mantine/core';
import { useRef, useState } from 'react'; // Import useRef and useState
import './MainContent.css';

export default function MainContent({ activePage, onPageChange }) {
    const fileInputRef = useRef(null); // Create a ref for the file input
    const [selectedFileName, setSelectedFileName] = useState(''); // State to store the selected file name

    const handleFileSelect = () => {
        // Trigger the file input click event
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <Container className="main-container" style={{ textAlign: 'center' }}>
            {/* Top Navigation */}
            <div className="top-head">
                <Text
                    size="lg"
                    className={`t-1 ${activePage === 'howItWorks' ? 'active' : ''}`}
                    onClick={() => onPageChange('howItWorks')}
                >
                    HOW IT WORKS
                </Text>
                <Text
                    size="lg"
                    className={`t-2 ${activePage === 'joiner' ? 'active' : ''}`}
                    onClick={() => onPageChange('joiner')}
                >
                    JOINER
                </Text>
            </div>

            {/* Conditional rendering based on activePage */}
            {activePage === 'howItWorks' ? (
                <div>
                    <h1>Audio Cutter</h1>
                    <Text className="main-description">
                        Free editor to trim and cut any audio file online
                    </Text>
                    <Button onClick={handleFileSelect}>Browse my files</Button>
                    {/* Hidden file input */}
                    <input
                        type="file"
                        accept="audio/mp3"
                        ref={fileInputRef}
                        style={{ display: 'none' }} // Hide the input
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setSelectedFileName(file.name); // Update state with the selected file name
                            }
                        }}
                    />
                    {selectedFileName && <Text className="selected-file">Selected file: {selectedFileName}</Text>}
                </div>
            ) : (
                <div>
                    <h1>Audio Joiner</h1>
                    <Text className="main-description">
                        Join multiple audio tracks into one. Choose audio files you want to merge.
                    </Text>
                    <Button onClick={handleFileSelect}>Browse my files</Button>
                    {/* Hidden file input */}
                    <input
                        type="file"
                        accept="audio/mp3"
                        ref={fileInputRef}
                        style={{ display: 'none' }} // Hide the input
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setSelectedFileName(file.name); // Update state with the selected file name
                            }
                        }}
                    />
                    {selectedFileName && <Text className="selected-file">Selected file: {selectedFileName}</Text>}
                </div>
            )}
        </Container>
    );
}
