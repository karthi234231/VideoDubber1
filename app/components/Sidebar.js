import { IconMenu2, IconCut, IconMusic, IconScissors, IconDeviceSpeaker, IconMicrophone2, IconWaveSine, IconHelpCircle } from '@tabler/icons-react';
import './Sidebar.css';

export default function Sidebar({ isOpen, toggleSidebar }) {
    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            {/* Fixed Toggle Button */}
            <div className="toggle-btn" onClick={toggleSidebar}>
                <IconMenu2 size={32} />
            </div>

            {/* Sidebar Menu (only visible when open) */}
            {isOpen && (
                <>
                    <div className="sidebar-content">
                        <div className="menu-item">
                            <IconMusic size={25} />
                            <span>Remover</span>
                        </div>
                        <div className="menu-item">
                            <IconWaveSine size={25} />
                            <span>Splitter</span>
                        </div>
                        <div className="menu-item">
                            <IconMicrophone2 size={25} />
                            <span>Pitcher</span>
                        </div>
                        <div className="menu-item">
                            <IconDeviceSpeaker size={25} />
                            <span>Key BPM Finder</span>
                        </div>
                        <div className="menu-item">
                            <IconScissors size={25} />
                            <span>Cutter</span>
                        </div>
                        <div className="menu-item">
                            <IconCut size={25} />
                            <span>Joiner</span>
                        </div>
                        <div className="menu-item">
                            <IconWaveSine size={25} />
                            <span>Recorder</span>
                        </div>
                        <div className="menu-item">
                            <IconMicrophone2 size={25} />
                            <span>Karaoke</span>
                        </div>

                    </div>

                    {/* Fixed Support Section */}
                    <div className="menu-item support">
                        <IconHelpCircle size={25} />
                        <span>Support</span>
                    </div>
                </>
            )}
        </div>
    );
}
