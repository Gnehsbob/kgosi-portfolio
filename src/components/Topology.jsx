import React, { useState } from 'react';

const NODES = {
  oracle: {
    id: 'oracle',
    label: 'Oracle Cloud Gateway',
    sub: 'Edge Proxy / Reverse Proxy Layer',
    ip: 'Public IP (redacted)',
    x: 400,
    y: 80,
    icon: '☁️',
    services: ['Nginx Reverse Proxy', 'Let\'s Encrypt SSL', 'Authelia Portal', 'WireGuard Interface']
  },
  byte: {
    id: 'byte',
    label: 'Storage & Mail Node',
    sub: 'Bare-metal / Self-hosted',
    ip: 'Private mesh (redacted)',
    x: 200,
    y: 280,
    icon: '💾',
    services: ['Postfix MTA', 'Dovecot MDA', 'LLDAP Directory', 'Nextcloud (Storage)', 'MariaDB Backend']
  },
  t560: {
    id: 't560',
    label: 'Compute Node',
    sub: 'Local inference / workstation',
    ip: 'Private mesh (redacted)',
    x: 600,
    y: 280,
    icon: '💻',
    services: ['Ollama AI Engine', 'Llama 3.1 Model', 'ONLYOFFICE Document Server']
  }
};

export default function Topology() {
  const [activeNode, setActiveNode] = useState(null);

  return (
    <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/50 space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-zinc-100">Interactive Cluster Topology</h3>
        <p className="text-xs text-zinc-500 font-mono">Hover over active nodes to inspect logical routing layers and service maps.</p>
      </div>

      <div className="relative">
        <svg viewBox="0 0 800 360" className="w-full h-auto max-w-2xl mx-auto overflow-visible">
          {/* Connection Lines (Tunnels) */}
          <line 
            x1={NODES.oracle.x} y1={NODES.oracle.y} 
            x2={NODES.byte.x} y2={NODES.byte.y} 
            className={`stroke-2 transition-all duration-300 ${activeNode === 'oracle' || activeNode === 'byte' ? 'stroke-blue-500 stroke-[3px]' : 'stroke-zinc-800'}`}
            strokeDasharray="5,5"
          />
          <line 
            x1={NODES.oracle.x} y1={NODES.oracle.y} 
            x2={NODES.t560.x} y2={NODES.t560.y} 
            className={`stroke-2 transition-all duration-300 ${activeNode === 'oracle' || activeNode === 't560' ? 'stroke-blue-500 stroke-[3px]' : 'stroke-zinc-800'}`}
            strokeDasharray="5,5"
          />
          <line 
            x1={NODES.byte.x} y1={NODES.byte.y} 
            x2={NODES.t560.x} y2={NODES.t560.y} 
            className={`stroke-2 transition-all duration-300 ${activeNode === 'byte' || activeNode === 't560' ? 'stroke-purple-500 stroke-[3px]' : 'stroke-zinc-800'}`}
            strokeDasharray="5,5"
          />

          {/* Interactive Nodes */}
          {Object.values(NODES).map((node) => {
            const isActive = activeNode === node.id;
            return (
              <g 
                key={node.id} 
                className="cursor-pointer"
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
              >
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r="32" 
                  className={`transition-all duration-300 ${isActive ? 'fill-zinc-800 stroke-zinc-400 stroke-2' : 'fill-zinc-900 stroke-zinc-800'}`}
                />
                <text 
                  x={node.x} 
                  y={node.y + 6} 
                  fontSize="20" 
                  textAnchor="middle"
                >
                  {node.icon}
                </text>
                <text 
                  x={node.x} 
                  y={node.y + 48} 
                  className={`text-[11px] font-mono transition-colors duration-300 ${isActive ? 'fill-zinc-100 font-bold' : 'fill-zinc-500'}`}
                  textAnchor="middle"
                >
                  {node.id.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Detail Card */}
        <div className="min-h-[140px] mt-6 p-4 rounded-lg bg-zinc-900/30 border border-zinc-900 font-mono text-xs space-y-3">
          {activeNode ? (
            <>
              <div className="flex justify-between items-start border-b border-zinc-900 pb-2">
                <div>
                  <h4 className="font-bold text-zinc-100 text-sm">{NODES[activeNode].label}</h4>
                  <p className="text-zinc-500 text-[11px]">{NODES[activeNode].sub}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
                  IP: {NODES[activeNode].ip}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase tracking-wider block">Active Processes:</span>
                <div className="flex flex-wrap gap-1.5">
                  {NODES[activeNode].services.map((service, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-24 text-zinc-600 italic">
              System idling. Hover over a node to establish telemetry tunnel.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
