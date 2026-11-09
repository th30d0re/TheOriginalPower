import eras from '../../dashboard_eras.json';

/** Dashboard names are deliberately tied to the rail, rather than to the order in a scene. */
export type InstrumentSlug =
  | 'era-clock' | 'system-stress' | 'capital' | 'interference' | 'compass'
  | 'active-patch' | 'variables' | 'executing-function' | 'policy-ticker' | 'wage-plane'
  | 'interference-engine' | 'phase-coherence' | 'five-tier-cone' | 'compounding-ledger'
  | 'backlash-oscillator' | 'thyristor-latch' | 'ac-extraction-meter' | 'snubber-circuit';
export type InstrumentStatus = 'off' | 'standby' | 'live';
export type DashboardFields = {
  system_stress?: {level?: string | null; reason?: string};
  capital?: {level?: string | null; reason?: string};
  interference_state?: {text?: string; phi_load?: number[]; rho_tau?: number[]; rho_tau_crash?: number | null};
  active_patch?: string | null;
  variables_loaded?: string[];
  variables_deployed?: string[];
  executing_function?: string | null;
  results?: string[];
};
export type DashboardState = {
  year: number;
  eraLog: number;
  title: string;
  instruments: Record<InstrumentSlug, InstrumentStatus>;
  values: DashboardFields;
};
export type DashboardKeyframe = DashboardState;

/** Converts the human-facing instrument label back to the stable dashboard rail key. */
export const instrumentSlug = (name: string): InstrumentSlug =>
  name.toLowerCase().replaceAll(' ', '-') as InstrumentSlug;

const slugs: InstrumentSlug[] = [
  'era-clock','system-stress','capital','interference','compass','active-patch','variables',
  'executing-function','policy-ticker','wage-plane','interference-engine','phase-coherence',
  'five-tier-cone','compounding-ledger','backlash-oscillator','thyristor-latch','ac-extraction-meter','snubber-circuit',
];
const status = (live: InstrumentSlug[] = [], standby: InstrumentSlug[] = []) =>
  Object.fromEntries(slugs.map(slug => [slug, live.includes(slug) ? 'live' : standby.includes(slug) ? 'standby' : 'off'])) as Record<InstrumentSlug, InstrumentStatus>;
const base = ['era-clock','compass','system-stress','capital'] as InstrumentSlug[];
const operational = [...base,'interference','active-patch','variables','policy-ticker'] as InstrumentSlug[];
const colonialRuntime = [...operational,'executing-function','wage-plane'] as InstrumentSlug[];
const allLive = status(slugs);
const era = (log: number) => (eras as unknown as {log:number; title:string; fields:DashboardFields}[]).find(entry => entry.log === log)!;
const fromEra = (year:number, log:number): DashboardState => {
  const source=era(log);
  return {year,eraLog:log,title:source.title,instruments:allLive,values:source.fields};
};

// This is a historical state machine, not a claim that the dashboard itself existed then.
// It prevents later analytical categories from appearing before the narrated institutions create them.
export const DASHBOARD_TIMELINE: DashboardKeyframe[] = [
  // 1441 — Goncalves's Rio d'Ouro kidnapping raid: seizure, but no royal policy, racial variable, or apparatus.
  {year:1441,eraLog:2,title:'1441 (RIO D’OURO COAST)',instruments:status(base),values:{
    system_stress:{level:'HIGH',reason:'Domestic labor scarcity constrains Portuguese elite accumulation.'},
    capital:{level:'CONSTRAINED',reason:'Maritime and island cultivation seek labor outside Christian customary protections.'},
  }},
  // 1444 — Companhia de Lagos and the royal quinto scale seizure into chartered commercial logistics.
  {year:1444,eraLog:2,title:'1444 (LAGOS, PORTUGAL)',instruments:status(base,['active-patch']),values:{
    system_stress:{level:'HIGH',reason:'Labor scarcity persists; direct raids meet resistance and raise costs.'},
    capital:{level:'SCALING',reason:'Chartered voyages and the royal fifth turn captive seizure into a fiscal stream.'},
    active_patch:'Chartered commercial logistics initializing…',
  }},
  // 1452 — Dum Diversas supplies ecclesiastical authority for conquest and perpetual servitude.
  {year:1452,eraLog:2,title:'1452 (DUM DIVERSAS)',instruments:status([...base,'policy-ticker'],['active-patch']),values:{
    system_stress:{level:'HIGH',reason:'Christian moral constraints require a supranational legal exception.'},
    capital:{level:'SCALING',reason:'Crown-backed extraction now has a papal authorization layer.'},
    active_patch:'Authorization layer compiling…',
    results:['[POLICY] Dum Diversas (1452) authorizes attack, conquest, and perpetual servitude of non-Christians.'],
  }},
  // 1453 — Zurara's commissioned chronicle begins the phenotype-keyed ideological category.
  {year:1453,eraLog:2,title:'1453 (ZURARA CHRONICLE)',instruments:status([...base,'interference','active-patch','variables','policy-ticker']),values:{
    system_stress:{level:'HIGH',reason:'The Crown needs moral cover for a profitable captive trade.'},
    capital:{level:'SCALING',reason:'Commercial seizure is profitable before the racial chronicle is commissioned.'},
    interference_state:{text:'Phenotype partition compiling. Φ_load ∈ [0.05, 0.10]; ρ_τ ∈ [0.80, 0.90].',phi_load:[.05,.10],rho_tau:[.80,.90]},
    active_patch:'Ideological layer compiling…',
    variables_deployed:['E (Crown / merchants)','O_racialized (being constructed from phenotype)'],
    results:['[IDEOLOGY] Zurara’s commissioned chronicle groups distinct African peoples into an inferior racial category.'],
  }},
  // 1455 — Romanus Pontifex adds Portugal's exclusive commercial and imperial monopoly.
  {year:1455,eraLog:2,title:'1455 (ROMANUS PONTIFEX)',instruments:status([...base,'interference','active-patch','variables','policy-ticker']),values:{
    system_stress:{level:'HIGH',reason:'The extraction route requires durable legal and moral cover.'},
    capital:{level:'SCALING',reason:'Exclusive monopoly secures the route’s commercial upside.'},
    interference_state:{text:'Phenotype partition initializing. Φ_load ∈ [0.08, 0.15]; ρ_τ ∈ [0.75, 0.88].',phi_load:[.08,.15],rho_tau:[.75,.88]},
    active_patch:'Version 1.0 authorization active.',
    variables_deployed:['E (Crown / merchants)','O_racialized (phenotype-keyed)','I (Portuguese Christian public)'],
    results:['[POLICY] Dum Diversas (1452) authorizes perpetual servitude.','[POLICY] Romanus Pontifex (1455) grants Portugal an exclusive imperial-commercial monopoly.'],
  }},
  // 1486 — Casa dos Escravos registers, taxes, and licenses human cargo under royal authority.
  {year:1486,eraLog:2,title:'1486 (LISBON, PORTUGAL)',instruments:status(operational),values:{
    system_stress:{level:'HIGH',reason:'Domestic labor shortage threatens agricultural capital; Christian exploitation remains constrained.'},
    capital:{level:'STAGNANT',reason:'Sugar trade demands labor the current moral economy cannot supply.'},
    interference_state:{text:'LOW axis count; phenotype partition institutionalizing. Φ_load ∈ [0.10, 0.20], ρ_τ ∈ [0.70, 0.85].',phi_load:[.10,.20],rho_tau:[.70,.85]},
    active_patch:'Version 1.0 institutionalizing…',
    variables_deployed:['E (Crown / merchants)','O_racialized (phenotype-keyed)','I (Portuguese Christian public)'],
    results:['[POLICY] Dum Diversas (1452) and Romanus Pontifex (1455) authorize exploitation.','[POLICY] Casa dos Escravos (1486) institutionalizes state-managed registration, taxation, and licensing.'],
  }},
  // 1619 — Point Comfort: Atlantic machinery is mature, but Virginia has no statutory white tier yet.
  {year:1619,eraLog:3,title:'1619 (POINT COMFORT, VIRGINIA)',instruments:status(operational),values:{
    system_stress:{level:'HIGH',reason:'Atlantic plantation demand expands while Virginia remains a marginal tobacco colony.'},
    capital:{level:'EXPANDING',reason:'Iberian sugar, silver, and port systems dominate enslaved African labor zones.'},
    interference_state:{text:'Atlantic racialization operating; Virginia statutory white tier not initialized. Φ_load ∈ [0.15, 0.25]; ρ_τ ∈ [0.65, 0.80].',phi_load:[.15,.25],rho_tau:[.65,.80]},
    active_patch:'Atlantic extraction runtime active.',
    variables_deployed:['E (Iberian crowns / merchants)','O_racialized (Atlantic labor category)','I (colonial publics)'],
    results:['[EVENT] White Lion trades twenty-and-odd Angolan captives at Point Comfort (1619).','[STATUS] Virginia has no comprehensive slave code or statutory white racial tier.'],
  }},
  // 1676 — Bacon's Rebellion exposes cross-racial solidarity; the buffer contract is not yet codified.
  {year:1676,eraLog:3,title:'1676 (BACON’S REBELLION)',instruments:status(operational,['executing-function','wage-plane']),values:{
    ...era(3).fields,
    system_stress:{level:'CRITICAL',reason:'Cross-racial labor solidarity detected; Jamestown is burning.'},
    capital:{level:'AT RISK',reason:'A unified revolt destabilizes plantation extraction.'},
    interference_state:{text:'Coherence breach before statutory racial partition. Φ_load ∈ [0.15, 0.30]; ρ_τ > 1.00 at crash.',phi_load:[.15,.30],rho_tau:[1,1.05],rho_tau_crash:1},
    active_patch:'Emergency recompile queued…',
    variables_loaded:['E','O_racialized','I'],
    variables_deployed:[],
    executing_function:null,
    results:['[EVENT] Bacon’s Rebellion (1676) reveals cross-racial labor solidarity.','[STATUS] Statutory white tier and buffer-class wage are not yet initialized.'],
  }},
  // 1704 — Virginia's 1705 code sequence formalizes the racial partition and buffer-class privileges.
  {...fromEra(1704,5),instruments:status(colonialRuntime)},
  // 1894 — post-emancipation containment restructures extraction through space and law.
  {...fromEra(1894,9),instruments:allLive},
  // 1968 — the post-Civil-Rights recompile adds high-dimensional routing.
  {...fromEra(1968,14),instruments:allLive},
  // 1994 — terminal runtime is the era-15 state in dashboard_eras.json.
  {...fromEra(1994,15),instruments:allLive},
  // 2010 — algorithmic epoch imports the era-17 values from dashboard_eras.json.
  {...fromEra(2010,17),instruments:allLive},
];

/** Returns the latest historically justified keyframe, clamping early dates to the first entry. */
export function dashboardStateAt(year:number): DashboardState {
  return DASHBOARD_TIMELINE.reduce((current,keyframe) => keyframe.year <= year ? keyframe : current, DASHBOARD_TIMELINE[0]);
}
