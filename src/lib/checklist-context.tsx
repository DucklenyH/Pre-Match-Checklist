import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ChecklistStatus = 'OK' | 'Issue' | 'N/A' | null
export type MemberRole = 'Student' | 'Subsystem Leader' | 'Mentor'

export type ChecklistItem = {
  id: string
  name: string
  detail: string
  imageUrl?: string
  status: ChecklistStatus
  notes: string
}

export type Subsystem = {
  id: string
  name: string
  imageUrl?: string
  items: ChecklistItem[]
}

export type TeamMember = {
  id: string
  name: string
  role: MemberRole
}

export type MatchHistory = {
  id: string
  competition: string
  qualificationNumber: number
  completedBy: string
  recordedAt: string
  subsystems: Subsystem[]
}

type ChecklistContextValue = {
  competition: string
  competitions: string[]
  qualificationNumber: number
  subsystems: Subsystem[]
  members: TeamMember[]
  history: MatchHistory[]
  setMatchSettings: (competition: string, qualificationNumber: number) => void
  addCompetition: (name: string) => void
  removeCompetition: (name: string) => void
  setItemStatus: (subsystemId: string, itemId: string, status: ChecklistStatus) => void
  markSubsystemOk: (subsystemId: string) => void
  setItemNotes: (subsystemId: string, itemId: string, notes: string) => void
  addSubsystem: (name: string, imageUrl?: string) => void
  renameSubsystem: (subsystemId: string, name: string) => void
  setSubsystemImage: (subsystemId: string, imageUrl: string) => void
  removeSubsystem: (subsystemId: string) => void
  addItem: (subsystemId: string, name: string, detail: string, imageUrl?: string) => void
  updateItem: (subsystemId: string, itemId: string, name: string, detail: string, imageUrl?: string) => void
  removeItem: (subsystemId: string, itemId: string) => void
  updateMemberRole: (memberId: string, role: MemberRole) => void
  removeMember: (memberId: string) => void
  removeHistory: (historyId: string) => void
}

const starterSubsystems: Subsystem[] = [
  subsystem('Drivebase', [
    'All wheels spin / rotate freely', 'Wheels secure and cannot be pulled, wiggled, or twisted out', 'Check wheel axle bolt', 'Wiggle all motors to check mounting (do not overtighten)', 'All Kraken housing Torx bolts are tight (T9)', 'Verify that all Krakens have two bolts on side', 'Each module rigidly mounted to the frame brackets on drivebase', 'Visually verify all swerve encoders are blinking green', 'All studs have thumb nuts', 'Modules well assembled, no bolts backing out', 'Visually check state of gears in each module for wear', 'Check tread wear and notify coach if uneven', 'Check tread condition - no tears or missing chunks', 'Check for general wear and tear', 'The battery box does not move', 'If any module was disassembled, programmer has re-zeroed/aligned', 'If any motors were removed, use loctite when reinstalling', 'Parts with red loctite are identified', 'Non-standard hardware is identified', 'Bolts that should never be loctited are identified', 'Main breaker lugs (1/4-28)', 'Kraken housing Torx bolts (T9)', 'Bolts into motor shafts are not loctited', 'Bumper mount brackets are identified', 'Drive team is here', 'Electrical has a battery ready',
  ]),
  subsystem('Bumpers', [
    'If bumpers do not need to be changed, do not remove them', 'Watch out for ethernet/USB cord', 'Correct color of bumpers', 'If bumpers are off, verify no bolts are backing out on attachment points', 'Bumper attachment points on drivebase are not bent', 'Studs do not wiggle or wobble', 'Corners are stiff and do not feel broken, floppy, or damaged', 'Numbers are in good condition', 'Tube plug bolts are not loose', 'Before using vise grips, notify coach', 'If any issue is found, discuss with coach',
  ]),
  subsystem('Intake', [
    'Wiggle drivebase mounting plates; they should not move', 'Wiggle Krakens x3', 'All Kraken housing Torx bolts are tight (T9)', 'Verify that Kraken has two bolts on side', 'Bash bar is not bent too far and SRPP plates are parallel', 'Check bolts holding in front tube with an allen (yellow)', 'All bearings are completely pressed in', 'Wheels are in acceptable condition with no big tears', 'Mecanum wheels have moving rollers', 'Tubing on silicone rollers is not severely torn', 'All rollers spin with minimal resistance', 'Outer SRPP gear plate is not damaged', 'Check deployment gears for missing teeth', 'Check all belts for damage, fraying, or splitting', 'Check dead axle pulleys for cracks', 'Dead axle shaft bolts are tight', 'Bearing retaining bolts are fully tightened', 'Left-hand threaded hardware is identified', 'Bolts with Vibratite are identified',
  ]),
  subsystem('Table', [
    'Ensure turret moves smoothly', 'Wiggle shooter assembly', 'All bearings are pressed', 'Visually check gears for significant wear', 'Visually check 3DP follower gears for cracks or missing teeth', '3DP turret stand-offs are not broken', 'Hood is securely attached to turret', 'All cable chain apparatuses are securely attached to the table', 'Check cable chain for any cracks', 'Chains are tight (blue/yellow wrench)', 'All bolts on rollers are tight; do not overtighten', 'All metal turret gears are identified', 'Table-drive rail bolts are identified', 'Bearing stack shoulder bolts are identified', '44t gear on bottom shaft is identified', 'Rollers are identified', 'Turnbuckle and chain nuts are identified', 'Polycarb rollers are identified',
  ]),
  subsystem('Turret', [
    'Wiggle table assembly', 'Tighten all Table-Drivebase bolts with allen', 'Wiggle Krakens x2', 'Check all belts for tension and wear', 'Check uptake wheels for wear', 'Mecanum wheels roll smoothly',
  ]),
  subsystem('Front Rollers / Uptake', [
    'Wiggle table assembly', 'Tighten all Table-Drivebase bolts with allen', 'Wiggle Krakens x2', 'Check all belts for tension and wear', 'Check uptake wheels for wear', 'Mecanum wheels roll smoothly', 'SRPP plates pivot smoothly',
  ]),
  subsystem('Hood', [
    'Check all belts for tension and wear', 'All bearings are pressed', 'Check flywheel and back wheels for excessive wear', 'Gear wall is not cracked or broken', 'Gear wall bolts are tight', 'Ensure flywheel and back wheel bolts are tight with allen', 'Check pulley teeth for excessive wear', 'Wiggle Falcon', 'Bottom hex bearing is flush with bellypan', 'Ensure 3DP rack is securely attached to plate', 'Check all gears for wear, especially the 3DP rack and gears', 'Ensure hood reaches full range of motion smoothly', 'Ensure 3DP cable chain guards are not cracked or destroyed', 'Ensure slug is intact',
  ]),
  subsystem('Serializer', [
    'Dead wheels spin freely', 'Bearings are pressed in', 'Dead wheel support shafts are tight', 'Wiggle all motors', 'Visually inspect gears for wear', 'Hub is firmly attached', 'Visually inspect all bolts for backing out',
  ]),
  subsystem('Wheels', [
    'Dead wheels spin freely', 'Bearings are pressed in', 'Dead wheel support shafts are tight', 'Wiggle all motors', 'Ensure flywheel and back wheel bolts are tight with allen', 'Visually inspect gears for wear', 'Hub is firmly attached',
  ]),
  subsystem('Uptake Ramp', [
    'Wiggle 6-inch tube extensions', 'Uptake ramp attachment bolts are not loose', 'Visually check 3DP ramp',
  ]),
  subsystem('Main Plate', [
    'Main plate has no damage, defects, warping, or bending', 'Back wall assembly is firmly attached to main plate', 'Main plate holes sit flush with swerve module bolts', 'Main plate is in-plane with WAGO covers and not pushing on WAGO wires',
  ]),
  subsystem('Climber', [
    'Wiggle whole climber gently', 'Wiggle Kraken', 'Check rope tension', 'Check rope wear for fraying', 'Verify string is attached tightly to spool and standoff', 'Check rope drum for cracks', 'Check rope attachments x2', 'Check gears for tooth wear or chipping', 'Hook joints are movable and do not get stuck', 'Bearings are pressed into gear box plates', 'Ensure pivot and standoff bolts are tight', 'Make sure all clamping bolts are tight', 'Check clamping spacer for cracks',
  ]),
  subsystem('Drive Team / Robot Loading', [
    '8 balls preloaded', 'Climber down', 'Shooter hood down', 'Zeroed with intake down and turret facing hub', 'Robot powered on',
  ]),
  subsystem('Driver Station', [
    'Velcroed to alliance station', 'Check Ethernet and joystick connections', 'Joystick on the right port', 'Auto selected', 'Run CRT by pressing back button', 'Zero robot by pressing start button', 'Open Advantage Scope to make sure pose is good', 'Close Advantage Scope and tuner if open',
  ]),
  subsystem('Electrical', [
    'All connections secure with a locking mechanism', 'Check for damaged wire, loose connections, exposed wire, and insulation wear', 'Connectors are secure at beginning and end of wire routing', 'Check wires for damage', 'Visually inspect all wires inside drivebase', 'Check for wire damage in intake', 'MPM wires are not loose or damaged', 'Check mount stability', 'Ethernet cable in roboRIO is secure and clicked in', 'Check power/CAN connections', 'No metal shavings in drivebase', 'roboRIO ports are covered with tape', 'Pigeon is securely attached', 'Pigeon wires are inspected for damage and strain', 'Check every swerve motor for wire damage', 'Ethernet cable is secure', 'WAGOs pass a light tug test', 'Encoder wires on all modules are blinking green', 'Check every wire coming out of energy chain', 'Check for cut insulation along sharp edges', 'Beginning and end of energy chain are securely in place', 'Energy chain links are fully connected throughout', 'Check mount for damage', 'Securely attached to robot or mount', 'Check power connection for radio', 'Check power connections for RSL', 'Check power connection and fuses for Mini Power Module',
  ]),
  subsystem('Limelight', [
    'Check mount', 'Ethernet cable is secure and clicked in', 'Power wires are secure', 'No wire damage',
  ]),
  subsystem('Programming Systems Check', [
    'No untested changes are pushed to robot', 'Power on robot with intake down and shooter hood down', 'Press Xbox BACK button to update turret angle', 'Enable robot; intake deploys', 'Run balls through ballpath at full speed', 'Run drive forward and backward normally, then in boost mode', 'Power off robot and untether ethernet', 'Set intake to starting/transport configuration up and ensure hood is all the way down', 'Ensure external USB drives are detached', 'Set intake to starting configuration up', 'Ensure controller is set to port 0', 'Pull logs from last match and copy to USB drive', 'Tested code changes are deployed', 'USB drive is in robot roboRIO', 'Electrical changed battery', 'Velcro driver station to alliance station', 'Check Ethernet and joystick connections', 'Joystick is on the right port', 'Auto is selected', 'Run CRT by pressing back button', 'Zero robot by pressing start button', 'Open Advantage Scope to make sure pose is good', 'Close Advantage Scope and tuner if open', 'Shooter hood position reads 0 and increases when hood is raised', 'Shooter velocity reads 0 and increases when spun out', 'Rollers deployment angle is approximately 150 when down and 8 when up', 'Turret angle reads approximately 3.1 facing away from intake and 0 facing intake', 'Roller velocity reads 0 and decreases when rollers are spun in',
  ]),
  subsystem('General Robot', [
    'Pull logs from last match and copy to USB drive', 'Tested code changes are deployed', 'USB drive is in robot roboRIO', 'Electrical changed battery',
  ]),
  subsystem('Robot Encoders', [
    'Shooter hood position reads 0 and increases when hood is raised', 'Shooter velocity reads 0 and increases when spun out', 'Rollers deployment angle is approximately 150 when down and 8 when up', 'Turret angle reads approximately 3.1 facing away from intake and 0 facing intake', 'Roller velocity reads 0 and decreases when rollers are spun in',
  ]),
]

function subsystem(name: string, checks: string[]): Subsystem {
  const subsystemId = slug(name)
  return { id: subsystemId, name, items: checks.map((check, index) => ({ id: `${subsystemId}-${index + 1}`, name: check, detail: 'Complete this pre-match check.', status: null, notes: '' })) }
}

const checklistSubsystemIds = ['drivebase', 'bumpers', 'intake', 'table', 'hood', 'serializer', 'climber', 'electrical', 'programming-systems-check']
const checklistSubsystems = starterSubsystems.filter((entry) => checklistSubsystemIds.includes(entry.id))

const starterMembers: TeamMember[] = [
  { id: 'declan', name: 'Declan H', role: 'Mentor' },
  { id: 'alex', name: 'Alex R', role: 'Student' },
  { id: 'jordan', name: 'Jordan K', role: 'Subsystem Leader' },
  { id: 'sam', name: 'Sam T', role: 'Student' },
]

const starterCompetitions = ['Pittsburgh Regional', 'Greater Pittsburgh Regional', 'World Championship']

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

function cloneSubsystems(subsystems: Subsystem[]) {
  return subsystems.map((subsystem) => ({
    ...subsystem,
    items: subsystem.items.map((checklistItem) => ({ ...checklistItem })),
  }))
}

export function progressFor(subsystems: Subsystem[]) {
  const items = subsystems.flatMap((subsystem) => subsystem.items)
  if (!items.length) return 0
  return Math.round((items.filter((checklistItem) => checklistItem.status !== null).length / items.length) * 100)
}

export function progressForSubsystem(subsystem: Subsystem) {
  return progressFor([subsystem])
}

const ChecklistContext = createContext<ChecklistContextValue | null>(null)

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [competition, setCompetition] = useState('Pittsburgh Regional')
  const [competitions, setCompetitions] = useState(starterCompetitions)
  const [qualificationNumber, setQualificationNumber] = useState(42)
  const [subsystems, setSubsystems] = useState<Subsystem[]>(checklistSubsystems)
  const [members, setMembers] = useState<TeamMember[]>(starterMembers)
  const [history, setHistory] = useState<MatchHistory[]>([])

  useEffect(() => {
    setSubsystems((currentSubsystems) => currentSubsystems.length === checklistSubsystems.length && checklistSubsystems.every((expected) => currentSubsystems.some((current) => current.id === expected.id))
      ? currentSubsystems
      : checklistSubsystems)
  }, [])

  const value = useMemo<ChecklistContextValue>(() => ({
    competition,
    competitions,
    qualificationNumber,
    subsystems,
    members,
    history,
    setMatchSettings: (nextCompetition, nextQualificationNumber) => {
      setHistory((currentHistory) => [
        {
          id: id('match'),
          competition,
          qualificationNumber,
          completedBy: 'Declan H',
          recordedAt: new Date().toISOString(),
          subsystems: cloneSubsystems(subsystems),
        },
        ...currentHistory,
      ])
      setCompetition(nextCompetition)
      setQualificationNumber(nextQualificationNumber)
      setSubsystems((currentSubsystems) => cloneSubsystems(currentSubsystems).map((subsystem) => ({
        ...subsystem,
        items: subsystem.items.map((checklistItem) => ({ ...checklistItem, status: null, notes: '' })),
      })))
    },
    addCompetition: (name) => setCompetitions((currentCompetitions) => currentCompetitions.includes(name) ? currentCompetitions : [...currentCompetitions, name]),
    removeCompetition: (name) => {
      setCompetitions((currentCompetitions) => {
        if (currentCompetitions.length <= 1) return currentCompetitions
        const nextCompetitions = currentCompetitions.filter((entry) => entry !== name)
        if (competition === name && nextCompetitions[0]) setCompetition(nextCompetitions[0])
        return nextCompetitions
      })
    },
    setItemStatus: (subsystemId, itemId, status) => {
      setSubsystems((currentSubsystems) => currentSubsystems.map((subsystem) => subsystem.id !== subsystemId ? subsystem : {
        ...subsystem,
        items: subsystem.items.map((checklistItem) => checklistItem.id === itemId ? { ...checklistItem, status } : checklistItem),
      }))
    },
    markSubsystemOk: (subsystemId) => {
      setSubsystems((currentSubsystems) => currentSubsystems.map((subsystem) => subsystem.id !== subsystemId ? subsystem : {
        ...subsystem,
        items: subsystem.items.map((checklistItem) => ({ ...checklistItem, status: 'OK' as const })),
      }))
    },
    setItemNotes: (subsystemId, itemId, notes) => {
      setSubsystems((currentSubsystems) => currentSubsystems.map((subsystem) => subsystem.id !== subsystemId ? subsystem : {
        ...subsystem,
        items: subsystem.items.map((checklistItem) => checklistItem.id === itemId ? { ...checklistItem, notes } : checklistItem),
      }))
    },
    addSubsystem: (name, imageUrl) => setSubsystems((currentSubsystems) => [...currentSubsystems, { id: id('subsystem'), name, imageUrl: imageUrl || undefined, items: [] }]),
    renameSubsystem: (subsystemId, name) => setSubsystems((currentSubsystems) => currentSubsystems.map((subsystem) => subsystem.id === subsystemId ? { ...subsystem, name } : subsystem)),
    setSubsystemImage: (subsystemId, imageUrl) => setSubsystems((currentSubsystems) => currentSubsystems.map((subsystem) => subsystem.id === subsystemId ? { ...subsystem, imageUrl: imageUrl || undefined } : subsystem)),
    removeSubsystem: (subsystemId) => setSubsystems((currentSubsystems) => currentSubsystems.filter((subsystem) => subsystem.id !== subsystemId)),
    addItem: (subsystemId, name, detail, imageUrl) => setSubsystems((currentSubsystems) => currentSubsystems.map((subsystem) => subsystem.id === subsystemId ? { ...subsystem, items: [...subsystem.items, { id: id('item'), name, detail, imageUrl: imageUrl || undefined, status: null, notes: '' }] } : subsystem)),
    updateItem: (subsystemId, itemId, name, detail, imageUrl) => setSubsystems((currentSubsystems) => currentSubsystems.map((subsystem) => subsystem.id === subsystemId ? { ...subsystem, items: subsystem.items.map((checklistItem) => checklistItem.id === itemId ? { ...checklistItem, name, detail, imageUrl: imageUrl || undefined } : checklistItem) } : subsystem)),
    removeItem: (subsystemId, itemId) => setSubsystems((currentSubsystems) => currentSubsystems.map((subsystem) => subsystem.id === subsystemId ? { ...subsystem, items: subsystem.items.filter((checklistItem) => checklistItem.id !== itemId) } : subsystem)),
    updateMemberRole: (memberId, role) => setMembers((currentMembers) => currentMembers.map((member) => member.id === memberId ? { ...member, role } : member)),
    removeMember: (memberId) => setMembers((currentMembers) => currentMembers.filter((member) => member.id !== memberId)),
    removeHistory: (historyId) => setHistory((currentHistory) => currentHistory.filter((match) => match.id !== historyId)),
  }), [competition, competitions, history, members, qualificationNumber, subsystems])

  return <ChecklistContext.Provider value={value}>{children}</ChecklistContext.Provider>
}

export function useChecklist() {
  const value = useContext(ChecklistContext)
  if (!value) throw new Error('useChecklist must be used inside ChecklistProvider')
  return value
}
