import React from 'react';
import ProcessStateSim from './simulations/ProcessStateSim';
import CpuSchedulingSim from './simulations/CpuSchedulingSim';
import ThreadsSim from './simulations/ThreadsSim';
import ProcessSyncSim from './simulations/ProcessSyncSim';
import DeadlocksSim from './simulations/DeadlocksSim';
import MemoryManagementSim from './simulations/MemoryManagementSim';
import PagingSim from './simulations/PagingSim';
import PageReplacementSim from './simulations/PageReplacementSim';
import DiskSchedulingSim from './simulations/DiskSchedulingSim';
import FileSystemsSim from './simulations/FileSystemsSim';

export default function StepAnimation({ moduleId, onInteract }) {
  const renderSim = () => {
    switch (moduleId) {
      case 'process-management':
        return <ProcessStateSim onInteract={onInteract} />;
      case 'cpu-scheduling':
        return <CpuSchedulingSim onInteract={onInteract} />;
      case 'threads':
        return <ThreadsSim onInteract={onInteract} />;
      case 'process-sync':
        return <ProcessSyncSim onInteract={onInteract} />;
      case 'deadlocks':
        return <DeadlocksSim onInteract={onInteract} />;
      case 'memory-management':
        return <MemoryManagementSim onInteract={onInteract} />;
      case 'paging':
        return <PagingSim onInteract={onInteract} />;
      case 'page-replacement':
        return <PageReplacementSim onInteract={onInteract} />;
      case 'disk-scheduling':
        return <DiskSchedulingSim onInteract={onInteract} />;
      case 'file-systems':
        return <FileSystemsSim onInteract={onInteract} />;
      default:
        return <div className="text-slate-400">Simulation not found.</div>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl text-xs text-slate-400 flex items-center justify-between font-mono">
        <span>💡 Interactive Simulation Mode</span>
        <span className="text-blue-400">Controls: Play, Pause, Step, Adjust parameters live</span>
      </div>
      {renderSim()}
    </div>
  );
}
