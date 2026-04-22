// 23 Schaeffler 2W Components with full technical content
// Categories: Engine, Transmission, Chassis, Engine Control Units

const components = [
  // ── ENGINE CONTROL UNITS ────────────────────────────────────────────
  {
    id: "m4c",
    label: "M4C Engine Control Unit",
    targetMeshes: ["M4C"],
    category: "Engine Control Units",
    model: "Parts/M4C.glb",
    anchor: [0.0, 3.5, 0.5],
    tagline: "Standalone Ride-by-Wire ECU for mid- to high-end motorcycles",
    highlights: ["Small and compact design for both 2 and 4 stroke engines", "Knock sensor compatible (x2)", "Automotive technology"],
    features: [
      "32 bit microcontroller, 80 MHz",
      "1.5 MB Flash Memory",
      "IP67 and IP6K9K (high pressure cleaning)",
      "Separate safety monitoring unit for ETC system",
      "4 binary O2-sensors (opt. 1 linear + 1 binary O2-sensors)",
      "CAN (opt. LIN interface)",
      "Single pocket 64 pins connector"
    ],
    advantages: [
      "Controls up to two electric throttle bodies or a mechanical throttle body and a stepper",
      "Operates up to two injectors per cylinder",
      "Euro 5 with OBD-II compliance",
      "ISO-26262 ready / Asil B"
    ],
    specs: {
      "Engine Type": "1- and 2-cylinder, 2- and 4-stroke",
      "Max RPM": "Up to 16,000 rpm",
      "Microcontroller": "32 bit, 80 MHz",
      "Flash Memory": "1.5 MB",
      "Protection": "IP67 / IP6K9K",
      "Standard": "EURO5 OBDII, ISO-26262 ASIL-B"
    }
  },
  {
    id: "m4a",
    label: "M4A/B Twin Spark Mechatronic",
    targetMeshes: ["M4A"],
    category: "Engine Control Units",
    model: "Parts/M4A.glb",
    anchor: [-1.0, 3.5, 0.0],
    tagline: "ECU with integrated throttle body for light motorcycles and scooters",
    highlights: ["Single/twin sparks solution", "Very compact size and easy mounting", "Throttle body size from ø16 up to 34 mm"],
    features: [
      "Single pocket 24/34 pins connector (equivalent to a 38/43 pins standalone ECU)",
      "IPX6 and IPX9K (high pressure cleaning)",
      "Operating temperature range: -30 °C up to +85 °C",
      "32 bit microcontroller, 32 MHz, 768 Kb Flash",
      "CAN interface",
      "EURO5 OBDII stage 2 compliant"
    ],
    advantages: [
      "ECU with integrated throttle body, sensors and actuator",
      "Uses Schaeffler automotive electronics and technologies",
      "Ethanol compatible",
      "Several configurations: Engine mounting interface, throttle size, cable interface",
      "Integrated 3-axis accelerometer (Tilt sensor)"
    ],
    specs: {
      "Application": "Single cylinder, 4-stroke, 50 cc to 350 cc",
      "Connector": "24/34 pins single pocket",
      "Microcontroller": "32 bit, 32 MHz, 768 Kb Flash",
      "Throttle Size": "ø16 to ø34 mm",
      "Protection": "IPX6, IPX9K",
      "Standard": "EURO5 OBDII stage 2"
    }
  },
  {
    id: "m4rek",
    label: "M4REK Mechatronic",
    targetMeshes: ["M4REK"],
    category: "Engine Control Units",
    model: "Parts/M4REK.glb",
    anchor: [-0.023, -0.249, 0.103],
    tagline: "ECU with embedded Electronic Throttle Control for mid-range motorcycles",
    highlights: ["Engine Control Unit with integrated Electronic Throttle Control", "Very compact size", "Easy mounting"],
    features: [
      "Single pocket 36 pins connector (equivalent to a 47 pins standalone ECU)",
      "IPX6 and IPX9K (high pressure cleaning)",
      "Operating temperature range: -30°C up to +85°C",
      "32 bit microcontroller, 80 MHz, 1.5 Mb Flash Memory",
      "CAN interface",
      "EURO5 OBDII stage 2 compliant",
      "Separate safety monitoring unit for ETC system (ISO-26262 compliant)"
    ],
    advantages: [
      "Uses Schaeffler automotive electronics",
      "Several configurations: Engine mounting interface, throttle diameter",
      "Throttle body size from ø28 mm up to 42 mm",
      "Supports Ride-by-Wire technology"
    ],
    specs: {
      "Application": "Single-cylinder, 4-stroke, 250 cc to 500 cc",
      "Connector": "36 pins single pocket",
      "Microcontroller": "32 bit, 80 MHz, 1.5 Mb Flash",
      "Throttle Size": "ø28 to ø42 mm",
      "Protection": "IPX6, IPX9K",
      "Standard": "EURO5 OBDII, ISO-26262"
    }
  },

  // ── ENGINE PRODUCTS ──────────────────────────────────────────────────
  {
    id: "fuel_injector",
    label: "Fuel Injector — Gasoline Deka 7",
    targetMeshes: ["Fuel Injector"],
    category: "Engine",
    model: "Parts/Fuel Injector.glb",
    anchor: [-0.056, -0.265, 0.845],
    tagline: "Port Fuel Injector with unique flexibility in body, tip and spray configurations",
    highlights: ["Proven durability performance", "Improved opening and closing performance", "E-fuel compatible design"],
    features: [
      "System pressure: 2.5 to 6 bar",
      "Static flow rate: 0.75 g/s to 6.0 g/s per application",
      "SMD size: 60 µm & higher",
      "Opening/Closing time: <1.1 ms / <0.8 ms",
      "Linearity Range/Pulse: 10:1; 1.2–1.3 ms (MOV = 5.5 V)",
      "Typical spray pattern: Cone 10°–30°, bent 5°–25°, split spray 15°–30°",
      "Mounting: Intake manifold or cylinder head"
    ],
    advantages: [
      "Fast opening / closing",
      "Various packaging options",
      "Flexible orifice configurations with various cone combinations",
      "Low pulse width with high linear performance",
      "Low voltage sensitivity"
    ],
    specs: {
      "System Pressure": "2.5 – 6 bar",
      "Static Flow Rate": "0.75 – 6.0 g/s",
      "SMD Size": "60 µm & higher",
      "Opening Time": "< 1.1 ms",
      "Closing Time": "< 0.8 ms",
      "Linearity": "10:1"
    }
  },
  {
    id: "knock_sensor",
    label: "Knock Sensor",
    targetMeshes: ["Knock sensor"],
    category: "Engine",
    model: "Parts/Knock sensor.glb",
    anchor: [0.644, -0.889, 1.048],
    tagline: "Measures structural vibrations to continuously adjust ignition parameters",
    highlights: ["Worldwide market leader since 1990", ">15 cable and integrated connector versions", "Enabler for emission reduction"],
    features: [
      "Acceleration sensor based on piezo ceramic technology",
      "Frequency range: 3 kHz up to 25 kHz",
      "Possible integration of discharge resistor",
      "Integrated connector or cable version",
      "Various connector designs",
      "Nut and glue types assembly technology"
    ],
    advantages: [
      "Production locations in Americas, Europe, India and China",
      "Optimized ignition timing for maximum efficiency",
      "High sensitivity",
      "Compact design, nested bolt possible",
      "Increases engine power",
      "Decreases fuel consumption",
      "Nut and glued types with in-house engine qualification capability"
    ],
    specs: {
      "Sensor Type": "Piezo ceramic",
      "Frequency Range": "3 kHz – 25 kHz",
      "Assembly": "Nut or glue",
      "Series Since": "1990",
      "Versions": ">15 cable & connector"
    }
  },
  {
    id: "pressure_sensor",
    label: "Pressure Sensor (MAP + Temperature)",
    targetMeshes: ["Pressure sensor"],
    category: "Engine",
    model: "Parts/pressure sensor.glb",
    anchor: [0.358, -0.073, 0.906],
    tagline: "Small and robust pressure sensor with integrated temperature sensing for manifolds",
    highlights: ["Flexible transfer function calibration", "High accuracy and temperature stability", "Compatible with toughest environments"],
    features: [
      "Pressure range: 7 kPa up to 500 kPa",
      "Accuracy: 1% full scale (10°C to 85°C)",
      "Temperature range: -40°C up to 140°C",
      "Output signal: Analog or SENT",
      "Programmable clip levels and OBD functionality"
    ],
    advantages: [
      "Flexible calibration of transfer functions",
      "High accuracy",
      "Low-cost design and high quality",
      "Fulfills toughest EMC requirements",
      "Flexible housing, connector and mounting design"
    ],
    specs: {
      "Pressure Range": "7 kPa – 500 kPa",
      "Accuracy": "1% full scale",
      "Temp Range": "-40°C to +140°C",
      "Output": "Analog or SENT",
      "OBD": "Supported"
    }
  },
  {
    id: "flex_fuel_sensor",
    label: "Flex Fuel Sensor",
    targetMeshes: ["Flex Fuel Sensor"],
    category: "Engine",
    model: "Parts/Flex Fuel sensore.glb",
    anchor: [0.631, -0.182, -1.724],
    tagline: "Detects ethanol concentration in gasoline/ethanol fuel mixture before engine injection",
    highlights: ["Worldwide market leader since 1998", "Highly accurate ethanol prediction", "Signal output within 250 ms after start-up"],
    features: [
      "Measurement principle: Capacitive (0–100% ethanol content)",
      "Accuracy: ±5% ethanol concentration",
      "Pressure range: <10 bar (145 psi)",
      "Fuel temp. range: -40°C to 80°C",
      "Environmental temp: -40°C to 140°C",
      "Ethanol detection before injection/combustion with OBD1 functionality"
    ],
    advantages: [
      "Highly accurate prediction of ethanol concentration",
      "Enables ethanol detection before inject./combustion",
      "Outputs ethanol concentration and fuel temperature within 250 ms after start-up",
      "Self-diagnostic capability",
      "Calibrations available for worldwide market"
    ],
    specs: {
      "Principle": "Capacitive",
      "Ethanol Range": "0–100%",
      "Accuracy": "±5%",
      "Pressure": "< 10 bar",
      "Response Time": "< 250 ms after start",
      "Fuel Temp": "-40°C to +80°C"
    }
  },
  {
    id: "hydraulic_chain_tensioner",
    label: "Hydraulic Chain Tensioner",
    targetMeshes: ["Hydraulic Chain tensioner"],
    category: "Engine",
    model: "Parts/Hydrolic Chain tenssioner.glb",
    anchor: [0.452, -0.794, 0.782],
    tagline: "Cost-effective hydraulic eco chain tensioner reducing friction and fuel consumption",
    highlights: ["Outstanding NVH behavior", "Reduced fuel consumption", "Robust and cost-effective design"],
    features: [
      "Steel piston in a formed steel housing",
      "Low chain pre-tensioning is possible",
      "Stable and precise damping behavior",
      "Reduced friction in the timing drive"
    ],
    advantages: [
      "Chain blade design can be simplified",
      "Superior load peak compensation compared to mechanical tensioners"
    ],
    specs: {
      "Type": "Hydraulic eco tensioner",
      "Housing": "Formed steel",
      "Piston": "Steel",
      "Application": "Timing drive"
    }
  },
  {
    id: "cam_roller",
    label: "Cam Roller & BZ Pin",
    targetMeshes: ["Rocket arm, Cam Roller, BZ Pin"],
    category: "Engine",
    model: "Parts/Rocket arm, Cam Roller, BZ Pin .glb",
    hasExplodedView: true,
    explodeTrigger: "zoom",
    anchor: [0.024, -0.054, 1.421],
    tagline: "Wide range of outer rings, needles and pins for various motorcycle applications",
    highlights: ["Easy to assemble with rocker arm", "Optimized friction", "Suitable for engine speed up to 12,000 RPM"],
    features: [
      "Application specific design features on the product/drawing",
      "Needles sorts defined as per bearing clearance requirements",
      "Automated production or assembly lines — no manual interventions"
    ],
    advantages: [
      "Simplified, more cost-effective manufacturing process for the outer ring, needles and pins",
      "High level of friction benefits against plain bearing",
      "Locally developed outer rings and pins — cost-effective solution"
    ],
    specs: {
      "Max Engine Speed": "12,000 RPM",
      "Production": "Automated lines",
      "In Market Since": ">10 years (India 2W)"
    }
  },
  {
    id: "crankpin_kzk",
    label: "Crankpin KZK & Pistonpin KBK",
    targetMeshes: ["Crankpin KZK", "Pistonpin KBK"],
    category: "Engine",
    model: "Parts/Crankpin KZK.glb",
    anchor: [0.585, -2.242, 0.965],
    tagline: "Needle bearings at the heart of each small combustion engine",
    highlights: ["High resistance against centrifugal forces", "Improved lubrication access", "Easy assembly"],
    features: [
      "Different cage profiles according to application requirements",
      "Various dimensions available",
      "Dedicated designs and dimensions on request",
      "Different coatings according to application requirements"
    ],
    advantages: [
      "Supports high centrifugal and acceleration forces, suitable for high speeds",
      "High wear resistance with improved cage surface quality",
      "Both inner and outer needle retention",
      "Long bearing lifetime",
      "Supports high frequency oscillating loads",
      "Good wear resistance during dry lubrication with coated cages"
    ],
    specs: {
      "Type": "KZK (big end) / KBK (small end)",
      "Cage Material": "Various, coated options",
      "Load Type": "High centrifugal & oscillating",
      "Assembly": "Easy"
    }
  },
  {
    id: "one_way_clutch",
    label: "Starter One Way Clutch",
    targetMeshes: ["One way clutch"],
    category: "Engine",
    model: "Parts/One way Clutch.glb",
    hasExplodedView: true,
    explodeTrigger: "zoom",
    anchor: [0.771, -2.246, 0.950],
    tagline: "Roller clutch for electric starter drives with integrated torque limitation",
    highlights: ["Easy to mount", "Low space requirements and reduced weight", "Suitable for high power densities"],
    features: [
      "Deep-drawn outer ring, manufactured using forming methods",
      "Integrated torque limitation function",
      "Schaeffler's manufacturing technology ensures reliable quality"
    ],
    advantages: [
      "Simplified, more cost-effective manufacturing process — hardening and grinding no longer required",
      "High level of protection against failure and protection of adjacent parts without additional components",
      "Cost-effective, high-quality — excellent price-performance ratio"
    ],
    specs: {
      "Type": "Roller clutch",
      "Outer Ring": "Deep-drawn",
      "Feature": "Integrated torque limitation",
      "Application": "Electric starter drive"
    }
  },
  {
    id: "drawn_cup_starter",
    label: "Drawn Cup Needle Roller Bearing (Starter/Primary Drive)",
    targetMeshes: ["Drawn Cup Needle Roller Bearing "],
    category: "Engine",
    model: "Parts/Drawn Cup Needle Roller Bearing HK - RS.glb",
    anchor: [-0.068, -2.086, -0.710],
    tagline: "Deep drawing technology providing significant cost and precision advantages",
    highlights: ["High load rating capacity", "Weight saving potential", "Cost-efficient deep drawing technology"],
    features: [
      "Deep drawing technology for roller bearing outer ring",
      "Applicable for multiple applications",
      "Low noise and friction level",
      "Ease of assembly",
      "Cost effective solution"
    ],
    advantages: [
      "High load rating capacity with significantly more compact design than ball bearing",
      "High robustness against overload due to line contact",
      "Low radial installation space",
      "Higher speeds with needle roller and cage assemblies",
      "Extremely high load carrying capacity (full complement)",
      "Anti rust performance with grease version"
    ],
    specs: {
      "Technology": "Deep drawing",
      "Application": "Starter motor / Primary drive",
      "Type": "HK-RS",
      "Lubrication": "Grease / Oil"
    }
  },
  {
    id: "cylindrical_roller",
    label: "Cylindrical Roller Bearing with Sheet Metal Cage",
    targetMeshes: ["Cylindrical Roller with sheet metal cage"],
    category: "Engine",
    hasExplodedView: true,
    explodeTrigger: "zoom",
    model: "Parts/Cylindrical Roller with sheet metal cage  .glb",
    anchor: [-0.137, -0.342, -1.506],
    tagline: "Non-separable self-retaining bearing with higher load rating and reduced friction",
    highlights: ["Higher stiffness", "Controlled rolling elements", "Non-separable — easy to mount"],
    features: [
      "Non-separable self-retaining bearing",
      "Reduction in frictional torque compared to standard CRB",
      "Higher load rating compared to a Ball bearing in same envelope size",
      "Suitable for higher radial & axial loads",
      "Both sides lip for the Inner ring and outer rings",
      "Riveted steel cage design"
    ],
    advantages: [
      "Higher power density in small or same envelope size",
      "High reliability compared to Ball bearings",
      "Lower friction compared to standard CRB",
      "Ease of assembly"
    ],
    specs: {
      "Type": "Cylindrical roller with riveted steel cage",
      "Cage": "Riveted steel / Sheet metal",
      "Load": "High radial & axial",
      "Assembly": "Non-separable unit"
    }
  },

  // ── TRANSMISSION ─────────────────────────────────────────────────────
  {
    id: "plastic_cage_needle",
    label: "Plastic Cage Needle Roller Bearing (K Type)",
    targetMeshes: ["Plastic cage and needle roller bearing (K Type"],
    category: "Transmission",
    model: "Parts/Plastic cage and needle roller bearing .glb",
    anchor: [1.5, -3.0, 3.0],
    tagline: "Compact needle cage for constant mesh gear support in gearboxes",
    highlights: ["Easy assembly with open cage design", "Compact dimensions", "Robust solution"],
    features: [
      "Inner and outer needle retention",
      "Various cage designs and materials available",
      "Special needle guidance for precise cage movement",
      "Improved shifting comfort",
      "Good dry-running characteristics"
    ],
    advantages: [
      "Low installation space required",
      "High load capacity",
      "High resistance to false brinelling",
      "Less friction, noise and heat",
      "Precise control on radial clearance"
    ],
    specs: {
      "Type": "K Type — plastic cage",
      "Cage": "Open (split) or closed",
      "Application": "Constant mesh gearbox",
      "Lubrication": "Operates under poor lubrication"
    }
  },
  {
    id: "machined_needle_rna",
    label: "Machined Needle Roller Bearing RNA/NK",
    targetMeshes: ["Machined Needle roller bearing RNA/NK"],
    category: "Transmission",
    model: "Parts/Machined Needle roller bearing RNK NK.glb",
    hasExplodedView: true,
    explodeTrigger: "zoom",
    anchor: [-1.5, -3.0, 3.0],
    tagline: "Machined outer ring with high static load capacity for transmission support",
    highlights: ["Easy assembly with open cage design", "Compact dimensions", "Robust solution"],
    features: [
      "Enhanced life & durability for Transmission Application",
      "Ease of assembly",
      "Cost optimized solution"
    ],
    advantages: [
      "Low installation space required",
      "High load capacity (Very High Static Load Capacity)",
      "Less friction, noise and heat",
      "Precise control on radial clearance",
      "Increased rating life",
      "Best suited for high static load applications"
    ],
    specs: {
      "Type": "RNA/NK — machined outer ring",
      "Raceway Profile": "Special XL life",
      "Application": "Transmission gear box",
      "Load": "Very high static"
    }
  },
  {
    id: "deep_groove_ball",
    label: "Deep Groove Ball Bearings",
    targetMeshes: ["Deep Groove Ball Bearings"],
    category: "Transmission",
    model: "Parts/Deep Groove Ball Bearings.glb",
    anchor: [-0.295, -1.529, -0.605],
    tagline: "Versatile ball bearing for engine and gearbox with reduced friction",
    highlights: ["Higher mileage", "Reduced friction", "Higher lifetime with special heat treatment"],
    features: [
      "Versatile, self-retaining",
      "Simple design, robust in operation and easy to maintain",
      "Support radial & axial forces in both directions",
      "Low noise and low friction",
      "Special coating & heat treatment"
    ],
    advantages: [
      "Reduced friction",
      "Higher load rating",
      "Reduced fuel consumption",
      "Higher bearing lifetime",
      "Higher resistance against contamination"
    ],
    specs: {
      "Type": "Deep groove ball bearing",
      "Load Direction": "Radial & axial (both)",
      "Special Treatment": "Coating + heat treatment",
      "Application": "Engine & gearbox"
    }
  },

  // ── CHASSIS ──────────────────────────────────────────────────────────
  {
    id: "drawn_cup_swing",
    label: "Drawn Cup Needle Roller Bearing (Swing Arm) HK/HNH",
    targetMeshes: ["Drawn Cup Needle Roller Bearing ("],
    category: "Chassis",
    model: "Parts/Drawn Cup Needle Roller Bearing HK - HNH.glb",
    hasExplodedView: true,
    explodeTrigger: "zoom",
    anchor: [-0.068, -2.086, -0.710],
    tagline: "High load capacity needle bearing for swing arm suspension applications",
    highlights: ["High load rating capacity", "Weight saving potential", "Cost-efficient deep drawing technology"],
    features: [
      "Deep drawing technology for roller bearing outer ring",
      "Applicable for multiple applications",
      "Low noise and friction level",
      "Ease of assembly",
      "Cost effective solution"
    ],
    advantages: [
      "High load rating capacity with compact design",
      "High robustness against overload due to line contact",
      "Low radial installation space",
      "Anti rust performance with grease version"
    ],
    specs: {
      "Type": "HK / HNH",
      "Application": "Swing arm suspension",
      "Technology": "Deep drawing",
      "Load": "High radial"
    }
  },
  {
    id: "ball_bearing_abs",
    label: "Ball Bearing with ABS Encoder Sealing",
    targetMeshes: ["Ball Bearing with ABS tonner"],
    category: "Chassis",
    model: "Parts/Ball Bearing with ABS tonner.glb",
    anchor: [0.240, -2.785, 6.323],
    tagline: "Wheel bearing with integrated encoder sealing for ABS systems",
    highlights: ["Higher accuracy", "Controlled braking", "Go Digital — embedded encoder for ABS"],
    features: [
      "Encoder integrated into sealing",
      "Excellent functional feasibility and predictability",
      "Compatible with Hall and magneto-resistive sensing technologies",
      "Robust and proven technology from Automotive"
    ],
    advantages: [
      "Fewer parts & installation space at system level",
      "No additional encoder assembly required",
      "Reliable over lifetime & better protection against dirt/dust",
      "More accurate speed measurement"
    ],
    specs: {
      "Type": "Wheel bearing with encoder",
      "Sensing": "Hall / magneto-resistive",
      "Feature": "ABS encoder in sealing",
      "Technology": "Automotive grade"
    }
  },
  {
    id: "angular_contact_ball",
    label: "Angular Contact Ball Bearing",
    targetMeshes: ["Angular Contact Ball bearing"],
    category: "Chassis",
    model: "Parts/Angular Contact  Ball Bearing.glb",
    hasExplodedView: true,
    explodeTrigger: "zoom",
    anchor: [0.0, 2.5, -6.0],
    tagline: "Steering head bearing with special grease for highest resilience",
    highlights: ["Highest resilience — absorbs more shocks", "Outstanding steering feeling", "High precision balls and raceways"],
    features: [
      "Optimized internal construction",
      "Improved raceway surfaces",
      "Improved ball quality",
      "Controlled running tolerances",
      "45° contact angle",
      "Higher thrust capacity",
      "Higher load rating and service life",
      "Data Matric Code (DMC)"
    ],
    advantages: [
      "Higher rating and operating life",
      "Increased reliability",
      "Low noise and lower friction",
      "Reduced steering efforts",
      "Reduced heat generation",
      "Extended maintenance intervals",
      "Reduced overall operating costs"
    ],
    specs: {
      "Contact Angle": "45°",
      "Application": "Steering head",
      "Special Feature": "Special grease",
      "Tracking": "Data Matric Code (DMC)"
    }
  },
  {
    id: "steering_head_trb",
    label: "Steering Head Taper Roller Bearing (TRB)",
    targetMeshes: ["Steering Head TRB"],
    category: "Chassis",
    model: "Parts/Steering Head TRB.glb",
    hasExplodedView: true,
    explodeTrigger: "zoom",
    anchor: [-0.662, 1.016, 4.235],
    tagline: "High-load steering head bearing with superior shock absorption for off-road",
    highlights: ["Highest resilience — absorbs more shocks", "Higher jumps on off-road drive", "Higher load rating"],
    features: [
      "Optimized internal construction",
      "Improved raceway surfaces",
      "Controlled running tolerances",
      "Higher thrust capacity",
      "Higher load rating and service life",
      "Increased reliability",
      "Higher power density",
      "Data Matric Code (DMC)"
    ],
    advantages: [
      "Higher rating and operating life",
      "Increased reliability",
      "Low noise, lower friction",
      "Reduced steering efforts",
      "Reduced heat generation",
      "Dampen high shocks",
      "Better aesthetic"
    ],
    specs: {
      "Type": "Taper Roller Bearing",
      "Application": "Steering head",
      "Special Feature": "Shock dampening",
      "Tracking": "Data Matric Code (DMC)"
    }
  },

  // ── ELECTRIFICATION (EV) ─────────────────────────────────────────────
  {
    id: "e_motor",
    label: "48V E-Motor",
    category: "Electrification",
    model: "e_motor.glb",
    anchor: [1.5, -1.5, 4.0],
    tagline: "High-performance, cost-optimized 48V electric motor for light 2/3-wheelers",
    highlights: ["Scalable platform in power and torque", "Tailored for electric & hybrid 2/3-wheelers", "Robust distributed winding technology"],
    features: [
      "Scalable output power: Up to 10 kW",
      "Scalable output torque at motor shaft: Up to 45 Nm",
      "Max speed: 7,500–10,000 rpm",
      "Protection class: IP67",
      "Weight: Starting from 7.5 kg"
    ],
    advantages: [
      "High power density permanent magnet motor — compact yet powerful",
      "Designed to optimize magnet cost versus performance",
      "Low cogging torque",
      "Reduced phase current demand for improved energy efficiency",
      "Modular and scalable platform with optional reducer integration"
    ],
    specs: {
      "Voltage": "48 V",
      "Max Power": "Up to 10 kW",
      "Max Torque": "Up to 45 Nm",
      "Max Speed": "7,500 – 10,000 rpm",
      "Protection": "IP67",
      "Weight": "From 7.5 kg"
    }
  },
  {
    id: "edcu",
    label: "Electric Drive Control Unit (eDCU)",
    category: "Electrification",
    model: "edcu.glb",
    anchor: [1.5, -0.5, 4.5],
    tagline: "All-in-one smart controller merging motor and vehicle control for electric 2-wheelers",
    highlights: ["Scalable platform for wide range of eMotor requirements", "Tailored for electric & hybrid 2/3-wheelers", "Built on Schaeffler automotive expertise"],
    features: [
      "Input voltage: 39 V to 58 V",
      "Scalable inverter performance: Up to 210 Arms phase current",
      "Protection class: IP67",
      "Functional safety: Up to ASIL-B / MSIL-C",
      "Interface: CAN"
    ],
    advantages: [
      "Seamless powertrain integration: From driver input to motor control",
      "Versatile motor control: Supports large variety of machine types",
      "Smart battery energy management for removable multi-battery systems",
      "Compact & efficient — saves space without compromising performance",
      "Cost effective design"
    ],
    specs: {
      "Input Voltage": "39 V – 58 V",
      "Phase Current": "Up to 210 Arms",
      "Protection": "IP67",
      "Safety": "ASIL-B / MSIL-C",
      "Interface": "CAN"
    }
  },
  {
    id: "irps",
    label: "Inductive Rotor Position Sensor (iRPS)",
    category: "Electrification",
    model: "irps.glb",
    anchor: [0.5, -1.5, 4.0],
    tagline: "Compact magnet-free inductive sensor for high-speed e-motor positioning",
    highlights: ["Magnet-free — no rare earth elements", "Functional safety up to ASIL-D", "Active analog signal — no demodulation needed"],
    features: [
      "Temperature: -40°C up to 150°C (160°C peak)",
      "Supply Voltage: 5 V",
      "Supply Current: < 20 mA",
      "Output signal: Analog Sine / Cosine",
      "Speed: up to 60 krpm (for 4 pairs of pole)",
      "Accuracy: < ±0.5° electrical",
      "Safety: ASIL C, ASIL D capable"
    ],
    advantages: [
      "Immune to low frequency magnetic fields",
      "Magnet-free technology without rare earth elements",
      "Light weight for sensor and target",
      "Configurable to any pole pair number",
      "Various mechanical integrations and packaging possible"
    ],
    specs: {
      "Type": "Inductive, through shaft",
      "Max Speed": "60,000 rpm",
      "Accuracy": "< ±0.5° electrical",
      "Safety": "ASIL-C / ASIL-D",
      "Supply": "5 V / < 20 mA",
      "Temp Range": "-40°C to +150°C"
    }
  },
  {
    id: "bms",
    label: "Battery Management System (BMS)",
    category: "Electrification",
    model: "bms.glb",
    anchor: [0.0, 3.0, 4.5],
    tagline: "Smart all-in-one 48V BMS merging battery management for small to medium electric 2/3-wheelers",
    highlights: ["High functionality integration", "Functional safety & cybersecurity state of the art", "Leveraging Schaeffler passenger car platforms"],
    features: [
      "In-series cell connection: Up to 14s (NMC) / 16s (LFP)",
      "Continuous current: 145 A",
      "Peak current: 210 A (30 s)",
      "Current accuracy: 0.1 A / 1% within [-300 A; 300 A] by shunt resistor",
      "Circuit breaker: Mosfets",
      "Cell balancing: 150 mA (passive)",
      "Communication: 2 CAN modules",
      "Safety & Security: ISO 26262 (ASIL C) & UNECE R155"
    ],
    advantages: [
      "Single PCB including switching, current sensing, balancing and monitoring",
      "Compatible with internal or external BMS supply",
      "Scalable to different powers, cells and chemistries",
      "Multi-batteries compatible",
      "Cost-effective solution with automotive quality standards"
    ],
    specs: {
      "Voltage": "48 V",
      "Cells": "Up to 14s NMC / 16s LFP",
      "Continuous Current": "145 A",
      "Peak Current": "210 A (30 s)",
      "Safety": "ISO 26262 ASIL-C, UNECE R155",
      "Interface": "2x CAN"
    }
  }
];

export default components;

export const componentMap = Object.fromEntries(components.map(c => [c.id, c]));

export const categories = [...new Set(components.map(c => c.category))];
