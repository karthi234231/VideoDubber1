import { useRef, useState, useEffect } from 'react';
import { Button, Text, Container, Group, Input } from '@mantine/core';
import WaveSurfer from 'wavesurfer.js';
import './MainContent.css';

export default function MainContent({ activePage, onPageChange }) {
    const fileInputRef = useRef(null);
    const waveformRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [waveSurfer, setWaveSurfer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [startCut, setStartCut] = useState(0);
    const [endCut, setEndCut] = useState(0);

    const handleFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    useEffect(() => {
        if (waveformRef.current && !waveSurfer) {
            const ws = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'cyan',
                progressColor: 'teal',
                backend: 'webaudio', // Use WebAudio backend to manipulate audio buffer directly
                height: 150,
            });
            setWaveSurfer(ws);
        }

        if (selectedFile && waveSurfer) {
            const fileURL = URL.createObjectURL(selectedFile);
            waveSurfer.load(fileURL);

            waveSurfer.on('ready', () => {
                const audioDuration = waveSurfer.getDuration();
                setDuration(audioDuration);
                setEndCut(audioDuration);
            });
        }

        return () => {
            if (waveSurfer) {
                waveSurfer.destroy();
            }
        };
    }, [selectedFile, waveSurfer]);

    const handlePlayPause = () => {
        if (waveSurfer) {
            waveSurfer.playPause();
            setIsPlaying(!isPlaying);
        }
    };

    const handleCut = async () => {
        // Validate if cut times are correct
        if (startCut >= 0 && endCut > startCut && endCut <= duration) {
            try {
                const audioBuffer = await waveSurfer.backend.getAudioBuffer();
                downloadTrimmedAudio(audioBuffer);
            } catch (error) {
                console.error('Error cutting audio:', error);
            }
        } else {
            // Download the full song if no valid cut
            downloadFullAudio();
        }
    };

    const downloadTrimmedAudio = (audioBuffer) => {
        const sampleRate = audioBuffer.sampleRate;
        const startSample = Math.floor(startCut * sampleRate);
        const endSample = Math.floor(endCut * sampleRate);
        const trimmedBuffer = audioBuffer.slice(startSample, endSample);

        // Create a new audio context and buffer
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const newBuffer = audioContext.createBuffer(
            trimmedBuffer.numberOfChannels,
            trimmedBuffer.length,
            sampleRate
        );

        // Copy channel data from the trimmed buffer to the new buffer
        for (let i = 0; i < trimmedBuffer.numberOfChannels; i++) {
            newBuffer.copyToChannel(trimmedBuffer.getChannelData(i), i);
        }

        // Convert the buffer to a Blob and download it
        audioBufferToWav(newBuffer).then((wavBlob) => {
            const url = URL.createObjectURL(wavBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${selectedFile.name.split('.')[0]}_trimmed.wav`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    const audioBufferToWav = (buffer) => {
        return new Promise((resolve) => {
            const numOfChan = buffer.numberOfChannels,
                length = buffer.length,
                wavBuffer = new ArrayBuffer(44 + length * 2 * numOfChan),
                view = new DataView(wavBuffer);

            let offset = 0;
            const writeString = (str) => {
                for (let i = 0; i < str.length; i++) {
                    view.setUint8(offset + i, str.charCodeAt(i));
                }
                offset += str.length;
            };

            writeString('RIFF');
            view.setUint32(4, 36 + length * 2 * numOfChan, true);
            writeString('WAVE');
            writeString('fmt ');
            view.setUint32(16, 16, true); // Subchunk1Size (PCM)
            view.setUint16(20, 1, true); // AudioFormat (PCM)
            view.setUint16(22, numOfChan, true); // NumChannels
            view.setUint32(24, buffer.sampleRate, true); // SampleRate
            view.setUint32(28, buffer.sampleRate * 2 * numOfChan, true); // ByteRate
            view.setUint16(32, numOfChan * 2, true); // BlockAlign
            view.setUint16(34, 16, true); // BitsPerSample
            writeString('data');
            view.setUint32(40, length * 2 * numOfChan, true);

            // Write interleaved PCM
            for (let i = 0; i < length; i++) {
                for (let channel = 0; channel < numOfChan; channel++) {
                    view.setInt16(44 + i * numOfChan * 2 + channel * 2, buffer.getChannelData(channel)[i] * 0x7FFF, true);
                }
            }

            resolve(new Blob([view], { type: 'audio/wav' }));
        });
    };

    const downloadFullAudio = () => {
        const link = document.createElement('a');
        link.href = waveSurfer.backend.media.src;
        link.download = selectedFile.name; // Download with original filename
        link.click();
    };

    return (
        <Container className="main-container" style={{ textAlign: 'center' }}>
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

            {activePage === 'howItWorks' ? (
                <div>
                    <h1>Audio Cutter</h1>
                    <Text className="main-description">
                        Free editor to trim and cut any audio file online
                    </Text>
                    <Button onClick={handleFileSelect}>Browse my files</Button>
                    <input
                        type="file"
                        accept="audio/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    {selectedFile && (
                        <div>
                            <Text className="selected-file">Selected file: {selectedFile.name}</Text>
                            <div ref={waveformRef} className="waveform"></div>
                            <Group position="center" mt="md">
                                <Button onClick={handlePlayPause}>
                                    {isPlaying ? 'Pause' : 'Play'}
                                </Button>
                                <Button onClick={handleCut}>Download Cut</Button>
                            </Group>
                            <div>
                                <Input
                                    label="Start Time (seconds)"
                                    type="number"
                                    value={startCut}
                                    onChange={(e) => setStartCut(parseFloat(e.target.value))}
                                    min={0}
                                    max={duration}
                                />
                                <Input
                                    label="End Time (seconds)"
                                    type="number"
                                    value={endCut}
                                    onChange={(e) => setEndCut(parseFloat(e.target.value))}
                                    min={0}
                                    max={duration}
                                />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <h1>Audio Joiner</h1>
                    <Text className="main-description">
                        Join multiple audio files into one seamlessly
                    </Text>
                </div>
            )}
        </Container>
    );
}
