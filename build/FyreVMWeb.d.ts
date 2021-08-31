declare class MersenneTwister {
    private N;
    private M;
    private MATRIX_A;
    private UPPER_MASK;
    private LOWER_MASK;
    private mt;
    private mti;
    constructor(seed?: number);
    private init_genrand;
    init_by_array(init_key: any, key_length: any): void;
    genrand_int32(): number;
    genrand_int31(): number;
    genrand_real1(): number;
    random(): number;
    genrand_real3(): number;
    genrand_res53(): number;
}
/**
 * A wrapper to emulate minimal Glk functionality.
 */
declare module FyreVM {
    function GlkWrapperCall(code: number, argc: number): any;
    function GlkWrapperWrite(s: string): void;
}
/**
 * Provides hardcoded versions of some commonly used veneer routines (low-level
 *  functions that are automatically compiled into every Inform game).
 * Inform games rely heavily on these routines, and substituting our "native" versions
 * for the Glulx versions in the story file can increase performance significantly.
 */
declare module FyreVM {
    const enum VeneerSlot {
        Z__Region = 1,
        CP__Tab = 2,
        OC__Cl = 3,
        RA__Pr = 4,
        RT__ChLDW = 5,
        Unsigned__Compare = 6,
        RL__Pr = 7,
        RV__Pr = 8,
        OP__Pr = 9,
        RT__ChSTW = 10,
        RT__ChLDB = 11,
        Meta__class = 12,
        String = 1001,
        Routine = 1002,
        Class = 1003,
        Object = 1004,
        RT__Err = 1005,
        NUM_ATTR_BYTES = 1006,
        classes_table = 1007,
        INDIV_PROP_START = 1008,
        cpv__start = 1009,
        ofclass_err = 1010,
        readprop_err = 1011
    }
    /**
     * Registers a routine address or constant value, using the acceleration
     * codes defined in the Glulx specification.
     */
    function setSlotGlulx(isParam: boolean, slot: number, value: any): boolean;
    /**
     *  Registers a routine address or constant value, using the traditional
     *  FyreVM slot codes.
     */
    function setSlotFyre(slot: VeneerSlot, value: any): boolean;
}
declare module FyreVM {
    /**
     * an OpcodeHandler takes any number of arguments (all numbers)
     * and returns nothing, or a number, or multiple numbers
     */
    interface OpcodeHandler {
        (...any: number[]): void | number | number[];
    }
    class Opcode {
        code: number;
        name: string;
        loadArgs: number;
        storeArgs: number;
        handler: OpcodeHandler;
        rule: OpcodeRule;
        constructor(code: number, name: string, loadArgs: number, storeArgs: number, handler: OpcodeHandler, rule?: OpcodeRule);
    }
    const enum Gestalt {
        GlulxVersion = 0,
        TerpVersion = 1,
        ResizeMem = 2,
        Undo = 3,
        IOSystem = 4,
        Unicode = 5,
        MemCopy = 6,
        MAlloc = 7,
        MAllocHeap = 8,
        Acceleration = 9,
        AccelFunc = 10,
        Float = 11,
        /**
         * ExtUndo (12):
         * Returns 1 if the interpreter supports the hasundo and discardundo opcodes.
         * (This must true for any terp supporting Glulx 3.1.3. On a terp which does not support undo functionality,
         * these opcodes will be callable but will fail.)
         */
        ExtUndo = 12
    }
    const enum FyreCall {
        ReadLine = 1,
        ReadKey = 2,
        ToLower = 3,
        ToUpper = 4,
        Channel = 5,
        SetVeneer = 6,
        XMLFilter = 7,
        SetStyle = 8
    }
    module Opcodes {
        function initOpcodes(): Opcode[];
    }
}
declare module FyreVM {
    const enum IOSystem {
        Null = 0,
        Filter = 1,
        Channels = 2,
        Glk = 3
    }
    function SendCharToOutput(x: number): void;
    function SendStringToOutput(x: string): void;
    const enum GLULX_HUFF {
        TABLESIZE_OFFSET = 0,
        NODECOUNT_OFFSET = 4,
        ROOTNODE_OFFSET = 8,
        NODE_BRANCH = 0,
        NODE_END = 1,
        NODE_CHAR = 2,
        NODE_CSTR = 3,
        NODE_UNICHAR = 4,
        NODE_UNISTR = 5,
        NODE_INDIRECT = 8,
        NODE_DBLINDIRECT = 9,
        NODE_INDIRECT_ARGS = 10,
        NODE_DBLINDIRECT_ARGS = 11
    }
    /**
     * Prints the next character of a compressed string, consuming one or more bits.
     *
     */
    function NextCompressedChar(): void;
    function NextCStringChar(): void;
    function NextUniStringChar(): void;
    function NextDigit(): void;
    interface ChannelData {
        [channel: string]: string;
        MAIN?: string;
        PRPT?: string;
        LOCN?: string;
        SCOR?: string;
        TIME?: string;
        TURN?: string;
        PLOG?: string;
        DEAD?: string;
        ENDG?: string;
        INFO?: string;
        SNOT?: string;
    }
    class OutputBuffer {
        private channel;
        private channelData;
        getChannel(): string;
        /**  If the output channel is changed to any channel other than
        * "MAIN", the channel's contents will be
        * cleared first.
        */
        setChannel(c: string): void;
        /**
         * Writes a string to the buffer for the currently
         * selected output channel.
         */
        write(s: string): void;
        /**
         *  Packages all the output that has been stored so far, returns it,
         *  and empties the buffer.
         */
        flush(): ChannelData;
    }
}
declare module FyreVM {
    /**
     * Manages the heap size and block allocation for the malloc/mfree opcodes.
     *
     * If Inform ever starts using the malloc opcode directly, instead of
     * its own heap allocator, this should be made a little smarter.
     * Currently we make no attempt to avoid heap fragmentation.
     */
    class HeapAllocator {
        private heapAddress;
        private endMem;
        private heapExtent;
        maxHeapExtent: number;
        private memory;
        private blocks;
        private freeList;
        constructor(heapAddress: number, memory: MemoryAccess);
        /**
         * saves the heap state into a Uint8Array.
         * Does not include the memory itself, only the block allocation information.
         */
        save(): Uint8Array;
        /**
         * restores the heap state from an Uint8Array (as created by the "save" method)
         */
        static restore(buffer: Uint8Array, memory: MemoryAccess): HeapAllocator;
        /**
         * allocates a new block on the heap
         * @return the address of the new block, or null if allocation failed
         */
        alloc(size: number): number;
        private setEndMem;
        blockCount(): number;
        /**
         * deallocates a previously allocated block
         */
        free(address: number): void;
    }
    /**
     *  Wrapper around ECMAScript 6 standard Uint8Array.
     *  Provides access to a memory buffer.
     */
    class MemoryAccess {
        buffer: Uint8Array;
        private maxSize;
        constructor(size: number, maxSize?: number);
        /**
         * Reads a single byte (unsigned)
         */
        readByte(offset: number): number;
        /**
        * Writes a single byte (unsigned).
        * Writes 0 when value is undefined or null.
        */
        writeByte(offset: number, value: number): void;
        /**
         * Reads an unsigned, big-endian, 16-bit number
         */
        readInt16(offset: number): number;
        private set;
        /**
         * Writes an unsigned, big-endian, 16-bit number.
         * Writes 0 when value is undefined or null.
         */
        writeInt16(offset: number, value: number): void;
        /**
        * Reads an unsigned, big-endian, 32-bit number
        */
        readInt32(offset: number): number;
        /**
         * Writes an unsigned, big-endian, 32-bit number
         * Writes 0 when value is undefined or null.
         */
        writeInt32(offset: number, value: number): void;
        /**
         * Converts part of the buffer into a String,
         * assumes that the data is valid ASCII
         */
        readASCII(offset: number, length: number): string;
        /**
         * reads a 0-terminated C-string
         */
        readCString(offset: number): string;
        /**
         * Writes an ASCII String
         */
        writeASCII(offset: number, value: string): void;
        /**
        * Resizes the available memory
        */
        setEndMem(newEndMem: number): boolean;
        /**
         * Copy a part of the memory into a new buffer.
         *
         * The length can be more than there is data
         * in the original buffer. In this case the
         * new buffer will contain unspecified data
         * at the end.
         */
        copy(offset: number, length: number): MemoryAccess;
        /**
          * returns the number of bytes available
          */
        size(): number;
    }
}
/**
 * Represents the ROM and RAM of a Glulx game image.
 */
declare module FyreVM {
    interface GlulxHeader {
        magic?: string;
        version?: number;
        ramStart?: number;
        extStart?: number;
        endMem?: number;
        stackSize?: number;
        startFunc?: number;
        decodingTbl?: number;
        checksum?: number;
    }
    class UlxImage {
        private memory;
        private ramstart;
        private original;
        constructor(original: MemoryAccess);
        private loadFromOriginal;
        getMajorVersion(): number;
        getMinorVersion(): number;
        getStackSize(): number;
        getEndMem(): number;
        getRamAddress(relativeAddress: number): number;
        /**
         * sets the address at which memory ends.
         * This can be changed by the game with setmemsize,
         * or managed automatically be the heap allocator.
         */
        setEndMem(value: number): void;
        getStartFunc(): number;
        getDecodingTable(): number;
        saveToQuetzal(): Quetzal;
        readByte(address: number): number;
        readInt16(address: number): number;
        readInt32(address: number): number;
        readCString(address: number): string;
        writeInt32(address: number, value: number): void;
        writeBytes(address: number, ...bytes: number[]): void;
        write(rule: OpcodeRule, address: number, value: number): void;
        /**
         * @param limit: the maximum number of bytes to write
         * returns the number of bytes written
         */
        writeASCII(address: number, text: string, limit: number): number;
        static writeHeader(fields: GlulxHeader, m: MemoryAccess, offset?: number): void;
        /** Reloads the game file, discarding all changes that have been made
        * to RAM and restoring the memory map to its original size.
        *
        * Use the optional "protection" parameters to preserve a RAM region
        */
        revert(protectionStart?: number, protectionLength?: number): void;
        private copyProtectedRam;
        restoreFromQuetzal(quetzal: Quetzal, protectionStart?: number, protectionLength?: number): void;
    }
}
declare module Base64 {
    function toByteArray(b64: any): Uint8Array;
    function fromByteArray(uint8: any): string;
}
declare module FyreVM {
    class Quetzal {
        private chunks;
        setChunk(name: string, value: Uint8Array): void;
        getChunk(name: string): Uint8Array;
        getIFhdChunk(): Uint8Array;
        serialize(): Uint8Array;
        static load(buffer: Uint8Array): Quetzal;
        /**
         * convenience method to encode a Quetzal file as Base64
         */
        base64Encode(): string;
        /**
         * convenience method to decode a Quetzal file from Base64
         */
        static base64Decode(base64: string): Quetzal;
    }
}
declare module FyreVM {
    const enum Versions {
        terp = 1,
        glulx = 196866
    }
    /**
     * Describes the type of Glk support offered by the interpreter.
     */
    const enum GlkMode {
        None = 0,
        Wrapper = 1
    }
    /**
     * A delegate that handles the LineWanted event
     */
    interface LineWantedEventHandler {
        (callback: LineReadyCallback): void;
    }
    interface LineReadyCallback {
        (line: string): void;
    }
    /**
    * A delegate that handles the KeyWanted event
    *
    * Also uses LineReadyCallback. Only the first character
    * will be used.
    */
    interface KeyWantedEventHandler {
        (callback: LineReadyCallback): void;
    }
    /**
     * A delegate that handles the OutputReady event
     */
    interface OutputReadyEventHandler {
        (package: ChannelData): void;
    }
    interface SaveGameEventHandler {
        (quetzal: Quetzal, callback: SavedGameCallback): void;
    }
    interface SavedGameCallback {
        (success: boolean): any;
    }
    interface LoadGameEventHandler {
        (callback: QuetzalReadyCallback): void;
    }
    interface QuetzalReadyCallback {
        (quetzal: Quetzal): any;
    }
    /**
     *  Describes the task that the interpreter is currently performing.
    */
    const enum ExecutionMode {
        Code = 0,
        CString = 1,
        CompressedString = 2,
        UnicodeString = 3,
        Number = 4,
        Return = 5
    }
    const enum LoadOperandType {
        zero = 0,
        byte = 1,
        int16 = 2,
        int32 = 3,
        ptr_8 = 5,
        ptr_16 = 6,
        ptr_32 = 7,
        stack = 8,
        local_8 = 9,
        local_16 = 10,
        local_32 = 11,
        ram_8 = 13,
        ram_16 = 14,
        ram_32 = 15
    }
    const enum StoreOperandType {
        discard = 0,
        ptr_8 = 5,
        ptr_16 = 6,
        ptr_32 = 7,
        stack = 8,
        local_8 = 9,
        local_16 = 10,
        local_32 = 11,
        ram_8 = 13,
        ram_16 = 14,
        ram_32 = 15
    }
    const enum CallType {
        stack = 192,
        localStorage = 193
    }
    const enum GLULX_STUB {
        STORE_NULL = 0,
        STORE_MEM = 1,
        STORE_LOCAL = 2,
        STORE_STACK = 3,
        RESUME_HUFFSTR = 10,
        RESUME_FUNC = 11,
        RESUME_NUMBER = 12,
        RESUME_CSTR = 13,
        RESUME_UNISTR = 14
    }
    const enum OpcodeRule {
        None = 0,
        Indirect8Bit = 1,
        Indirect16Bit = 2,
        DelayedStore = 3,
        Catch = 4
    }
    class Engine {
        image: UlxImage;
        private stack;
        private decodingTable;
        private SP;
        private FP;
        private PC;
        private frameLen;
        private localsPos;
        private execMode;
        private opcodes;
        private running;
        private outputSystem;
        private filterAddress;
        private outputBuffer;
        private heap;
        private cycle;
        private startTime;
        private printingDigit;
        private protectionStart;
        private protectionLength;
        private veneer;
        enableFyreVM: boolean;
        glkMode: GlkMode;
        outputReady: OutputReadyEventHandler;
        lineWanted: LineWantedEventHandler;
        keyWanted: KeyWantedEventHandler;
        saveRequested: SaveGameEventHandler;
        loadRequested: LoadGameEventHandler;
        constructor(gameFile: UlxImage);
        /**
         * clears the stack and initializes VM registers
         * from values found in RAM
         */
        bootstrap(): void;
        /**
         *  Pushes a frame for a function call, updating FP, SP, and PC.
         *  (A call stub should have already been pushed.)
         */
        private enterFunction;
        private push;
        private pop;
        private pushByte;
        private pushCallStub;
        private popCallStub;
        /**
         * executes a single cycle
         */
        step(): string;
        /**
         * Starts the interpreter.
         * This method does not return until the game finishes, either by
         * returning from the main function or with the quit opcode
         * (unless it is placed into "waiting" mode for asynchronous
         * user input. In this case, there will be a callback that resumes
         * execution)
         */
        run(): void;
        /**
         * @return how many extra bytes were read (so that operandPos can be advanced)
         */
        private decodeLoadOperand;
        /**
         * @return how many extra bytes were read (so that operandPos can be advanced)
         */
        private decodeStoreOperand;
        /**
         * @return how many extra bytes were read (so that operandPos can be advanced)
         */
        private decodeDelayedStoreOperand;
        private performDelayedStore;
        private storeResults;
        private leaveFunction;
        private resumeFromCallStub;
        takeBranch(jumpVector: number): void;
        performCall(address: number, args: number[], destType: number, destAddr: number, stubPC: number, tailCall?: boolean): void;
        streamCharCore(x: number): void;
        streamUniCharCore(x: number): void;
        streamNumCore(x: number): void;
        streamStrCore(address: number): void;
        private deliverOutput;
        saveToQuetzal(destType: any, destAddr: any): Quetzal;
        loadFromQuetzal(quetzal: Quetzal): void;
        /**  Reloads the initial contents of memory (except the protected area)
        * and starts the game over from the top of the main function.
        */
        restart(): void;
        fyreCall(call: any, x: any, y: any): any;
        private inputLine;
        private inputChar;
        private resumeAfterWait_resultTypes;
        private resumeAfterWait_resultAddrs;
        private resumeAfterWait;
    }
}
/**
 * A wrapper around Engine that can be communicates
 * via simple JSON-serializable messages.
 *
 */
declare module FyreVM {
    const enum EngineState {
        loaded = 1,
        running = 2,
        completed = 100,
        error = -100,
        waitingForLineInput = 51,
        waitingForKeyInput = 52,
        waitingForGameSavedConfirmation = 53,
        waitingForLoadSaveGame = 54
    }
    interface EngineWrapperState {
        state: EngineState;
        channelData?: ChannelData;
        errorMessage?: string;
        gameBeingSaved?: Quetzal;
    }
    class EngineWrapper {
        private engine;
        private canSaveGames;
        constructor(gameImage: MemoryAccess, canSaveGames?: boolean);
        /**
         * convenience method to construct from an ArrayBuffer
         */
        static loadFromArrayBuffer(arrayBuffer: ArrayBuffer, canSaveGames?: boolean): EngineWrapper;
        /**
         * convenience method to construct from a FileReaderEvent
         * (which is supposed to have been successful)
         */
        static loadFromFileReaderEvent(ev: any, canSaveGames?: boolean): EngineWrapper;
        /**
        * convenience method to construct from a Base64 encoded string containing the game image
        */
        static loadFromBase64(base64: string, canSaveGames?: boolean): EngineWrapper;
        private resumeCallback;
        private engineState;
        private channelData;
        private gameBeingSaved;
        private waitState;
        run(): EngineWrapperState;
        private currentState;
        receiveLine(line: string): EngineWrapperState;
        receiveKey(line: string): EngineWrapperState;
        receiveSavedGame(quetzal: Quetzal): EngineWrapperState;
        saveGameDone(success: boolean): EngineWrapperState;
        getIFhd(): Uint8Array;
        getUndoState(): Quetzal;
        /**
         * convenience method to run "restore" and then
         * feed it the given savegame
         */
        restoreSaveGame(quetzal: Quetzal): EngineWrapperState;
        /**
         * convenience method to run "save"
         */
        saveGame(): Quetzal;
    }
}
declare var fyrevm: {};
declare function isEnterKey(e: any): boolean;
declare module FyreVMWeb {
    enum States {
        INIT = 0,
        RESTORE_SESSION = 1,
        NEW_SESSION = 2,
        WAITING_FOR_KEY = 3,
        WAITING_FOR_LINE = 4,
        COMMAND = 5,
        SAVE = 6,
        UPDATE_SESSION = 7
    }
    enum StoryStatus {
        CONTINUE = 0,
        ENDED = 1
    }
    class Manager {
        ChannelData: FyreVM.ChannelData;
        State: States;
        Status: StoryStatus;
        OutputReady: () => void;
        InputElement: HTMLInputElement;
        private wrapper;
        private contentDefinition;
        private ifid;
        private SetState;
        LoadStory(url: string): void;
        private GetSaveData;
        private Init;
        private NewSession;
        private RestoreSession;
        ProcessResult(result: FyreVM.EngineWrapperState): void;
        private SendCommand;
        ProcessCommand(result: FyreVM.EngineWrapperState): void;
        private NewSaveGame;
        private SaveGame;
        private LoadSavedGame;
        private UpdateSavedGame;
        private LoadSession;
        private SaveSession;
        private UpdateCommand;
        private UpdateStory;
        private UpdateTurnData;
        private SaveKey;
        private GetIFID;
        private GetChannelName;
        private UpdateContent;
    }
}
