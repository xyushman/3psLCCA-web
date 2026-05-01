import React, { useState } from 'react'
import HomePage from './gui/components/Homepage'
import Loginpage from './gui/Login/Loginpage'
import ProjectLayout from './gui/components/ProjectLayout'
import ProjectInformationPlaceholder from './gui/components/global_info/ProjectInformationPlaceholder'
import BridgeData from './gui/components/bridgedata/BridgeData'
import FinancialData from './gui/components/financialdata/FinancialData'
import TrafficData from './gui/components/trafficdata/TrafficData'
import ConstructionWorkData from './gui/components/constructionworkdata/ConstructionWorkData'
import CarbonEmissionContainer from './gui/components/carbon_emission/CarbonEmissionContainer'
import Logs from './gui/components/Logs'
import './App.css'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isProjectOpen, setIsProjectOpen] = useState(false)
  const [activeNode, setActiveNode] = useState('General Information')
  const [checkpoints, setCheckpoints] = useState([])
  const [logs, setLogs] = useState([])
  const [userName, setUserName] = useState('')

  const addLog = (message) => {
    const time = new Date().toTimeString().split(' ')[0]
    setLogs(prev => [...prev, `[${time}] ${message}`])
  }

  const handleLogin = (isGuest = false, name = "Admin") => {
    setIsLoggedIn(true)
    setUserName(name)
    addLog(isGuest ? `Guest user '${name}' logged in.` : `User '${name}' logged in.`)
  }

  const handleProjectOpen = () => {
    setIsProjectOpen(true)
    addLog("Project 'Bridge_Assessment_01' opened successfully.")
  }

  const handleSaveCheckpoint = (newCheckpoint) => {
    setCheckpoints(prev => [...prev, newCheckpoint])
    addLog(`Checkpoint '${newCheckpoint.label}' created.`)
  }

  const handleDeleteCheckpoint = (index) => {
    const cp = checkpoints[index]
    setCheckpoints(prev => prev.filter((_, i) => i !== index))
    addLog(`Checkpoint '${cp?.label || 'Unknown'}' deleted.`)
  }

  const handleClearLogs = () => {
    setLogs([])
  }

  const handleSetActiveNode = (node) => {
    if (node !== activeNode) {
      setActiveNode(node)
      addLog(`Switched to ${node} view.`)
    }
  }

  const CONTENT_MAP = {
    'General Information': <ProjectInformationPlaceholder />,
    'Bridge Data': <BridgeData />,
    'Financial Data': <FinancialData />,
    'Traffic Data': <TrafficData />,
    'Construction Work Data': <ConstructionWorkData setActiveNode={setActiveNode} />,
    'Foundation': <ConstructionWorkData setActiveNode={setActiveNode} />,
    'Sub Structure': <ConstructionWorkData initialTab="SubStructure" setActiveNode={setActiveNode} />,
    'Super Structure': <ConstructionWorkData initialTab="SuperStructure" setActiveNode={setActiveNode} />,
    'Miscellaneous': <ConstructionWorkData initialTab="Miscellaneous" setActiveNode={setActiveNode} />,
    'Carbon Emission Data': <CarbonEmissionContainer />,
    'Material Emissions': <CarbonEmissionContainer initialTab="Material" />,
    'Transportation Emissions': <CarbonEmissionContainer initialTab="Transportation" />,
    'Machinery Emissions': <CarbonEmissionContainer initialTab="Machinery" />,
    'Traffic Diversion Emissions': <CarbonEmissionContainer initialTab="Traffic" />,
    'Social Cost of Carbon': <CarbonEmissionContainer initialTab="SocialCost" />,
    'Logs': <Logs />,
    'Outputs': <CarbonEmissionContainer initialTab="SocialCost" />,
  }

  if (!isLoggedIn) {
    const handleAdminLogin = (credentials) => {
      const namePart = credentials.email ? credentials.email.split('@')[0] : 'Admin';
      handleLogin(false, namePart);
    };
    return <Loginpage onLogin={handleAdminLogin} onGuestLogin={(name) => handleLogin(true, name || 'Guest')} />
  }

  if (isProjectOpen) {
    const content = CONTENT_MAP[activeNode] || null
    return (
      <ProjectLayout
        activeNode={activeNode}
        setActiveNode={handleSetActiveNode}
        onBackToHome={() => {
          setIsProjectOpen(false)
          addLog("Project closed. Returning to home.")
        }}
        checkpoints={checkpoints}
        onSaveCheckpoint={handleSaveCheckpoint}
        onDeleteCheckpoint={handleDeleteCheckpoint}
        addLog={addLog}
      >
        {React.cloneElement(content, {
          checkpoints,
          logs,
          onClearLogs: handleClearLogs
        })}
      </ProjectLayout>
    )
  }

  return (
    <HomePage onProjectOpen={handleProjectOpen} userName={userName} />
  )
}

export default App
