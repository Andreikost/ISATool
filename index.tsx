/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

interface Instrument {
    id: string;
    category: 'sensor' | 'actuator' | 'controller-indicator';
    code: string;
    name: string;
    description: string;
    icon: string;
    detailsContent: string;
    controllerLogic: string;
    hmiRepresentation: string;
}

const isaData: Instrument[] = [
    // --- SENSORS ---
    {
        id: 'TT',
        category: 'sensor',
        code: 'TT',
        name: 'Temperature Transmitter',
        description: 'Measures the temperature of a process and transmits it.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">T</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">T</text></svg>',
        detailsContent: `### Temperature Transmitter (TT)
A Temperature Transmitter is a device that measures the temperature of a process and converts this measurement into a standardized electrical signal (usually 4-20 mA or a digital signal). This signal is transmitted to a control system, such as a PLC or DCS, for monitoring and control.

### Operating Principle
It uses a primary sensor (like a thermocouple or RTD) to detect temperature. The transmitter's internal electronics amplify, linearize, and convert the sensor's signal into the standard output signal.

### Common Applications
Temperature control in chemical reactors, furnaces, HVAC systems, and monitoring the temperature of fluids in pipes and tanks.`,
        controllerLogic: `(* PLC Standard Code - Structured Text (ST) *)
FUNCTION_BLOCK FB_TemperatureTransmitter
VAR_INPUT
    Raw_Input : INT; (* Raw input from analog card (e.g., 0-27648) *)
    Min_Raw : INT := 0;
    Max_Raw : INT := 27648;
    Min_EU : REAL := 0.0; (* Engineering Units Min (e.g., 0 °C) *)
    Max_EU : REAL := 150.0; (* Engineering Units Max (e.g., 150 °C) *)
    High_Alarm_SP : REAL := 120.0;
    Low_Alarm_SP : REAL := 10.0;
    Enable : BOOL := TRUE;
END_VAR
VAR_OUTPUT
    Process_Value : REAL; (* Scaled process value in EU *)
    High_Alarm : BOOL;
    Low_Alarm : BOOL;
    Fault : BOOL;
END_VAR
VAR
    Scale_Factor : REAL;
END_VAR

IF Enable THEN
    (* Check for sensor fault (out of range) *)
    IF Raw_Input < Min_Raw OR Raw_Input > Max_Raw THEN
        Fault := TRUE;
        Process_Value := 0.0;
        High_Alarm := FALSE;
        Low_Alarm := FALSE;
    ELSE
        Fault := FALSE;
        (* Scaling logic *)
        Scale_Factor := (Max_EU - Min_EU) / REAL_TO_INT(Max_Raw - Min_Raw);
        Process_Value := (INT_TO_REAL(Raw_Input - Min_Raw) * Scale_Factor) + Min_EU;

        (* Alarm logic *)
        High_Alarm := Process_Value > High_Alarm_SP;
        Low_Alarm := Process_Value < Low_Alarm_SP;
    END_IF;
ELSE
    Process_Value := 0.0;
    High_Alarm := FALSE;
    Low_Alarm := FALSE;
    Fault := TRUE;
END_IF;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">TEMPERATURE</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">85.3</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">°C</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">TT-101</text>
</svg>`
    },
    {
        id: 'PT',
        category: 'sensor',
        code: 'PT',
        name: 'Pressure Transmitter',
        description: 'Measures the pressure of a fluid and transmits it.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">P</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">T</text></svg>',
        detailsContent: `### Pressure Transmitter (PT)
A Pressure Transmitter measures the pressure of a gas or liquid within a system and converts it into a proportional electrical signal. This signal is sent to a control system for monitoring and automatic decision-making.

### Operating Principle
It typically uses a diaphragm or a piezoresistive sensor that deforms under the fluid's pressure. This deformation results in a change in electrical resistance, which is processed by the transmitter's electronics to generate the output signal.

### Common Applications
Pressure measurement in pipes, tanks, reactors, hydraulic, and pneumatic systems.`,
        controllerLogic: `(* PLC Standard Code - Structured Text (ST) *)
FUNCTION_BLOCK FB_PressureTransmitter
VAR_INPUT
    Raw_Input : INT; (* Raw input from analog card (e.g., 0-27648) *)
    Min_Raw : INT := 0;
    Max_Raw : INT := 27648;
    Min_EU : REAL := 0.0; (* Engineering Units Min (e.g., 0 bar) *)
    Max_EU : REAL := 10.0; (* Engineering Units Max (e.g., 10 bar) *)
    HH_Alarm_SP : REAL := 9.5;
    H_Alarm_SP : REAL := 9.0;
    L_Alarm_SP : REAL := 1.0;
    LL_Alarm_SP : REAL := 0.5;
    Enable : BOOL := TRUE;
END_VAR
VAR_OUTPUT
    Process_Value : REAL; (* Scaled process value in EU *)
    HH_Alarm : BOOL;
    H_Alarm : BOOL;
    L_Alarm : BOOL;
    LL_Alarm : BOOL;
    Fault : BOOL;
END_VAR
VAR
    Scale_Factor : REAL;
END_VAR

IF Enable THEN
    IF Raw_Input < Min_Raw OR Raw_Input > Max_Raw THEN
        Fault := TRUE;
        Process_Value := 0.0;
        HH_Alarm := FALSE; H_Alarm := FALSE; L_Alarm := FALSE; LL_Alarm := FALSE;
    ELSE
        Fault := FALSE;
        Scale_Factor := (Max_EU - Min_EU) / REAL_TO_INT(Max_Raw - Min_Raw);
        Process_Value := (INT_TO_REAL(Raw_Input - Min_Raw) * Scale_Factor) + Min_EU;
        HH_Alarm := Process_Value > HH_Alarm_SP;
        H_Alarm := Process_Value > H_Alarm_SP;
        L_Alarm := Process_Value < L_Alarm_SP;
        LL_Alarm := Process_Value < LL_Alarm_SP;
    END_IF;
ELSE
    Process_Value := 0.0;
    HH_Alarm := FALSE; H_Alarm := FALSE; L_Alarm := FALSE; LL_Alarm := FALSE;
    Fault := TRUE;
END_IF;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">PRESSURE</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">5.21</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">bar</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">PT-205</text>
</svg>`
    },
    {
        id: 'LT',
        category: 'sensor',
        code: 'LT',
        name: 'Level Transmitter',
        description: 'Measures the level of a liquid or solid in a tank and transmits it.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">L</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">T</text></svg>',
        detailsContent: `### Level Transmitter (LT)
A Level Transmitter is used to measure the height of a liquid or solid material within a container (tank, silo, etc.) and transmit that information as an electrical signal. It is crucial for inventory control and for preventing tank overflows or emptying.

### Operating Principle
There are various technologies, such as differential pressure (measures hydrostatic pressure), radar, ultrasound, capacitance, or floats. The transmitter converts the sensor's measurement into a standard signal.

### Common Applications
Level control in storage tanks for chemicals, water, food, and in silos for grains or powders.`,
        controllerLogic: `(* PLC Standard Code - Structured Text (ST) *)
FUNCTION_BLOCK FB_LevelTransmitter
VAR_INPUT
    Raw_Input : INT; (* Raw input from analog card *)
    Min_Raw : INT := 0;
    Max_Raw : INT := 27648;
    Min_EU : REAL := 0.0; (* Engineering Units Min (e.g., 0 %) *)
    Max_EU : REAL := 100.0; (* Engineering Units Max (e.g., 100 %) *)
    High_Alarm_SP : REAL := 95.0;
    Low_Alarm_SP : REAL := 15.0;
    Enable : BOOL := TRUE;
END_VAR
VAR_OUTPUT
    Level_Percentage : REAL;
    High_Alarm : BOOL;
    Low_Alarm : BOOL;
    Fault : BOOL;
END_VAR

IF Enable THEN
    IF Raw_Input < Min_Raw OR Raw_Input > Max_Raw THEN
        Fault := TRUE;
        Level_Percentage := 0.0;
    ELSE
        Fault := FALSE;
        Level_Percentage := (INT_TO_REAL(Raw_Input - Min_Raw) / INT_TO_REAL(Max_Raw - Min_Raw)) * (Max_EU - Min_EU) + Min_EU;
        High_Alarm := Level_Percentage > High_Alarm_SP;
        Low_Alarm := Level_Percentage < Low_Alarm_SP;
    END_IF;
ELSE
    Level_Percentage := 0.0;
    Fault := TRUE;
END_IF;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">TANK LEVEL</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">72.5</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">%</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">LT-510</text>
</svg>`
    },
    {
        id: 'FT',
        category: 'sensor',
        code: 'FT',
        name: 'Flow Transmitter',
        description: 'Measures the flow rate of a fluid in a pipe and transmits it.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">F</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">T</text></svg>',
        detailsContent: `### Flow Transmitter (FT)
A Flow Transmitter measures the amount of a fluid passing through a pipe in a given period of time (flow rate) and converts it into an electrical signal.

### Operating Principle
They can be based on different principles, such as differential pressure across an orifice plate, vortex shedding frequency (vortex), or electromagnetic or mass measurement (Coriolis). The electronics convert this physical measurement into a 4-20 mA or digital signal.

### Common Applications
Measurement of water, steam, gas, chemical, and fuel flow in industrial processes for dosing control and billing.`,
        controllerLogic: `(* PLC Standard Code - Structured Text (ST) *)
FUNCTION_BLOCK FB_FlowTransmitter
VAR_INPUT
    Raw_Input : INT;
    Min_Raw : INT := 0;
    Max_Raw : INT := 27648;
    Min_EU : REAL := 0.0; (* e.g., 0 m³/h *)
    Max_EU : REAL := 500.0; (* e.g., 500 m³/h *)
    Enable : BOOL := TRUE;
END_VAR
VAR_OUTPUT
    Flow_Rate : REAL;
    Fault : BOOL;
END_VAR

IF Enable THEN
    IF Raw_Input < Min_Raw OR Raw_Input > Max_Raw THEN
        Fault := TRUE;
        Flow_Rate := 0.0;
    ELSE
        Fault := FALSE;
        Flow_Rate := (INT_TO_REAL(Raw_Input - Min_Raw) / INT_TO_REAL(Max_Raw - Min_Raw)) * (Max_EU - Min_EU) + Min_EU;
    END_IF;
ELSE
    Flow_Rate := 0.0;
    Fault := TRUE;
END_IF;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">FLOW RATE</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">254.1</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">m³/h</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">FT-330</text>
</svg>`
    },
    {
        id: 'AT',
        category: 'sensor',
        code: 'AT',
        name: 'Analytical Transmitter',
        description: 'Measures a chemical property (pH, conductivity, etc.).',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">A</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">T</text></svg>',
        detailsContent: `### Analytical Transmitter (AT)
An Analytical Transmitter measures a specific chemical or physical property of a substance, such as pH, conductivity, dissolved oxygen (DO), or oxidation-reduction potential (ORP).

### Operating Principle
It uses a specific probe or electrode for the variable to be measured. The probe generates a small electrical signal (e.g., a voltage in the case of pH) which the transmitter converts into a standard and robust output signal.

### Common Applications
Wastewater treatment, quality control in the food and pharmaceutical industries, and monitoring of chemical processes.`,
        controllerLogic: `(* PLC Standard Code - Structured Text (ST) for a generic AT, e.g., Conductivity *)
FUNCTION_BLOCK FB_AnalyticalTransmitter
VAR_INPUT
    Raw_Input : INT;
    Min_Raw : INT := 0;
    Max_Raw : INT := 27648;
    Min_EU : REAL := 0.0; (* e.g., 0 µS/cm *)
    Max_EU : REAL := 2000.0; (* e.g., 2000 µS/cm *)
    High_Alarm_SP : REAL := 1800.0;
    Enable : BOOL := TRUE;
END_VAR
VAR_OUTPUT
    Process_Value : REAL;
    High_Alarm : BOOL;
    Fault : BOOL;
END_VAR

IF Enable THEN
    IF Raw_Input < Min_Raw OR Raw_Input > Max_Raw THEN
        Fault := TRUE;
        Process_Value := 0.0;
    ELSE
        Fault := FALSE;
        Process_Value := (INT_TO_REAL(Raw_Input - Min_Raw) / INT_TO_REAL(Max_Raw - Min_Raw)) * (Max_EU - Min_EU) + Min_EU;
        High_Alarm := Process_Value > High_Alarm_SP;
    END_IF;
ELSE
    Process_Value := 0.0;
    Fault := TRUE;
END_IF;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">CONDUCTIVITY</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">1520</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">µS/cm</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">AT-601</text>
</svg>`
    },
     {
        id: 'pHT',
        category: 'sensor',
        code: 'pHT',
        name: 'pH Transmitter',
        description: 'Specifically measures the acidity or alkalinity of a solution.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="6" font-family="sans-serif" font-weight="bold" fill="currentColor">pH</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">T</text></svg>',
        detailsContent: `### pH Transmitter (pHT)
A pH Transmitter is a specific type of analytical transmitter dedicated to measuring the acidity or alkalinity of an aqueous solution. It is a fundamental instrument in water treatment and many chemical processes.

### Operating Principle
It uses a pH electrode that generates a millivolt voltage proportional to the solution's pH. Because this signal is very weak and has high impedance, the transmitter amplifies it, compensates for temperature (using a separate temperature probe), and converts it into a robust 4-20 mA signal.

### Common Applications
pH control in chemical reactors, monitoring of effluents in water treatment plants, and quality control in the food, beverage, and pharmaceutical industries.`,
        controllerLogic: `(* PLC Standard Code - Structured Text (ST) for pH *)
FUNCTION_BLOCK FB_pH_Transmitter
VAR_INPUT
    Raw_Input : INT;
    Min_Raw : INT := 0;
    Max_Raw : INT := 27648;
    Min_EU : REAL := 0.0; (* pH 0 *)
    Max_EU : REAL := 14.0; (* pH 14 *)
    High_Alarm_SP : REAL := 9.0;
    Low_Alarm_SP : REAL := 5.0;
    Enable : BOOL := TRUE;
END_VAR
VAR_OUTPUT
    pH_Value : REAL;
    High_Alarm : BOOL;
    Low_Alarm : BOOL;
    Fault : BOOL;
END_VAR

IF Enable THEN
    IF Raw_Input < Min_Raw OR Raw_Input > Max_Raw THEN
        Fault := TRUE;
        pH_Value := 7.0; (* Neutral value on fault *)
    ELSE
        Fault := FALSE;
        pH_Value := (INT_TO_REAL(Raw_Input - Min_Raw) / INT_TO_REAL(Max_Raw - Min_Raw)) * (Max_EU - Min_EU) + Min_EU;
        High_Alarm := pH_Value > High_Alarm_SP;
        Low_Alarm := pH_Value < Low_Alarm_SP;
    END_IF;
ELSE
    pH_Value := 7.0;
    Fault := TRUE;
END_IF;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">pH LEVEL</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">7.12</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">pH</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">AIT-602</text>
</svg>`
    },
    {
        id: 'ZT',
        category: 'sensor',
        code: 'ZT',
        name: 'Position Transmitter',
        description: 'Measures the position of an object, such as a valve.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">Z</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">T</text></svg>',
        detailsContent: `### Position Transmitter (ZT)
A Position Transmitter is used to determine the position of a mechanical element, commonly the stem of a control valve. It provides feedback to the control system to confirm that the valve has moved to the desired point.

### Operating Principle
It can be of the contact type (using a potentiometer) or non-contact (using magnetic effects like Hall or LVDT). It measures linear or angular displacement and converts it into an electrical signal.

### Common Applications
Confirming the opening or closing of control valves, monitoring the position of dampers or linear actuators.`,
        controllerLogic: `(* PLC Standard Code - Structured Text (ST) for Valve Position *)
FUNCTION_BLOCK FB_PositionTransmitter
VAR_INPUT
    Raw_Input : INT;
    Min_Raw : INT := 0;
    Max_Raw : INT := 27648;
    Min_EU : REAL := 0.0; (* 0% open *)
    Max_EU : REAL := 100.0; (* 100% open *)
    Enable : BOOL := TRUE;
END_VAR
VAR_OUTPUT
    Position : REAL;
    Is_Open : BOOL;
    Is_Closed : BOOL;
    Fault : BOOL;
END_VAR

IF Enable THEN
    IF Raw_Input < Min_Raw OR Raw_Input > Max_Raw THEN
        Fault := TRUE;
        Position := 0.0;
    ELSE
        Fault := FALSE;
        Position := (INT_TO_REAL(Raw_Input - Min_Raw) / INT_TO_REAL(Max_Raw - Min_Raw)) * (Max_EU - Min_EU) + Min_EU;
        Is_Open := Position > 99.0;
        Is_Closed := Position < 1.0;
    END_IF;
ELSE
    Position := 0.0;
    Fault := TRUE;
END_IF;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">VALVE POSITION</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">100.0</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">%</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">ZT-451</text>
</svg>`
    },
    {
        id: 'YT',
        category: 'sensor',
        code: 'YT',
        name: 'Vibration Transmitter',
        description: 'Measures the vibration or oscillation of rotating machinery.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">Y</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">T</text></svg>',
        detailsContent: `### Vibration Transmitter (YT)
A Vibration Transmitter measures the mechanical oscillations of rotating equipment like motors, pumps, or turbines. It is a key tool in predictive maintenance for detecting impending failures.

### Operating Principle
It uses accelerometers or proximity sensors to capture the vibration. The transmitter's electronics process this signal to obtain parameters such as the velocity or acceleration of the vibration and transmit it to the control system.

### Common Applications
Monitoring the health of critical machinery to detect imbalances, misalignments, or bearing problems before they cause a major failure.`,
        controllerLogic: `(* PLC Standard Code - Structured Text (ST) for Vibration *)
FUNCTION_BLOCK FB_VibrationTransmitter
VAR_INPUT
    Raw_Input : INT;
    Min_Raw : INT := 0;
    Max_Raw : INT := 27648;
    Min_EU : REAL := 0.0; (* e.g., 0 mm/s *)
    Max_EU : REAL := 25.0; (* e.g., 25 mm/s *)
    High_Alarm_SP : REAL := 15.0;
    High_Trip_SP : REAL := 20.0;
    Enable : BOOL := TRUE;
END_VAR
VAR_OUTPUT
    Vibration_Value : REAL;
    High_Alarm : BOOL;
    High_Trip : BOOL;
    Fault : BOOL;
END_VAR

IF Enable THEN
    IF Raw_Input < Min_Raw OR Raw_Input > Max_Raw THEN
        Fault := TRUE;
        Vibration_Value := 0.0;
    ELSE
        Fault := FALSE;
        Vibration_Value := (INT_TO_REAL(Raw_Input - Min_Raw) / INT_TO_REAL(Max_Raw - Min_Raw)) * (Max_EU - Min_EU) + Min_EU;
        High_Alarm := Vibration_Value > High_Alarm_SP;
        High_Trip := Vibration_Value > High_Trip_SP;
    END_IF;
ELSE
    Vibration_Value := 0.0;
    Fault := TRUE;
END_IF;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">MOTOR VIBRATION</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">4.8</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">mm/s</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">YT-101A</text>
</svg>`
    },
    {
        id: 'ST',
        category: 'sensor',
        code: 'ST',
        name: 'Speed Transmitter',
        description: 'Measures the rotational speed (RPM) of equipment.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">S</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">T</text></svg>',
        detailsContent: `### Speed Transmitter (ST)
A Speed Transmitter measures the rotational speed of a shaft, commonly expressed in revolutions per minute (RPM). It is a crucial sensor for monitoring and controlling rotating machinery such as motors, turbines, and compressors.

### Operating Principle
They often use proximity sensors (inductive or Hall effect) that detect the passage of gear teeth or marks on the rotating shaft. The transmitter counts these pulses over a time interval and calculates the rotational speed, converting it into an analog (4-20 mA) or digital signal.

### Common Applications
Speed control of motors using variable frequency drives (VFDs), overspeed protection in turbines, and monitoring the performance of pumps and fans.`,
        controllerLogic: `(* PLC Standard Code - Structured Text (ST) for Speed *)
FUNCTION_BLOCK FB_SpeedTransmitter
VAR_INPUT
    Pulse_Input : DINT; (* Accumulated pulses from high-speed counter *)
    Time_Base_Sec : REAL := 1.0; (* Time period over which pulses are counted *)
    Pulses_Per_Revolution : INT := 60;
    Enable : BOOL := TRUE;
END_VAR
VAR_OUTPUT
    Speed_RPM : REAL;
    Fault : BOOL;
END_VAR
VAR
    Delta_Pulses : DINT;
    Last_Pulses : DINT := 0;
END_VAR

IF Enable THEN
    Fault := FALSE;
    Delta_Pulses := Pulse_Input - Last_Pulses;
    IF Time_Base_Sec > 0.0 AND Pulses_Per_Revolution > 0 THEN
        Speed_RPM := (DINT_TO_REAL(Delta_Pulses) / Pulses_Per_Revolution) / Time_Base_Sec * 60.0;
    ELSE
        Speed_RPM := 0.0;
        Fault := TRUE;
    END_IF;
    Last_Pulses := Pulse_Input;
ELSE
    Speed_RPM := 0.0;
    Fault := TRUE;
END_IF;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">MOTOR SPEED</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">1485</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">RPM</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">ST-101A</text>
</svg>`
    },
    {
        id: 'WT',
        category: 'sensor',
        code: 'WT',
        name: 'Weight Transmitter',
        description: 'Measures weight or force, often using load cells.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">W</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">T</text></svg>',
        detailsContent: `### Weight Transmitter (WT)
A Weight Transmitter converts the signal from one or more load cells (force sensors) into a standardized process signal. It measures the weight of material in tanks, silos, or on conveyor belts.

### Operating Principle
Load cells deform under weight, generating a small electrical signal. The weight transmitter (often called a weight indicator) amplifies, filters, and converts this signal into a readable weight value and transmits it to a control system.

### Common Applications
Batch dosing systems, inventory control in silos, mass flow measurement on conveyor belts, and truck weighing systems.`,
        controllerLogic: `(* PLC Standard Code - Structured Text (ST) for Weight *)
FUNCTION_BLOCK FB_WeightTransmitter
VAR_INPUT
    Raw_Input : INT;
    Min_Raw : INT := 0;
    Max_Raw : INT := 27648;
    Min_EU : REAL := 0.0; (* e.g., 0 kg *)
    Max_EU : REAL := 10000.0; (* e.g., 10000 kg *)
    Enable : BOOL := TRUE;
END_VAR
VAR_OUTPUT
    Weight_Value : REAL;
    Fault : BOOL;
END_VAR

IF Enable THEN
    IF Raw_Input < Min_Raw OR Raw_Input > Max_Raw THEN
        Fault := TRUE;
        Weight_Value := 0.0;
    ELSE
        Fault := FALSE;
        Weight_Value := (INT_TO_REAL(Raw_Input - Min_Raw) / INT_TO_REAL(Max_Raw - Min_Raw)) * (Max_EU - Min_EU) + Min_EU;
    END_IF;
ELSE
    Weight_Value := 0.0;
    Fault := TRUE;
END_IF;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">SILO WEIGHT</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">8753</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">kg</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">WT-510</text>
</svg>`
    },
    {
        id: 'RT',
        category: 'sensor',
        code: 'RT',
        name: 'Radiation Transmitter',
        description: 'Measures radiation to determine level, density, or thickness.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">R</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">T</text></svg>',
        detailsContent: `### Radiation Transmitter (RT)
A Radiation Transmitter uses a low-intensity radioactive source and a detector to perform non-contact measurements. The amount of radiation that reaches the detector is attenuated by the process material, which allows for inferring variables such as level, density, or thickness.

### Operating Principle
A source (usually Cesium-137 or Cobalt-60) emits gamma rays. On the other side of the vessel or pipe, a detector measures the intensity of the received radiation. The transmitter calculates the process variable based on the attenuation of this radiation.

### Common Applications
Level measurement in tanks with extreme conditions (high temperature, pressure, corrosive fluids), density measurement of slurries or pulps, and thickness measurement in rolling mills.`,
        controllerLogic: `(* PLC Standard Code - Structured Text (ST) *)
(* Note: Radiation-based instruments often have complex, proprietary calculations. *)
(* This is a simplified linear scaling example. *)
FUNCTION_BLOCK FB_RadiationTransmitter
VAR_INPUT
    Raw_Input : INT; (* Raw detector signal *)
    Min_Raw : INT := 0; (* Empty condition count *)
    Max_Raw : INT := 27648; (* Full condition count - signal is often inverse *)
    Min_EU : REAL := 0.0; (* e.g., 0% Level *)
    Max_EU : REAL := 100.0; (* e.g., 100% Level *)
    Enable : BOOL := TRUE;
END_VAR
VAR_OUTPUT
    Process_Value : REAL;
    Fault : BOOL;
END_VAR

IF Enable THEN
    (* Radiation measurement is often inverse: higher count = lower level *)
    IF Raw_Input < Min_Raw OR Raw_Input > Max_Raw THEN
        Fault := TRUE;
        Process_Value := 0.0;
    ELSE
        Fault := FALSE;
        Process_Value := 100.0 - ((INT_TO_REAL(Raw_Input - Min_Raw) / INT_TO_REAL(Max_Raw - Min_Raw)) * (Max_EU - Min_EU) + Min_EU);
    END_IF;
ELSE
    Process_Value := 0.0;
    Fault := TRUE;
END_IF;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">COKE DRUM LEVEL</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">65.2</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">%</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">RT-801</text>
</svg>`
    },
    {
        id: 'TE',
        category: 'sensor',
        code: 'TE',
        name: 'Temperature Element',
        description: 'Primary sensor that detects temperature (e.g., thermocouple, RTD).',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">T</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">E</text></svg>',
        detailsContent: `### Temperature Element (TE)
A Temperature Element is the primary sensor that is in direct contact with the process to detect its temperature. It does not transmit a standardized signal by itself, but rather generates a signal that must be interpreted by a transmitter (TT) or a controller (TC).

### Common Types
- **Thermocouple:** Formed by the junction of two different metals that generate a small voltage proportional to the temperature.
- **RTD (Resistance Temperature Detector):** Usually made of platinum (Pt100), its electrical resistance changes predictably with temperature.

### Common Applications
It is the fundamental component in any temperature measurement loop.`,
        controllerLogic: `(* A Temperature Element (TE) is a primary sensor. It does not have its own logic block. *)
(* Instead, its signal is an INPUT to a transmitter (TT) or a temperature input card. *)
(* The logic shown for the Temperature Transmitter (TT) is what processes the signal originating from a TE. *)
(* Therefore, no separate controller logic is shown for the TE itself. *)

COMMENT "TE provides the raw physical signal (mV or Ohms) to a TT or an Analog Input card.";`,
        hmiRepresentation: `<!-- A Temperature Element (TE) is a field device without a direct HMI representation. -->
<!-- Its value is displayed through an indicator (TI) or used by a controller (TC). -->
<!-- This graphic shows how its value would be presented on an HMI via a TI. -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">BEARING TEMPERATURE</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">68.0</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">°C</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">TI-101B (from TE-101B)</text>
</svg>`
    },
    {
        id: 'PE',
        category: 'sensor',
        code: 'PE',
        name: 'Pressure Element',
        description: 'Primary sensor that detects pressure (e.g., diaphragm).',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">P</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">E</text></svg>',
        detailsContent: `### Pressure Element (PE)
A Pressure Element is the sensing component that converts the force exerted by a fluid (pressure) into a mechanical displacement or an initial electrical signal. It is the fundamental part of a pressure gauge, pressure switch, or pressure transmitter.

### Common Types
- **Bourdon Tube:** A curved tube that tends to straighten with pressure.
- **Diaphragm:** A flexible membrane that deforms.
- **Piezoresistive Cell:** A semiconductor material whose resistance changes when deformed by pressure.

### Common Applications
Main component in all pressure measurement devices.`,
        controllerLogic: `(* A Pressure Element (PE) is the primary sensing part of a pressure instrument. *)
(* It does not have controller logic on its own. Its output is processed by a PT, PI, or PC. *)
(* The logic shown for the Pressure Transmitter (PT) is what handles the signal from a PE. *)

COMMENT "PE provides the raw physical signal to a PT or pressure gauge.";`,
        hmiRepresentation: `<!-- A Pressure Element (PE) is a physical component within a larger instrument. -->
<!-- It does not have a unique HMI symbol. Its value is displayed via a PI. -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">PUMP DISCHARGE PRESS.</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">8.32</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">bar</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">PI-205 (from PE-205)</text>
</svg>`
    },
    {
        id: 'LE',
        category: 'sensor',
        code: 'LE',
        name: 'Level Element',
        description: 'Primary sensor that detects the level (e.g., float, electrode).',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">L</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">E</text></svg>',
        detailsContent: `### Level Element (LE)
A Level Element is the primary sensor that detects the height of the material in a vessel. Its output can be a direct indication or a signal that a transmitter converts to an industrial standard.

### Common Types
- **Float:** A buoyant object that rises and falls with the liquid level.
- **Conductivity Probes:** Detect the presence of a conductive liquid at different heights.
- **Sight Glass:** A simple transparent tube that shows the level directly.

### Common Applications
Level detection in tanks, cisterns, and reservoirs.`,
        controllerLogic: `(* A Level Element (LE) is a primary sensor. *)
(* It does not have its own logic block in the PLC. *)
(* Its signal is used by a Level Transmitter (LT) or a Level Switch (LSL/LSH). *)
(* The logic for those devices applies. *)

COMMENT "LE provides the raw physical signal (e.g., position, capacitance) to an LT or LS.";`,
        hmiRepresentation: `<!-- A Level Element (LE) is a sensor component. -->
<!-- Its measurement is shown on an HMI through a Level Indicator (LI). -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">SUMP LEVEL</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">45.1</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">%</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">LI-511 (from LE-511)</text>
</svg>`
    },
    {
        id: 'FE',
        category: 'sensor',
        code: 'FE',
        name: 'Flow Element',
        description: 'Primary sensor that detects flow (e.g., orifice plate).',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">F</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">E</text></svg>',
        detailsContent: `### Flow Element (FE)
A Flow Element is a device that is inserted into a pipe and generates a measurable physical change in response to the fluid's flow. This change is then measured by a transmitter to calculate the flow rate.

### Common Types
- **Orifice Plate:** A plate with a hole that creates a pressure drop proportional to the square of the flow rate.
- **Venturi Tube:** A gradual narrowing that also generates a pressure drop.
- **Turbine:** A propeller that rotates at a speed proportional to the flow.

### Common Applications
Flow measurement in combination with a differential pressure transmitter.`,
        controllerLogic: `(* A Flow Element (FE) creates a condition (e.g., a pressure drop) measured by a transmitter. *)
(* It does not have its own logic. *)
(* If using a differential pressure FE, a DP transmitter's signal needs square root extraction. *)
FUNCTION_BLOCK FB_DP_Flow
VAR_INPUT
    DP_Raw_Input : INT; (* DP from transmitter *)
    Min_Raw : INT := 0;
    Max_Raw : INT := 27648;
    Max_Flow_EU : REAL := 500.0; (* Flow at Max DP *)
END_VAR
VAR_OUTPUT
    Flow_Rate : REAL;
END_VAR
VAR
    Scaled_DP : REAL;
END_VAR

    Scaled_DP := INT_TO_REAL(DP_Raw_Input) / INT_TO_REAL(Max_Raw);
    IF Scaled_DP < 0.0 THEN Scaled_DP := 0.0; END_IF;
    Flow_Rate := SQRT(Scaled_DP) * Max_Flow_EU;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<!-- A Flow Element (FE) is a field device. -->
<!-- Its calculated value is shown via a Flow Indicator (FI). -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">STEAM FLOW</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">12.8</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">T/h</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">FI-331 (from FE-331)</text>
</svg>`
    },
    // --- ACTUATORS ---
    {
        id: 'FV',
        category: 'actuator',
        code: 'FV',
        name: 'Flow Valve',
        description: 'Control valve that regulates the flow of a fluid.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">F</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">V</text></svg>',
        detailsContent: `### Flow Valve (FV)
A Flow Valve, also known as a control valve, is an actuator that modulates the passage of a fluid in a pipe. It can be positioned anywhere between fully open and fully closed to precisely regulate flow, pressure, level, or temperature.

### Components
- **Body:** The part that contains the fluid.
- **Plug/Disc:** The internal element that moves to restrict flow.
- **Actuator:** The mechanism (pneumatic, electric, or hydraulic) that moves the plug.
- **Positioner:** An intelligent device that ensures the valve moves to the exact position commanded by the controller.

### Common Applications
It is the most common final control element in the process industry.`,
        controllerLogic: `(* PLC Standard Code - Structured Text (ST) for Analog Valve Control *)
FUNCTION_BLOCK FB_AnalogValve
VAR_INPUT
    Control_Output : REAL; (* From PID controller, 0-100% *)
    Min_Out_Raw : INT := 0;
    Max_Out_Raw : INT := 27648;
    Enable : BOOL := TRUE;
END_VAR
VAR_OUTPUT
    Analog_Output : INT; (* To analog output card *)
END_VAR
VAR
    Scaled_Output : REAL;
END_VAR

IF Enable THEN
    IF Control_Output > 100.0 THEN
        Scaled_Output := 100.0;
    ELSIF Control_Output < 0.0 THEN
        Scaled_Output := 0.0;
    ELSE
        Scaled_Output := Control_Output;
    END_IF;

    Analog_Output := REAL_TO_INT(Scaled_Output / 100.0 * INT_TO_REAL(Max_Out_Raw - Min_Out_Raw)) + Min_Out_Raw;
ELSE
    Analog_Output := Min_Out_Raw; (* Fail-safe position, assumes fail-closed *)
END_IF;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
    <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
    <text x="100" y="25" text-anchor="middle" font-size="12" fill="#ccc">CONTROL VALVE</text>
    <text x="100" y="40" text-anchor="middle" font-size="10" fill="#888">FV-101</text>

    <!-- Output -->
    <text x="40" y="60" text-anchor="middle" font-size="10" fill="#ccc">OUT</text>
    <text id="out_val" x="40" y="80" text-anchor="middle" font-size="16" font-weight="bold" fill="#03a9f4">75.2%</text>

    <!-- Feedback -->
    <text x="100" y="60" text-anchor="middle" font-size="10" fill="#ccc">POS</text>
    <text id="pos_val" x="100" y="80" text-anchor="middle" font-size="16" font-weight="bold" fill="#ccc">75.1%</text>

    <!-- Mode -->
    <text x="160" y="60" text-anchor="middle" font-size="10" fill="#ccc">MODE</text>
    <text id="mode_val" x="160" y="80" text-anchor="middle" font-size="16" font-weight="bold" fill="#4caf50">AUTO</text>
</svg>`
    },
    {
        id: 'XV',
        category: 'actuator',
        code: 'XV',
        name: 'On/Off Valve',
        description: 'Valve for complete shut-off or opening, with no intermediate control.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">X</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">V</text></svg>',
        detailsContent: `### On/Off Valve (XV)
An On/Off Valve, also known as a shut-off or block valve, is an actuator designed to be in one of two positions: fully open or fully closed. It is not used for fine flow regulation.

### Operating Principle
It is operated by an actuator (usually a solenoid or a quarter-turn actuator) that receives a discrete signal (on/off) from the control system.

### Common Applications
Safety systems to quickly shut off flow (ESD - Emergency Shutdown), isolating equipment for maintenance, or in batch processes where a tank needs to be completely filled or emptied.`,
        controllerLogic: `(* PLC Standard Code - Structured Text (ST) for On/Off Valve *)
FUNCTION_BLOCK FB_OnOffValve
VAR_INPUT
    Open_Cmd : BOOL; (* Command to open the valve *)
    Close_Cmd : BOOL; (* Command to close the valve (optional, for safety) *)
    Feedback_Open : BOOL; (* Limit switch input for open position *)
    Feedback_Closed : BOOL; (* Limit switch input for closed position *)
    Travel_Time : TIME := T#5S; (* Time allowed for valve to travel *)
END_VAR
VAR_OUTPUT
    Output_Open : BOOL; (* Digital output to solenoid *)
    Status_Open : BOOL;
    Status_Closed : BOOL;
    Status_Fault : BOOL;
END_VAR
VAR
    Travel_Timer : TON;
END_VAR

(* Latching logic for the output *)
IF Open_Cmd THEN
    Output_Open := TRUE;
ELSIF Close_Cmd THEN
    Output_Open := FALSE;
END_IF;

(* Status logic *)
Status_Open := Feedback_Open AND NOT Feedback_Closed;
Status_Closed := Feedback_Closed AND NOT Feedback_Open;

(* Fault logic *)
Travel_Timer(IN := (Output_Open AND NOT Feedback_Open) OR (NOT Output_Open AND NOT Feedback_Closed), PT := Travel_Time);
Status_Fault := Travel_Timer.Q OR (Feedback_Open AND Feedback_Closed);

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
    <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
    <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">SHUTDOWN VALVE</text>
    <text x="100" y="70" text-anchor="middle" font-size="28" font-weight="bold" fill="#4caf50">OPEN</text>
    <circle cx="170" cy="25" r="5" fill="#4caf50" />
    <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">XV-901</text>
</svg>`
    },
    {
        id: 'M',
        category: 'actuator',
        code: 'M',
        name: 'Motor',
        description: 'Converts electrical energy into mechanical energy to move equipment.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="12" text-anchor="middle" dominant-baseline="central" font-size="8" font-family="sans-serif" font-weight="bold" fill="currentColor">M</text></svg>',
        detailsContent: `### Motor (M)
In the context of ISA instrumentation, a motor is an actuator that converts electrical energy into rotational mechanical energy. It is the device responsible for driving equipment such as pumps, compressors, fans, or conveyor belts.

### Control
Its control can be simple (start/stop) or complex, using a Variable Frequency Drive (VFD) to regulate its speed and, therefore, control the flow of a pump or fan.

### Common Applications
Driving virtually any type of rotating machinery in an industrial plant.`,
        controllerLogic: `(* PLC Standard Code - Structured Text (ST) for Motor Control *)
FUNCTION_BLOCK FB_Motor
VAR_INPUT
    Start_Cmd : BOOL;
    Stop_Cmd : BOOL;
    Feedback_Running : BOOL; (* From motor contactor *)
    Enable_Start : BOOL := TRUE; (* Interlock *)
    Trip : BOOL; (* From motor protection relay *)
END_VAR
VAR_OUTPUT
    Output_Start : BOOL;
    Status_Running : BOOL;
    Status_Stopped : BOOL;
    Status_Fault : BOOL;
END_VAR
VAR
    Start_Latch : BOOL;
END_VAR

(* Latching Start/Stop Logic *)
IF Start_Cmd AND Enable_Start AND NOT Trip THEN
    Start_Latch := TRUE;
END_IF;

IF Stop_Cmd OR Trip THEN
    Start_Latch := FALSE;
END_IF;

Output_Start := Start_Latch;

(* Status Logic *)
Status_Running := Feedback_Running;
Status_Stopped := NOT Feedback_Running;
Status_Fault := (Output_Start AND NOT Feedback_Running) OR Trip;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
    <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
    <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">PUMP MOTOR</text>
    <text x="100" y="70" text-anchor="middle" font-size="28" font-weight="bold" fill="#4caf50">RUNNING</text>
    <circle cx="170" cy="25" r="5" fill="#4caf50" />
    <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">M-101A</text>
</svg>`
    },
    {
        id: 'P',
        category: 'actuator',
        code: 'P',
        name: 'Pump',
        description: 'A machine that transfers energy to a fluid to move it.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="12" text-anchor="middle" dominant-baseline="central" font-size="8" font-family="sans-serif" font-weight="bold" fill="currentColor">P</text></svg>',
        detailsContent: `### Pump (P)
A pump is a machine used to transfer a fluid (liquid or gas) from one place to another, usually increasing its pressure. In P&ID diagrams, it is represented as an actuator, as it is an element that performs work on the process, usually driven by a motor.

### Common Types
- **Centrifugal:** Use a rotating impeller to accelerate the fluid.
- **Positive Displacement:** Trap a fixed volume of fluid and force it out (e.g., piston pumps, gear pumps).

### Common Applications
Transporting raw materials and products, cooling systems, boiler feed, etc.`,
        controllerLogic: `(* A Pump (P) is a mechanical device, usually driven by a Motor (M). *)
(* The control logic for a pump is therefore the logic for its motor. *)
(* Please see the logic example for the Motor (M). *)
(* Additional logic may include monitoring pump-specific signals like seal pot level or casing temperature. *)

COMMENT "Pump control is achieved by controlling its driver, typically M-101 for pump P-101.";`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
    <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
    <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">FEED PUMP</text>
    <text x="100" y="70" text-anchor="middle" font-size="28" font-weight="bold" fill="#f44336">STOPPED</text>
    <circle cx="170" cy="25" r="5" fill="#f44336" />
    <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">P-101</text>
</svg>`
    },
    {
        id: 'PSV',
        category: 'actuator',
        code: 'PSV',
        name: 'Pressure Safety Valve',
        description: 'Automatic valve that relieves overpressure in a system.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">P</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="6" font-family="sans-serif" font-weight="bold" fill="currentColor">SV</text></svg>',
        detailsContent: `### Pressure Safety Valve (PSV)
A Pressure Safety Valve (PSV) is a self-operated protection device. Its function is to open automatically when the pressure in a system or vessel exceeds a preset value (setpoint), releasing the excess pressure to prevent an explosion or equipment damage.

### Operating Principle
A calibrated spring keeps the valve closed. When the force exerted by the fluid pressure overcomes the spring force, the valve opens quickly and fully. It closes automatically when the pressure returns to a safe level.

### Common Applications
It is a mandatory safety element on pressure vessels such as boilers, reactors, and storage tanks.`,
        controllerLogic: `(* A Pressure Safety Valve (PSV) is a mechanical, self-actuating device. *)
(* It typically has no direct control logic within the PLC/DCS. *)
(* It may have a rupture disk indicator or a position switch to alarm that it has lifted. *)
FUNCTION_BLOCK FB_PSV_Monitor
VAR_INPUT
    Lift_Indicator : BOOL; (* Digital input, e.g., from a rupture pin *)
END_VAR
VAR_OUTPUT
    Lift_Alarm : BOOL;
END_VAR
VAR
    Lift_Latch : BOOL;
END_VAR

IF Lift_Indicator THEN
    Lift_Latch := TRUE;
END_IF;

Lift_Alarm := Lift_Latch;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<!-- A PSV is a mechanical device, it does not have a controllable HMI object. -->
<!-- Its status (lifted) might be indicated with an alarm. -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
    <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
    <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">SAFETY VALVE STATUS</text>
    <text x="100" y="70" text-anchor="middle" font-size="28" font-weight="bold" fill="#4caf50">NORMAL</text>
    <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">PSV-201</text>
</svg>`
    },
    {
        id: 'IY',
        category: 'actuator',
        code: 'IY',
        name: 'I/P Converter',
        description: 'Converts a current signal (I) into a pneumatic signal (P).',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="12" y="9.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">I</text><text x="12" y="15.5" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">Y</text></svg>',
        detailsContent: `### I/P Converter (IY)
An I/P (Current-to-Pressure) Converter is a type of transducer that converts an analog electrical control signal (usually 4-20 mA) into a proportional pneumatic pressure signal (usually 3-15 psi or 0.2-1 bar). The letter 'Y' in ISA often denotes a relay, converter, or calculation.

### Function
It acts as a bridge between modern electronic control systems (PLC, DCS) and older or simpler pneumatic actuators, such as control valves that do not have a digital positioner.

### Common Applications
Interfacing the analog output of a controller with the actuator of a pneumatic valve. It allows the electronic system to precisely modulate the valve's opening by varying the air pressure.`,
        controllerLogic: `(* An I/P Converter (IY) is a transducer. It's the "actuator" for the analog output signal itself. *)
(* The control logic is the same as for a Flow Valve (FV) or other analog actuator. *)
(* The PLC sends a 0-100% signal, which the analog output card converts to 4-20mA. The IY then converts this to 3-15 psi. *)
(* See the logic for FB_AnalogValve. *)

COMMENT "The IY is the final stage of an analog output signal chain for pneumatic actuators.";`,
        hmiRepresentation: `<!-- An I/P converter is a field device without a direct HMI representation. -->
<!-- It is part of the control loop for a valve, and the valve's HMI object is what's displayed. -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
    <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
    <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">CONTROL VALVE (via IY)</text>
    <text x="100" y="40" text-anchor="middle" font-size="10" fill="#888">FV-102</text>
    <text x="40" y="60" text-anchor="middle" font-size="10" fill="#ccc">OUT</text>
    <text x="40" y="80" text-anchor="middle" font-size="16" font-weight="bold" fill="#03a9f4">50.0%</text>
    <text x="125" y="60" text-anchor="middle" font-size="10" fill="#ccc">Signal Chain</text>
    <text x="125" y="80" text-anchor="middle" font-size="12" fill="#ccc">PLC -> AO -> IY -> Valve</text>
</svg>`
    },
    {
        id: 'HS',
        category: 'actuator',
        code: 'HS',
        name: 'Hand Switch',
        description: 'A switch operated manually by a person (Hand Switch).',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5"/><text x="12" y="9" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">H</text><text x="12" y="16" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">S</text></svg>',
        detailsContent: `### Hand Switch (HS)
A Hand Switch is a device operated by a person to initiate an action in the control system. It can be a simple push button, a two or three-position selector switch, or an emergency mushroom button.

### Function
It provides a direct interface for the plant operator to intervene in the process. It allows starting or stopping a motor, opening or closing a valve, or changing the mode of a control loop from automatic to manual.

### Common Applications
Local control panels next to equipment for maintenance or local start/stop (e.g., H-O-A: Hand-Off-Auto), emergency stop buttons, and mode selectors in control rooms.`,
        controllerLogic: `(* PLC Standard Code - Structured Text (ST) for a Hand Switch, e.g., H-O-A *)
FUNCTION_BLOCK FB_HandSwitch
VAR_INPUT
    Input_Hand : BOOL; (* DI from 'Hand' position *)
    Input_Auto : BOOL; (* DI from 'Auto' position *)
END_VAR
VAR_OUTPUT
    Is_Hand : BOOL;
    Is_Auto : BOOL;
    Is_Off : BOOL;
END_VAR

Is_Hand := Input_Hand AND NOT Input_Auto;
Is_Auto := Input_Auto AND NOT Input_Hand;
Is_Off := NOT Input_Hand AND NOT Input_Auto;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
    <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
    <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">PUMP-101 CONTROL</text>
    <text x="100" y="45" text-anchor="middle" font-size="10" fill="#888">HS-101</text>
    <rect x="20" y="60" width="50" height="25" rx="3" fill="#666" />
    <text x="45" y="77" font-size="12" text-anchor="middle" fill="#ccc">HAND</text>
    <rect x="75" y="60" width="50" height="25" rx="3" fill="#f44336" />
    <text x="100" y="77" font-size="12" text-anchor="middle" fill="#fff">OFF</text>
    <rect x="130" y="60" width="50" height="25" rx="3" fill="#666" />
    <text x="155" y="77" font-size="12" text-anchor="middle" fill="#ccc">AUTO</text>
</svg>`
    },
    // --- CONTROLLERS & INDICATORS ---
    {
        id: 'TI',
        category: 'controller-indicator',
        code: 'TI',
        name: 'Temperature Indicator',
        description: 'Locally or remotely displays the temperature value.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5"/><text x="12" y="9" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">T</text><text x="12" y="16" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">I</text></svg>',
        detailsContent: `### Temperature Indicator (TI)
A Temperature Indicator is a device that displays the value of a process temperature to operators. It can be a local device (a dial thermometer installed on the pipe) or a digital display on a control panel that receives the signal from a transmitter.

### Operating Principle
- **Local:** A bimetallic or bulb thermometer that moves a needle on a graduated scale.
- **Remote:** A digital screen that displays the numerical value received from a Temperature Transmitter (TT).

### Common Applications
Allows for quick visual monitoring of the process status by plant personnel.`,
        controllerLogic: `(* A Temperature Indicator (TI) is a display device. *)
(* In a modern system, it's a function of the HMI/SCADA, not the PLC. *)
(* The PLC provides the data (from a TT), and the HMI displays it. *)
(* The logic involved is simply making the Process_Value from the FB_TemperatureTransmitter block available to the HMI. *)

COMMENT "Variable 'Reactor_Temp' (REAL) is mapped to the HMI for display as TI-105.";`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">REACTOR TEMPERATURE</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">125.4</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">°C</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">TI-105</text>
</svg>`
    },
    {
        id: 'PI',
        category: 'controller-indicator',
        code: 'PI',
        name: 'Pressure Indicator',
        description: 'Locally or remotely displays the pressure value.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5"/><text x="12" y="9" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">P</text><text x="12" y="16" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">I</text></svg>',
        detailsContent: `### Pressure Indicator (PI)
A Pressure Indicator, commonly known as a pressure gauge, is a device that displays the pressure of a fluid. Like the temperature indicator, it can be local or remote.

### Operating Principle
- **Local:** A gauge with a Bourdon tube that moves a needle over a scale.
- **Remote:** A digital display in a control room that shows the value measured by a Pressure Transmitter (PT).

### Common Applications
Installed on pipes and vessels so operators can check the pressure locally and quickly, especially for safety and operational reasons.`,
        controllerLogic: `(* A Pressure Indicator (PI) is a display device. *)
(* In a modern system, it's a function of the HMI/SCADA, not the PLC. *)
(* The PLC provides the data (from a PT), and the HMI displays it. *)
(* The logic involved is simply making the Process_Value from the FB_PressureTransmitter block available to the HMI. *)

COMMENT "Variable 'Header_Pressure' (REAL) is mapped to the HMI for display as PI-210.";`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">STEAM HEADER PRESSURE</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">9.8</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">bar</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">PI-210</text>
</svg>`
    },
    {
        id: 'LI',
        category: 'controller-indicator',
        code: 'LI',
        name: 'Level Indicator',
        description: 'Locally or remotely displays the level value.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5"/><text x="12" y="9" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">L</text><text x="12" y="16" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">I</text></svg>',
        detailsContent: `### Level Indicator (LI)
A Level Indicator is a device that shows the height of the material inside a tank or vessel.

### Operating Principle
- **Local:** It can be a simple glass sight tube mounted on the side of the tank, or a magnetic indicator with a float that moves a series of colored flippers.
- **Remote:** A display on a panel that shows the value coming from a Level Transmitter (LT).

### Common Applications
Monitoring inventory in storage tanks and visual control of filling or emptying.`,
        controllerLogic: `(* A Level Indicator (LI) is a display device. *)
(* In a modern system, it's a function of the HMI/SCADA, not the PLC. *)
(* The PLC provides the data (from a LT), and the HMI displays it. *)
(* The logic involved is simply making the Level_Percentage from the FB_LevelTransmitter block available to the HMI. *)

COMMENT "Variable 'Storage_Tank_Level' (REAL) is mapped to the HMI for display as LI-501.";`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">STORAGE TANK LEVEL</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">88.2</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">%</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">LI-501</text>
</svg>`
    },
    {
        id: 'FI',
        category: 'controller-indicator',
        code: 'FI',
        name: 'Flow Indicator',
        description: 'Locally or remotely displays the flow value.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5"/><text x="12" y="9" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">F</text><text x="12" y="16" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">I</text></svg>',
        detailsContent: `### Flow Indicator (FI)
A Flow Indicator shows the flow rate of a fluid in a pipe.

### Operating Principle
- **Local:** It can be a rotameter, which consists of a float inside a tapered transparent tube, where the height indicates the flow rate.
- **Remote:** A digital display that shows the value measured by a Flow Transmitter (FT). Often, these indicators can also totalize the volume that has passed.

### Common Applications
Monitoring the flow of coolants, fuels, or products to ensure the process is operating correctly.`,
        controllerLogic: `(* A Flow Indicator (FI) is a display device. *)
(* In a modern system, it's a function of the HMI/SCADA, not the PLC. *)
(* The PLC provides the data (from a FT), and the HMI displays it. *)
(* The logic involved is simply making the Flow_Rate from the FB_FlowTransmitter block available to the HMI. *)

COMMENT "Variable 'Cooling_Water_Flow' (REAL) is mapped to the HMI for display as FI-711.";`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">COOLING WATER FLOW</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">350.0</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">m³/h</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">FI-711</text>
</svg>`
    },
    {
        id: 'FQI',
        category: 'controller-indicator',
        code: 'FQI',
        name: 'Flow Totalizer Indicator',
        description: 'Displays and accumulates the total amount of fluid that has passed.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5"/><text x="12" y="9" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">F</text><text x="12" y="16" text-anchor="middle" dominant-baseline="middle" font-size="6" font-family="sans-serif" font-weight="bold" fill="currentColor">QI</text></svg>',
        detailsContent: `### Flow Totalizer Indicator (FQI)
A Flow Totalizer Indicator combines two functions: it indicates the instantaneous flow rate (like an FI) and also integrates (sums) that flow rate over time to calculate the total volume of fluid that has passed.

### Function
The 'Q' stands for 'Quantity'. Essentially, it's a volume or mass counter. It displays the current flow rate (e.g., in m³/h) and the accumulated volume (e.g., in m³). Often, this total can be reset.

### Common Applications
Measuring water, gas, or steam consumption for billing, controlling the amount of reactant added in a batch process, and loading/unloading tanker trucks.`,
        controllerLogic: `(* PLC Standard Code - Structured Text (ST) for Flow Totalizer *)
FUNCTION_BLOCK FB_FlowTotalizer
VAR_INPUT
    Flow_Rate : REAL; (* In units per second, e.g., m³/s *)
    Reset_Cmd : BOOL;
    Enable : BOOL := TRUE;
END_VAR
VAR_OUTPUT
    Total_Flow : LREAL; (* Use LREAL for large accumulated values *)
END_VAR
VAR
    Cycle_Time_Sec : REAL;
    Last_Time : DINT;
    Current_Time : DINT;
END_VAR

IF Enable THEN
    (* This is a simplified totalizer. A real implementation should use system clock for accuracy. *)
    (* Assuming this FB is called in a fixed-time task, e.g., every 100ms *)
    Cycle_Time_Sec := 0.1; (* Example: 100ms scan time *)
    Total_Flow := Total_Flow + (Flow_Rate * Cycle_Time_Sec);
ELSE
    (* Hold value *)
END_IF;

IF Reset_Cmd THEN
    Total_Flow := 0.0;
END_IF;

END_FUNCTION_BLOCK`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
    <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
    <text x="100" y="25" text-anchor="middle" font-size="12" fill="#ccc">TOTAL GAS CONSUMED</text>
    <text x="100" y="60" text-anchor="middle" font-size="24" font-weight="bold" fill="#03a9f4">123456.7</text>
    <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">m³</text>
    <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">FQI-001</text>
</svg>`
    },
    {
        id: 'AI',
        category: 'controller-indicator',
        code: 'AI',
        name: 'Analytical Indicator',
        description: 'Displays the value of an analytical variable (e.g., pH).',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5"/><text x="12" y="9" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">A</text><text x="12" y="16" text-anchor="middle" dominant-baseline="middle" font-size="7" font-family="sans-serif" font-weight="bold" fill="currentColor">I</text></svg>',
        detailsContent: `### Analytical Indicator (AI)
An Analytical Indicator displays the value of a chemical or physical measurement, such as pH, conductivity, or the concentration of a gas.

### Operating Principle
It is almost always a device with a digital display that is connected to an Analytical Transmitter (AT). It shows the value of the variable in the corresponding units (e.g., "7.2 pH").

### Common Applications
Control panels in water treatment plants to monitor pH, or in industrial areas to display the concentration of hazardous gases.`,
        controllerLogic: `(* An Analytical Indicator (AI) is a display device. *)
(* In a modern system, it's a function of the HMI/SCADA, not the PLC. *)
(* The PLC provides the data (from an AT), and the HMI displays it. *)
(* The logic involved is simply making the Process_Value from the FB_AnalyticalTransmitter block available to the HMI. *)

COMMENT "Variable 'Effluent_pH' (REAL) is mapped to the HMI for display as AI-602.";`,
        hmiRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100" style="background-color:#333; color:#fff; font-family:sans-serif;">
  <rect x="10" y="10" width="180" height="80" rx="5" ry="5" fill="#444" stroke="#555" stroke-width="2"/>
  <text x="100" y="30" text-anchor="middle" font-size="12" fill="#ccc">EFFLUENT pH</text>
  <text x="100" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="#03a9f4">6.85</text>
  <text x="175" y="80" text-anchor="end" font-size="14" fill="#03a9f4">pH</text>
  <text x="20" y="80" text-anchor="start" font-size="10" fill="#888">AI-602</text>
</svg>`
    },
    {
        id: 'TC',
        category: 'controller-indicator',
        code: 'TC',
        name: 'Temperature Controller',
        description: 'Compares the temperature with a setpoint and adjusts an output.',
        icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="