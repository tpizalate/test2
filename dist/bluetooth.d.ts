/// <reference types="node" />
export declare class LaunchBluetooth {
    private serviceUUID;
    private charUUIDs;
    private device;
    private service;
    private cmdChar;
    private dataChar;
    findLaunch(): Promise<void>;
    readCmd(): Promise<Buffer>;
    writeCmd(aData: Buffer): Promise<any>;
    readData(): Promise<Buffer>;
    writeData(aData: Buffer): Promise<any>;
    CommandWithResponse(aCommand: number, aData?: number): Promise<Buffer>;
    LockAppMode(): Promise<void>;
    GetVersion(): Promise<Buffer>;
    GetExecutionMode(): Promise<Buffer>;
    GetFlashInfo(): Promise<{
        writeBlockCommandSize: number;
        flashEraseValue: number;
        programLength: number;
        wordSize: number;
        addressIncrement: number;
        programBase: number;
        rowSize: number;
    }>;
    Initialize(): Promise<void>;
}
